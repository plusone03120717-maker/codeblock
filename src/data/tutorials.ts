export interface LessonTutorial {
  lessonId: string;
  characterName: string;
  characterEmoji: string;
  characterImage?: string;
  slides?: Array<{
    title: string;
    content: string;
    characterMessage: string;
    codeExample?: {
      good?: string;
      bad?: string;
    };
    image?: string;
  }>;
}

export const tutorials: LessonTutorial[] = [
  {
    lessonId: "1-1",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "print()関数とは？",
        content: "print()は、画面に文字を表示するための命令だ。",
        characterMessage: "よし、一緒にPythonの基本を学ぼう！俺が全力でサポートする！",
      },
      {
        title: "print()の使い方",
        content: "print()の中に、表示したい文字を \" \" で囲んで入れるんだ。\" \" は「クォーテーション」と読むよ。",
        characterMessage: "まずは \"Hello World\" を表示させてみよう！これがプログラミングの第一歩だ！",
        codeExample: {
          good: "print(\"Hello World\")",
        },
      },
      {
        title: "改行について",
        content: "プログラムは1行ずつ書いていくんだ。print()を2回使うと、2つのメッセージを表示できるよ。改行はスペースキーで行うことができる。codeblockの中では、改行ブロックを使う。",
        characterMessage: "↵マークは「改行」を意味する。次の行に移るときに使うんだ！",
        codeExample: {
          good: "print(\"Hello\")\nprint(\"World\")",
        },
        image: "/images/blocks/newline.png",
      },
      {
        title: "改行を忘れるとエラーになる！",
        content: "print()を続けて書くときは、必ず改行を入れよう。同じ行に2つの命令を書くとエラーになってしまうよ。",
        characterMessage: "↵を使って改行するのを忘れないでね！",
        codeExample: {
          bad: "print(\"Hello\")print(\"World\")",
          good: "print(\"Hello\")\nprint(\"World\")",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "これから実際にコードを組み立ててもらう。",
        characterMessage: "準備はいいか？腕試しの時間だ！",
      },
    ],
  },
  {
    lessonId: "1-2",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "数字を表示しよう",
        content: "print()は文字だけじゃなく、数字も表示できるんだ。",
        characterMessage: "今度は数字を表示する方法を学ぼう！",
      },
      {
        title: "数字はそのまま書く",
        content: "数字を表示するときは、\" \" で囲まなくていいんだ。そのまま数字を書けばOK！",
        characterMessage: "文字は \" \" が必要だけど、数字はいらないんだ！",
        codeExample: {
          good: "print(123)",
        },
      },
      {
        title: "文字と数字の違い",
        content: "\" \" で囲むと「文字」、囲まないと「数字」として扱われるよ。",
        characterMessage: "\"123\" は文字、123 は数字。見た目は同じでも違うんだ！",
        codeExample: {
          good: "print(\"123\")  # 文字として表示\nprint(123)    # 数字として表示",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "数字を表示するミッションに挑戦しよう！",
        characterMessage: "準備はいいか？やってみよう！",
      },
    ],
  },
  {
    lessonId: "1-3",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "四則演算を学ぼう",
        content: "Pythonでは、計算もできるんだ。足し算、引き算、掛け算、割り算をやってみよう！",
        characterMessage: "プログラミングで計算ができるようになるぞ！",
      },
      {
        title: "足し算と引き算",
        content: "+ で足し算、- で引き算ができるよ。",
        characterMessage: "これは算数と同じだね！",
        codeExample: {
          good: "print(5 + 3)  # 結果: 8\nprint(10 - 4) # 結果: 6",
        },
      },
      {
        title: "掛け算と割り算",
        content: "* で掛け算、/ で割り算ができるよ。×や÷ではないから注意！",
        characterMessage: "キーボードにある記号を使うんだ！",
        codeExample: {
          good: "print(4 * 3)  # 結果: 12\nprint(10 / 2) # 結果: 5.0",
        },
      },
      {
        title: "計算の組み合わせ",
        content: "複数の計算を組み合わせることもできるよ。( ) を使って計算の順番を指定できるんだ。",
        characterMessage: "算数で習った計算の順番と同じだ！",
        codeExample: {
          good: "print(2 + 3 * 4)   # 結果: 14\nprint((2 + 3) * 4) # 結果: 20",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "四則演算のミッションに挑戦しよう！",
        characterMessage: "計算、できるかな？やってみよう！",
      },
    ],
  },
  {
    lessonId: "1-4",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "文字列をつなげよう",
        content: "文字列は「+」を使ってつなげることができるよ！",
        characterMessage: "文字列の連結をマスターしよう！",
      },
      {
        title: "文字列連結の書き方",
        content: "「+」の左右に文字列を置くと、2つがくっついて1つの文字列になるんだ。",
        characterMessage: "\"Hello\" + \"World\" で \"HelloWorld\" になるよ！",
        codeExample: {
          good: "print(\"Hello\" + \"World\")",
        },
      },
      {
        title: "スペースを入れたいときは",
        content: "文字列の中にスペースを入れるか、スペースだけの文字列をつなげよう。",
        characterMessage: "\" \" もひとつの文字列だよ！",
        codeExample: {
          good: "print(\"Hello\" + \" \" + \"World\")",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "文字列をつなげるミッションに挑戦しよう！",
        characterMessage: "準備はいいか？やってみよう！",
      },
    ],
  },
  {
    lessonId: "1-5",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "余りを計算しよう",
        content: "「%」を使うと、割り算の余りを求めることができるよ！",
        characterMessage: "余りの計算はプログラミングでよく使うんだ！",
      },
      {
        title: "余りの計算の書き方",
        content: "10 % 3 は「10を3で割った余り」という意味だよ。答えは1になるね。",
        characterMessage: "10 ÷ 3 = 3 余り 1 だから、% の結果は 1 だ！",
        codeExample: {
          good: "print(10 % 3)  # 結果: 1",
        },
      },
      {
        title: "偶数・奇数の判定に使える",
        content: "数字 % 2 が 0 なら偶数、1 なら奇数だよ。",
        characterMessage: "余りが0かどうかで割り切れるかわかるんだ！",
        codeExample: {
          good: "print(8 % 2)   # 結果: 0（偶数）\nprint(7 % 2)   # 結果: 1（奇数）",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "余りの計算ミッションに挑戦しよう！",
        characterMessage: "準備はいいか？やってみよう！",
      },
    ],
  },
  {
    lessonId: "1-6",
    characterName: "コーディ",
    characterEmoji: "🐍",
    characterImage: "/images/characters/cody.png",
    slides: [
      {
        title: "複数の値を表示しよう",
        content: "print()の中に「,」で区切って複数の値を入れると、まとめて表示できるよ！",
        characterMessage: "カンマを使った表示方法を学ぼう！",
      },
      {
        title: "カンマ区切りの書き方",
        content: "print(値1, 値2, 値3) のように書くと、スペースで区切って表示されるんだ。",
        characterMessage: "自動でスペースが入るから便利だよ！",
        codeExample: {
          good: "print(\"Hello\", \"World\")  # 結果: Hello World",
        },
      },
      {
        title: "文字列と数字を一緒に表示",
        content: "カンマを使えば、文字列と数字を一緒に表示できるよ。",
        characterMessage: "「+」だと文字列同士しかつなげられないけど、カンマなら何でもOK！",
        codeExample: {
          good: "print(\"答えは\", 42)  # 結果: 答えは 42",
        },
      },
      {
        title: "さあ、挑戦だ！",
        content: "複数の値を表示するミッションに挑戦しよう！",
        characterMessage: "準備はいいか？やってみよう！",
      },
    ],
  },
  {
    lessonId: "2-1",
    characterName: "リリー",
    characterEmoji: "👩‍🏫",
    characterImage: "/images/characters/lily.png",
    slides: [
      {
        title: "はじめまして！",
        content: "私はリリー。レッスン2からは私が担当するわね。一緒にゆっくり学んでいきましょう。",
        characterMessage: "よろしくね！焦らなくて大丈夫よ。",
      },
      {
        title: "変数ってなに？",
        content: "変数は「データを入れる箱」のようなものよ。箱に名前をつけて、中に文字や数字を入れておけるの。",
        characterMessage: "名前のついた箱をイメージしてね。",
      },
      {
        title: "変数の作り方",
        content: "変数を作るには「名前 = 値」と書くの。「=」は「入れる」という意味よ。",
        characterMessage: "数学の「等しい」とは少し違うの。",
        codeExample: {
          good: "name = \"太郎\"",
        },
      },
      {
        title: "変数名のルール",
        content: "変数名は英語で書くのが基本よ。数字から始めたり、スペースを入れたりはできないの。",
        characterMessage: "わかりやすい名前をつけるのがコツよ。",
        codeExample: {
          good: "age = 10\nmy_name = \"花子\"",
          bad: "1name = \"太郎\"  # 数字から始まるのはダメ",
        },
      },
      {
        title: "さあ、やってみましょう！",
        content: "変数に値を入れるミッションに挑戦してみましょう。",
        characterMessage: "ゆっくりで大丈夫。私が見守っているわ。",
      },
    ],
  },
  {
    lessonId: "2-2",
    characterName: "リリー",
    characterEmoji: "👩‍🏫",
    characterImage: "/images/characters/lily.png",
    slides: [
      {
        title: "変数を表示しよう",
        content: "変数の中身を見るには、print()を使うの。変数名をそのまま入れればいいのよ。",
        characterMessage: "箱の中身を見てみましょう。",
      },
      {
        title: "変数の表示方法",
        content: "print()の中に変数名を書くと、その変数の中身が表示されるわ。",
        characterMessage: "クオーテーションは要らないのがポイントよ。",
        codeExample: {
          good: "name = \"太郎\"\nprint(name)  # 太郎と表示される",
          bad: "print(\"name\")  # nameという文字が表示されちゃう",
        },
      },
      {
        title: "文字列と変数の違い",
        content: "\"name\"と書くと文字列、nameと書くと変数よ。この違いは大切ね。",
        characterMessage: "クオーテーションがあるかないかで意味が変わるの。",
      },
      {
        title: "挑戦してみましょう",
        content: "変数を作って、print()で表示するミッションよ。",
        characterMessage: "落ち着いて取り組んでね。",
      },
    ],
  },
  {
    lessonId: "2-3",
    characterName: "リリー",
    characterEmoji: "👩‍🏫",
    characterImage: "/images/characters/lily.png",
    slides: [
      {
        title: "変数で計算しよう",
        content: "変数には数字も入れられるの。数字を入れた変数は計算に使えるわよ。",
        characterMessage: "変数を使うと計算がもっと便利になるの。",
      },
      {
        title: "数字を変数に入れる",
        content: "数字を入れるときは、クオーテーションなしで書くのよ。",
        characterMessage: "文字列と数字の違いを思い出してね。",
        codeExample: {
          good: "x = 5\ny = 3\nprint(x + y)  # 8と表示される",
        },
      },
      {
        title: "変数を使った計算",
        content: "変数同士を足したり、引いたり、掛けたりできるわ。",
        characterMessage: "変数を使うと、後から値を変えやすいの。",
        codeExample: {
          good: "price = 100\ncount = 3\nprint(price * count)  # 300",
        },
      },
      {
        title: "チャレンジタイム！",
        content: "変数を使った計算ミッションに挑戦してみましょう。",
        characterMessage: "ここまで大丈夫？ゆっくりやってみてね。",
      },
    ],
  },
  {
    lessonId: "2-4",
    characterName: "リリー",
    characterEmoji: "👩‍🏫",
    characterImage: "/images/characters/lily.png",
    slides: [
      {
        title: "変数の中身を変えよう",
        content: "変数は箱だから、中身を入れ替えることができるの。同じ変数名に新しい値を入れるだけよ。",
        characterMessage: "上書きって言ったりするわね。",
      },
      {
        title: "値の上書き",
        content: "同じ変数名にもう一度「=」で値を入れると、前の値は消えて新しい値になるの。",
        characterMessage: "箱の中身を入れ替えるイメージね。",
        codeExample: {
          good: "x = 5\nprint(x)  # 5\nx = 10\nprint(x)  # 10",
        },
      },
      {
        title: "自分自身を使った更新",
        content: "今の値を使って更新することもできるわ。「x = x + 1」は「今のxに1を足す」という意味よ。",
        characterMessage: "これはよく使うテクニックね。",
        codeExample: {
          good: "score = 100\nscore = score + 50\nprint(score)  # 150",
        },
      },
      {
        title: "やってみましょう",
        content: "変数の値を変更するミッションに挑戦よ。",
        characterMessage: "少し難しくなるけど、大丈夫。",
      },
    ],
  },
  {
    lessonId: "2-5",
    characterName: "リリー",
    characterEmoji: "👩‍🏫",
    characterImage: "/images/characters/lily.png",
    slides: [
      {
        title: "変数を組み合わせよう",
        content: "複数の変数を使って、計算したり文字列をつなげたりしてみましょう。",
        characterMessage: "今まで学んだことの総まとめね。",
      },
      {
        title: "複数の変数で計算",
        content: "いくつもの変数を組み合わせて計算できるわ。",
        characterMessage: "変数が増えても基本は同じよ。",
        codeExample: {
          good: "a = 10\nb = 20\nc = 30\nprint(a + b + c)  # 60",
        },
      },
      {
        title: "文字列変数の連結",
        content: "文字列が入った変数同士も「+」でつなげられるの。",
        characterMessage: "レッスン1-4でやった文字列連結と同じね。",
        codeExample: {
          good: "first = \"山田\"\nlast = \"太郎\"\nprint(first + last)  # 山田太郎",
        },
      },
      {
        title: "最後のチャレンジ！",
        content: "複数の変数を使いこなすミッションよ。レッスン2の総仕上げね！",
        characterMessage: "ここまでよく頑張ったわね。",
      },
    ],
  },
  {
    lessonId: "2-6",
    characterName: "リリー",
    characterEmoji: "👩‍🏫",
    characterImage: "/images/characters/lily.png",
    slides: [
      {
        title: "変数クイズに挑戦！",
        content: "ここまでよく頑張ったわね！今度はコードを読んで、何が表示されるか当てるクイズよ。",
        characterMessage: "落ち着いて考えれば大丈夫！",
      },
      {
        title: "クイズの解き方",
        content: "コードを上から順番に読んで、変数の中身がどう変わるか追いかけてみてね。",
        characterMessage: "紙に書きながら考えるのもいい方法よ。",
      },
      {
        title: "例題をやってみよう",
        content: "例えば、このコードだと何が表示されるかな？",
        characterMessage: "x は最初 3、次に 3 + 2 = 5 になるわね。",
        codeExample: {
          good: "x = 3\nx = x + 2\nprint(x)  # 答えは 5",
        },
      },
      {
        title: "さあ、クイズスタート！",
        content: "4つの選択肢から正しい答えを選んでね。間違えても大丈夫、何度でも挑戦できるわ！",
        characterMessage: "自信を持って！きっとできるわ！",
      },
    ],
  },
  // ユニット3: データ型（デックス担当）
  {
    lessonId: "3-1",
    characterName: "デックス",
    characterEmoji: "🤖",
    characterImage: "/images/characters/dex.png",
    slides: [
      {
        title: "はじめまして！",
        content: "私はデックス。データ変換スペシャリストのロボットだ。データ型について教えよう。",
        characterMessage: "どんなデータも、正しい形に変換できる。",
      },
      {
        title: "データ型ってなに？",
        content: "Pythonでは、データにはいろいろな「型」がある。文字、数字、True/Falseなど、それぞれ種類が違うんだ。",
        characterMessage: "型を理解することが、プログラミングの基礎だ。",
      },
      {
        title: "3つの基本の型",
        content: "まずは3つの型を覚えよう。str（文字列）、int（整数）、bool（真偽値）だ。",
        characterMessage: "str は文字、int は数字、bool は True か False。",
        codeExample: {
          good: '"Hello"  → str（文字列）\n42       → int（整数）\nTrue     → bool（真偽値）',
        },
      },
      {
        title: "さあ、始めよう！",
        content: "データ型を正しく理解すれば、エラーを防げる。一緒に学んでいこう。",
        characterMessage: "型を制する者、コードを制す。",
      },
    ],
  },
  {
    lessonId: "3-2",
    characterName: "デックス",
    characterEmoji: "🤖",
    characterImage: "/images/characters/dex.png",
    slides: [
      {
        title: "型を調べよう",
        content: "データの型を調べるには、type() という関数を使う。",
        characterMessage: "まず、このデータが何型か確認しよう。",
      },
      {
        title: "type()の使い方",
        content: "type(データ) と書くと、そのデータの型がわかる。",
        characterMessage: "type() は型を教えてくれる便利な関数だ。",
        codeExample: {
          good: 'type("Hello")  → <class \'str\'>\ntype(42)       → <class \'int\'>\ntype(True)     → <class \'bool\'>',
        },
      },
      {
        title: "printと組み合わせる",
        content: "print(type(データ)) で、型を画面に表示できる。",
        characterMessage: "確認することが、エラー防止の第一歩。",
        codeExample: {
          good: 'print(type("Hello"))\n# 出力: <class \'str\'>',
        },
      },
      {
        title: "さあ、調べてみよう！",
        content: "いろいろなデータの型を調べてみよう。",
        characterMessage: "型を知ることで、コードがもっと理解しやすくなる。",
      },
    ],
  },
  {
    lessonId: "3-3",
    characterName: "デックス",
    characterEmoji: "🤖",
    characterImage: "/images/characters/dex.png",
    slides: [
      {
        title: "型を変換しよう",
        content: "データの型を変えることを「型変換」という。int()やstr()を使えば変換できるんだ。",
        characterMessage: "型変換は、データを扱いやすくするための技術だ。",
      },
      {
        title: "文字列を数値に変換",
        content: "str()で文字列に、int()で整数に変換できる。\"123\"を123に変えることもできるんだ。",
        characterMessage: "文字列の数字を、計算できる数字に変えられる。",
        codeExample: {
          good: 'x = "123"\ny = int(x)\nprint(y + 1)  # 124',
        },
      },
      {
        title: "数値を文字列に変換",
        content: "str()を使えば、数字を文字列に変えられる。計算結果を文字列とつなげるときに便利だ。",
        characterMessage: "数字と文字列は直接つなげられない。str()で変換してからつなげよう。",
        codeExample: {
          good: 'age = 10\nmessage = "私は" + str(age) + "歳です"\nprint(message)  # 私は10歳です',
        },
      },
      {
        title: "型変換をマスターしよう",
        content: "型変換を使いこなせば、いろいろなデータを自由に扱えるようになる。",
        characterMessage: "変換は、データを自由に操る鍵だ。",
      },
    ],
  },
  {
    lessonId: "3-4",
    characterName: "デックス",
    characterEmoji: "🤖",
    characterImage: "/images/characters/dex.png",
    slides: [
      {
        title: "データ型クイズに挑戦！",
        content: "ここまでよく学んだな。今度はコードを読んで、データの型を予測するクイズだ。",
        characterMessage: "型を見極める目を養おう。",
      },
      {
        title: "クイズの解き方",
        content: "コードを見て、各データが何型かを考えよう。type()で確認できることを思い出して。",
        characterMessage: "落ち着いて、一つずつ確認していけば大丈夫だ。",
      },
      {
        title: "例題をやってみよう",
        content: "例えば、このコードの型は何かな？",
        characterMessage: '"Hello" は str、42 は int、True は bool だ。',
        codeExample: {
          good: 'type("Hello")  # <class \'str\'>\ntype(42)       # <class \'int\'>\ntype(True)     # <class \'bool\'>',
        },
      },
      {
        title: "さあ、クイズスタート！",
        content: "4つの選択肢から正しい型を選んでくれ。間違えても大丈夫、何度でも挑戦できる。",
        characterMessage: "型を制する者、コードを制す。自信を持って挑戦しよう。",
      },
    ],
  },
  // ユニット4: 条件分岐（ジャッジ担当）
  {
    lessonId: "4-1",
    characterName: "ジャッジ",
    characterEmoji: "⚖️",
    characterImage: "/images/characters/judge.png",
    slides: [
      {
        title: "条件分岐の法廷へようこそ",
        content: "私はジャッジ。条件分岐の判定者だ。これから君には、TrueとFalseを見極める力を身につけてもらう。準備はいいかな？判定を始めよう。",
        characterMessage: "条件分岐の法廷へようこそ。私が判定を下す。",
      },
      {
        title: "条件分岐とは何か",
        content: "条件によって、処理を分けることを「条件分岐」と呼ぶ。例：信号が青なら渡る、赤なら止まる。プログラムも同じように、条件で行動を変えられる。",
        characterMessage: "条件分岐は、判断の基本だ。",
        codeExample: {
          good: "信号が青 → 渡る\n信号が赤 → 止まる",
        },
      },
      {
        title: "if文の書き方",
        content: "if 条件:\n    処理\n条件がTrueなら、処理が実行される。コロン「:」を忘れないこと。",
        characterMessage: "if文は、条件を判定する構文だ。",
        codeExample: {
          good: "if age >= 10:\n    print(\"10歳以上です\")",
        },
      },
      {
        title: "TrueとFalse",
        content: "条件は必ず True か False のどちらかになる。True = 条件が正しい → 処理を実行。False = 条件が正しくない → 処理をスキップ。曖昧さは許されない。それがプログラムの世界だ。",
        characterMessage: "判定は明確でなければならない。",
        codeExample: {
          good: "age >= 10  → True なら処理実行\nage < 10   → False なら処理スキップ",
        },
      },
      {
        title: "インデント（字下げ）",
        content: "if文の中の処理は、スペース4つ分下げる。これを「インデント」と呼ぶ。インデントがないと、エラーになる。整ったコードは、正しい判定の第一歩だ。",
        characterMessage: "インデントは、コードの構造を示す。",
        codeExample: {
          good: "if age >= 10:\n    print(\"10歳以上です\")  # 4スペース下げる",
          bad: "if age >= 10:\nprint(\"10歳以上です\")  # エラー：インデントなし",
        },
      },
      {
        title: "判定者になろう",
        content: "では、実際にif文を書いてみよう。条件を正しく設定し、判定を下すのだ。さあ、始めよう。",
        characterMessage: "実践で判定力を身につける。",
      },
    ],
  },
  {
    lessonId: "4-2",
    characterName: "ジャッジ",
    characterEmoji: "⚖️",
    characterImage: "/images/characters/judge.png",
    slides: [
      {
        title: "比較演算子とは",
        content: "比較演算子は、2つの値を比べるための記号だ。比べた結果は、必ず True か False になる。これを使って、条件を作ることができる。",
        characterMessage: "比較演算子は、判定の基本である。",
      },
      {
        title: "等しい・等しくない",
        content: "== は「等しいか？」を判定する。!= は「等しくないか？」を判定する。例: 5 == 5 は True、5 != 3 も True。",
        characterMessage: "等しいか、等しくないか。判定は明確だ。",
        codeExample: {
          good: "5 == 5  → True\n5 != 3  → True",
        },
      },
      {
        title: "大小を比べる",
        content: "< は「より小さい」を判定する。> は「より大きい」を判定する。例: 3 < 5 は True、10 > 5 も True。",
        characterMessage: "大小の判定も、明確でなければならない。",
        codeExample: {
          good: "3 < 5   → True\n10 > 5  → True",
        },
      },
      {
        title: "以上・以下",
        content: "<= は「以下（同じか小さい）」を判定する。>= は「以上（同じか大きい）」を判定する。例: 5 <= 5 は True、10 >= 5 も True。",
        characterMessage: "以上・以下は、境界を含む判定だ。",
        codeExample: {
          good: "5 <= 5  → True\n10 >= 5 → True",
        },
      },
      {
        title: "比較演算子を使ってみよう",
        content: "では、比較演算子を使って条件を作ってみよう。正しく比較できれば、判定は成功する。さあ、始めよう。",
        characterMessage: "実践で判定力を身につける。",
      },
    ],
  },
  {
    lessonId: "4-3",
    characterName: "ジャッジ",
    characterEmoji: "⚖️",
    characterImage: "/images/characters/judge.png",
    slides: [
      {
        title: "elseとは",
        content: "if文の条件がFalseの時、何も起きなかった。だが、Falseの時にも処理をしたい場合がある。そんな時に使うのが else だ。",
        characterMessage: "elseは、Falseの時の処理を書く構文である。",
      },
      {
        title: "if-elseの書き方",
        content: "if 条件:\n    Trueの時の処理\nelse:\n    Falseの時の処理\nelseの後にもコロン「:」を忘れないこと。",
        characterMessage: "if-elseは、2つの結果を分岐させる構文だ。",
        codeExample: {
          good: "if age >= 18:\n    print(\"大人\")\nelse:\n    print(\"子ども\")",
        },
      },
      {
        title: "具体例を見てみよう",
        content: "点数が60以上なら「合格」、そうでなければ「不合格」。HPが0より大きければ「生存」、そうでなければ「ゲームオーバー」。このように、2つの結果を分岐させることができる。",
        characterMessage: "2つの結果を明確に分岐させる。",
        codeExample: {
          good: "if score >= 60:\n    print(\"合格\")\nelse:\n    print(\"不合格\")",
        },
      },
      {
        title: "必ずどちらかが実行される",
        content: "if-elseでは、必ずどちらか一方が実行される。条件がTrueならifブロック、Falseならelseブロック。両方実行されることも、両方スキップされることもない。",
        characterMessage: "判定は明確でなければならない。",
        codeExample: {
          good: "if True → ifブロック実行\nif False → elseブロック実行",
        },
      },
      {
        title: "if-elseを使ってみよう",
        content: "では、if-elseを使って2つの結果を分岐させよう。TrueとFalse、両方の判定を下すのだ。さあ、始めよう。",
        characterMessage: "実践で判定力を身につける。",
      },
    ],
  },
  {
    lessonId: "4-4",
    characterName: "ジャッジ",
    characterEmoji: "⚖️",
    characterImage: "/images/characters/judge.png",
    slides: [
      {
        title: "elifとは",
        content: "if-elseでは、条件が2つしか分岐できなかった。だが、3つ以上に分岐したい場合もある。そんな時に使うのが elif だ。",
        characterMessage: "elifは、複数の条件を判定する構文である。",
      },
      {
        title: "if-elif-elseの書き方",
        content: "if 条件1:\n    条件1がTrueの時の処理\nelif 条件2:\n    条件2がTrueの時の処理\nelse:\n    どれもFalseの時の処理\nelifは「else if」の略だ。",
        characterMessage: "if-elif-elseは、3つ以上の結果を分岐させる構文だ。",
        codeExample: {
          good: "if score >= 80:\n    print(\"A\")\nelif score >= 60:\n    print(\"B\")\nelse:\n    print(\"C\")",
        },
      },
      {
        title: "具体例を見てみよう",
        content: "点数が80以上なら「A」。点数が60以上なら「B」。それ以外なら「C」。このように、3つ以上の結果に分岐できる。",
        characterMessage: "複数の条件で判定を下す。",
        codeExample: {
          good: "if score >= 80:\n    print(\"A\")\nelif score >= 60:\n    print(\"B\")\nelse:\n    print(\"C\")",
        },
      },
      {
        title: "上から順に判定される",
        content: "条件は上から順にチェックされる。最初にTrueになった条件だけが実行される。一度実行されたら、残りの条件はスキップされる。この順番が重要だ。覚えておこう。",
        characterMessage: "判定は順番が重要である。",
        codeExample: {
          good: "上から順にチェック → 最初のTrueで実行 → 残りはスキップ",
        },
      },
      {
        title: "if-elif-elseを使ってみよう",
        content: "では、複数の条件で分岐させてみよう。上から順に判定を下すのだ。さあ、始めよう。",
        characterMessage: "実践で判定力を身につける。",
      },
    ],
  },
  {
    lessonId: "4-5",
    characterName: "ジャッジ",
    characterEmoji: "⚖️",
    characterImage: "/images/characters/judge.png",
    slides: [
      {
        title: "論理演算子とは",
        content: "複数の条件を組み合わせたい時がある。例えば「HPが50以上 かつ MPが30以上」のような条件だ。そんな時に使うのが論理演算子だ。",
        characterMessage: "論理演算子は条件を組み合わせるための道具である。",
      },
      {
        title: "and（かつ）",
        content: "and は「両方の条件がTrue」の時だけTrueになる。例: hp >= 50 and mp >= 30。HPもMPも条件を満たさないと、Trueにならない。",
        characterMessage: "and は厳格だ。両方とも満たさなければならない。",
        codeExample: {
          good: "if hp >= 50 and mp >= 30:\n    print(\"戦える\")",
        },
      },
      {
        title: "or（または）",
        content: "or は「どちらかの条件がTrue」ならTrueになる。例: hp > 0 or mp > 0。どちらか一方でも条件を満たせば、Trueになる。",
        characterMessage: "or は柔軟だ。どちらか一つでも満たせばよい。",
        codeExample: {
          good: "if hp > 0 or mp > 0:\n    print(\"まだ動ける\")",
        },
      },
      {
        title: "not（〜でない）",
        content: "not は条件の結果を反転させる。True は False に、False は True になる。例: not isGameOver は「ゲームオーバーでない」という意味だ。",
        characterMessage: "not は反転の力を持つ。TrueとFalseを逆転させる。",
        codeExample: {
          good: "if not isGameOver:\n    print(\"続行\")",
        },
      },
      {
        title: "論理演算子を使ってみよう",
        content: "では、and, or, not を使って複雑な条件を作ってみよう。複数の条件を組み合わせて判定を下すのだ。",
        characterMessage: "さあ、始めよう。論理演算子の力を見せてもらおう。",
      },
    ],
  },
  {
    lessonId: "4-6",
    characterName: "ジャッジ",
    characterEmoji: "⚖️",
    characterImage: "/images/characters/judge.png",
    slides: [
      {
        title: "総復習の時間だ",
        content: "ここまでif、elif、else、論理演算子を学んできた。条件分岐の基本は身についたはずだ。最後に、総復習のクイズに挑戦しよう。",
        characterMessage: "総復習の時間だ。これまでの知識を試す。",
      },
      {
        title: "クイズ形式",
        content: "コードを読んで、何が出力されるか予測する。選択肢の中から正しい答えを選ぶのだ。条件をよく読み、判定を下そう。",
        characterMessage: "コードを読んで判定を下す。冷静に。",
      },
      {
        title: "全問正解を目指そう",
        content: "では、最終テストを始めよう。落ち着いて、一つずつ判定するのだ。",
        characterMessage: "健闘を祈る。全問正解を目指せ。",
      },
    ],
  },
  {
    lessonId: "5-1",
    characterName: "ルーピー",
    characterEmoji: "🐹",
    characterImage: "/images/characters/loopy.png",
    slides: [
      {
        title: "やっほー！ルーピーだよ！",
        content: "僕はルーピー！繰り返しが大好きなハムスターだよ！回し車をぐるぐる回すみたいに、プログラムも繰り返せるんだ！一緒にループの世界を冒険しよう！",
        characterMessage: "やっほー！僕はルーピー！繰り返しが大好きなハムスターだよ！一緒にループを学ぼう！",
      },
      {
        title: "繰り返しって何？",
        content: "同じことを何回もやりたい時、どうする？「print(\"Hello\")」を5回書く？ 大変だよね！ループを使えば、1回書くだけで何回でも繰り返せるんだ！",
        characterMessage: "繰り返しって便利だよ！1回書くだけで、何回でも実行できるんだ！",
        codeExample: {
          good: "# ループなし（大変！）\nprint(\"Hello\")\nprint(\"Hello\")\nprint(\"Hello\")\nprint(\"Hello\")\nprint(\"Hello\")\n\n# ループあり（簡単！）\nfor i in range(5):\n    print(\"Hello\")",
        },
      },
      {
        title: "for文の書き方",
        content: "for i in range(3):\n    print(\"Hello\")\nこれで「Hello」が3回出力されるよ！range(3)は「3回繰り返してね」という意味だよ！",
        characterMessage: "for文は簡単だよ！for i in range(3): で3回繰り返せるんだ！",
        codeExample: {
          good: "for i in range(3):\n    print(\"Hello\")\n# 結果: Hello\n#      Hello\n#      Hello",
        },
      },
      {
        title: "インデントを忘れずに！",
        content: "for文の中の処理は、スペース4つ分下げるよ。これを「インデント」って言うんだ。if文と同じだね！覚えてる？",
        characterMessage: "インデントを忘れないで！4スペース下げるんだよ！",
        codeExample: {
          good: "for i in range(3):\n    print(\"Hello\")  # 4スペース下げる",
          bad: "for i in range(3):\nprint(\"Hello\")  # エラー：インデントなし",
        },
      },
      {
        title: "ぐるぐる回そう！",
        content: "さあ、for文を使って繰り返しに挑戦だ！最初は3回から、だんだん増やしていくよ！準備はいい？ いっくよー！",
        characterMessage: "ぐるぐる回そう！for文で繰り返しをマスターするよ！もう一回！",
      },
    ],
  },
  {
    lessonId: "5-2",
    characterName: "ルーピー",
    characterEmoji: "🐹",
    characterImage: "/images/characters/loopy.png",
    slides: [
      {
        title: "range()のヒミツ",
        content: "range(3)で3回、range(5)で5回繰り返せたよね！そう、カッコの中の数字が繰り返す回数なんだ！この数字を変えれば、何回でも繰り返せるよ！",
        characterMessage: "range(3)で3回、range(5)で5回繰り返せたよね！カッコの中の数字が繰り返す回数なんだ！",
      },
      {
        title: "いろんな回数",
        content: "range(1) → 1回だけ\nrange(10) → 10回\nrange(100) → 100回だって楽勝！回し車と同じで、何周でも回れるんだ！",
        characterMessage: "range(1)で1回、range(10)で10回、range(100)で100回だって楽勝だよ！回し車と同じで、何周でも回れるんだ！",
        codeExample: {
          good: "for i in range(1):\n    print(\"スタート\")\n# 1回だけ\n\nfor i in range(10):\n    print(\"やったー\")\n# 10回繰り返す",
        },
      },
      {
        title: "0回ってある？",
        content: "じゃあ range(0) は？実は0回、つまり何も実行されないんだ！ちょっと寂しいけど、そういう時もあるよね",
        characterMessage: "range(0)は0回、つまり何も実行されないんだ！ちょっと寂しいけど、そういう時もあるよね！",
        codeExample: {
          good: "for i in range(0):\n    print(\"Hello\")\n# 何も出力されない（0回）",
        },
      },
      {
        title: "回数ぴったりに挑戦！",
        content: "さあ、いろんな回数で繰り返してみよう！1回から10回まで、ぴったり合わせてね！準備はいい？ いっくよー！",
        characterMessage: "さあ、いろんな回数で繰り返してみよう！1回から10回まで、ぴったり合わせてね！準備はいい？ いっくよー！もう一回！",
      },
    ],
  },
  {
    lessonId: "5-3",
    characterName: "ルーピー",
    characterEmoji: "🐹",
    characterImage: "/images/characters/loopy.png",
    slides: [
      {
        title: "iのヒミツを教えるよ！",
        content: "今まで何気なく書いていた「i」には、実は特別な役割があります。ループが今何周目かを覚えてくれる変数なんです！",
        characterMessage: "ねえねえ、for i in range(3): の『i』って何だと思う？ 実はすごい秘密があるんだ！",
      },
      {
        title: "iは0からスタート！",
        content: "プログラミングでは、数を数えるとき0から始めるのがルールです。最初の1周目は i = 0、2周目は i = 1 になります。",
        characterMessage: "「え、1からじゃないの？」って思うよね。でもプログラムの世界では0から数えるんだ！",
        codeExample: {
          good: "for i in range(3):\n    print(i)\n# 結果: 0\n#     1\n#     2",
        },
      },
      {
        title: "iは毎回1ずつ増える！",
        content: "ループが1回実行されるごとに、iの値は自動的に1増えます。回し車の周回カウンターみたいに、何周目かを教えてくれます。",
        characterMessage: "ループが1回終わるたびに、iは1増えるよ！ 0 → 1 → 2 → 3 ってね！",
        codeExample: {
          good: "for i in range(3):\n    print(i)\n# 1周目: i = 0\n# 2周目: i = 1\n# 3周目: i = 2",
        },
      },
      {
        title: "range(5)だとiはどうなる？",
        content: "range(5) では、iは 0, 1, 2, 3, 4 の5つの値を取ります。「0から始めて、指定した数の手前で止まる」と覚えましょう！",
        characterMessage: "range(5) だと、i は 0, 1, 2, 3, 4 って変わるよ。5にはならないのがポイント！",
        codeExample: {
          good: "for i in range(5):\n    print(i)\n# 結果: 0\n#     1\n#     2\n#     3\n#     4\n# 5にはならない！",
        },
      },
      {
        title: "iを出力してみよう！",
        content: "print(i) と書くと、ループの中でiの値を出力できます。何が出てくるか予想しながらやってみましょう！",
        characterMessage: "print(i) で今のiの値を出力できるよ！ 準備はいい？ いっくよー！",
      },
    ],
  },
  {
    lessonId: "5-4",
    characterName: "ルーピー",
    characterEmoji: "🐹",
    characterImage: "/images/characters/loopy.png",
    slides: [
      {
        title: "ループで計算できるよ！",
        content: "ループを使うと、繰り返しながら計算することができます。例えば、0から4までの合計を求めたりできます！",
        characterMessage: "ループって繰り返すだけじゃないんだ！ 計算もできるんだよ！",
      },
      {
        title: "合計を求めてみよう！",
        content: "変数totalを用意して、ループの中で total = total + i と書くと、iの値が毎回totalに足されていきます。",
        characterMessage: "total = total + i って書くと、iの値をどんどん足していけるんだ！",
        codeExample: {
          good: "total = 0\nfor i in range(3):\n    total = total + i\nprint(total)",
        },
      },
      {
        title: "どうやって計算されるの？",
        content: "total=0から始めて、i=0のとき total=0+0=0、i=1のとき total=0+1=1、i=2のとき total=1+2=3 となります。",
        characterMessage: "range(3)だと、total は 0 → 1 → 3 って変わるよ！ 0+0=0、0+1=1、1+2=3 だね！",
        codeExample: {
          good: "total = 0\nfor i in range(3):\n    total = total + i\n    # i=0: total = 0+0 = 0\n    # i=1: total = 0+1 = 1\n    # i=2: total = 1+2 = 3\nprint(total)  # 結果: 3",
        },
      },
      {
        title: "計算結果を出力しよう！",
        content: "print(total)はループの外（インデントなし）に書きます。ループが全部終わった後の合計値が出力されます。",
        characterMessage: "ループの外で print(total) すると、最終結果が出るよ！",
        codeExample: {
          good: "total = 0\nfor i in range(3):\n    total = total + i\nprint(total)  # ループの外",
          bad: "total = 0\nfor i in range(3):\n    total = total + i\n    print(total)  # ループの中（間違い）",
        },
      },
      {
        title: "計算に挑戦！",
        content: "変数totalを使って、iの合計を求めてみましょう。ループの外でprint(total)するのを忘れずに！",
        characterMessage: "さあ、ループで計算してみよう！ 準備はいい？ いっくよー！",
      },
    ],
  },
  {
    lessonId: "5-5",
    characterName: "ルーピー",
    characterEmoji: "🐹",
    characterImage: "/images/characters/loopy.png",
    slides: [
      {
        title: "while文って何？",
        content: "while文は、条件がTrueである限り繰り返し続けます。「〜の間、繰り返す」という意味です。",
        characterMessage: "for文は回数を決めて繰り返したよね。while文は条件がTrueの間ずっと繰り返すんだ！",
      },
      {
        title: "for文とどう違うの？",
        content: "for文は繰り返す回数が決まっているとき、while文は条件を満たす間繰り返したいときに使います。",
        characterMessage: "for文は『3回繰り返す』、while文は『HPが0になるまで繰り返す』って感じ！",
        codeExample: {
          good: "# for文：回数が決まっている\nfor i in range(3):\n    print(i)\n\n# while文：条件がTrueの間繰り返す\ncount = 3\nwhile count > 0:\n    print(count)\n    count = count - 1",
        },
      },
      {
        title: "while文の書き方",
        content: "while 条件: と書き、その下にインデントして繰り返す処理を書きます。条件がFalseになると、ループが終わります。",
        characterMessage: "while 条件: って書くよ！ if文と似てるでしょ？",
        codeExample: {
          good: "count = 3\nwhile count > 0:\n    print(count)\n    count = count - 1\n# 条件がFalseになったら終了",
        },
      },
      {
        title: "無限ループに注意！",
        content: "ループの中で条件が変わるようにしないと、無限ループになります。変数を変化させることを忘れずに！",
        characterMessage: "あわわ！ 条件がずっとTrueだと、永遠に止まらなくなっちゃう！",
        codeExample: {
          good: "count = 3\nwhile count > 0:\n    print(count)\n    count = count - 1  # 変数を変化させる！",
          bad: "count = 3\nwhile count > 0:\n    print(count)\n    # countを変化させない → 無限ループ！",
        },
      },
      {
        title: "while文に挑戦！",
        content: "while文を使って、条件を満たす間繰り返してみましょう。変数の値を変えるのを忘れずに！",
        characterMessage: "条件がFalseになるまで繰り返すよ！ 準備はいい？ いっくよー！",
      },
    ],
  },
  {
    lessonId: "5-6",
    characterName: "ルーピー",
    characterEmoji: "🐹",
    characterImage: "/images/characters/loopy.png",
    slides: [
      {
        title: "ループの総復習だよ！",
        content: "ここまで学んだループの知識を総復習します。コードを読んで、何が出力されるか予測しましょう！",
        characterMessage: "for文、range()、変数i、while文...たくさん学んだね！ 最後にクイズで確認しよう！",
      },
      {
        title: "クイズ形式だよ！",
        content: "選択肢の中から正しい答えを選びます。ループが何回実行されるか、変数がどう変わるかに注目しましょう！",
        characterMessage: "コードをよく読んで、答えを選んでね！ 落ち着いて考えれば大丈夫！",
      },
      {
        title: "全問正解を目指そう！",
        content: "全10問のクイズに挑戦します。これが終わればループマスター！頑張りましょう！",
        characterMessage: "準備はいい？ ループマスターへの最終テストだよ！ いっくよー！",
      },
    ],
  },
  {
    lessonId: "6-1",
    characterName: "アリー",
    characterEmoji: "🐜",
    slides: [
      {
        title: "はじめまして！アリーだよ！",
        content: "アリーは働きアリ。仲間と協力して、たくさんのデータを順番に並べて管理するエキスパートです。",
        characterMessage: "こんにちは！私はアリー。データを整列させるのが得意なの！",
      },
      {
        title: "リストって何？",
        content: "リストを使うと、複数のデータをひとまとめにして管理できます。名前のリスト、数字のリストなど、いろんなデータを並べられます。",
        characterMessage: "リストは、データを順番に並べたものだよ。私たちアリが列を作るみたいにね！",
      },
      {
        title: "リストの書き方",
        content: "Pythonでは、角カッコ [ ] の中にデータを入れてリストを作ります。例：[\"りんご\", \"バナナ\", \"みかん\"]",
        characterMessage: "リストは [ ] で囲んで、データを , で区切るよ！",
        codeExample: {
          good: '["りんご", "バナナ", "みかん"]',
        },
      },
      {
        title: "リストを変数に入れよう",
        content: "リストを変数に入れると、後から使いやすくなります。変数名は中身が分かりやすい名前にしましょう。",
        characterMessage: "リストも変数に入れられるよ。fruits = [\"りんご\", \"バナナ\"] こんな感じ！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ"]',
        },
      },
      {
        title: "さあ、整列しよう！",
        content: "リストを作って、printで出力してみましょう。チームワークで頑張ろうね！",
        characterMessage: "さあ、みんな整列〜！ 一緒にリストを作ってみよう！",
      },
    ],
  },
  {
    lessonId: "6-2",
    characterName: "アリー",
    characterEmoji: "🐜",
    slides: [
      {
        title: "インデックスって何？",
        content: "インデックスは、リストの中の位置を表す番号です。これを使うと、リストの特定の要素を取り出せます。",
        characterMessage: "列に並んだら、自分が何番目か知りたいよね？ それがインデックス！",
      },
      {
        title: "インデックスは0から！",
        content: "プログラミングでは、最初の要素は0番目です。[\"A\", \"B\", \"C\"] なら、Aは0番、Bは1番、Cは2番になります。",
        characterMessage: "ここ大事！ インデックスは0から始まるの。先頭は0番だよ！",
        codeExample: {
          good: '["A", "B", "C"]\n# Aは0番、Bは1番、Cは2番',
        },
      },
      {
        title: "要素を取り出そう",
        content: "例えば fruits = [\"りんご\", \"バナナ\", \"みかん\"] の場合、fruits[0] は \"りんご\"、fruits[1] は \"バナナ\" になります。",
        characterMessage: "リスト名[番号] で、その番号の要素を取り出せるよ！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ", "みかん"]\nprint(fruits[0])  # りんご\nprint(fruits[1])  # バナナ',
        },
      },
      {
        title: "やってみよう",
        content: "リスト名の後ろに [インデックス] をつけると、その位置の要素だけを取り出せます。printと組み合わせて出力してみましょう。",
        characterMessage: "fruits[0] で先頭のりんごが取れるよ。fruits[2] なら3番目のみかんだね！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ", "みかん"]\nprint(fruits[0])  # りんご\nprint(fruits[2])  # みかん',
        },
      },
      {
        title: "位置を指定して取り出そう！",
        content: "prefixCodeで用意されたリストから、指定された要素をインデックスで取り出しましょう。",
        characterMessage: "さあ、インデックスを使って要素を取り出してみよう！ 0から数えるのを忘れないでね！",
      },
    ],
  },
  {
    lessonId: "6-3",
    characterName: "アリー",
    characterEmoji: "🐜",
    slides: [
      {
        title: "appendって何？",
        content: "appendは「追加する」という意味です。リストの最後に新しい要素を追加できます。",
        characterMessage: "新しい仲間をチームに加えたい時、appendを使うよ！",
      },
      {
        title: "appendの書き方",
        content: "リスト名の後ろにドット(.)をつけて、append(追加したい値)と書きます。例：fruits.append(\"ぶどう\")",
        characterMessage: "リスト名.append(追加したいもの) って書くよ！ ドットを忘れないでね！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ"]\nfruits.append("ぶどう")',
        },
      },
      {
        title: "どうなるの？",
        content: "fruits = [\"りんご\", \"バナナ\"] に fruits.append(\"みかん\") すると、[\"りんご\", \"バナナ\", \"みかん\"] になります。",
        characterMessage: "appendすると、列の最後に並んでくれるの。『最後尾にお並びください〜！』ってね！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ"]\nfruits.append("みかん")\n# 結果: ["りんご", "バナナ", "みかん"]',
        },
      },
      {
        title: "追加したら確認しよう",
        content: "appendは追加するだけで何も返しません。追加後にprint(リスト名)で中身を確認しましょう。",
        characterMessage: "appendした後にprintすると、ちゃんと追加されたか確認できるよ！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ"]\nfruits.append("みかん")\nprint(fruits)  # 確認',
        },
      },
      {
        title: "仲間を増やそう！",
        content: "appendを使って、リストに要素を追加してみましょう。追加後はprintで確認してね。",
        characterMessage: "さあ、リストに新しい仲間を追加してみよう！ チームワークで頑張ろうね！",
      },
    ],
  },
  {
    lessonId: "6-4",
    characterName: "アリー",
    characterEmoji: "🐜",
    slides: [
      {
        title: "lenって何？",
        content: "lenは「length（長さ）」の略で、リストに入っている要素の数を教えてくれます。",
        characterMessage: "列に何匹並んでるか数えたい時、lenを使うよ！",
      },
      {
        title: "lenの書き方",
        content: "len()のカッコの中にリスト名を入れると、要素の数が返ってきます。例：len(fruits) は fruits の要素数を返します。",
        characterMessage: "len(リスト名) って書くと、中に何個入ってるか分かるよ！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ", "みかん"]\nprint(len(fruits))  # 3',
        },
      },
      {
        title: "やってみよう",
        content: "リストに3つの要素があれば3、5つあれば5が返ってきます。空のリスト [] なら0です。",
        characterMessage: "fruits = [\"りんご\", \"バナナ\", \"みかん\"] なら、len(fruits) は 3 になるよ！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ", "みかん"]\nprint(len(fruits))  # 3\n\nempty = []\nprint(len(empty))  # 0',
        },
      },
      {
        title: "結果を出力しよう",
        content: "lenの結果をprintで出力すると、リストに何個の要素があるか確認できます。",
        characterMessage: "print(len(リスト名)) で、要素数を出力できるよ！",
        codeExample: {
          good: 'numbers = [1, 2, 3, 4, 5]\nprint(len(numbers))  # 5',
        },
      },
      {
        title: "仲間を数えよう！",
        content: "lenを使って、リストの要素数を調べてみましょう。",
        characterMessage: "さあ、リストの仲間が何匹いるか数えてみよう！",
      },
    ],
  },
  {
    lessonId: "6-5",
    characterName: "アリー",
    characterEmoji: "🐜",
    slides: [
      {
        title: "リストとループは最強コンビ！",
        content: "for文を使うと、リストの要素を一つずつ順番に取り出して処理できます。これがプログラミングでとても便利な技です。",
        characterMessage: "ルーピーと私が一緒になると、すごいことができるんだよ！",
      },
      {
        title: "for文でリストを回そう",
        content: "for fruit in fruits: と書くと、fruitsリストから一つずつfruitに入れて処理できます。rangeの代わりにリストを使うイメージです。",
        characterMessage: "for 変数 in リスト: って書くと、リストの中身を一つずつ取り出せるよ！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ", "みかん"]\nfor fruit in fruits:\n    print(fruit)',
        },
      },
      {
        title: "どう動くの？",
        content: "fruits = [\"りんご\", \"バナナ\"] なら、1回目はfruit=\"りんご\"、2回目はfruit=\"バナナ\"になります。",
        characterMessage: "リストの先頭から順番に、一匹ずつ呼び出すの。『次の方どうぞ〜！』ってね！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ"]\nfor fruit in fruits:\n    print(fruit)\n# 1回目: fruit = "りんご"\n# 2回目: fruit = "バナナ"',
        },
      },
      {
        title: "全員に同じ処理",
        content: "for文の中にprint(fruit)を書くと、リストの要素が一つずつ出力されます。全員に同じ処理ができて便利です。",
        characterMessage: "ループの中でprintすると、リストの全員を出力できるよ！",
        codeExample: {
          good: 'fruits = ["りんご", "バナナ", "みかん"]\nfor fruit in fruits:\n    print(fruit)\n# りんご\n# バナナ\n# みかん',
        },
      },
      {
        title: "全員集合！",
        content: "for文を使って、リストの要素を一つずつ出力してみましょう。",
        characterMessage: "さあ、リストの仲間全員を呼び出してみよう！ チームワークの見せ所だよ！",
      },
    ],
  },
  {
    lessonId: "6-6",
    characterName: "アリー",
    characterEmoji: "🐜",
    slides: [
      {
        title: "リストの総復習だよ！",
        content: "ここまで学んだリストの知識を総復習します。コードを読んで、何が出力されるか予測しましょう！",
        characterMessage: "リストの作り方、インデックス、append、len、ループ...たくさん学んだね！",
      },
      {
        title: "クイズ形式だよ！",
        content: "選択肢の中から正しい答えを選びます。インデックスは0から始まることを忘れないでね！",
        characterMessage: "コードをよく読んで、答えを選んでね！ 落ち着いて考えれば大丈夫！",
      },
      {
        title: "全問正解を目指そう！",
        content: "全10問のクイズに挑戦します。これが終わればリストマスター！",
        characterMessage: "準備はいい？ リストマスターへの最終テストだよ！ チームワークで頑張ろう！",
      },
    ],
  },
  {
    lessonId: "7-1",
    characterName: "ニコ",
    characterEmoji: "🐱",
    slides: [
      {
        title: "ニコのキッチンへようこそ！",
        content: "ニコはシェフのネコ。関数という「レシピ」を使って、プログラミングの料理を作る達人です。",
        characterMessage: "いらっしゃい！僕はニコ、プログラミング料理のシェフさ！",
      },
      {
        title: "関数って何？",
        content: "関数は、処理をまとめたものです。同じ処理を何度も書かなくても、関数を呼び出すだけで実行できます。",
        characterMessage: "関数はね、『レシピ』みたいなものなんだ。一度作れば、何度でも使えるよ！",
      },
      {
        title: "defでレシピを作ろう",
        content: "defは「define（定義する）」の略です。def say_hello(): のように書いて、その下にインデントして処理を書きます。",
        characterMessage: "def 関数名(): って書くと、新しいレシピが作れるよ！",
        codeExample: {
          good: "def say_hello():\n    print(\"こんにちは\")",
        },
      },
      {
        title: "レシピの中身を書こう",
        content: "関数の中に書いた処理は、関数を呼び出すまで実行されません。defで作って、後から呼び出して使います。",
        characterMessage: "関数の中にprint()を書くと、呼び出した時に実行されるんだ！",
        codeExample: {
          good: "def say_hello():\n    print(\"こんにちは\")\n\n# 関数を呼び出す\nsay_hello()  # こんにちは",
        },
      },
      {
        title: "レシピを作ってみよう！",
        content: "defを使って関数を作る練習をしましょう。まずは簡単なprintから始めます。",
        characterMessage: "さあ、自分だけのレシピ（関数）を作ってみよう！ 材料を揃えて、調理開始だ！",
      },
    ],
  },
  {
    lessonId: "7-2",
    characterName: "ニコ",
    characterEmoji: "🐱",
    slides: [
      {
        title: "レシピを実行しよう！",
        content: "関数は定義しただけでは動きません。関数名()と書いて呼び出すと、中の処理が実行されます。",
        characterMessage: "レシピを作っただけじゃ、料理はできないよね？ 呼び出して実行しよう！",
      },
      {
        title: "関数名()で呼び出し",
        content: "say_hello() のように、関数名の後ろにカッコをつけると呼び出せます。レストランで「これください！」と注文するイメージです。",
        characterMessage: "関数名の後ろに () をつけるだけ！ これが『注文』だよ！",
        codeExample: {
          good: "say_hello()",
        },
      },
      {
        title: "定義してから呼び出す",
        content: "関数は必ず定義してから呼び出します。定義より前に呼び出すとエラーになります。",
        characterMessage: "まずdefでレシピを作って、その後で呼び出す。この順番が大事だよ！",
        codeExample: {
          good: "def say_hello():\n    print(\"こんにちは\")\n\nsay_hello()",
          bad: "say_hello()  # エラー：定義より前に呼び出している",
        },
      },
      {
        title: "実際にやってみよう",
        content: "関数を呼び出すと、関数の中に書いた処理が上から順に実行されます。",
        characterMessage: "def say_hello(): で作って、say_hello() で呼び出す。これでprintが実行されるんだ！",
        codeExample: {
          good: "def say_hello():\n    print(\"こんにちは\")\n\nsay_hello()\n# 結果: こんにちは",
        },
      },
      {
        title: "注文してみよう！",
        content: "関数を定義して、呼び出して、出力を確認しましょう。",
        characterMessage: "さあ、作ったレシピに注文を出してみよう！ 関数名()で呼び出しだ！",
      },
    ],
  },
  {
    lessonId: "7-3",
    characterName: "ニコ",
    characterEmoji: "🐱",
    slides: [
      {
        title: "レシピは何度でも使える！",
        content: "関数は一度定義すれば、何度でも呼び出せます。同じ処理を繰り返し書く必要がなくなります。",
        characterMessage: "一度作ったレシピは、何度でも使えるんだ。これが関数の便利なところさ！",
      },
      {
        title: "同じ関数を何度も呼び出す",
        content: "関数名()を複数回書くと、その回数だけ関数が実行されます。コードがスッキリして読みやすくなります。",
        characterMessage: "say_hello() を3回書けば、3回挨拶できるよ！",
        codeExample: {
          good: "say_hello()\nsay_hello()\nsay_hello()",
        },
      },
      {
        title: "コードの再利用",
        content: "長い処理も関数にまとめておけば、呼び出すだけで実行できます。これを「コードの再利用」と言います。",
        characterMessage: "毎回print()を書くより、関数を呼び出す方が楽でしょ？",
        codeExample: {
          good: "def greet():\n    print(\"こんにちは\")\n    print(\"よろしく\")\n\ngreet()\ngreet()",
        },
      },
      {
        title: "やってみよう",
        content: "同じ関数を複数行に分けて呼び出すと、順番に実行されます。",
        characterMessage: "greet()を2回呼び出すと、2回挨拶できる。簡単でしょ？",
        codeExample: {
          good: "def greet():\n    print(\"こんにちは\")\n\ngreet()\ngreet()\n# 結果: こんにちは\n#     こんにちは",
        },
      },
      {
        title: "何度も注文しよう！",
        content: "関数を複数回呼び出して、同じ処理を繰り返してみましょう。",
        characterMessage: "さあ、同じレシピを何度も注文してみよう！ 繰り返しの力を感じてね！",
      },
    ],
  },
  {
    lessonId: "7-4",
    characterName: "ニコ",
    characterEmoji: "🐱",
    slides: [
      {
        title: "引数って何？",
        content: "引数（ひきすう）は、関数に渡すデータのことです。同じ関数でも、引数を変えると違う結果が得られます。",
        characterMessage: "料理には材料が必要でしょ？ 関数に渡す材料のことを『引数』っていうんだ！",
      },
      {
        title: "引数の書き方",
        content: "関数名の後ろのカッコの中に変数名を書きます。これがパラメータ（材料リスト）になります。",
        characterMessage: "def greet(name): って書くと、nameという材料を受け取れるよ！",
        codeExample: {
          good: "def greet(name):\n    print(name)",
        },
      },
      {
        title: "引数を使って出力",
        content: "パラメータで受け取った値は、関数の中で変数として使えます。printで出力したり、計算に使ったりできます。",
        characterMessage: "受け取った材料は、関数の中で自由に使えるよ！ print(name)で出力できる！",
        codeExample: {
          good: "def greet(name):\n    print(name)",
        },
      },
      {
        title: "呼び出す時に材料を渡す",
        content: "関数を呼び出す時にカッコの中に値を入れると、その値がパラメータに渡されます。",
        characterMessage: "greet(\"太郎\") って呼び出すと、nameに\"太郎\"が入るんだ！",
        codeExample: {
          good: 'def greet(name):\n    print(name)\n\ngreet("太郎")\n# 結果: 太郎',
        },
      },
      {
        title: "材料を渡してみよう！",
        content: "引数を使った関数を呼び出して、いろいろな値を渡してみましょう。",
        characterMessage: "さあ、関数に材料（引数）を渡してみよう！ 同じレシピでも材料で味が変わるよ！",
      },
    ],
  },
  {
    lessonId: "7-6",
    characterName: "ニコ",
    characterEmoji: "🐱",
    slides: [
      {
        title: "関数の総復習だよ！",
        content: "ここまで学んだ関数の知識を総復習します。コードを読んで、何が出力されるか予測しましょう！",
        characterMessage: "def、呼び出し、引数...たくさん学んだね！ 最後にクイズで確認しよう！",
      },
      {
        title: "クイズ形式だよ！",
        content: "選択肢の中から正しい答えを選びます。関数の定義と呼び出しに注目しましょう！",
        characterMessage: "コードをよく読んで、答えを選んでね！ レシピ通りに考えれば大丈夫さ！",
      },
      {
        title: "全問正解を目指そう！",
        content: "全10問のクイズに挑戦します。これが終われば関数の基本はマスター！",
        characterMessage: "準備はいい？ 関数マスターへの最終テストだよ！ 材料を揃えて、いざ挑戦！",
      },
    ],
  },
  {
    lessonId: "8-1",
    characterName: "リコ",
    characterEmoji: "🐭",
    slides: [
      {
        title: "リコのテイスティングルームへようこそ",
        content: "リコはソムリエのネズミ。ニコが作った料理（関数）の結果を受け取って、評価するエキスパートです。",
        characterMessage: "私はリコ。関数から返ってくる『結果』を見極めるのが得意なの",
      },
      {
        title: "戻り値って何？",
        content: "関数はreturn文を使って値を返すことができます。この返ってくる値のことを「戻り値」と言います。",
        characterMessage: "シェフが料理を差し出す瞬間、それが『return』。受け取った料理が『戻り値』よ",
      },
      {
        title: "returnの書き方",
        content: "return文は関数の中で使います。return \"カレー\" と書くと、\"カレー\"という値が返されます。",
        characterMessage: "return 値 と書くと、その値が関数の呼び出し元に返されるわ",
        codeExample: {
          good: 'def get_dish():\n    return "カレー"',
        },
      },
      {
        title: "printとの違い",
        content: "printは画面に表示するだけで、値は消えてしまいます。returnは値を呼び出し元に渡すので、後から使えます。",
        characterMessage: "printは『見せる』だけ。returnは『渡す』の。この違い、とても大事よ",
        codeExample: {
          good: '# print: 表示するだけ\nprint("カレー")\n\n# return: 値を返す\nresult = get_dish()\nprint(result)',
        },
      },
      {
        title: "結果を返してみましょう",
        content: "returnを使って値を返す関数を作ってみましょう。",
        characterMessage: "さて、関数から結果を返す練習をしましょう。私が受け取って評価するわ",
      },
    ],
  },
  {
    lessonId: "8-2",
    characterName: "リコ",
    characterEmoji: "🐭",
    slides: [
      {
        title: "結果を受け取りましょう",
        content: "関数がreturnで値を返しても、それを受け取らないと使えません。変数で受け取って保存しましょう。",
        characterMessage: "シェフが料理を出しても、誰も受け取らなければ意味がないでしょう？",
      },
      {
        title: "変数で受け取る",
        content: "関数の呼び出しを変数に代入すると、戻り値がその変数に入ります。後から何度でも使えます。",
        characterMessage: "result = 関数名() と書くと、戻り値をresultに保存できるわ",
        codeExample: {
          good: 'def get_number():\n    return 100\n\nresult = get_number()\nprint(result)',
        },
      },
      {
        title: "受け取った値を使う",
        content: "result = get_number() で受け取った後、print(result)で表示したり、result + 10のように計算に使えます。",
        characterMessage: "変数に入れたら、printで表示したり、計算に使ったりできるわ",
        codeExample: {
          good: 'result = get_number()\nprint(result)  # 100\nprint(result + 10)  # 110',
        },
      },
      {
        title: "受け取らないと消える",
        content: "戻り値を変数に入れないと、その値は使えなくなります。必要な値は必ず変数で受け取りましょう。",
        characterMessage: "get_number()だけ書いて受け取らないと、戻り値は消えてしまうの。もったいないわ",
        codeExample: {
          bad: "get_number()  # 戻り値が消える",
          good: "result = get_number()  # 変数に保存される",
        },
      },
      {
        title: "料理を受け取りましょう",
        content: "戻り値を変数に入れて、printで出力してみましょう。",
        characterMessage: "さて、関数から返ってくる結果を変数で受け取る練習よ。私が見届けるわ",
      },
    ],
  },
];

export function getTutorial(lessonId: string): LessonTutorial | undefined {
  return tutorials.find((t) => t.lessonId === lessonId);
}
