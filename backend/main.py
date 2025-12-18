from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import io
import signal
import threading
from contextlib import redirect_stdout
from typing import Optional

app = FastAPI()

# CORS設定（フロントエンドからのリクエストを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.jsのデフォルトポート
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    code: str


class CodeResponse(BaseModel):
    output: Optional[str] = None
    error: Optional[str] = None


# 危険な関数やモジュールを制限
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


def execute_python_code(code: str, timeout: int = 5) -> tuple[Optional[str], Optional[str]]:
    """Pythonコードを安全に実行"""
    # 安全性チェック
    safety_error = check_code_safety(code)
    if safety_error:
        return None, safety_error

    # stdoutをキャプチャ
    old_stdout = sys.stdout
    sys.stdout = captured_output = io.StringIO()

    # 実行結果とエラーを格納
    execution_result = {"output": None, "error": None, "completed": False}

    def run_code():
        """コードを実行する関数"""
        try:
            exec(code, {"__builtins__": __builtins__})
            execution_result["output"] = captured_output.getvalue()
            execution_result["completed"] = True
        except Exception as e:
            execution_result["error"] = f"実行エラー: {str(e)}"
            execution_result["completed"] = True

    # スレッドでコードを実行
    thread = threading.Thread(target=run_code)
    thread.daemon = True
    thread.start()
    thread.join(timeout=timeout)

    # タイムアウトチェック
    if thread.is_alive():
        sys.stdout = old_stdout
        return None, f"コードの実行がタイムアウトしました（{timeout}秒）"

    sys.stdout = old_stdout

    if execution_result["error"]:
        return None, execution_result["error"]

    output = execution_result["output"]
    return output.strip() if output else None, None


@app.post("/api/execute", response_model=CodeResponse)
async def execute_code(request: CodeRequest):
    """Pythonコードを実行するエンドポイント"""
    if not request.code or not request.code.strip():
        raise HTTPException(status_code=400, detail="コードが空です")

    output, error = execute_python_code(request.code)

    return CodeResponse(output=output, error=error)


@app.get("/")
async def root():
    return {"message": "CodeBlock Python Execution API"}


@app.get("/health")
async def health():
    return {"status": "ok"}

