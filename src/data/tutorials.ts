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
];

export function getTutorial(lessonId: string): LessonTutorial | undefined {
  return tutorials.find((t) => t.lessonId === lessonId);
}
