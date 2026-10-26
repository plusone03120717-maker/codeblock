"""CodeBlock のレッスンのコードを動かすサーバー（Render の codeblock-api）。

2026-10-26 セキュリティの直し（依頼主）：
- 使えるのは、ログインした CodeBlock の生徒だけ（Firebase の ID トークンを確かめ、users の文書があるかを本人のログインで読む）
- 生徒のコードは、このサーバーの中ではなく、別の小さなプロセスで、時間・メモリ・CPU の上限をつけて動かす。
  そのプロセスには環境変数を渡さない
- 課金（Stripe）は止めた。AI のヒントは Vercel の /api/hint に移した。なので、このサーバーに秘密の鍵は要らない
"""
import os
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request
from typing import Optional

import jwt
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Firebase のプロジェクト（公開されている名前。鍵ではない）
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "codeblock-app-863d0")
JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
FIRESTORE_BASE = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents"

TIMEOUT_SECONDS = 5
MAX_CODE_CHARS = 20_000
MAX_OUTPUT_CHARS = 100_000
RUNS_PER_MINUTE = 60  # 1人あたり

app = FastAPI()

# CORS設定（フロントエンドからのリクエストを許可）
origins = [
    "http://localhost:3000",
    "http://localhost:3023",
    "https://codeblock-omega.vercel.app",
    "https://codeblock.jp",
    "https://www.codeblock.jp",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================================
# ログインの確かめ
# ========================================
_jwks = jwt.PyJWKClient(JWKS_URL, cache_keys=True, lifespan=3600)
_member_cache: dict[str, float] = {}  # uid → 確かめた時刻
_MEMBER_CACHE_SECONDS = 600
_runs: dict[str, list[float]] = {}
_lock = threading.Lock()


def _is_member(uid: str, token: str) -> bool:
    """管理画面で作られた生徒か（users/{uid} の文書があるか）を、本人のログインで確かめる"""
    now = time.time()
    with _lock:
        if now - _member_cache.get(uid, 0) < _MEMBER_CACHE_SECONDS:
            return True
    req = urllib.request.Request(
        f"{FIRESTORE_BASE}/users/{uid}?mask.fieldPaths=userId",
        headers={"Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            ok = res.status == 200
    except urllib.error.HTTPError:
        ok = False
    except urllib.error.URLError:
        raise HTTPException(status_code=503, detail="ログインを確かめられませんでした")
    if ok:
        with _lock:
            _member_cache[uid] = now
    return ok


def require_member(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ログインが必要です")
    token = authorization[7:]
    try:
        key = _jwks.get_signing_key_from_jwt(token).key
        claims = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=FIREBASE_PROJECT_ID,
            issuer=f"https://securetoken.google.com/{FIREBASE_PROJECT_ID}",
        )
    except Exception:
        raise HTTPException(status_code=401, detail="ログインが必要です")
    uid = claims.get("sub")
    if not isinstance(uid, str) or not uid:
        raise HTTPException(status_code=401, detail="ログインが必要です")
    if not _is_member(uid, token):
        raise HTTPException(status_code=403, detail="このアカウントでは使えません")
    # 1人あたりの回数の上限（短い時間に送りすぎない）
    now = time.time()
    with _lock:
        recent = [t for t in _runs.get(uid, []) if now - t < 60]
        if len(recent) >= RUNS_PER_MINUTE:
            raise HTTPException(status_code=429, detail="少し待ってからもう一度ためしてね")
        recent.append(now)
        _runs[uid] = recent
    return uid


# ========================================
# コードの実行
# ========================================
class CodeRequest(BaseModel):
    code: str


class CodeResponse(BaseModel):
    output: Optional[str] = None
    error: Optional[str] = None


# 前からある、わかりやすい止め方（生徒への案内のため。守りの本体は下の別プロセス）
FORBIDDEN_KEYWORDS = [
    "import os",
    "import sys",
    "import subprocess",
    "import shutil",
    "import socket",
    "import urllib",
    "import http",
    "import requests",
    "open(",
    "__import__",
    "eval(",
    "exec(",
    "compile(",
]


def check_code_safety(code: str) -> Optional[str]:
    """コードの安全性をチェック"""
    code_lower = code.lower()
    for keyword in FORBIDDEN_KEYWORDS:
        if keyword.lower() in code_lower:
            return f"禁止されたキーワードが検出されました: {keyword}"
    return None


# 別プロセスの中で生徒のコードを動かす係。エラーは「実行エラー: …」の形（前と同じ）で、目印をつけて stderr に返す
_RUNNER = r"""
import sys
code = sys.stdin.read()
try:
    exec(compile(code, "<code>", "exec"), {"__name__": "__main__"})
except BaseException as e:
    if isinstance(e, SystemExit) and e.code in (None, 0):
        sys.exit(0)
    sys.stdout.flush()
    sys.stderr.write("\x00CODEBLOCK_ERROR\x00" + str(e))
    sys.exit(1)
"""
_ERROR_MARK = "\x00CODEBLOCK_ERROR\x00"


def _limit_resources():  # Linux（Render）だけ。子プロセスが始まる直前に呼ばれる
    import resource

    resource.setrlimit(resource.RLIMIT_CPU, (TIMEOUT_SECONDS, TIMEOUT_SECONDS))
    resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
    resource.setrlimit(resource.RLIMIT_FSIZE, (1024 * 1024, 1024 * 1024))
    resource.setrlimit(resource.RLIMIT_NOFILE, (32, 32))
    os.setsid()


def execute_python_code(code: str, timeout: int = TIMEOUT_SECONDS) -> tuple[Optional[str], Optional[str]]:
    """Pythonコードを別プロセスで実行"""
    safety_error = check_code_safety(code)
    if safety_error:
        return None, safety_error

    with tempfile.TemporaryDirectory() as workdir:
        try:
            proc = subprocess.run(
                [sys.executable, "-I", "-c", _RUNNER],
                input=code.encode("utf-8"),
                capture_output=True,
                timeout=timeout,
                cwd=workdir,
                # 環境変数は渡さない（文字コードだけ）
                env={"PYTHONIOENCODING": "utf-8", "LANG": "C.UTF-8"},
                preexec_fn=_limit_resources if sys.platform.startswith("linux") else None,
            )
        except subprocess.TimeoutExpired:
            return None, f"コードの実行がタイムアウトしました（{timeout}秒）"

    stdout = proc.stdout.decode("utf-8", "replace")[:MAX_OUTPUT_CHARS]
    stderr = proc.stderr.decode("utf-8", "replace")
    if _ERROR_MARK in stderr:
        return None, "実行エラー: " + stderr.split(_ERROR_MARK, 1)[1][:2000]
    if proc.returncode != 0:
        # 上限にかかって止められたときなど
        return None, "実行エラー: プログラムが止められました（時間かメモリを使いすぎたかもしれません）"
    return (stdout.strip() or None), None


@app.post("/api/execute", response_model=CodeResponse)
def execute_code(request: CodeRequest, authorization: Optional[str] = Header(default=None)):
    """Pythonコードを実行するエンドポイント（ログインした生徒だけ）"""
    require_member(authorization)
    if not request.code or not request.code.strip():
        raise HTTPException(status_code=400, detail="コードが空です")
    if len(request.code) > MAX_CODE_CHARS:
        raise HTTPException(status_code=400, detail="コードが長すぎます")

    output, error = execute_python_code(request.code)
    return CodeResponse(output=output, error=error)


@app.get("/")
async def root():
    return {"message": "CodeBlock Python Execution API"}


@app.get("/health")
async def health():
    return {"status": "ok"}
