# CodeBlock Backend API

Pythonコード実行バックエンドAPI

## セットアップ

1. Python 3.8以上をインストール

2. 仮想環境を作成（推奨）:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. 依存パッケージをインストール:
```bash
pip install -r requirements.txt
```

## 実行方法

```bash
uvicorn main:app --reload --port 8000
```

APIは `http://localhost:8000` で起動します。

## APIエンドポイント

### POST /api/execute

Pythonコードを実行します。

**リクエスト:**
```json
{
  "code": "print('Hello World')"
}
```

**レスポンス（成功）:**
```json
{
  "output": "Hello World",
  "error": null
}
```

**レスポンス（エラー）:**
```json
{
  "output": null,
  "error": "実行エラー: ..."
}
```

## セキュリティ機能

- 危険な関数やモジュールの使用を制限
- タイムアウト設定（デフォルト5秒）
- stdoutのキャプチャによる出力取得


