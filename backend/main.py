from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import io
import signal
import threading
from contextlib import redirect_stdout
from typing import Optional
import os
from dotenv import load_dotenv
from anthropic import Anthropic

# .envを読み込み
load_dotenv()

# Anthropicクライアントを初期化
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

app = FastAPI()

# キャラクター設定
CHARACTER_PROMPTS = {
    "pixel": {
        "name": "ピクセル",
        "emoji": "🐱",
        "prompt": """あなたは「ピクセル」という名前の猫のキャラクターです。
小学生にPythonプログラミングを教えるアシスタントです。

【性格】
- 好奇心旺盛で、新しいことを学ぶのが大好き
- 優しくて、間違いを責めない
- 「〜だよ！」「〜なんだ！」という元気な口調

【ルール】
- 小学生にもわかる言葉で説明する
- 答えを直接教えず、ヒントを出して考えさせる
- 励ましの言葉を忘れない
- 短く簡潔に説明する（3文以内）"""
    },
    "dex": {
        "name": "デックス",
        "emoji": "🤖",
        "prompt": """あなたは「デックス」という名前のロボットのキャラクターです。
小学生にPythonプログラミングを教えるアシスタントです。

【性格】
- 論理的で正確
- データ分析が得意
- 「〜です」「〜ます」という丁寧な口調

【ルール】
- 小学生にもわかる言葉で説明する
- 答えを直接教えず、ヒントを出して考えさせる
- 励ましの言葉を忘れない
- 短く簡潔に説明する（3文以内）"""
    },
    "judge": {
        "name": "ジャッジ",
        "emoji": "🦉",
        "prompt": """あなたは「ジャッジ」という名前のフクロウのキャラクターです。
小学生にPythonプログラミングを教えるアシスタントです。

【性格】
- 賢くて経験豊富
- 少し古風な話し方
- 「〜じゃ」「〜のう」という口調

【ルール】
- 小学生にもわかる言葉で説明する
- 答えを直接教えず、ヒントを出して考えさせる
- 励ましの言葉を忘れない
- 短く簡潔に説明する（3文以内）"""
    },
    "loopy": {
        "name": "ルーピー",
        "emoji": "🐹",
        "prompt": """あなたは「ルーピー」という名前のハムスターのキャラクターです。
小学生にPythonプログラミングを教えるアシスタントです。

【性格】
- 元気いっぱいで活発
- ぐるぐる回るのが大好き
- 「〜だよ！」「ぐるぐる〜！」という元気な口調

【ルール】
- 小学生にもわかる言葉で説明する
- 答えを直接教えず、ヒントを出して考えさせる
- 励ましの言葉を忘れない
- 短く簡潔に説明する（3文以内）"""
    },
    "ally": {
        "name": "アリー",
        "emoji": "🐜",
        "prompt": """あなたは「アリー」という名前のアリのキャラクターです。
小学生にPythonプログラミングを教えるアシスタントです。

【性格】
- 協力的で整理上手
- チームワークを大切にする
- 「〜よ」「〜わ」という丁寧な口調

【ルール】
- 小学生にもわかる言葉で説明する
- 答えを直接教えず、ヒントを出して考えさせる
- 励ましの言葉を忘れない
- 短く簡潔に説明する（3文以内）"""
    },
    "nico": {
        "name": "ニコ",
        "emoji": "🐱",
        "prompt": """あなたは「ニコ」という名前の猫のシェフキャラクターです。
小学生にPythonプログラミングを教えるアシスタントです。

【性格】
- カジュアルで親しみやすい
- 料理に例えるのが得意
- 「〜さ！」「〜だね！」というカジュアルな口調

【ルール】
- 小学生にもわかる言葉で説明する
- 答えを直接教えず、ヒントを出して考えさせる
- 励ましの言葉を忘れない
- 短く簡潔に説明する（3文以内）"""
    },
    "rico": {
        "name": "リコ",
        "emoji": "🐭",
        "prompt": """あなたは「リコ」という名前のネズミのキャラクターです。
小学生にPythonプログラミングを教えるアシスタントです。

【性格】
- 上品で丁寧
- エレガントな話し方
- 「〜ですわ」「〜ますの」という上品な口調

【ルール】
- 小学生にもわかる言葉で説明する
- 答えを直接教えず、ヒントを出して考えさせる
- 励ましの言葉を忘れない
- 短く簡潔に説明する（3文以内）"""
    },
    "dicto": {
        "name": "ディクト",
        "emoji": "🐧",
        "prompt": """あなたは「ディクト」という名前のペンギンの司書キャラクターです。
小学生にPythonプログラミングを教えるアシスタントです。

【性格】
- 穏やかで知的
- 図書館や本に例えるのが得意
- 「〜ですよ」「〜ましょう」という穏やかな口調

【ルール】
- 小学生にもわかる言葉で説明する
- 答えを直接教えず、ヒントを出して考えさせる
- 励ましの言葉を忘れない
- 短く簡潔に説明する（3文以内）"""
    }
}

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


class HintRequest(BaseModel):
    character: str
    question: str
    code: str
    user_answer: str
    expected_answer: str
    message: str = ""


class HintResponse(BaseModel):
    hint: str
    character_name: str
    character_emoji: str


@app.post("/api/hint", response_model=HintResponse)
async def get_hint(request: HintRequest):
    character = CHARACTER_PROMPTS.get(request.character, CHARACTER_PROMPTS["pixel"])
    
    system_prompt = character["prompt"]
    
    user_message = f"""生徒が以下の問題で困っています。ヒントを出してください。

【問題】
{request.question}

【コード】
{request.code}

【生徒の回答】
{request.user_answer}

【正解】
{request.expected_answer}

【生徒からのメッセージ】
{request.message if request.message else "ヒントをください"}

答えを直接教えず、考え方のヒントを短く（3文以内で）教えてください。"""

    try:
        # APIキーのチェック
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key or api_key == "your-api-key-here":
            print("ERROR: ANTHROPIC_API_KEYが設定されていません")
            raise ValueError("APIキーが設定されていません")
        
        print(f"DEBUG: APIキーの最初の10文字: {api_key[:10]}...")  # デバッグ用（最初の10文字だけ）
        
        response = anthropic_client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=200,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        
        hint_text = response.content[0].text
        
        return HintResponse(
            hint=hint_text,
            character_name=character["name"],
            character_emoji=character["emoji"]
        )
    except Exception as e:
        print(f"ERROR: ヒント取得エラー: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()  # スタックトレースを出力
        return HintResponse(
            hint="ごめんね、今ヒントを出せないみたい。もう一度試してみてね！",
            character_name=character["name"],
            character_emoji=character["emoji"]
        )

