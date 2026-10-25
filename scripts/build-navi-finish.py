"""Python ナビの「仕上げ5問」（25ステップのころの STEPS を、NEW_STEP で55ステップの番号にして）を作る（src/data/navi/finishSteps.ts を書き出す）。
  python scripts/build-navi-finish.py
問題を直すときは、このファイルを直して作り直す（finishSteps.ts を手で直さない）。31-1 は finish31.ts に手で書いてある。
・形：結果の予想2問・まちがいを直す1問・ならべかえ2問（tkinter・Pillow の回は5問ともクイズ）
・選択肢はアプリでならびかえされないので、正解の位置はここで問題ごとに散らす
・ならべかえは、正解コードを区切ってブロックにし、まぎらわしいブロック（extra）を足す。ブロックは何回でも使える
・答えは scripts/verify-missions.ts（npx jiti）と、このファイルの --check で Python を動かして確かめる
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "navi" / "finishSteps.ts"
NL, IND = "↵", "    "
PREDICT = "このコードを実行すると、何が出る？"
LINES = "このコードを実行すると、何が出る？（出る行を「・」でならべたよ）"


def Q(title, code, answer, wrong, hint, explanation, desc=PREDICT, out=None, run=True):
    """クイズ。out は実際の出力（「・」でならべた答えと別のとき）。run=False は動かして確かめない（入力・窓・止まらない など）"""
    return dict(kind="quiz", title=title, desc=desc, code=code, answer=answer, wrong=wrong, hint=hint,
                explanation=explanation, out=out, run=run)


def B(title, desc, code, expected, extra=(), prefix=None, rules=(), explanation=None):
    """ならべかえ。rules は (requires|forbids, [文字], メッセージ)"""
    return dict(kind="blocks", title=title, desc=desc, code=code, expected=expected, extra=list(extra), prefix=prefix,
                rules=[{"requires" if k == "req" else "forbids": v, "message": m} for k, v, m in rules],
                explanation=explanation)


JUDGE = '''def judge(you, com):
    if you == com:
        return "あいこ"
    elif (you == "グー" and com == "チョキ") or (you == "チョキ" and com == "パー") or (you == "パー" and com == "グー"):
        return "あなたの勝ち！"
    else:
        return "あなたの負け…"'''

STEPS = {
    2: dict(desc="変数（箱）に入れて、計算や表示に使おう", example='hako = 10\nprint(hako)  # 10', qs=[
        Q("箱の中身で計算", "tate = 4\nyoko = 5\nprint(tate * yoko)", "20", ["9", "tate * yoko"],
          "tate と yoko には、何が入っているかな？", "tate は 4、yoko は 5。4 × 5 で 20 が出るよ。"),
        Q("\" \" があると？", 'name = "いちか"\nprint("name")', "name", ["いちか", "エラーになる"],
          "print の中の name は \" \" でかこんであるね。",
          "\" \" でかこむと、ただの文字 name が出る。箱の中身を出すなら print(name) だよ。"),
        Q("エラーを直そう", "print(takasa)", "print の前に takasa = 6 のように、箱を作る",
          ["takasa を \" \" でかこむ", "print を Print にする"],
          "NameError は「その名前の箱がないよ」という意味。",
          "takasa という箱をまだ作っていないので NameError。先に takasa = 6 のように作ろう。",
          desc="実行したら「NameError: name 'takasa' is not defined」と出た。どう直す？", run=False),
        B("箱を作って表示", "変数 kazu に 7 を入れて、kazu の中身を表示しよう！", "kazu = 7\nprint(kazu)", "7",
          extra=['"kazu"'], rules=[("forbids", ['"kazu"'], "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！")]),
        B("かけ算を箱に入れる", "tate × yoko の答えを変数 menseki に入れて、menseki を表示しよう！",
          "menseki = tate * yoko\nprint(menseki)", "30", extra=["×"], prefix="tate = 10\nyoko = 3",
          rules=[("forbids", ["×"], "かけ算は × ではなく、* で書くよ！")]),
    ]),
    3: dict(desc="input で聞いて、答えを計算に使おう", example='name = input("名前は？")\nprint(name)', qs=[
        Q("入れた答えを出す", 'name = input("名前は？")\nprint(name, "さん")', "いちか さん", ["name さん", "名前は？ さん"],
          "name には、入れた答えが入るよ。",
          "input で入れた「いちか」が name に入る。カンマでならべるので「いちか さん」になるよ。",
          desc="このコードで「いちか」と入れると、何が出る？", run=False),
        Q("カンマでならべる", 'menseki = 45.0\nprint("台形の面積は", menseki, "です")', "台形の面積は 45.0 です",
          ["台形の面積は menseki です", "台形の面積は45.0です"],
          "menseki は \" \" の外。カンマのところには何が入るかな？",
          "menseki の中身 45.0 が出て、カンマのところにスペースが1つずつ入るよ。"),
        Q("エラーを直そう", 'katei = float(input("下底はいくつ？")', "さいごに ) をもう1つ足す",
          ["( を1つ消す", "\" をもう1つ足す"],
          "( が2つあるね。) はいくつある？",
          "float( と input( で ( が2つ。) も2つにしないと「とじていない」エラーになるよ。",
          desc="実行したら「SyntaxError: '(' was never closed」と出た。どう直す？", run=False),
        B("文と答えをならべる", "「台形の面積は 45.0 です」と表示しよう！（menseki には 45.0 が入っているよ）",
          'print("台形の面積は", menseki, "です")', "台形の面積は 45.0 です", extra=['"menseki"'],
          prefix="menseki = 45.0",
          rules=[("forbids", ['"menseki"'], "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！")]),
        B("台形の面積を計算", "（上底 + 下底）× 高さ ÷ 2 を menseki に入れて、表示しよう！",
          "menseki = (jotei + katei) * takasa / 2\nprint(menseki)", "45.0", extra=["×"],
          prefix="jotei = 5.0\nkatei = 10.0\ntakasa = 6.0",
          rules=[("forbids", ["×"], "かけ算は × ではなく、* で書くよ！"),
                 ("req", ["("], "上底と下底を先に足すので、( ) でかこもう！")]),
    ]),
    4: dict(desc="データ型（文字・数）のちがいと、型をそろえる方法", example='print(type(10))  # int', qs=[
        Q("文字にそろえる", 'print("ハロー" + str(5))', "ハロー5", ["ハロー 5", "エラーになる"],
          "str(5) は、5 を文字の \"5\" にするよ。",
          "str(5) で文字にそろえたので、+ でつながって「ハロー5」。スペースは入らないよ。"),
        Q("文字 × 数", 'print("ワン" * 2)', "ワンワン", ["ワン2", "エラーになる"],
          "文字に * で数をかけると…？", "文字 * 数 は、その回数だけくりかえすよ。"),
        Q("エラーを直そう", 'print("ハロー" + 10)', "10 を str(10) にする",
          ["print を Print にする", "\"ハロー\" を str(\"ハロー\") にする"],
          "文字と数は、そのままでは + できないよ。",
          "10 を str(10) にして、文字どうしにそろえると + でつなげられるよ。",
          desc="実行したら「TypeError: can only concatenate str (not \"int\") to str」と出た。どう直す？", run=False),
        B("数を文字にしてつなぐ", "str( ) を使って「ハロー10」と表示しよう！", 'print("ハロー" + str(10))', "ハロー10",
          extra=["int"], rules=[("req", ["str("], "数を文字にそろえるには str( ) を使うよ！")]),
        B("文字を数にして計算", "kazu には input で入れた文字の \"8\" が入っているよ。数にして 2 を足して表示しよう！",
          "print(float(kazu) + 2)", "10.0", extra=["str"], prefix='kazu = "8"',
          rules=[("req", ["float("], "文字のままでは計算できないよ。float( ) で数にしよう！")]),
    ]),
    5: dict(desc="+= などで、コードを短く書こう", example='y = 1\ny += 1\nprint(y)  # 2', qs=[
        Q("+= で足す", "x = 20\nx += 5\nprint(x)", "25", ["205", "5"],
          "x += 5 は x = x + 5 と同じだよ。", "20 に 5 を足して、x は 25 になるよ。"),
        Q("文字にも *=", 'hello = "やあ"\nhello *= 3\nprint(hello)', "やあやあやあ", ["やあ3", "やあ やあ やあ"],
          "hello *= 3 は hello = hello * 3 と同じ。", "文字に * 3 をすると3回くりかえす。スペースは入らないよ。"),
        Q("まちがいを直そう", "x = 10\nx =+ 5\nprint(x)", "=+ を += にする", ["5 を 15 にする", "print(x) を2回書く"],
          "記号の順番をよく見てみよう。",
          "=+ だと「x に +5 を入れる」になって 5 が出る。足すときは += の順番だよ。",
          desc="15 を出したいのに、5 が出た。どう直す？", out="5"),
        B("-= でひく", "-= を使って、x から 50 をひいて表示しよう！", "x -= 50\nprint(x)", "100", extra=["+="],
          prefix="x = 150", rules=[("req", ["-="], "-= を使って、短く書こう！")]),
        B("*= でかける", "x に 3 を入れて、*= で 4 倍にして表示しよう！", "x = 3\nx *= 4\nprint(x)", "12", extra=["×"],
          rules=[("forbids", ["×"], "かけ算は × ではなく、* で書くよ！"), ("req", ["*="], "*= を使って、短く書こう！")]),
    ]),
    6: dict(desc="input・int・str・*= で、自分の計算アプリ", example='kosu = 2\nprint("合計は" + str(100 * kosu) + "円です")', qs=[
        Q("お買い物の合計", 'kosu = 3\ngoukei = 120 * kosu\nprint("合計は" + str(goukei) + "円です")', "合計は360円です",
          ["合計は 360 円です", "エラーになる"],
          "+ でつなぐと、スペースは入るかな？", "120 × 3 で 360。str( ) で文字にして + でつなぐので、スペースなしだよ。"),
        Q("長方形の面積", 'tate = 4.0\nyoko = 5.0\nprint("長方形の面積は", tate * yoko, "です")', "長方形の面積は 20.0 です",
          ["長方形の面積は 20 です", "長方形の面積は tate * yoko です"],
          "4.0 のように .0 がついた数どうしを計算すると…？", "小数どうしのかけ算なので 20.0。カンマでスペースが入るよ。"),
        Q("エラーを直そう", 'goukei = 360\nprint("合計は" + goukei + "円です")', "goukei を str(goukei) にする",
          ["360 を \"360\" にしても直らない", "int( ) でかこむ"],
          "文字と数は、そのままでは + できないよ。", "goukei は数。str(goukei) で文字にすると + でつなげられるよ。",
          desc="実行したら TypeError が出た。どう直す？", run=False),
        B("2倍にする", "*= を使って goukei を 2 倍にして、表示しよう！", "goukei *= 2\nprint(goukei)", "720",
          extra=["+="], prefix="goukei = 360", rules=[("req", ["*="], "*= を使って、何倍にもできるよ！")]),
        B("平均を出す", "たてとよこの平均（足して 2 でわる）を heikin に入れて、表示しよう！",
          "heikin = (tate + yoko) / 2\nprint(heikin)", "4.5", extra=["*"], prefix="tate = 4.0\nyoko = 5.0",
          rules=[("req", ["("], "先に足すので、( ) でかこもう！")]),
    ]),
    7: dict(desc="len で文字数、[ ] で文字の一部を取り出そう", example='word = "Python"\nprint(word[0])  # P', qs=[
        Q("文字数を数える", 'word = "プログラミング"\nprint(len(word))', "7", ["6", "8"],
          "1文字ずつ数えてみよう。", "プ・ロ・グ・ラ・ミ・ン・グ で 7文字だよ。"),
        Q("一部を取り出す", 'word = "いちかです"\nprint(word[0:3])', "いちか", ["いちかで", "ちかで"],
          "番号は 0 から。[0:3] は 3番の手前まで。", "0番・1番・2番の3文字「いちか」が出るよ。"),
        Q("まちがいを直そう", 'word = "おはようございます"\nprint(word[:3])', "[:3] を [-3:] にする",
          ["[:3] を [3:] にする", "len( ) でかこむ"],
          "後ろから数えるときは、マイナスの番号を使ったね。",
          "[:3] は前から3文字「おはよ」。[-3:] にすると後ろから3文字「います」が出るよ。",
          desc="後ろの3文字「います」を出したいのに「おはよ」が出た。どう直す？", out="おはよ"),
        B("文字数を表示", "len( ) を使って、hello の文字数を表示しよう！", "print(len(hello))", "12", extra=["str"],
          prefix='hello = "こんにちは、私は瞳です。"', rules=[("req", ["len("], "文字の数は len( ) で数えるよ！")]),
        B("後ろから取り出す", "マイナスの番号を使って、hello の後ろから6文字を表示しよう！", "print(hello[-6:])", "私は瞳です。",
          extra=["6"], prefix='hello = "こんにちは、私は瞳です。"',
          rules=[("req", ["-6"], "後ろから数えるときは、マイナスをつけるよ！")]),
    ]),
    8: dict(desc="if と else で、文字数によって出し方を変えよう", example='if 5 > 3:\n    print("5 のほうが大きい")', qs=[
        Q("どちらが動く？①", 'tweet = "おやつ食べてる"\nif len(tweet) > 10:\n    print("文字数が多すぎるよ")\nelse:\n    print(tweet)',
          "おやつ食べてる", ["文字数が多すぎるよ", "何も出ない"],
          "tweet は何文字かな？", "「おやつ食べてる」は7文字。10 より多くないので else の中が動くよ。"),
        Q("どちらが動く？②", 'tweet = "今日は公園でサッカーをしたよ"\nif len(tweet) > 10:\n    print("文字数が多すぎるよ")\nelse:\n    print(tweet)',
          "文字数が多すぎるよ", ["今日は公園でサッカーをしたよ", "何も出ない"],
          "tweet は何文字かな？", "14文字なので 10 より多い。if の中が動くよ。"),
        Q("エラーを直そう", 'if len(tweet) > 10\n    print("文字数が多すぎるよ")', "10 のあとに : を足す",
          ["print の前の空白を消す", "> を = にする"],
          "expected ':' は「: がほしい」という意味。", "if の条件のあとには : を書くよ。",
          desc="実行したら「SyntaxError: expected ':'」と出た。どう直す？", run=False),
        B("if を書く", "tweet が10文字より多ければ「文字数が多すぎるよ」と出す if を書こう！",
          'if len(tweet) > 10:\n    print("文字数が多すぎるよ")', "文字数が多すぎるよ", extra=["="],
          prefix='tweet = "今日は公園でサッカーをしたよ"',
          rules=[("req", ["\n    "], "if の中の行は、半角4文字の字下げ（インデント）をつけよう！")]),
        B("else もつける", "10文字より多ければ「文字数が多すぎるよ」、そうでなければ tweet をそのまま出そう！",
          'if len(tweet) > 10:\n    print("文字数が多すぎるよ")\nelse:\n    print(tweet)', "おやつ食べてる",
          extra=['"tweet"'], prefix='tweet = "おやつ食べてる"',
          rules=[("forbids", ['"tweet"'], "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"),
                 ("req", ["else:"], "「でなければ」は else: で書くよ！")]),
    ]),
    9: dict(desc=">=・> のちがいと、elif で条件をふやそう", example='score = 90\nif score >= 80:\n    print("大変よくできました")', qs=[
        Q(">= のとき", 'score = 80\nif score >= 80:\n    print("合格")\nelse:\n    print("もう少し")', "合格",
          ["もう少し", "両方出る"], ">= は「以上」。80 もふくむかな？", "80 は「80以上」に入るので、if の中が動くよ。"),
        Q("elif のとき", 'score = 65\nif score >= 80:\n    print("大変よくできました")\nelif score >= 60:\n    print("よくできましたね")\nelse:\n    print("もっと頑張りましょう")',
          "よくできましたね", ["大変よくできました", "もっと頑張りましょう"],
          "上から順に調べるよ。", "65 は 80 以上ではないけど 60 以上なので、elif の中が動くよ。"),
        Q("エラーを直そう", 'score = 70\nif score => 70:\n    print("頑張りましたね")', "=> を >= にする",
          ["70 を \"70\" にする", "if を elif にする"],
          "記号の順番をよく見てみよう。", "「以上」は >= の順番。=> はエラーになるよ。",
          desc="実行したら SyntaxError が出た。どう直す？", run=False),
        B("70点以上なら", "score が 70 以上なら「頑張りましたね」と出す if を書こう！",
          'if score >= 70:\n    print("頑張りましたね")', "頑張りましたね", extra=[">"], prefix="score = 70",
          rules=[("req", [">="], ">= は「以上」。70 もふくめるよ！")]),
        B("elif をつかう", "60 以上なら「よくできましたね」、そうでなく 40 以上なら「もう少し頑張りましょう」と出そう！",
          'if score >= 60:\n    print("よくできましたね")\nelif score >= 40:\n    print("もう少し頑張りましょう")',
          "もう少し頑張りましょう", extra=["else"], prefix="score = 50",
          rules=[("req", ["elif "], "条件をふやすときは elif を使うよ！")]),
    ]),
    10: dict(desc="リストと番号、random でおみくじ", example='colors = ["赤", "青"]\nprint(colors[1])  # 青', qs=[
        Q("番号で取り出す", 'lunch = ["ラーメン", "カレー", "うどん"]\nprint(lunch[0])', "ラーメン", ["カレー", "エラーになる"],
          "番号は 0 から数えるよ。", "0番はいちばん左の「ラーメン」だよ。"),
        Q("いちばん後ろ", 'omikuji = ["大吉", "中吉", "小吉"]\nprint(omikuji[2])', "小吉", ["中吉", "エラーになる"],
          "0・1・2 と数えてみよう。", "0番が大吉、1番が中吉、2番が小吉だよ。"),
        Q("エラーを直そう", 'lunch = ["ラーメン", "カレー", "うどん"]\nprint(lunch[3])', "[3] を [2] にする",
          ["[3] を [4] にする", "lunch を \"lunch\" にする"],
          "3つのリストの番号は 0・1・2 だよ。", "番号は 0 から。3つめの「うどん」は [2] だよ。",
          desc="「うどん」を出したいのに「IndexError: list index out of range」が出た。どう直す？", run=False),
        B("リストを作る", "「りんご」と「みかん」が入ったリスト fruits を作って、表示しよう！",
          'fruits = ["りんご", "みかん"]\nprint(fruits)', "['りんご', 'みかん']", extra=['"fruits"'],
          rules=[("forbids", ['"fruits"'], "\" \" でかこむと、リストではなく文字のまま出るよ！")]),
        B("番号で取り出す", "lunch から「ハンバーガー」を番号で取り出して、表示しよう！", "print(lunch[2])", "ハンバーガー",
          extra=["3"], prefix='lunch = ["ラーメン", "カレー", "ハンバーガー", "うどん"]',
          rules=[("req", ["[2]"], "番号は 0 から数えるよ！")]),
    ]),
    11: dict(desc="sum・max・sorted と .append( )", example='nums = [3, 1, 2]\nprint(min(nums))  # 1', qs=[
        Q("合計", "tensu = [70, 90, 80]\nprint(sum(tensu))", "240", ["90", "[70, 90, 80]"],
          "sum はぜんぶ足すよ。", "70 + 90 + 80 で 240 だよ。"),
        Q("ならべかえ", "tensu = [70, 90, 80]\nprint(sorted(tensu))", "[70, 80, 90]", ["[90, 80, 70]", "[70, 90, 80]"],
          "sorted は小さい順？大きい順？", "sorted は小さい順にならべるよ。"),
        Q("エラーを直そう", 'lunch = ["カレー", "うどん"]\nlunch.append["パスタ"]', "[ ] を ( ) にする",
          ["\"パスタ\" の \" \" をとる", "append を add にする"],
          ".append のあとのカッコの形を見てみよう。", ".append( ) は丸いカッコ。lunch.append(\"パスタ\") だよ。",
          desc="実行したら TypeError が出た。どう直す？", run=False),
        B("いちばん大きい点数", "tensu の中で、いちばん大きい点数を表示しよう！", "print(max(tensu))", "90", extra=["min"],
          prefix="tensu = [80, 65, 90, 70]", rules=[("req", ["max("], "いちばん大きい数は max( ) だよ！")]),
        B("リストに追加", "lunch に「うどん」を追加して、lunch を表示しよう！", 'lunch.append("うどん")\nprint(lunch)',
          "['ラーメン', 'カレー', 'うどん']", extra=["pop"], prefix='lunch = ["ラーメン", "カレー"]',
          rules=[("req", ["append("], "追加するときは .append( ) だよ！")]),
    ]),
    12: dict(desc="str・int で型をそろえて、足し算アプリ", example='a = 2\nprint(str(a) + "こ")  # 2こ', qs=[
        Q("問題の文を作る", 'suji1 = 3\nsuji2 = 4\nprint(str(suji1) + "+" + str(suji2) + "はいくつ？")', "3+4はいくつ？",
          ["7はいくつ？", "エラーになる"],
          "str( ) で文字にしてから + でつないでいるよ。", "文字どうしの + はつなぐだけ。計算はしないので「3+4はいくつ？」だよ。"),
        Q("数にしてくらべる", 'kotae = int("7")\nprint(kotae == 7)', "True", ["False", "エラーになる"],
          "int( ) で数になっているかな？", "int(\"7\") で数の 7 になったので、7 と同じ。True だよ。"),
        Q("エラーを直そう", 'suji1 = 3\nprint(suji1 + "はいくつ？")', "suji1 を str(suji1) にする",
          ["\"はいくつ？\" を int( ) でかこむ", "+ を * にする"],
          "数と文字は、そのままでは + できないよ。", "str(suji1) で文字にそろえると、+ でつなげられるよ。",
          desc="実行したら TypeError が出た。どう直す？", run=False),
        B("正解か調べる", "goukei と kotae が同じなら「正解です」と出そう！", 'if goukei == kotae:\n    print("正解です")',
          "正解です", extra=["="], prefix='goukei = 7\nkotae = int("7")',
          rules=[("req", ["=="], "くらべるときは == （= が2つ）だよ！")]),
        B("答えを数にする", "kotae には文字の \"7\" が入っているよ。数にして 3 を足して表示しよう！", "print(int(kotae) + 3)", "10",
          extra=["str"], prefix='kotae = "7"', rules=[("req", ["int("], "文字を整数にするには int( ) だよ！")]),
    ]),
    13: dict(desc="for と range でくりかえそう", example='for i in range(2):\n    print("やあ")', qs=[
        Q("何が出る？①", "for i in range(4):\n    print(i)", "0・1・2・3", ["1・2・3・4", "4だけ"],
          "i は 0 から始まるよ。", "range(4) は 0・1・2・3 の4回。", desc=LINES, out="0\n1\n2\n3"),
        Q("何が出る？②", "for i in range(3):\n    print(2 * i)", "0・2・4", ["2・4・6", "0・1・2"],
          "i が 0・1・2 のとき、2 * i はいくつ？", "2 × 0、2 × 1、2 × 2 で 0・2・4 だよ。", desc=LINES, out="0\n2\n4"),
        Q("エラーを直そう", "for i in range(3):\nprint(i)", "print(i) の前に、半角4文字の字下げをつける",
          ["range(3) を range(4) にする", "i を \"i\" にする"],
          "for の中の行はどう書いたかな？", "for の中でくりかえす行は、字下げ（インデント）をつけるよ。",
          desc="実行したら「IndentationError: expected an indented block」と出た。どう直す？", run=False),
        B("1・2・3 を出す", "for と range(3) を使って、1・2・3 を1行ずつ出そう！（i + 1 を使うよ）",
          "for i in range(3):\n    print(i + 1)", "1\n2\n3", extra=["4"],
          rules=[("req", ["for "], "for を使ってくりかえそう！")]),
        B("リストを1つずつ", "for を使って、lunch の中身を1つずつ表示しよう！", "for i in lunch:\n    print(i)",
          "ラーメン\nカレー\nうどん", extra=["range"], prefix='lunch = ["ラーメン", "カレー", "うどん"]',
          rules=[("req", ["in lunch"], "for i in lunch: で、リストから1つずつ取り出せるよ！")]),
    ]),
    14: dict(desc="for の中に for・for の中に if", example='for i in range(2):\n    for j in range(2):\n        print(i, j)', qs=[
        Q("for の中の for", "for i in range(2):\n    for j in range(2):\n        print(i * j)", "0・0・0・1",
          ["0・1・0・1", "0・1・2・3"], "i が 0 のとき、j は 0・1。i が 1 のときは？",
          "0×0、0×1、1×0、1×1 の順で 0・0・0・1 だよ。", desc=LINES, out="0\n0\n0\n1"),
        Q("わり算のあまり", "print(7 % 2)", "1", ["3", "3.5"],
          "% は「わったあまり」だよ。", "7 ÷ 2 は 3 あまり 1。% はあまりの 1 を出すよ。"),
        Q("まちがいを直そう", "for i in range(6):\n    if i % 2 == 1:\n        print(i)", "== 1 を == 0 にする",
          ["% を / にする", "range(6) を range(5) にする"],
          "2 でわったあまりが 0 なのは、偶数？奇数？", "偶数は 2 でわり切れる（あまり 0）。== 0 にすると 0・2・4 が出るよ。",
          desc="偶数の 0・2・4 を出したいのに、1・3・5 が出た。どう直す？", out="1\n3\n5"),
        B("偶数だけ出す", "0〜5 の中で、偶数だけを出そう！", "for i in range(6):\n    if i % 2 == 0:\n        print(i)",
          "0\n2\n4", extra=["/"], rules=[("req", ["%"], "あまりを調べるときは % だよ！")]),
        B("for を2重に", "for の中に for を書いて、0・1・2 を2回出そう！",
          "for i in range(2):\n    for j in range(3):\n        print(j)", "0\n1\n2\n0\n1\n2", extra=["i"],
          rules=[("req", ["        print"], "中の for の中は、字下げを2つ重ねるよ！")]),
    ]),
    15: dict(desc="break・continue・while", example='n = 3\nwhile n > 0:\n    print(n)\n    n -= 1', qs=[
        Q("break", "for i in range(10):\n    if i >= 3:\n        break\n    print(i)", "0・1・2",
          ["0・1・2・3", "3・4・5・6・7・8・9"], "break で、くりかえしがどうなる？",
          "i が 3 になったところで break。0・1・2 だけが出るよ。", desc=LINES, out="0\n1\n2"),
        Q("continue", "for i in range(5):\n    if i == 2:\n        continue\n    print(i)", "0・1・3・4",
          ["0・1", "2だけ"], "continue はその回だけとばすよ。", "2 のときだけとばすので 0・1・3・4。", desc=LINES,
          out="0\n1\n3\n4"),
        Q("まちがいを直そう", "n = 0\nwhile n <= 3:\n    print(n)", "print(n) の下に、字下げして n += 1 を足す",
          ["while を if にする", "<= を >= にする"],
          "n はずっと 0 のままだね。", "n += 1 で n をふやさないと、条件がずっと合ったままで止まらないよ。",
          desc="このコードは、ずっと止まらなかった。0〜3 を出して止めるには、どう直す？", run=False),
        B("while で 1〜3", "while を使って、1・2・3 を出そう！", "while n <= 3:\n    print(n)\n    n += 1", "1\n2\n3",
          extra=["break"], prefix="n = 1", rules=[("req", ["n += 1"], "n += 1 を忘れると、ずっと止まらないよ！")]),
        B("2 だけとばす", "0〜4 のうち、2 のときだけとばして出そう！",
          "for i in range(5):\n    if i == 2:\n        continue\n    print(i)", "0\n1\n3\n4", extra=["break"],
          rules=[("forbids", ["break"], "break だと、そこで止まってしまうよ。とばすのは continue！"),
                 ("req", ["continue"], "その回だけとばすのは continue だよ！")]),
    ]),
    16: dict(desc="and・or と if で、じゃんけんの判定", example='you = "グー"\nif you == "グー":\n    print("グーだね")', qs=[
        Q("勝ち負けの判定", 'you = "グー"\ncom = "チョキ"\nif you == com:\n    print("あいこ")\nelif you == "グー" and com == "チョキ":\n    print("勝ち")\nelse:\n    print("負け")',
          "勝ち", ["あいこ", "負け"], "you と com は同じ？", "あなたがグー・コンピュータがチョキなので、elif の中「勝ち」が動くよ。"),
        Q("and のとき", "print(1 == 1 and 2 == 3)", "False", ["True", "エラーになる"],
          "and は「どちらも合っている」ときだけ True。", "1 == 1 は True、2 == 3 は False。and なので False だよ。"),
        Q("エラーを直そう", 'you = "グー"\nif you = "グー":\n    print("グーだね")', "= を == にする",
          ["\"グー\" の \" \" をとる", "if を while にする"],
          "くらべる記号は = が何個だったかな？", "= は「入れる」。くらべるときは == だよ。",
          desc="実行したら SyntaxError が出た。どう直す？", run=False),
        B("あいこの判定", "you と com が同じなら「あいこ！もう一回！」と出そう！", 'if you == com:\n    print("あいこ！もう一回！")',
          "あいこ！もう一回！", extra=["="], prefix='you = "グー"\ncom = "グー"',
          rules=[("req", ["=="], "くらべるときは == （= が2つ）だよ！")]),
        B("and で勝ちを判定", "あなたがパーで、かつコンピュータがグーなら「あなたの勝ち！」と出そう！",
          'if you == "パー" and com == "グー":\n    print("あなたの勝ち！")', "あなたの勝ち！", extra=["or"],
          prefix='you = "パー"\ncom = "グー"', rules=[("req", [" and "], "「〜かつ〜」は and だよ！")]),
    ]),
    17: dict(desc="def で関数を作って、呼び出そう", example='def bye():\n    print("またね")\nbye()', qs=[
        Q("2回呼ぶと", 'def hello():\n    print("こんにちは")\nhello()\nhello()', "こんにちは・こんにちは",
          ["こんにちは", "何も出ない"], "hello() は何回書いてある？", "呼び出した2回だけ動くので、2行出るよ。",
          desc=LINES, out="こんにちは\nこんにちは"),
        Q("作っただけだと", 'def hello():\n    print("こんにちは")', "何も出ない", ["こんにちは", "エラーになる"],
          "関数は、作っただけで動くかな？", "def で作っただけでは動かない。hello() で呼び出したときに動くよ。", out=""),
        Q("まちがいを直そう", 'def hello():\n    print("やあ")\nhello', "hello を hello() にする",
          ["def を消す", "print を2回書く"], "呼び出すときに、何か足りないね。", "関数を動かすには、カッコをつけて hello() と書くよ。",
          desc="「やあ」と出したいのに、何も出ない。どう直す？", out=""),
        B("関数を作って呼ぶ", "「おはよう」と出す関数 aisatsu を作って、呼び出そう！", 'def aisatsu():\n    print("おはよう")\naisatsu()',
          "おはよう", extra=["return"],
          rules=[("req", ["\naisatsu()"], "作っただけでは動かないよ。さいごに aisatsu() で呼び出そう！")]),
        B("for で3回呼ぶ", "for を使って、hello を3回呼び出そう！", "for i in range(3):\n    hello()",
          "こんにちは\nこんにちは\nこんにちは", extra=["hello"], prefix='def hello():\n    print("こんにちは")',
          rules=[("req", ["hello()"], "呼び出すときは hello() とカッコをつけよう！")]),
    ]),
    18: dict(desc="引数と return（戻り値）", example='def double(n):\n    return n * 2\nprint(double(4))  # 8', qs=[
        Q("消費税", "def shohizei(kingaku):\n    return kingaku * 0.1\nprint(shohizei(500))", "50.0", ["500", "5000"],
          "500 × 0.1 はいくつ？", "引数の kingaku に 500 が入り、500 × 0.1 = 50.0 が戻ってくるよ。"),
        Q("引数で名前をわたす", 'def hello2(name):\n    print(name + "さん、こんにちは")\nhello2("ひかり")', "ひかりさん、こんにちは",
          ["nameさん、こんにちは", "エラーになる"], "name には何が入るかな？", "hello2(\"ひかり\") で、name に「ひかり」が入るよ。"),
        Q("まちがいを直そう", "def baisu(kazu):\n    kekka = kazu * 2\nprint(baisu(5))", "kekka のあとに return kekka を足す",
          ["print を消す", "kazu を 2 にする"], "関数の答えを外にわたすには？",
          "return がないと、関数は答えを返さず None になる。return kekka を足そう。",
          desc="10 を出したいのに「None」が出た。どう直す？", out="None"),
        B("引数のある関数", "name を受け取って「〇〇さん、ようこそ」と出す関数 welcome を作り、welcome(\"いちか\") で呼ぼう！",
          'def welcome(name):\n    print(name + "さん、ようこそ")\nwelcome("いちか")', "いちかさん、ようこそ", extra=['"name"'],
          rules=[("forbids", ['"name"'], "\" \" でかこむと、引数の中身ではなく文字の name になるよ！")]),
        B("関数を使う", "shohizei を使って、1000円の消費税を表示しよう！", "print(shohizei(1000))", "100.0",
          extra=["kingaku"], prefix="def shohizei(kingaku):\n    return kingaku * 0.1",
          rules=[("req", ["shohizei(1000)"], "shohizei( ) のカッコに 1000 をわたそう！")]),
    ]),
    19: dict(desc="引数を2つにした関数", example='def kakeru(a, b):\n    return a * b\nprint(kakeru(2, 5))  # 10', qs=[
        Q("面積の関数", "def menseki(tate, yoko):\n    return tate * yoko\nprint(menseki(6, 7))", "42", ["13", "67"],
          "tate と yoko には何が入る？", "tate に 6、yoko に 7。6 × 7 = 42 だよ。"),
        Q("わたす順番", "def hiku(a, b):\n    return a - b\nprint(hiku(3, 10))", "-7", ["7", "エラーになる"],
          "a と b に入るのは、どっちの数？", "順番どおり a に 3、b に 10。3 - 10 = -7 だよ。"),
        Q("エラーを直そう", "def menseki(tate, yoko):\n    return tate * yoko\nprint(menseki(4))",
          "menseki(4) を menseki(4, 5) のように2つわたす", ["return を print にする", "def を消す"],
          "引数はいくつ必要かな？", "menseki は tate と yoko の2つを受け取る。カンマで区切って2つわたそう。",
          desc="実行したら「TypeError: menseki() missing 1 required positional argument: 'yoko'」と出た。どう直す？", run=False),
        B("たし算の関数", "a と b を受け取って足した答えを返す関数 tasu を作り、tasu(2, 3) を表示しよう！",
          "def tasu(a, b):\n    return a + b\nprint(tasu(2, 3))", "5", extra=["*"],
          rules=[("req", ["return "], "関数の答えは return で返そう！")]),
        B("面積を表示", "menseki を使って、たて 12・よこ 8 の面積を表示しよう！", "print(menseki(12, 8))", "96",
          extra=["×"], prefix="def menseki(tate, yoko):\n    return tate * yoko",
          rules=[("req", ["menseki(12, 8)"], "たて・よこの順に、カンマで区切ってわたそう！")]),
    ]),
    20: dict(desc="じゃんけんの判定を judge( ) 関数に", example='def kotae(x):\n    if x == 1:\n        return "いち"\nprint(kotae(1))', qs=[
        Q("judge の結果①", JUDGE + '\nprint(judge("チョキ", "パー"))', "あなたの勝ち！", ["あいこ", "あなたの負け…"],
          "チョキとパーは、どちらが勝つ？", "あなたがチョキ・コンピュータがパーなので、あなたの勝ち！"),
        Q("judge の結果②", JUDGE + '\nprint(judge("グー", "パー"))', "あなたの負け…", ["あいこ", "あなたの勝ち！"],
          "グーとパーは、どちらが勝つ？", "パーがグーに勝つので、あなたの負け…だよ。"),
        Q("まちがいを直そう", 'def judge(you, com):\n    if you == com:\n        print("あいこ")\nresult = judge("グー", "グー")\nprint(result)',
          "print(\"あいこ\") を return \"あいこ\" にする", ["judge を Judge にする", "if を while にする"],
          "関数の答えを外にわたすのは？", "print では result に何も入らず None になる。return で返そう。",
          desc="result に「あいこ」を入れたいのに、None になった。どう直す？", out="あいこ\nNone"),
        B("あいこを返す", "同じ手なら「あいこ」を返す関数 judge を作り、judge(\"パー\", \"パー\") を表示しよう！",
          'def judge(you, com):\n    if you == com:\n        return "あいこ"\nprint(judge("パー", "パー"))', "あいこ",
          extra=["="], rules=[("req", ["return "], "関数の答えは return で返そう！"),
                               ("req", ["=="], "くらべるときは == だよ！")]),
        B("judge を使う", "judge で「グー」と「チョキ」の結果を result に入れて、表示しよう！",
          'result = judge("グー", "チョキ")\nprint(result)', "あなたの勝ち！", extra=['"result"'], prefix=JUDGE,
          rules=[("forbids", ['"result"'], "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！")]),
    ]),
    21: dict(desc="tkinter で、窓・ラベル・ボタンのアプリ", example='root = tk.Tk()\nroot.title("はじめての窓")', quiz_only=True, qs=[
        Q("窓の大きさ", 'root.geometry("300x200")', "200", ["300", "500"],
          "\"よこxたて\" の順で書くよ。", "300 がよこ、200 がたての大きさだよ。", desc="この窓の「たて」の大きさは？", run=False),
        Q("窓に出すには", 'lbl = tk.Label(text="ラベル")\nbtn = tk.Button(text="プッシュ")', "lbl.pack() と btn.pack() を書く",
          ["print(lbl) と書く", "何もしなくても出る"], "作っただけでは、窓にはならばないよ。",
          ".pack() で窓にならべると表示されるよ。", desc="ラベルとボタンを作った。窓に出すには？", run=False),
        Q("まちがいを直そう", 'import tkinter as tk\nroot = tk.Tk()\nlbl = tk.Label(text="こんにちは")\nlbl.pack()', "tk.mainloop()",
          ["root.title()", "lbl.config()"], "窓を出したままにする1行があったね。",
          "さいごに tk.mainloop() を書くと、窓が開いたままになるよ。",
          desc="実行しても、窓がすぐ消えてしまう。さいごに足りない1行は？", run=False),
        Q("command=", 'btn = tk.Button(text="プッシュ", command=change_label)', "change_label 関数が動く",
          ["ボタンが消える", "「プッシュ」と2回出る"], "command= には、押したときに動く関数を書くよ。",
          "ボタンを押すと、command= に書いた change_label が動くよ。", desc="このボタンを押すと、何が起きる？", run=False),
        Q("config", 'lbl.config(text="こんにちは")', "ラベルの文字を「こんにちは」に書きかえる",
          ["ボタンを作る", "窓の大きさを変える"], "config は「設定を変える」だよ。",
          "lbl.config(text=…) で、ラベルの文字を書きかえられるよ。", desc="この行は、何をする？", run=False),
    ]),
    22: dict(desc="ボタンでくじを引く、おみくじアプリ", example='root.geometry("400x300")', quiz_only=True, qs=[
        Q("title", 'root.title("おみくじ")', "窓の上のタイトル", ["ラベルの文字", "ボタンの文字"],
          "title は「題名」だよ。", "root.title( ) で、窓の上に出るタイトルが変わるよ。", desc="この行で、どこの文字が変わる？", run=False),
        Q("くじを引く", 'kuji = ["大吉", "中吉", "小吉", "凶"]\nkekka = random.choice(kuji)', "4つのどれか1つ（毎回かわる）",
          ["いつも大吉", "4つ全部"], "choice は「えらぶ」だよ。", "random.choice で、リストからランダムに1つえらぶよ。",
          desc="kekka に入るのは？", run=False),
        Q("まちがいを直そう", 'btn = tk.Button(text="占う", command=uranau())', "uranau() を uranau にする（カッコをとる）",
          ["text を command にする", "占う を \"占う\" にする"], "command= に書くのは、関数の名前だけだよ。",
          "カッコをつけると、窓を作るときに1回動くだけ。command=uranau とカッコなしで書こう。",
          desc="ボタンを押しても、くじが引けない。どう直す？", run=False),
        Q("書く場所", "def uranau():", "btn を作る行より上", ["tk.mainloop() の下", "どこでもよい"],
          "使う前に作っておく必要があるよ。", "command=uranau で使うので、btn の行より上で作っておくよ。",
          desc="def uranau(): は、どこに書く？", run=False),
        Q("ラベルに出るもの", "lbl.config(text=kekka)", "引いたくじ（大吉など）", ["kekka という文字", "今日のあなたの運勢は"],
          "kekka は \" \" でかこんでいないね。", "kekka の中身（引いたくじ）が、ラベルに出るよ。",
          desc="ボタンを押したあと、ラベルに出るのは？", run=False),
    ]),
    23: dict(desc="ファイルをえらんで、画像を窓に出すアプリ", example="import tkinter as tk  # 窓を作るモジュール", quiz_only=True, qs=[
        Q("PIL", "import PIL.Image", "画像を使う道具（Pillow）を読みこむ", ["窓を作る", "ファイルを消す"],
          "PIL は画像の道具だったね。", "Pillow（PIL）は、画像を開いたり加工したりする外部ライブラリだよ。",
          desc="この行は、何のため？", run=False),
        Q("ファイルをえらぶ", "fpath = fd.askopenfilename()", "ファイルをえらぶ画面を出して、えらんだ場所を fpath に入れる",
          ["画像を白黒にする", "ボタンを作る"], "ask は「たずねる」、open は「開く」。",
          "ファイルをえらぶ画面が出て、えらんだファイルの場所が fpath に入るよ。", desc="この行は、何をする？", run=False),
        Q("まちがいを直そう", 'btn = tk.Button(text="ファイルを開く", command=openFile)\nimageLabel = tk.Label()\nbtn.pack()',
          "imageLabel.pack() を足す", ["import random を足す", "btn.pack() を消す"],
          "作った部品は、窓にならべないと出ないよ。", "imageLabel も .pack() で窓にならべると、画像が出るよ。",
          desc="ボタンは出るのに、えらんだ画像が窓に出ない。どう直す？", run=False),
        Q("resize", "PIL.Image.open(path).resize((300, 300))", "画像の大きさを よこ300・たて300 にする",
          ["画像を300回出す", "画像を白黒にする"], "resize は「大きさを変える」だよ。",
          "開いた画像を、よこ300・たて300 の大きさにするよ。", desc="resize((300, 300)) は、何をする？", run=False),
        Q("dispPhoto", "dispPhoto(fpath)", "えらんだ画像を窓に出す関数を呼んでいる", ["ファイルを消している", "窓を閉じている"],
          "dispPhoto は、自分で作った関数だったね。", "えらんだファイルの場所をわたして、画像を窓に出しているよ。",
          desc="openFile の中の dispPhoto(fpath) は、何をしている？", run=False),
    ]),
    24: dict(desc="convert と resize で、白黒とモザイク", example='PIL.Image.open(path).resize((150, 150))', quiz_only=True, qs=[
        Q("convert(\"L\")", 'PIL.Image.open(path).convert("L")', "白黒の画像になる", ["モザイクの画像になる", "大きい画像になる"],
          "L は白黒のモードだよ。", "convert(\"L\") で、画像を白黒にできるよ。", desc="convert(\"L\") をつけると？", run=False),
        Q("resize を2回", "PIL.Image.open(path).resize((32, 32)).resize((300, 300))", "モザイクになる",
          ["白黒になる", "何も変わらない"], "一度小さくしてから、大きくもどしているね。",
          "小さくすると細かいところが消えるので、大きくもどすとモザイクになるよ。", desc="この書き方で、画像はどうなる？", run=False),
        Q("細かくするには", "PIL.Image.open(path).resize((32, 32)).resize((300, 300), resample=0)", "32 を 64 にする",
          ["32 を 16 にする", "300 を 30 にする"], "小さくするときの数を大きくすると、四角は…？",
          "64 にすると、四角が小さく細かいモザイクになる。16 にすると、もっと大きな四角になるよ。",
          desc="モザイクの四角を、もっと小さく（細かく）したい。どう直す？", run=False),
        Q("resample=0", ".resize((300, 300), resample=0)", "四角がくっきりしたモザイクになる", ["画像が消える", "色がつく"],
          "resample=0 は、ぼかさずに大きくするよ。", "ぼかさずに大きくするので、四角がはっきりしたモザイクになるよ。",
          desc="resample=0 をつけると？", run=False),
        Q("白黒のモザイク", "newImage = （どれ？）",
          'PIL.Image.open(path).convert("L").resize((32, 32)).resize((300, 300))',
          ['PIL.Image.open(path).resize((300, 300))', 'PIL.Image.open(path).convert("L")'],
          "白黒にする部分と、小さくして大きくもどす部分の両方が要るよ。",
          "convert(\"L\") で白黒にして、resize を2回でモザイクにするよ。", desc="白黒のモザイクにするには、どれ？", run=False),
    ]),
    25: dict(desc="ボタンで切りかえる、画像加工アプリ", example='tk.Button(window, text="もとにもどす", command=to_original)', quiz_only=True, qs=[
        Q("押すと動く関数", 'tk.Button(window, text="白黒", command=to_gray)', "to_gray", ["to_mosaic", "open_image"],
          "command= のあとを見てみよう。", "「白黒」ボタンを押すと、command= の to_gray が動くよ。",
          desc="このボタンを押すと動く関数は？", run=False),
        Q("// の数を変える", "small = original.resize((original.width // 20, original.height // 20))",
          "モザイクの四角が小さく（細かく）なる", ["モザイクの四角が大きくなる", "白黒になる"],
          "// 10 にすると、small は大きい？小さい？", "// 10 だと小さくする度合いが弱くなり、四角が小さい細かいモザイクになるよ。",
          desc="// 20 を // 10 に変えると？", run=False),
        Q("しくみを読もう", 'def to_gray():\n    if original is not None:\n        show(original.convert("L"))',
          "画像があるときだけ白黒にするから", ["convert が何もしないから", "ボタンが押せないから"],
          "is not None は「からっぽではない」だよ。", "original に画像が入っているときだけ動くので、開く前に押してもエラーにならないよ。",
          desc="画像を開く前に「白黒」を押しても、エラーにならないのはなぜ？", run=False),
        Q("side=tk.LEFT", ".pack(side=tk.LEFT, expand=True)", "ボタンを左から横にならべる",
          ["ボタンをたてにならべる", "ボタンを消す"], "LEFT は「左」だよ。", "side=tk.LEFT で、左から横にならべるよ。",
          desc="ボタンの .pack( ) にこれをつけると？", run=False),
        Q("show", "def show(img):\n    global photo\n    photo = ImageTk.PhotoImage(img)\n    label.config(image=photo)",
          "わたされた画像を、窓のラベルに出す", ["画像を保存する", "画像を白黒にする"],
          "label.config(image=…) は何をする？", "わたされた画像を窓に出せる形にして、ラベルに出すよ。",
          desc="この show 関数は、何をする？", run=False),
    ]),
}

VIDEO = {2: "#3", 3: "#4", 4: "#5", 5: "#6", 7: "#7", 8: "#8", 9: "#9", 10: "#10", 11: "#11", 12: "#12", 13: "#13",
         14: "#14", 15: "#14", 17: "#15", 18: "#16", 19: "#16.1", 21: "#18", 22: "#19", 23: "#20", 24: "#21"}
# 55ステップへの組みかえ（2026-10-25）：STEPS の番号（25ステップのころ）→ 仕上げをつける新しいステップ。
# 前の動画を見出しで分けたステップは、後ろの部分（その動画の内容をぜんぶ見おわったところ）につける
# 55ステップで新しく作った動画の仕上げ（番号は55ステップのまま。動画を作ったら足す）
FRESH = {
    2: dict(desc="ひき算・かけ算・わり算と、計算のじゅんばん・かっこ", example="print(9 - 5)  # 4", qs=[
        Q("どっちが先？", "print(9 - 4 * 2)", "1", ["10", "9 - 4 * 2"],
          "かけ算と、ひき算。どちらが先に計算されるかな？", "かけ算が先。4 * 2 = 8 を先に計算して、9 - 8 = 1 だよ。"),
        Q("わり算の答え", "print(8 / 4)", "2.0", ["2", "8 / 4"],
          "パイソンのわり算の答えには、何がつくかな？", "わり算の答えには .0 がつく。8 / 4 は 2.0 だよ。"),
        Q("エラーを直そう", "print(3 × 5)", "× を * にする", ["3 と 5 を \" \" でかこむ", "かっこをもう1つ足す"],
          "× は、パイソンでつかえるかな？", "パイソンのかけ算は * （アスタリスク）。× はつかえないので SyntaxError になるよ。",
          desc="実行したら「SyntaxError: invalid character '×'」と出た。どう直す？", run=False),
        B("おつりを出そう", "100円で 30円の あめを買った。おつりを計算して表示しよう！", "print(100 - 30)", "70", extra=["+"],
          rules=[("req", ["-"], "おつりは、ひき算（-）で出すよ！")]),
        B("かっこで先に", "4 + 6 を先に計算してから、3 をかけよう！", "print((4 + 6) * 3)", "30", extra=["×"],
          rules=[("forbids", ["×"], "かけ算は × ではなく、* で書くよ！"),
                 ("req", ["(4 + 6)"], "先にしたい 4 + 6 を、かっこでかこもう！")]),
    ]),
    3: dict(desc="わり算の / と //、あまりの %", example="print(7 % 2)  # 1", qs=[
        Q("あまりは？", "print(17 % 5)", "2", ["3", "3.4"],
          "% は、わり算の何を出すかな？", "17 ÷ 5 = 3 あまり 2。% は、あまりの 2 を出すよ。"),
        Q("// の答え", "print(9 // 2)", "4", ["4.5", "1"],
          "スラッシュ2つは、小数のところをどうするかな？", "9 / 2 は 4.5。// は小数のところを切りすてて 4 になるよ。"),
        Q("エラーを直そう", "print(10 / 0)", "0 ではない数でわる", ["/ を // にする", "かっこをもう1つ足す"],
          "0 で、わり算はできるかな？", "算数と同じで、0 ではわれない。// にしても ZeroDivisionError になるよ。",
          desc="実行したら「ZeroDivisionError: division by zero」と出た。どう直す？", run=False),
        B("あまりを出そう", "23 を 4 でわった、あまりを表示しよう！", "print(23 % 4)", "3", extra=["//"],
          rules=[("req", ["%"], "あまりは % で出すよ！")]),
        B("何こ買える？", "1こ 30円のガム。200円で何こ買えるかな？ 整数の答えを表示しよう！", "print(200 // 30)", "6", extra=["/"],
          rules=[("req", ["//"], "整数の答えは // で出すよ！")]),
    ]),
}

NEW_STEP = {2: 5, 3: 8, 4: 9, 5: 10, 6: 11, 7: 14, 8: 16, 9: 18, 10: 23, 11: 25, 12: 28, 13: 33, 14: 35, 15: 37,
            16: 38, 17: 40, 18: 42, 19: 43, 20: 45, 21: 49, 22: 50, 23: 51, 24: 53, 25: 54}

TOKEN = re.compile(r'"[^"]*"|==|!=|>=|<=|=>|\+=|-=|\*=|/=|//|[A-Za-z_][A-Za-z_0-9]*|\d+(?:\.\d+)?|[()\[\],:.+\-*/%=<>×]')


def tokens(code):
    out = []
    for li, line in enumerate(code.split("\n")):
        if li:
            out.append(NL)
        rest = line
        while rest.startswith(IND):
            out.append(IND)
            rest = rest[len(IND):]
        toks = TOKEN.findall(rest)
        assert "".join(toks) == rest.replace(" ", "") or '"' in rest, (code, toks)
        # マイナスの数（[-6:] など）は1つのブロックにする
        merged = []
        for t in toks:
            if merged and merged[-1] == "-" and t.isdigit() and (len(merged) == 1 or merged[-2] in "([,"):
                merged[-1] = "-" + t
            else:
                merged.append(t)
        out += merged
    return out


KEYWORDS = {"if", "elif", "else", "for", "in", "while", "def", "return", "break", "continue", "and", "or", "import", "not"}
FUNCS = {"print", "len", "str", "int", "float", "sum", "max", "min", "sorted", "range", "append", "pop", "input", "type"}
OPS = {"=", "+", "-", "*", "/", "%", "==", "!=", ">=", "<=", ">", "<", "+=", "-=", "*=", "/=", "=>", "×", "//"}


def block(t, i):
    if t == NL:
        return dict(id=f"nl{i}", text=NL, type="newline", color="bg-pink-200")
    if t == IND:
        return dict(id=f"ind{i}", text=IND, type="indent", color="bg-gray-200")
    if t.startswith('"'):
        typ, col = "string", "bg-green-200"
    elif re.fullmatch(r"-?\d+(\.\d+)?", t):
        typ, col = "number", "bg-yellow-100"
    elif t in KEYWORDS:
        typ, col = "keyword", "bg-blue-200"
    elif t in FUNCS:
        typ, col = "function", "bg-yellow-200"
    elif t in OPS:
        typ, col = "operator", "bg-orange-200"
    elif t in "()[]":
        typ, col = "bracket", "bg-gray-200"
    elif t == ",":
        typ, col = "separator", "bg-purple-200"
    elif t == ":":
        typ, col = "colon", "bg-gray-200"
    elif t == ".":
        typ, col = "separator", "bg-gray-200"
    else:
        typ, col = "variable", "bg-sky-200"
    return dict(id=f"b{i}", text=t, type=typ, color=col)


def build():
    lessons, missions, tutorials = [], {}, []
    k = 0
    # 25ステップのころの仕上げ（NEW_STEP で新しい番号に）と、55ステップで新しく作った仕上げ（FRESH）
    items = [(NEW_STEP[n], STEPS[n], VIDEO.get(n)) for n in STEPS] + [(n, FRESH[n], True) for n in FRESH]
    for new, s, vid in sorted(items, key=lambda x: x[0]):
        lid = f"31-{new}"
        lessons.append(dict(id=lid, unitNumber=31, subNumber=new, title=f"ステップ{new}の仕上げ", description=s["desc"],
                            difficulty="ふつう" if new >= 15 else "かんたん"))
        ms = []
        answers = []
        for j, q in enumerate(s["qs"], 1):
            if q["kind"] == "quiz":
                n_ch = 1 + len(q["wrong"])
                pos = (k * 2 + 1) % n_ch
                k += 1
                choices = list(q["wrong"])
                choices.insert(pos, q["answer"])
                ms.append(dict(id=j, type="quiz", title=q["title"], description=q["desc"], codeToRead=q["code"],
                               choices=choices, correctAnswer=pos, expectedOutput=q["answer"], hint=q["hint"],
                               explanation=q["explanation"], availableBlocks=[]))
                answers.append(q["code"])
            else:
                toks = tokens(q["code"])
                seen, uniq = set(), []
                for t in toks + q["extra"]:
                    if t not in seen:
                        seen.add(t)
                        uniq.append(t)
                m = dict(id=j, title=q["title"], description=q["desc"], expectedOutput=q["expected"],
                         correctCode=q["code"], availableBlocks=[block(t, i) for i, t in enumerate(uniq)])
                if q["prefix"]:
                    m["prefixCode"] = q["prefix"]
                if q["rules"]:
                    m["rules"] = q["rules"]
                if q["explanation"]:
                    m["explanation"] = q["explanation"]
                ms.append(m)
                answers.append(q["code"])
        missions[lid] = ms
        assert all(s["example"].split("  #")[0].strip() not in a for a in answers), (lid, "お手本が答えと同じ")
        what = ("さっきの動画で習ったことを、5問でたしかめます。" if vid else "作品の回で使った書き方を、5問でたしかめます。")
        kinds = ("コードを読んで答えるクイズです。" if s.get("quiz_only")
                 else "結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。")
        tutorials.append(dict(lessonId=lid, characterName="いちか", characterEmoji="🙂", characterImage="/navi/bob_smile.webp",
                              slides=[dict(title="5問で仕上げよう", content=what + kinds,
                                           characterMessage="わからなくなったら、ヒントを見てね。",
                                           codeExample=dict(good=s["example"]))]))
    return lessons, missions, tutorials


def run(code):
    p = subprocess.run([sys.executable, "-X", "utf8", "-c", code], capture_output=True, text=True, encoding="utf-8",
                       timeout=10)
    return p.stdout.strip() if p.returncode == 0 else "__ERROR__ " + p.stderr.strip().splitlines()[-1]


def check():
    bad = 0
    for n, st in [(f"old{k}", STEPS[k]) for k in sorted(STEPS)] + [(k, FRESH[k]) for k in sorted(FRESH)]:
        for j, q in enumerate(st["qs"], 1):
            tag = f"31-{n}#{j}"
            if q["kind"] == "quiz":
                if not q["run"]:
                    continue
                got = run(q["code"])
                want = q["out"] if q["out"] is not None else q["answer"]
                if want == "エラーになる":
                    ok = got.startswith("__ERROR__")
                else:
                    ok = got == want
            else:
                got = run((q["prefix"] + "\n" if q["prefix"] else "") + q["code"])
                ok = got == q["expected"]
            if not ok:
                bad += 1
                print(f"NG {tag}: {got!r}")
    print("check:", "all OK" if not bad else f"{bad} NG")
    return bad


if __name__ == "__main__":
    if "--check" in sys.argv:
        sys.exit(1 if check() else 0)
    lessons, missions, tutorials = build()
    j = lambda o: json.dumps(o, ensure_ascii=False, indent=2)  # noqa: E731
    OUT.write_text(
        "// Python ナビの「仕上げ5問」。31-N はステップ N の仕上げ（55ステップ。番号は build-navi-finish.py の NEW_STEP）。\n"
        "// このファイルは scripts/build-navi-finish.py で作る。直すときはそちらを直して作り直す（手で直さない）。\n"
        "// 答えは scripts/build-navi-finish.py --check と scripts/verify-missions.ts で Python を動かして確かめてある。\n"
        'import type { Lesson, Mission } from "@/types";\n'
        'import type { LessonTutorial } from "@/data/tutorials";\n\n'
        f"export const finishStepLessons: Lesson[] = {j(lessons)};\n\n"
        f"export const finishStepMissions: Record<string, Mission[]> = {j(missions)};\n\n"
        f"export const finishStepTutorials: LessonTutorial[] = {j(tutorials)};\n",
        encoding="utf-8", newline="\n")
    print("wrote", OUT, sum(len(v) for v in missions.values()), "missions")
