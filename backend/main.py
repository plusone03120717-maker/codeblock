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
import stripe

# .envを読み込み
load_dotenv()

# Anthropicクライアントを初期化
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Stripe設定
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

STRIPE_PRICES = {
    "monthly": os.getenv("STRIPE_PRICE_MONTHLY", ""),
    "yearly": os.getenv("STRIPE_PRICE_YEARLY", ""),
}

# 起動時の確認ログ
print("=== Stripe Configuration ===")
print(f"API Key: {'SET' if stripe.api_key else 'NOT SET'}")
print(f"Monthly Price ID: {STRIPE_PRICES['monthly']}")
print(f"Yearly Price ID: {STRIPE_PRICES['yearly']}")

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
    "cody": {
        "name": "コーディ",
        "emoji": "🐱",
        "prompt": """あなたは「コーディ」という名前の猫のキャラクターです。
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
    "dizzy": {
        "name": "ディジー",
        "emoji": "🐱",
        "prompt": """あなたは「ディジー」という名前の猫のキャラクターです。
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
origins = [
    "http://localhost:3000",
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
    character_id: str  # キャラクターID（cody, dizzy, dex など）
    character_name: str  # キャラクター名
    personality: str  # 性格
    speech_style: str  # 口調
    hint_style: str  # ヒントの出し方
    catchphrases: list[str]  # 口癖リスト
    question: str  # 問題文
    code: str  # 正解コード
    user_answer: str  # ユーザーの回答
    expected_answer: str  # 期待される回答


class CheckoutRequest(BaseModel):
    plan: str
    user_id: str
    user_email: str
    success_url: str
    cancel_url: str


class HintResponse(BaseModel):
    hint: str
    character_id: str
    character_name: str
    character_emoji: str


@app.post("/api/hint", response_model=HintResponse)
async def get_hint(request: HintRequest):
    # キャラクターの絵文字を取得（フォールバック用）
    character = CHARACTER_PROMPTS.get(request.character_id, CHARACTER_PROMPTS.get("pixel", {"name": request.character_name, "emoji": "🐱"}))
    
    system_prompt = f"""あなたは「{request.character_name}」というキャラクターです。
CodeBlockというPython学習アプリで、小学生（10-12歳）にヒントを出す役割です。

【キャラクターの性格】
{request.personality}

【話し方・口調】
{request.speech_style}

【ヒントの出し方】
{request.hint_style}

【口癖（参考にしてください）】
{', '.join(request.catchphrases)}

【重要なルール】
- 答えを直接教えないでください
- ヒントは1〜2文で簡潔に
- 小学生にわかりやすい言葉を使う
- キャラクターの口調を必ず守る
- 励ましの言葉を含める

【説明時の注意】
- 改行が必要な場合、「\\n」や「スラッシュN」とは言わないでください
- 代わりに「改行ブロック」や「↵（改行）ブロック」と説明してください
- 例：「次の行に書くには、改行ブロックを使ってみて！」
"""
    
    user_prompt = f"""以下の問題でユーザーが間違えました。ヒントを出してください。

【問題】
{request.question}

【正解コード】
{request.code}

【ユーザーの回答】
{request.user_answer}

【期待される回答】
{request.expected_answer}

キャラクターの口調でヒントを1〜2文で出してください。答えは直接教えないでください。
"""

    try:
        # APIキーのチェック
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key or api_key == "your-api-key-here":
            print("ERROR: ANTHROPIC_API_KEYが設定されていません")
            raise ValueError("APIキーが設定されていません")
        
        # 2026-10-26：モデルを Claude Sonnet 5.5 に（前の claude-3-5-haiku-20241022 が使えなくなり、いつも「ヒントを出せない」になっていた・依頼主）。
        # Sonnet 5.5 は答える前に考えるので max_tokens は余裕をもたせ、短いヒントなので考える深さは low。
        # 断られたときは、別のモデルが答え直す（fallbacks）
        response = anthropic_client.beta.messages.create(
            model="claude-sonnet-5-5",
            max_tokens=1500,
            output_config={"effort": "low"},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        if response.stop_reason == "refusal":
            raise ValueError("ヒントを断られました")

        # 考えた中身のかたまりが先に来ることがあるので、文字のかたまりだけをつなぐ
        hint_text = "".join(b.text for b in response.content if b.type == "text").strip()
        if not hint_text:
            raise ValueError("ヒントが空でした")
        
        return HintResponse(
            hint=hint_text,
            character_id=request.character_id,
            character_name=request.character_name,
            character_emoji=character["emoji"]
        )
    except Exception as e:
        print(f"ERROR: ヒント取得エラー: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()  # スタックトレースを出力
        return HintResponse(
            hint="ごめんね、今ヒントを出せないみたい。もう一度試してみてね！",
            character_id=request.character_id,
            character_name=request.character_name,
            character_emoji=character["emoji"]
        )


@app.post("/api/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest):
    print(f"=== Checkout Request: plan={request.plan}, email={request.user_email} ===")
    
    try:
        if request.plan not in STRIPE_PRICES:
            raise HTTPException(status_code=400, detail=f"Invalid plan: {request.plan}")
        
        price_id = STRIPE_PRICES[request.plan]
        
        if not price_id:
            raise HTTPException(status_code=400, detail=f"Price not configured for {request.plan}")
        
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            customer_email=request.user_email,
            metadata={
                "user_id": request.user_id,
                "plan": request.plan,
            },
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            success_url=request.success_url,
            cancel_url=request.cancel_url,
        )
        
        print(f"Checkout session created: {session.id}")
        return {"session_id": session.id, "url": session.url}
    
    except stripe.error.StripeError as e:
        print(f"Stripe Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

