// Python ナビの「仕上げ5問」。31-N はステップ N の仕上げ（55ステップ。番号は build-navi-finish.py の NEW_STEP）。
// このファイルは scripts/build-navi-finish.py で作る。直すときはそちらを直して作り直す（手で直さない）。
// 答えは scripts/build-navi-finish.py --check と scripts/verify-missions.ts で Python を動かして確かめてある。
import type { Lesson, Mission } from "@/types";
import type { LessonTutorial } from "@/data/tutorials";

export const finishStepLessons: Lesson[] = [
  {
    "id": "31-2",
    "unitNumber": 31,
    "subNumber": 2,
    "title": "ステップ2の仕上げ",
    "description": "ひき算・かけ算・わり算と、計算のじゅんばん・かっこ",
    "difficulty": "かんたん"
  },
  {
    "id": "31-3",
    "unitNumber": 31,
    "subNumber": 3,
    "title": "ステップ3の仕上げ",
    "description": "わり算の / と //、あまりの %",
    "difficulty": "かんたん"
  },
  {
    "id": "31-4",
    "unitNumber": 31,
    "subNumber": 4,
    "title": "ステップ4の仕上げ",
    "description": "変数（箱）に数を入れて、表示や計算に使おう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-5",
    "unitNumber": 31,
    "subNumber": 5,
    "title": "ステップ5の仕上げ",
    "description": "箱をいくつも使って、台形などの面積を計算しよう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-6",
    "unitNumber": 31,
    "subNumber": 6,
    "title": "ステップ6の仕上げ",
    "description": "＋ で文字をつなぎ、＊ で文字をくりかえそう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-7",
    "unitNumber": 31,
    "subNumber": 7,
    "title": "ステップ7の仕上げ",
    "description": "input で質問して、入れた答えを使おう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-8",
    "unitNumber": 31,
    "subNumber": 8,
    "title": "ステップ8の仕上げ",
    "description": "input で数を聞いて、float で計算できる数にしよう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-9",
    "unitNumber": 31,
    "subNumber": 9,
    "title": "ステップ9の仕上げ",
    "description": "データの型（str・int・float・bool）を知って、かえたり調べたりしよう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-10",
    "unitNumber": 31,
    "subNumber": 10,
    "title": "ステップ10の仕上げ",
    "description": "+=・-=・*=・/= で、箱の中身を短い書き方でかえよう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-11",
    "unitNumber": 31,
    "subNumber": 11,
    "title": "ステップ11の仕上げ",
    "description": "input・int・計算・カンマで、自分の計算アプリを作ろう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-12",
    "unitNumber": 31,
    "subNumber": 12,
    "title": "ステップ12の仕上げ",
    "description": "今あるアプリに、かざり・買い足し・ポイントを足してアレンジしよう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-14",
    "unitNumber": 31,
    "subNumber": 14,
    "title": "ステップ14の仕上げ",
    "description": "len で文字数、[ ] で文字の一部を取り出そう",
    "difficulty": "かんたん"
  },
  {
    "id": "31-16",
    "unitNumber": 31,
    "subNumber": 16,
    "title": "ステップ16の仕上げ",
    "description": "if と else で、文字数によって出し方を変えよう",
    "difficulty": "ふつう"
  },
  {
    "id": "31-18",
    "unitNumber": 31,
    "subNumber": 18,
    "title": "ステップ18の仕上げ",
    "description": ">=・> のちがいと、elif で条件をふやそう",
    "difficulty": "ふつう"
  },
  {
    "id": "31-23",
    "unitNumber": 31,
    "subNumber": 23,
    "title": "ステップ23の仕上げ",
    "description": "リストと番号、random でおみくじ",
    "difficulty": "ふつう"
  },
  {
    "id": "31-25",
    "unitNumber": 31,
    "subNumber": 25,
    "title": "ステップ25の仕上げ",
    "description": "sum・max・sorted と .append( )",
    "difficulty": "ふつう"
  },
  {
    "id": "31-28",
    "unitNumber": 31,
    "subNumber": 28,
    "title": "ステップ28の仕上げ",
    "description": "str・int で型をそろえて、足し算アプリ",
    "difficulty": "ふつう"
  },
  {
    "id": "31-33",
    "unitNumber": 31,
    "subNumber": 33,
    "title": "ステップ33の仕上げ",
    "description": "for と range でくりかえそう",
    "difficulty": "ふつう"
  },
  {
    "id": "31-35",
    "unitNumber": 31,
    "subNumber": 35,
    "title": "ステップ35の仕上げ",
    "description": "for の中に for・for の中に if",
    "difficulty": "ふつう"
  },
  {
    "id": "31-37",
    "unitNumber": 31,
    "subNumber": 37,
    "title": "ステップ37の仕上げ",
    "description": "break・continue・while",
    "difficulty": "ふつう"
  },
  {
    "id": "31-38",
    "unitNumber": 31,
    "subNumber": 38,
    "title": "ステップ38の仕上げ",
    "description": "and・or と if で、じゃんけんの判定",
    "difficulty": "ふつう"
  },
  {
    "id": "31-40",
    "unitNumber": 31,
    "subNumber": 40,
    "title": "ステップ40の仕上げ",
    "description": "def で関数を作って、呼び出そう",
    "difficulty": "ふつう"
  },
  {
    "id": "31-42",
    "unitNumber": 31,
    "subNumber": 42,
    "title": "ステップ42の仕上げ",
    "description": "引数と return（戻り値）",
    "difficulty": "ふつう"
  },
  {
    "id": "31-43",
    "unitNumber": 31,
    "subNumber": 43,
    "title": "ステップ43の仕上げ",
    "description": "引数を2つにした関数",
    "difficulty": "ふつう"
  },
  {
    "id": "31-45",
    "unitNumber": 31,
    "subNumber": 45,
    "title": "ステップ45の仕上げ",
    "description": "じゃんけんの判定を judge( ) 関数に",
    "difficulty": "ふつう"
  },
  {
    "id": "31-49",
    "unitNumber": 31,
    "subNumber": 49,
    "title": "ステップ49の仕上げ",
    "description": "tkinter で、窓・ラベル・ボタンのアプリ",
    "difficulty": "ふつう"
  },
  {
    "id": "31-50",
    "unitNumber": 31,
    "subNumber": 50,
    "title": "ステップ50の仕上げ",
    "description": "ボタンでくじを引く、おみくじアプリ",
    "difficulty": "ふつう"
  },
  {
    "id": "31-51",
    "unitNumber": 31,
    "subNumber": 51,
    "title": "ステップ51の仕上げ",
    "description": "ファイルをえらんで、画像を窓に出すアプリ",
    "difficulty": "ふつう"
  },
  {
    "id": "31-53",
    "unitNumber": 31,
    "subNumber": 53,
    "title": "ステップ53の仕上げ",
    "description": "convert と resize で、白黒とモザイク",
    "difficulty": "ふつう"
  },
  {
    "id": "31-54",
    "unitNumber": 31,
    "subNumber": 54,
    "title": "ステップ54の仕上げ",
    "description": "ボタンで切りかえる、画像加工アプリ",
    "difficulty": "ふつう"
  }
];

export const finishStepMissions: Record<string, Mission[]> = {
  "31-2": [
    {
      "id": 1,
      "type": "quiz",
      "title": "どっちが先？",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(9 - 4 * 2)",
      "choices": [
        "10",
        "1",
        "9 - 4 * 2"
      ],
      "correctAnswer": 1,
      "expectedOutput": "1",
      "hint": "かけ算と、ひき算。どちらが先に計算されるかな？",
      "explanation": "かけ算が先。4 * 2 = 8 を先に計算して、9 - 8 = 1 だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "わり算の答え",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(8 / 4)",
      "choices": [
        "2.0",
        "2",
        "8 / 4"
      ],
      "correctAnswer": 0,
      "expectedOutput": "2.0",
      "hint": "パイソンのわり算の答えには、何がつくかな？",
      "explanation": "わり算の答えには .0 がつく。8 / 4 は 2.0 だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら「SyntaxError: invalid character '×'」と出た。どう直す？",
      "codeToRead": "print(3 × 5)",
      "choices": [
        "3 と 5 を \" \" でかこむ",
        "かっこをもう1つ足す",
        "× を * にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "× を * にする",
      "hint": "× は、パイソンでつかえるかな？",
      "explanation": "パイソンのかけ算は * （アスタリスク）。× はつかえないので SyntaxError になるよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "おつりを出そう",
      "description": "100円で 30円の あめを買った。おつりを計算して表示しよう！",
      "expectedOutput": "70",
      "correctCode": "print(100 - 30)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "100",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b3",
          "text": "-",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "30",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "-"
          ],
          "message": "おつりは、ひき算（-）で出すよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "かっこで先に",
      "description": "4 + 6 を先に計算してから、3 をかけよう！",
      "expectedOutput": "30",
      "correctCode": "print((4 + 6) * 3)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "4",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b3",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "6",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b7",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b8",
          "text": "×",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "forbids": [
            "×"
          ],
          "message": "かけ算は × ではなく、* で書くよ！"
        },
        {
          "requires": [
            "(4 + 6)"
          ],
          "message": "先にしたい 4 + 6 を、かっこでかこもう！"
        }
      ]
    }
  ],
  "31-3": [
    {
      "id": 1,
      "type": "quiz",
      "title": "あまりは？",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(17 % 5)",
      "choices": [
        "3",
        "2",
        "3.4"
      ],
      "correctAnswer": 1,
      "expectedOutput": "2",
      "hint": "% は、わり算の何を出すかな？",
      "explanation": "17 ÷ 5 = 3 あまり 2。% は、あまりの 2 を出すよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "// の答え",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(9 // 2)",
      "choices": [
        "4",
        "4.5",
        "1"
      ],
      "correctAnswer": 0,
      "expectedOutput": "4",
      "hint": "スラッシュ2つは、小数のところをどうするかな？",
      "explanation": "9 / 2 は 4.5。// は小数のところを切りすてて 4 になるよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら「ZeroDivisionError: division by zero」と出た。どう直す？",
      "codeToRead": "print(10 / 0)",
      "choices": [
        "/ を // にする",
        "かっこをもう1つ足す",
        "0 ではない数でわる"
      ],
      "correctAnswer": 2,
      "expectedOutput": "0 ではない数でわる",
      "hint": "0 で、わり算はできるかな？",
      "explanation": "算数と同じで、0 ではわれない。// にしても ZeroDivisionError になるよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "あまりを出そう",
      "description": "23 を 4 でわった、あまりを表示しよう！",
      "expectedOutput": "3",
      "correctCode": "print(23 % 4)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "23",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b3",
          "text": "%",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "4",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "//",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "%"
          ],
          "message": "あまりは % で出すよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "何こ買える？",
      "description": "1こ 30円のガム。200円で何こ買えるかな？ 整数の答えを表示しよう！",
      "expectedOutput": "6",
      "correctCode": "print(200 // 30)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "200",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b3",
          "text": "//",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "30",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "/",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "//"
          ],
          "message": "整数の答えは // で出すよ！"
        }
      ]
    }
  ],
  "31-4": [
    {
      "id": 1,
      "type": "quiz",
      "title": "箱の中身は？",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "hako = 7\nprint(hako)",
      "choices": [
        "hako",
        "7",
        "エラーになる"
      ],
      "correctAnswer": 1,
      "expectedOutput": "7",
      "hint": "print の中の hako には、\" \" がついていないね。",
      "explanation": "hako は箱の名前。print(hako) で、中身の 7 が出るよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "\" \" をつけると？",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "tate = 5\nprint(\"tate\")",
      "choices": [
        "tate",
        "5",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "tate",
      "hint": "print の中の tate は、\" \" でかこんであるね。",
      "explanation": "\" \" でかこむと、ただの文字 tate が出る。箱の中身を出すなら print(tate) だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら「NameError: name 'haba' is not defined」と出た。どう直す？",
      "codeToRead": "print(haba)",
      "choices": [
        "haba を \" \" でかこむ",
        "print を Print にする",
        "print の前に haba = 4 のように、箱を作る"
      ],
      "correctAnswer": 2,
      "expectedOutput": "print の前に haba = 4 のように、箱を作る",
      "hint": "NameError は「その名前が、まだ作られていないよ」という意味。",
      "explanation": "haba という箱をまだ作っていないので NameError。先に haba = 4 のように作ろう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "箱を作って表示",
      "description": "変数 kazu に 12 を入れて、kazu の中身を表示しよう！",
      "expectedOutput": "12",
      "correctCode": "kazu = 12\nprint(kazu)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "kazu",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b1",
          "text": "=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b2",
          "text": "12",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "nl3",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "b4",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b5",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "\"kazu\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "rules": [
        {
          "forbids": [
            "\"kazu\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "たて × よこ",
      "description": "tate と yoko の箱を使って、長方形の面積を表示しよう！",
      "expectedOutput": "48",
      "correctCode": "print(tate * yoko)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "tate",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "yoko",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "×",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b7",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "tate = 6\nyoko = 8",
      "rules": [
        {
          "forbids": [
            "×"
          ],
          "message": "かけ算は × ではなく、* で書くよ！"
        },
        {
          "requires": [
            "tate",
            "yoko"
          ],
          "message": "数ではなく、箱の名前で計算しよう！"
        }
      ]
    }
  ],
  "31-5": [
    {
      "id": 1,
      "type": "quiz",
      "title": "台形の面積",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "ue = 3\nshita = 5\ntakasa = 4\nprint((ue + shita) * takasa / 2)",
      "choices": [
        "16",
        "16.0",
        "32.0"
      ],
      "correctAnswer": 1,
      "expectedOutput": "16.0",
      "hint": "わり算 / が入っていると、答えに何がつくかな？",
      "explanation": "(3 + 5) × 4 ÷ 2 = 16。わり算なので 16.0 と出るよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "箱に入れた答え",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "tate = 3\nyoko = 4\nmenseki = tate * yoko\nprint(menseki)",
      "choices": [
        "12",
        "menseki",
        "tate * yoko"
      ],
      "correctAnswer": 0,
      "expectedOutput": "12",
      "hint": "menseki の箱には、何が入っているかな？",
      "explanation": "menseki には tate * yoko の答え 12 が入る。print(menseki) で 12 が出るよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら「NameError: name 'menseki' is not defined」と出た。どう直す？",
      "codeToRead": "print(menseki)\nmenseki = 6 * 4",
      "choices": [
        "menseki を \" \" でかこむ",
        "* を × にする",
        "menseki = 6 * 4 の行を、print より上に書く"
      ],
      "correctAnswer": 2,
      "expectedOutput": "menseki = 6 * 4 の行を、print より上に書く",
      "hint": "パイソンは、上の行から順番に動くよ。",
      "explanation": "1行目では menseki をまだ作っていないので NameError。箱を作る行を、先に書こう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "台形の面積",
      "description": "ue・shita・takasa の箱を使って、台形の面積を表示しよう！",
      "expectedOutput": "21.0",
      "correctCode": "print((ue + shita) * takasa / 2)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "ue",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "shita",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b7",
          "text": "takasa",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b8",
          "text": "/",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b9",
          "text": "2",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b10",
          "text": "×",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b11",
          "text": "÷",
          "type": "variable",
          "color": "bg-sky-200"
        }
      ],
      "prefixCode": "ue = 3\nshita = 4\ntakasa = 6",
      "rules": [
        {
          "forbids": [
            "×",
            "÷"
          ],
          "message": "かけ算は *、わり算は / で書くよ！"
        },
        {
          "requires": [
            "(ue + shita)"
          ],
          "message": "上の辺と下の辺を、かっこで先にたそう！"
        }
      ]
    },
    {
      "id": 5,
      "title": "答えを箱に入れる",
      "description": "三角形の面積を menseki に入れて、menseki を表示しよう！",
      "expectedOutput": "12.0",
      "correctCode": "menseki = teihen * takasa / 2\nprint(menseki)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "menseki",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b1",
          "text": "=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b2",
          "text": "teihen",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "takasa",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b5",
          "text": "/",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "2",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "nl7",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "b8",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b9",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b11",
          "text": "\"menseki\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "prefixCode": "teihen = 6\ntakasa = 4",
      "rules": [
        {
          "forbids": [
            "\"menseki\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        }
      ]
    }
  ],
  "31-6": [
    {
      "id": 1,
      "type": "quiz",
      "title": "つなぐと？",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(\"たこ\" + \"やき\")",
      "choices": [
        "たこ やき",
        "たこやき",
        "エラーになる"
      ],
      "correctAnswer": 1,
      "expectedOutput": "たこやき",
      "hint": "＋ は、文字と文字をどうするかな？",
      "explanation": "＋ で文字と文字をつなぐと、あいだにスペースは入らない。たこやき と出るよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "くりかえすと？",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(\"ニャー\" * 2)",
      "choices": [
        "ニャーニャー",
        "ニャー2",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "ニャーニャー",
      "hint": "＊ 2 は、何回くりかえすかな？",
      "explanation": "文字 * 2 で、2回くりかえす。ニャーニャー と出るよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら「TypeError: can only concatenate str (not \"int\") to str」と出た。どう直す？",
      "codeToRead": "print(\"レベル\" + 5)",
      "choices": [
        "+ を * にする",
        "レベル の \" \" をとる",
        "5 を \"5\" のように \" \" でかこむ"
      ],
      "correctAnswer": 2,
      "expectedOutput": "5 を \"5\" のように \" \" でかこむ",
      "hint": "文字と数は、＋ でつなげるかな？",
      "explanation": "文字と数は ＋ でつなげないので TypeError。数も \" \" でかこんで \"5\" にすれば、レベル5 と出るよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "名前とつなぐ",
      "description": "namae の箱を使って「ゆうきさん、こんにちは」と表示しよう！",
      "expectedOutput": "ゆうきさん、こんにちは",
      "correctCode": "print(namae + \"さん、こんにちは\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "namae",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "\"さん、こんにちは\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "\"namae\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "prefixCode": "namae = \"ゆうき\"",
      "rules": [
        {
          "forbids": [
            "\"namae\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "線をひく",
      "description": "「=」を 15回 くりかえして、線を表示しよう！",
      "expectedOutput": "===============",
      "correctCode": "print(\"=\" * 15)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "\"=\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "15",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "*"
          ],
          "message": "くりかえすときは ＊ を使うよ！"
        }
      ]
    }
  ],
  "31-7": [
    {
      "id": 1,
      "type": "quiz",
      "title": "入れた答えは？",
      "description": "このコードを実行して「はると」と入れると、何が出る？",
      "codeToRead": "namae = input(\"なまえは？\")\nprint(namae + \"さん\")",
      "choices": [
        "namaeさん",
        "はるとさん",
        "なまえは？さん"
      ],
      "correctAnswer": 1,
      "expectedOutput": "はるとさん",
      "hint": "namae の箱には、何が入るかな？",
      "explanation": "「はると」と入れると、namae の箱に はると が入る。namae + \"さん\" で はるとさん と出るよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "\" \" をつけると？",
      "description": "このコードを実行して「あお」と入れると、何が出る？",
      "codeToRead": "iro = input(\"すきないろは？\")\nprint(\"iro\")",
      "choices": [
        "iro",
        "あお",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "iro",
      "hint": "print の中の iro は、\" \" でかこんであるね。",
      "explanation": "\" \" でかこむと、ただの文字 iro が出る。入れた答えを出すなら print(iro) だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "「いちか」と入れたら「NameError: name 'namae' is not defined」と出た。どう直す？",
      "codeToRead": "input(\"なまえは？\")\nprint(namae + \"さん\")",
      "choices": [
        "namae を \"namae\" にする",
        "input を print にする",
        "1行目を namae = input(\"なまえは？\") にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "1行目を namae = input(\"なまえは？\") にする",
      "hint": "入れた答えを、箱に入れているかな？",
      "explanation": "input の答えを箱に入れていないので、namae がなくて NameError。namae = input(…) で箱に入れよう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "答えを使って出す",
      "description": "namae には、input で入れた「はると」が入っているよ。「はるとさん、ようこそ」と表示しよう！",
      "expectedOutput": "はるとさん、ようこそ",
      "correctCode": "print(namae + \"さん、ようこそ\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "namae",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "\"さん、ようこそ\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "\"namae\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "prefixCode": "namae = \"はると\"",
      "rules": [
        {
          "forbids": [
            "\"namae\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "2つの答えをつなぐ",
      "description": "namae と doubutsu には、input で入れた答えが入っているよ。「ゆうとはイヌがすき」と表示しよう！",
      "expectedOutput": "ゆうとはイヌがすき",
      "correctCode": "print(namae + \"は\" + doubutsu + \"がすき\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "namae",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "\"は\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b5",
          "text": "doubutsu",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b6",
          "text": "\"がすき\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b7",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": "\"doubutsu\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "prefixCode": "namae = \"ゆうと\"\ndoubutsu = \"イヌ\"",
      "rules": [
        {
          "forbids": [
            "\"doubutsu\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        }
      ]
    }
  ],
  "31-8": [
    {
      "id": 1,
      "type": "quiz",
      "title": "入れた数で計算",
      "description": "このコードを実行して「3」と入れると、何が出る？",
      "codeToRead": "kazu = float(input(\"数は？\"))\nprint(kazu * 2)",
      "choices": [
        "6",
        "6.0",
        "33"
      ],
      "correctAnswer": 1,
      "expectedOutput": "6.0",
      "hint": "float で数になった 3 を、2ばいすると…？",
      "explanation": "float で 3 が数の 3.0 になる。3.0 * 2 で 6.0。float の数には .0 がつくよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "float がないと？",
      "description": "このコードを実行して「2」と「3」を入れると、何が出る？",
      "codeToRead": "a = input(\"数は？\")\nb = input(\"数は？\")\nprint(a + b)",
      "choices": [
        "23",
        "5",
        "5.0"
      ],
      "correctAnswer": 0,
      "expectedOutput": "23",
      "hint": "input の答えは、数に見えても文字だったね。",
      "explanation": "文字の 2 と 3 を + でつなぐので 23。足し算にするなら、float でかこんで数にしよう。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "「4」と入れたら「TypeError」と出た。どう直す？",
      "codeToRead": "nagasa = input(\"長さは？\")\nprint(nagasa * 3 / 2)",
      "choices": [
        "nagasa を \"nagasa\" にする",
        "3 を \"3\" にする",
        "1行目を nagasa = float(input(\"長さは？\")) にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "1行目を nagasa = float(input(\"長さは？\")) にする",
      "hint": "input の答えは、まだ文字のままだよ。",
      "explanation": "文字のままでは計算できないので TypeError。float(input(…)) で数にしてから計算しよう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "カンマでならべて出す",
      "description": "menseki には 45.0 が入っているよ。「面積は 45.0 です」と表示しよう！",
      "expectedOutput": "面積は 45.0 です",
      "correctCode": "print(\"面積は\", menseki, \"です\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "\"面積は\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b4",
          "text": "menseki",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b5",
          "text": "\"です\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "\"menseki\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "prefixCode": "menseki = 45.0",
      "rules": [
        {
          "forbids": [
            "\"menseki\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "長方形の面積",
      "description": "tate と yoko には、float で数にした 4.0 と 6.0 が入っているよ。「面積は 24.0」と表示しよう！",
      "expectedOutput": "面積は 24.0",
      "correctCode": "print(\"面積は\", tate * yoko)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "\"面積は\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b4",
          "text": "tate",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b5",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "yoko",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b7",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": "tate + yoko",
          "type": "variable",
          "color": "bg-sky-200"
        }
      ],
      "prefixCode": "tate = 4.0\nyoko = 6.0",
      "rules": [
        {
          "forbids": [
            "tate + yoko"
          ],
          "message": "長方形の面積は、たて × よこ（*）だよ！"
        }
      ]
    }
  ],
  "31-9": [
    {
      "id": 1,
      "type": "quiz",
      "title": "型を調べる",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(type(10))",
      "choices": [
        "<class 'str'>",
        "<class 'int'>",
        "<class 'float'>"
      ],
      "correctAnswer": 1,
      "expectedOutput": "<class 'int'>",
      "hint": "10 は、点のない数だね。",
      "explanation": "10 は整数なので int。4.5 のように点があると float、\" \" でかこむと str だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "input の答えの型",
      "description": "このコードを実行して「7」と入れると、何が出る？",
      "codeToRead": "kotae = input(\"数は？\")\nprint(type(kotae))",
      "choices": [
        "<class 'str'>",
        "<class 'int'>",
        "7"
      ],
      "correctAnswer": 0,
      "expectedOutput": "<class 'str'>",
      "hint": "input の答えは、数に見えても…？",
      "explanation": "input の答えはいつも文字（str）。数にするなら int( ) か float( ) でかこもう。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "「TypeError」と出た。どう直す？",
      "codeToRead": "nensei = 3\nprint(\"ぼくは\" + nensei + \"年生\")",
      "choices": [
        "nensei を \"nensei\" にする",
        "3 を 3.0 にする",
        "2行目の nensei を str(nensei) にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "2行目の nensei を str(nensei) にする",
      "hint": "文字と数は、+ でつなげないね。",
      "explanation": "数の 3 を str( ) で文字にすると、+ でつなげる。\" \" でかこむと、ただの文字 nensei になってしまうよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "くりかえして出す",
      "description": "「ワンワンワン」と表示しよう！",
      "expectedOutput": "ワンワンワン",
      "correctCode": "print(\"ワン\" * 3)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "\"ワン\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b4",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "forbids": [
            "+"
          ],
          "message": "文字 × 数（*）で、くりかえしてみよう！"
        }
      ]
    },
    {
      "id": 5,
      "title": "数を文字にしてつなぐ",
      "description": "toshi には 10 が入っているよ。「10さいです」と表示しよう！",
      "expectedOutput": "10さいです",
      "correctCode": "print(str(toshi) + \"さいです\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "str",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b3",
          "text": "toshi",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "\"さいです\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b7",
          "text": "\"toshi\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "prefixCode": "toshi = 10",
      "rules": [
        {
          "forbids": [
            "\"toshi\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        },
        {
          "requires": [
            "str("
          ],
          "message": "数と文字を + でつなぐときは、str( ) で文字にしよう！"
        }
      ]
    }
  ],
  "31-10": [
    {
      "id": 1,
      "type": "quiz",
      "title": "+= の意味",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "point = 5\npoint += 3\nprint(point)",
      "choices": [
        "3",
        "8",
        "53"
      ],
      "correctAnswer": 1,
      "expectedOutput": "8",
      "hint": "point の中身の 5 に、3 をたすと…？",
      "explanation": "point += 3 は point = point + 3 と同じ。5 + 3 で 8 だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "じゅんばんに計算",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "okane = 100\nokane -= 40\nokane *= 2\nprint(okane)",
      "choices": [
        "120",
        "60",
        "160"
      ],
      "correctAnswer": 0,
      "expectedOutput": "120",
      "hint": "上から じゅんばんに。100 から 40 をひいて、そのあと 2ばい。",
      "explanation": "100 − 40 = 60、60 × 2 = 120。上の行から じゅんばんに計算するよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "「NameError: name 'point' is not defined」と出た。どう直す？",
      "codeToRead": "point += 10\nprint(point)",
      "choices": [
        "point += 10 を point = 10 + にする",
        "print(point) を print(\"point\") にする",
        "1行目の前に point = 0 を書く"
      ],
      "correctAnswer": 2,
      "expectedOutput": "1行目の前に point = 0 を書く",
      "hint": "たす前に、point の箱はあるかな？",
      "explanation": "+= は「今の中身」にたすので、先に point = 0 のように箱を作っておこう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "+= で うしろにつなぐ",
      "description": "namae には「はると」が入っているよ。+= で「くん」をつけて、「はるとくん」と表示しよう！",
      "expectedOutput": "はるとくん",
      "correctCode": "namae += \"くん\"\nprint(namae)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "namae",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b1",
          "text": "+=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b2",
          "text": "\"くん\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "nl3",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "b4",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b5",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "-=",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "namae = \"はると\"",
      "rules": [
        {
          "forbids": [
            "-="
          ],
          "message": "文字をうしろにつなぐのは += だよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "/= で分ける",
      "description": "ame には 12 が入っているよ。/= で 3人に分けて、「4.0」と表示しよう！",
      "expectedOutput": "4.0",
      "correctCode": "ame /= 3\nprint(ame)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "ame",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b1",
          "text": "/=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b2",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "nl3",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "b4",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b5",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "*=",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "ame = 12",
      "rules": [
        {
          "forbids": [
            "*="
          ],
          "message": "分けるのは わり算の /= だよ！"
        }
      ]
    }
  ],
  "31-11": [
    {
      "id": 1,
      "type": "quiz",
      "title": "ごうけいの計算",
      "description": "このコードを実行して「50」と「4」を入れると、何が出る？",
      "codeToRead": "nedan = int(input(\"1こいくら？\"))\nkosu = int(input(\"いくつ買う？\"))\nprint(nedan * kosu)",
      "choices": [
        "504",
        "200",
        "54"
      ],
      "correctAnswer": 1,
      "expectedOutput": "200",
      "hint": "int で数にしてから、かけ算するよ。",
      "explanation": "50 と 4 は int で数になるので、50 × 4 で 200。int がないと文字のままになるよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "おつり",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "goukei = 360\nprint(\"おつりは\", 1000 - goukei, \"円\")",
      "choices": [
        "おつりは 640 円",
        "おつりは 1360 円",
        "おつりは1000-goukei円"
      ],
      "correctAnswer": 0,
      "expectedOutput": "おつりは 640 円",
      "hint": "1000 から goukei の 360 をひくと…？",
      "explanation": "1000 − 360 で 640。カンマでならべると、間に空白が入って「おつりは 640 円」。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "「3」と入れたら「TypeError」と出た。どう直す？",
      "codeToRead": "kosu = input(\"いくつ？\")\nprint(kosu + 1)",
      "choices": [
        "kosu + 1 を kosu + \"1\" にする",
        "print を input にする",
        "1行目を kosu = int(input(\"いくつ？\")) にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "1行目を kosu = int(input(\"いくつ？\")) にする",
      "hint": "input の答えは、まだ文字のままだよ。",
      "explanation": "文字と数は + で計算できないので TypeError。int(input(…)) で数にしよう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "長方形の面積アプリ",
      "description": "tate と yoko には、使う人が入れた 4 と 5 が入っているよ。「面積は 20」と表示しよう！",
      "expectedOutput": "面積は 20",
      "correctCode": "print(\"面積は\", tate * yoko)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "\"面積は\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b4",
          "text": "tate",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b5",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "yoko",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b7",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": "tate + yoko",
          "type": "variable",
          "color": "bg-sky-200"
        }
      ],
      "prefixCode": "tate = 4\nyoko = 5",
      "rules": [
        {
          "forbids": [
            "tate + yoko"
          ],
          "message": "長方形の面積は、たて × よこ（*）だよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "おやつを分けるアプリ",
      "description": "12このおやつを、3人で同じ数ずつ分けるよ。「1人 4 こ」と表示しよう！",
      "expectedOutput": "1人 4 こ",
      "correctCode": "print(\"1人\", oyatsu // ninzu, \"こ\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "\"1人\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b4",
          "text": "oyatsu",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b5",
          "text": "//",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "ninzu",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b7",
          "text": "\"こ\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b8",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "oyatsu * ninzu",
          "type": "variable",
          "color": "bg-sky-200"
        }
      ],
      "prefixCode": "oyatsu = 12\nninzu = 3",
      "rules": [
        {
          "forbids": [
            "oyatsu * ninzu"
          ],
          "message": "分けるときは、わり算（//）だよ！"
        }
      ]
    }
  ],
  "31-12": [
    {
      "id": 1,
      "type": "quiz",
      "title": "かざりの線",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(\"=\" * 5)",
      "choices": [
        "=5",
        "=====",
        "= * 5"
      ],
      "correctAnswer": 1,
      "expectedOutput": "=====",
      "hint": "文字に かける数をすると…？",
      "explanation": "文字 × 数 はくりかえし。「=」が5こならぶよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "ポイント",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "goukei = 730\nprint(goukei // 100)",
      "choices": [
        "7",
        "7.3",
        "30"
      ],
      "correctAnswer": 0,
      "expectedOutput": "7",
      "hint": "スラッシュ2つは、わり算の整数の答えだったね。",
      "explanation": "730 // 100 は 7（のこりの 30 は切りすて）。730円なら 7ポイント。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "買い足し",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "goukei = 300\ngoukei += 150\ngoukei += 50\nprint(goukei)",
      "choices": [
        "450",
        "150",
        "500"
      ],
      "correctAnswer": 2,
      "expectedOutput": "500",
      "hint": "上から じゅんばんに たしていこう。",
      "explanation": "300 + 150 = 450、450 + 50 = 500。+= は今の中身にたすよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "わりびき",
      "description": "goukei には 400 が入っているよ。50円のわりびきで、goukei から 50 をひいて「350」と表示しよう！",
      "expectedOutput": "350",
      "correctCode": "goukei -= 50\nprint(goukei)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "goukei",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b1",
          "text": "-=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b2",
          "text": "50",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "nl3",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "b4",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b5",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "+=",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "goukei = 400",
      "rules": [
        {
          "forbids": [
            "+="
          ],
          "message": "ひくのは -= だよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "ポイントを出す",
      "description": "goukei には 860 が入っているよ。100円ごとに1ポイントで、「ポイントは 8」と表示しよう！",
      "expectedOutput": "ポイントは 8",
      "correctCode": "print(\"ポイントは\", goukei // 100)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "\"ポイントは\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b4",
          "text": "goukei",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b5",
          "text": "//",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "100",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b7",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": "goukei % 100",
          "type": "variable",
          "color": "bg-sky-200"
        }
      ],
      "prefixCode": "goukei = 860",
      "rules": [
        {
          "forbids": [
            "%"
          ],
          "message": "ポイントは スラッシュ2つ（//）で計算しよう！"
        }
      ]
    }
  ],
  "31-14": [
    {
      "id": 1,
      "type": "quiz",
      "title": "文字数を数える",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "word = \"プログラミング\"\nprint(len(word))",
      "choices": [
        "6",
        "7",
        "8"
      ],
      "correctAnswer": 1,
      "expectedOutput": "7",
      "hint": "1文字ずつ数えてみよう。",
      "explanation": "プ・ロ・グ・ラ・ミ・ン・グ で 7文字だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "一部を取り出す",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "word = \"いちかです\"\nprint(word[0:3])",
      "choices": [
        "いちか",
        "いちかで",
        "ちかで"
      ],
      "correctAnswer": 0,
      "expectedOutput": "いちか",
      "hint": "番号は 0 から。[0:3] は 3番の手前まで。",
      "explanation": "0番・1番・2番の3文字「いちか」が出るよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "後ろの3文字「います」を出したいのに「おはよ」が出た。どう直す？",
      "codeToRead": "word = \"おはようございます\"\nprint(word[:3])",
      "choices": [
        "[:3] を [3:] にする",
        "len( ) でかこむ",
        "[:3] を [-3:] にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "[:3] を [-3:] にする",
      "hint": "後ろから数えるときは、マイナスの番号を使ったね。",
      "explanation": "[:3] は前から3文字「おはよ」。[-3:] にすると後ろから3文字「います」が出るよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "文字数を表示",
      "description": "len( ) を使って、hello の文字数を表示しよう！",
      "expectedOutput": "12",
      "correctCode": "print(len(hello))",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "len",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b3",
          "text": "hello",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "str",
          "type": "function",
          "color": "bg-yellow-200"
        }
      ],
      "prefixCode": "hello = \"こんにちは、私は瞳です。\"",
      "rules": [
        {
          "requires": [
            "len("
          ],
          "message": "文字の数は len( ) で数えるよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "後ろから取り出す",
      "description": "マイナスの番号を使って、hello の後ろから6文字を表示しよう！",
      "expectedOutput": "私は瞳です。",
      "correctCode": "print(hello[-6:])",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "hello",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "[",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "-6",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b5",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "]",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": "6",
          "type": "number",
          "color": "bg-yellow-100"
        }
      ],
      "prefixCode": "hello = \"こんにちは、私は瞳です。\"",
      "rules": [
        {
          "requires": [
            "-6"
          ],
          "message": "後ろから数えるときは、マイナスをつけるよ！"
        }
      ]
    }
  ],
  "31-16": [
    {
      "id": 1,
      "type": "quiz",
      "title": "どちらが動く？①",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "tweet = \"おやつ食べてる\"\nif len(tweet) > 10:\n    print(\"文字数が多すぎるよ\")\nelse:\n    print(tweet)",
      "choices": [
        "文字数が多すぎるよ",
        "おやつ食べてる",
        "何も出ない"
      ],
      "correctAnswer": 1,
      "expectedOutput": "おやつ食べてる",
      "hint": "tweet は何文字かな？",
      "explanation": "「おやつ食べてる」は7文字。10 より多くないので else の中が動くよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "どちらが動く？②",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "tweet = \"今日は公園でサッカーをしたよ\"\nif len(tweet) > 10:\n    print(\"文字数が多すぎるよ\")\nelse:\n    print(tweet)",
      "choices": [
        "文字数が多すぎるよ",
        "今日は公園でサッカーをしたよ",
        "何も出ない"
      ],
      "correctAnswer": 0,
      "expectedOutput": "文字数が多すぎるよ",
      "hint": "tweet は何文字かな？",
      "explanation": "14文字なので 10 より多い。if の中が動くよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら「SyntaxError: expected ':'」と出た。どう直す？",
      "codeToRead": "if len(tweet) > 10\n    print(\"文字数が多すぎるよ\")",
      "choices": [
        "print の前の空白を消す",
        "> を = にする",
        "10 のあとに : を足す"
      ],
      "correctAnswer": 2,
      "expectedOutput": "10 のあとに : を足す",
      "hint": "expected ':' は「: がほしい」という意味。",
      "explanation": "if の条件のあとには : を書くよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "if を書く",
      "description": "tweet が10文字より多ければ「文字数が多すぎるよ」と出す if を書こう！",
      "expectedOutput": "文字数が多すぎるよ",
      "correctCode": "if len(tweet) > 10:\n    print(\"文字数が多すぎるよ\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "len",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b2",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b3",
          "text": "tweet",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": ">",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "10",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b11",
          "text": "\"文字数が多すぎるよ\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b12",
          "text": "=",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "tweet = \"今日は公園でサッカーをしたよ\"",
      "rules": [
        {
          "requires": [
            "\n    "
          ],
          "message": "if の中の行は、半角4文字の字下げ（インデント）をつけよう！"
        }
      ]
    },
    {
      "id": 5,
      "title": "else もつける",
      "description": "10文字より多ければ「文字数が多すぎるよ」、そうでなければ tweet をそのまま出そう！",
      "expectedOutput": "おやつ食べてる",
      "correctCode": "if len(tweet) > 10:\n    print(\"文字数が多すぎるよ\")\nelse:\n    print(tweet)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "len",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b2",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b3",
          "text": "tweet",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": ">",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "10",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b11",
          "text": "\"文字数が多すぎるよ\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b12",
          "text": "else",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b13",
          "text": "\"tweet\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "prefixCode": "tweet = \"おやつ食べてる\"",
      "rules": [
        {
          "forbids": [
            "\"tweet\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        },
        {
          "requires": [
            "else:"
          ],
          "message": "「でなければ」は else: で書くよ！"
        }
      ]
    }
  ],
  "31-18": [
    {
      "id": 1,
      "type": "quiz",
      "title": ">= のとき",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "score = 80\nif score >= 80:\n    print(\"合格\")\nelse:\n    print(\"もう少し\")",
      "choices": [
        "もう少し",
        "合格",
        "両方出る"
      ],
      "correctAnswer": 1,
      "expectedOutput": "合格",
      "hint": ">= は「以上」。80 もふくむかな？",
      "explanation": "80 は「80以上」に入るので、if の中が動くよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "elif のとき",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "score = 65\nif score >= 80:\n    print(\"大変よくできました\")\nelif score >= 60:\n    print(\"よくできましたね\")\nelse:\n    print(\"もっと頑張りましょう\")",
      "choices": [
        "よくできましたね",
        "大変よくできました",
        "もっと頑張りましょう"
      ],
      "correctAnswer": 0,
      "expectedOutput": "よくできましたね",
      "hint": "上から順に調べるよ。",
      "explanation": "65 は 80 以上ではないけど 60 以上なので、elif の中が動くよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら SyntaxError が出た。どう直す？",
      "codeToRead": "score = 70\nif score => 70:\n    print(\"頑張りましたね\")",
      "choices": [
        "70 を \"70\" にする",
        "if を elif にする",
        "=> を >= にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "=> を >= にする",
      "hint": "記号の順番をよく見てみよう。",
      "explanation": "「以上」は >= の順番。=> はエラーになるよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "70点以上なら",
      "description": "score が 70 以上なら「頑張りましたね」と出す if を書こう！",
      "expectedOutput": "頑張りましたね",
      "correctCode": "if score >= 70:\n    print(\"頑張りましたね\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "score",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": ">=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b3",
          "text": "70",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b4",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl5",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind6",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b8",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "\"頑張りましたね\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b10",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b11",
          "text": ">",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "score = 70",
      "rules": [
        {
          "requires": [
            ">="
          ],
          "message": ">= は「以上」。70 もふくめるよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "elif をつかう",
      "description": "60 以上なら「よくできましたね」、そうでなく 40 以上なら「もう少し頑張りましょう」と出そう！",
      "expectedOutput": "もう少し頑張りましょう",
      "correctCode": "if score >= 60:\n    print(\"よくできましたね\")\nelif score >= 40:\n    print(\"もう少し頑張りましょう\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "score",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": ">=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b3",
          "text": "60",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b4",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl5",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind6",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b8",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "\"よくできましたね\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b10",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b11",
          "text": "elif",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b12",
          "text": "40",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b13",
          "text": "\"もう少し頑張りましょう\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b14",
          "text": "else",
          "type": "keyword",
          "color": "bg-blue-200"
        }
      ],
      "prefixCode": "score = 50",
      "rules": [
        {
          "requires": [
            "elif "
          ],
          "message": "条件をふやすときは elif を使うよ！"
        }
      ]
    }
  ],
  "31-23": [
    {
      "id": 1,
      "type": "quiz",
      "title": "番号で取り出す",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "lunch = [\"ラーメン\", \"カレー\", \"うどん\"]\nprint(lunch[0])",
      "choices": [
        "カレー",
        "ラーメン",
        "エラーになる"
      ],
      "correctAnswer": 1,
      "expectedOutput": "ラーメン",
      "hint": "番号は 0 から数えるよ。",
      "explanation": "0番はいちばん左の「ラーメン」だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "いちばん後ろ",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "omikuji = [\"大吉\", \"中吉\", \"小吉\"]\nprint(omikuji[2])",
      "choices": [
        "小吉",
        "中吉",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "小吉",
      "hint": "0・1・2 と数えてみよう。",
      "explanation": "0番が大吉、1番が中吉、2番が小吉だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "「うどん」を出したいのに「IndexError: list index out of range」が出た。どう直す？",
      "codeToRead": "lunch = [\"ラーメン\", \"カレー\", \"うどん\"]\nprint(lunch[3])",
      "choices": [
        "[3] を [4] にする",
        "lunch を \"lunch\" にする",
        "[3] を [2] にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "[3] を [2] にする",
      "hint": "3つのリストの番号は 0・1・2 だよ。",
      "explanation": "番号は 0 から。3つめの「うどん」は [2] だよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "リストを作る",
      "description": "「りんご」と「みかん」が入ったリスト fruits を作って、表示しよう！",
      "expectedOutput": "['りんご', 'みかん']",
      "correctCode": "fruits = [\"りんご\", \"みかん\"]\nprint(fruits)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "fruits",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b1",
          "text": "=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b2",
          "text": "[",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b3",
          "text": "\"りんご\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b4",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b5",
          "text": "\"みかん\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b6",
          "text": "]",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "nl7",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "b8",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b9",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b11",
          "text": "\"fruits\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "rules": [
        {
          "forbids": [
            "\"fruits\""
          ],
          "message": "\" \" でかこむと、リストではなく文字のまま出るよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "番号で取り出す",
      "description": "lunch から「ハンバーガー」を番号で取り出して、表示しよう！",
      "expectedOutput": "ハンバーガー",
      "correctCode": "print(lunch[2])",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "lunch",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "[",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "2",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b5",
          "text": "]",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        }
      ],
      "prefixCode": "lunch = [\"ラーメン\", \"カレー\", \"ハンバーガー\", \"うどん\"]",
      "rules": [
        {
          "requires": [
            "[2]"
          ],
          "message": "番号は 0 から数えるよ！"
        }
      ]
    }
  ],
  "31-25": [
    {
      "id": 1,
      "type": "quiz",
      "title": "合計",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "tensu = [70, 90, 80]\nprint(sum(tensu))",
      "choices": [
        "90",
        "240",
        "[70, 90, 80]"
      ],
      "correctAnswer": 1,
      "expectedOutput": "240",
      "hint": "sum はぜんぶ足すよ。",
      "explanation": "70 + 90 + 80 で 240 だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "ならべかえ",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "tensu = [70, 90, 80]\nprint(sorted(tensu))",
      "choices": [
        "[70, 80, 90]",
        "[90, 80, 70]",
        "[70, 90, 80]"
      ],
      "correctAnswer": 0,
      "expectedOutput": "[70, 80, 90]",
      "hint": "sorted は小さい順？大きい順？",
      "explanation": "sorted は小さい順にならべるよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら TypeError が出た。どう直す？",
      "codeToRead": "lunch = [\"カレー\", \"うどん\"]\nlunch.append[\"パスタ\"]",
      "choices": [
        "\"パスタ\" の \" \" をとる",
        "append を add にする",
        "[ ] を ( ) にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "[ ] を ( ) にする",
      "hint": ".append のあとのカッコの形を見てみよう。",
      "explanation": ".append( ) は丸いカッコ。lunch.append(\"パスタ\") だよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "いちばん大きい点数",
      "description": "tensu の中で、いちばん大きい点数を表示しよう！",
      "expectedOutput": "90",
      "correctCode": "print(max(tensu))",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "max",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b3",
          "text": "tensu",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "min",
          "type": "function",
          "color": "bg-yellow-200"
        }
      ],
      "prefixCode": "tensu = [80, 65, 90, 70]",
      "rules": [
        {
          "requires": [
            "max("
          ],
          "message": "いちばん大きい数は max( ) だよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "リストに追加",
      "description": "lunch に「うどん」を追加して、lunch を表示しよう！",
      "expectedOutput": "['ラーメン', 'カレー', 'うどん']",
      "correctCode": "lunch.append(\"うどん\")\nprint(lunch)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "lunch",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b1",
          "text": ".",
          "type": "separator",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "append",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "\"うどん\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b5",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "nl6",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "b7",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b8",
          "text": "pop",
          "type": "function",
          "color": "bg-yellow-200"
        }
      ],
      "prefixCode": "lunch = [\"ラーメン\", \"カレー\"]",
      "rules": [
        {
          "requires": [
            "append("
          ],
          "message": "追加するときは .append( ) だよ！"
        }
      ]
    }
  ],
  "31-28": [
    {
      "id": 1,
      "type": "quiz",
      "title": "問題の文を作る",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "suji1 = 3\nsuji2 = 4\nprint(str(suji1) + \"+\" + str(suji2) + \"はいくつ？\")",
      "choices": [
        "7はいくつ？",
        "3+4はいくつ？",
        "エラーになる"
      ],
      "correctAnswer": 1,
      "expectedOutput": "3+4はいくつ？",
      "hint": "str( ) で文字にしてから + でつないでいるよ。",
      "explanation": "文字どうしの + はつなぐだけ。計算はしないので「3+4はいくつ？」だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "数にしてくらべる",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "kotae = int(\"7\")\nprint(kotae == 7)",
      "choices": [
        "True",
        "False",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "True",
      "hint": "int( ) で数になっているかな？",
      "explanation": "int(\"7\") で数の 7 になったので、7 と同じ。True だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら TypeError が出た。どう直す？",
      "codeToRead": "suji1 = 3\nprint(suji1 + \"はいくつ？\")",
      "choices": [
        "\"はいくつ？\" を int( ) でかこむ",
        "+ を * にする",
        "suji1 を str(suji1) にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "suji1 を str(suji1) にする",
      "hint": "数と文字は、そのままでは + できないよ。",
      "explanation": "str(suji1) で文字にそろえると、+ でつなげられるよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "正解か調べる",
      "description": "goukei と kotae が同じなら「正解です」と出そう！",
      "expectedOutput": "正解です",
      "correctCode": "if goukei == kotae:\n    print(\"正解です\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "goukei",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "==",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b3",
          "text": "kotae",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl5",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind6",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b8",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "\"正解です\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b10",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b11",
          "text": "=",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "goukei = 7\nkotae = int(\"7\")",
      "rules": [
        {
          "requires": [
            "=="
          ],
          "message": "くらべるときは == （= が2つ）だよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "答えを数にする",
      "description": "kotae には文字の \"7\" が入っているよ。数にして 3 を足して表示しよう！",
      "expectedOutput": "10",
      "correctCode": "print(int(kotae) + 3)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "int",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b3",
          "text": "kotae",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b6",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b7",
          "text": "str",
          "type": "function",
          "color": "bg-yellow-200"
        }
      ],
      "prefixCode": "kotae = \"7\"",
      "rules": [
        {
          "requires": [
            "int("
          ],
          "message": "文字を整数にするには int( ) だよ！"
        }
      ]
    }
  ],
  "31-33": [
    {
      "id": 1,
      "type": "quiz",
      "title": "何が出る？①",
      "description": "このコードを実行すると、何が出る？（出る行を「・」でならべたよ）",
      "codeToRead": "for i in range(4):\n    print(i)",
      "choices": [
        "1・2・3・4",
        "0・1・2・3",
        "4だけ"
      ],
      "correctAnswer": 1,
      "expectedOutput": "0・1・2・3",
      "hint": "i は 0 から始まるよ。",
      "explanation": "range(4) は 0・1・2・3 の4回。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "何が出る？②",
      "description": "このコードを実行すると、何が出る？（出る行を「・」でならべたよ）",
      "codeToRead": "for i in range(3):\n    print(2 * i)",
      "choices": [
        "0・2・4",
        "2・4・6",
        "0・1・2"
      ],
      "correctAnswer": 0,
      "expectedOutput": "0・2・4",
      "hint": "i が 0・1・2 のとき、2 * i はいくつ？",
      "explanation": "2 × 0、2 × 1、2 × 2 で 0・2・4 だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら「IndentationError: expected an indented block」と出た。どう直す？",
      "codeToRead": "for i in range(3):\nprint(i)",
      "choices": [
        "range(3) を range(4) にする",
        "i を \"i\" にする",
        "print(i) の前に、半角4文字の字下げをつける"
      ],
      "correctAnswer": 2,
      "expectedOutput": "print(i) の前に、半角4文字の字下げをつける",
      "hint": "for の中の行はどう書いたかな？",
      "explanation": "for の中でくりかえす行は、字下げ（インデント）をつけるよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "1・2・3 を出す",
      "description": "for と range(3) を使って、1・2・3 を1行ずつ出そう！（i + 1 を使うよ）",
      "expectedOutput": "1\n2\n3",
      "correctCode": "for i in range(3):\n    print(i + 1)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "for",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "i",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "in",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b3",
          "text": "range",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b4",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b11",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b12",
          "text": "1",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b13",
          "text": "4",
          "type": "number",
          "color": "bg-yellow-100"
        }
      ],
      "rules": [
        {
          "requires": [
            "for "
          ],
          "message": "for を使ってくりかえそう！"
        }
      ]
    },
    {
      "id": 5,
      "title": "リストを1つずつ",
      "description": "for を使って、lunch の中身を1つずつ表示しよう！",
      "expectedOutput": "ラーメン\nカレー\nうどん",
      "correctCode": "for i in lunch:\n    print(i)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "for",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "i",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "in",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b3",
          "text": "lunch",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl5",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind6",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b8",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "range",
          "type": "function",
          "color": "bg-yellow-200"
        }
      ],
      "prefixCode": "lunch = [\"ラーメン\", \"カレー\", \"うどん\"]",
      "rules": [
        {
          "requires": [
            "in lunch"
          ],
          "message": "for i in lunch: で、リストから1つずつ取り出せるよ！"
        }
      ]
    }
  ],
  "31-35": [
    {
      "id": 1,
      "type": "quiz",
      "title": "for の中の for",
      "description": "このコードを実行すると、何が出る？（出る行を「・」でならべたよ）",
      "codeToRead": "for i in range(2):\n    for j in range(2):\n        print(i * j)",
      "choices": [
        "0・1・0・1",
        "0・0・0・1",
        "0・1・2・3"
      ],
      "correctAnswer": 1,
      "expectedOutput": "0・0・0・1",
      "hint": "i が 0 のとき、j は 0・1。i が 1 のときは？",
      "explanation": "0×0、0×1、1×0、1×1 の順で 0・0・0・1 だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "わり算のあまり",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(7 % 2)",
      "choices": [
        "1",
        "3",
        "3.5"
      ],
      "correctAnswer": 0,
      "expectedOutput": "1",
      "hint": "% は「わったあまり」だよ。",
      "explanation": "7 ÷ 2 は 3 あまり 1。% はあまりの 1 を出すよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "偶数の 0・2・4 を出したいのに、1・3・5 が出た。どう直す？",
      "codeToRead": "for i in range(6):\n    if i % 2 == 1:\n        print(i)",
      "choices": [
        "% を / にする",
        "range(6) を range(5) にする",
        "== 1 を == 0 にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "== 1 を == 0 にする",
      "hint": "2 でわったあまりが 0 なのは、偶数？奇数？",
      "explanation": "偶数は 2 でわり切れる（あまり 0）。== 0 にすると 0・2・4 が出るよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "偶数だけ出す",
      "description": "0〜5 の中で、偶数だけを出そう！",
      "expectedOutput": "0\n2\n4",
      "correctCode": "for i in range(6):\n    if i % 2 == 0:\n        print(i)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "for",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "i",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "in",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b3",
          "text": "range",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b4",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "6",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b11",
          "text": "%",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b12",
          "text": "2",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b13",
          "text": "==",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b14",
          "text": "0",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b15",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b16",
          "text": "/",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "%"
          ],
          "message": "あまりを調べるときは % だよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "for を2重に",
      "description": "for の中に for を書いて、0・1・2 を2回出そう！",
      "expectedOutput": "0\n1\n2\n0\n1\n2",
      "correctCode": "for i in range(2):\n    for j in range(3):\n        print(j)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "for",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "i",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "in",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b3",
          "text": "range",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b4",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "2",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "j",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b11",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b12",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "        print"
          ],
          "message": "中の for の中は、字下げを2つ重ねるよ！"
        }
      ]
    }
  ],
  "31-37": [
    {
      "id": 1,
      "type": "quiz",
      "title": "break",
      "description": "このコードを実行すると、何が出る？（出る行を「・」でならべたよ）",
      "codeToRead": "for i in range(10):\n    if i >= 3:\n        break\n    print(i)",
      "choices": [
        "0・1・2・3",
        "0・1・2",
        "3・4・5・6・7・8・9"
      ],
      "correctAnswer": 1,
      "expectedOutput": "0・1・2",
      "hint": "break で、くりかえしがどうなる？",
      "explanation": "i が 3 になったところで break。0・1・2 だけが出るよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "continue",
      "description": "このコードを実行すると、何が出る？（出る行を「・」でならべたよ）",
      "codeToRead": "for i in range(5):\n    if i == 2:\n        continue\n    print(i)",
      "choices": [
        "0・1・3・4",
        "0・1",
        "2だけ"
      ],
      "correctAnswer": 0,
      "expectedOutput": "0・1・3・4",
      "hint": "continue はその回だけとばすよ。",
      "explanation": "2 のときだけとばすので 0・1・3・4。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "このコードは、ずっと止まらなかった。0〜3 を出して止めるには、どう直す？",
      "codeToRead": "n = 0\nwhile n <= 3:\n    print(n)",
      "choices": [
        "while を if にする",
        "<= を >= にする",
        "print(n) の下に、字下げして n += 1 を足す"
      ],
      "correctAnswer": 2,
      "expectedOutput": "print(n) の下に、字下げして n += 1 を足す",
      "hint": "n はずっと 0 のままだね。",
      "explanation": "n += 1 で n をふやさないと、条件がずっと合ったままで止まらないよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "while で 1〜3",
      "description": "while を使って、1・2・3 を出そう！",
      "expectedOutput": "1\n2\n3",
      "correctCode": "while n <= 3:\n    print(n)\n    n += 1",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "while",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "n",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "<=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b3",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b4",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl5",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind6",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b8",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "+=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b11",
          "text": "1",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b12",
          "text": "break",
          "type": "keyword",
          "color": "bg-blue-200"
        }
      ],
      "prefixCode": "n = 1",
      "rules": [
        {
          "requires": [
            "n += 1"
          ],
          "message": "n += 1 を忘れると、ずっと止まらないよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "2 だけとばす",
      "description": "0〜4 のうち、2 のときだけとばして出そう！",
      "expectedOutput": "0\n1\n3\n4",
      "correctCode": "for i in range(5):\n    if i == 2:\n        continue\n    print(i)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "for",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "i",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "in",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b3",
          "text": "range",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b4",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "5",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b11",
          "text": "==",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b12",
          "text": "2",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b13",
          "text": "continue",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b14",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b15",
          "text": "break",
          "type": "keyword",
          "color": "bg-blue-200"
        }
      ],
      "rules": [
        {
          "forbids": [
            "break"
          ],
          "message": "break だと、そこで止まってしまうよ。とばすのは continue！"
        },
        {
          "requires": [
            "continue"
          ],
          "message": "その回だけとばすのは continue だよ！"
        }
      ]
    }
  ],
  "31-38": [
    {
      "id": 1,
      "type": "quiz",
      "title": "勝ち負けの判定",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "you = \"グー\"\ncom = \"チョキ\"\nif you == com:\n    print(\"あいこ\")\nelif you == \"グー\" and com == \"チョキ\":\n    print(\"勝ち\")\nelse:\n    print(\"負け\")",
      "choices": [
        "あいこ",
        "勝ち",
        "負け"
      ],
      "correctAnswer": 1,
      "expectedOutput": "勝ち",
      "hint": "you と com は同じ？",
      "explanation": "あなたがグー・コンピュータがチョキなので、elif の中「勝ち」が動くよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "and のとき",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "print(1 == 1 and 2 == 3)",
      "choices": [
        "False",
        "True",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "False",
      "hint": "and は「どちらも合っている」ときだけ True。",
      "explanation": "1 == 1 は True、2 == 3 は False。and なので False だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら SyntaxError が出た。どう直す？",
      "codeToRead": "you = \"グー\"\nif you = \"グー\":\n    print(\"グーだね\")",
      "choices": [
        "\"グー\" の \" \" をとる",
        "if を while にする",
        "= を == にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "= を == にする",
      "hint": "くらべる記号は = が何個だったかな？",
      "explanation": "= は「入れる」。くらべるときは == だよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "あいこの判定",
      "description": "you と com が同じなら「あいこ！もう一回！」と出そう！",
      "expectedOutput": "あいこ！もう一回！",
      "correctCode": "if you == com:\n    print(\"あいこ！もう一回！\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "you",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "==",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b3",
          "text": "com",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl5",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind6",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b8",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "\"あいこ！もう一回！\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b10",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b11",
          "text": "=",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "you = \"グー\"\ncom = \"グー\"",
      "rules": [
        {
          "requires": [
            "=="
          ],
          "message": "くらべるときは == （= が2つ）だよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "and で勝ちを判定",
      "description": "あなたがパーで、かつコンピュータがグーなら「あなたの勝ち！」と出そう！",
      "expectedOutput": "あなたの勝ち！",
      "correctCode": "if you == \"パー\" and com == \"グー\":\n    print(\"あなたの勝ち！\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "you",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "==",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b3",
          "text": "\"パー\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b4",
          "text": "and",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b5",
          "text": "com",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b6",
          "text": "\"グー\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b11",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b12",
          "text": "\"あなたの勝ち！\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b13",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b14",
          "text": "or",
          "type": "keyword",
          "color": "bg-blue-200"
        }
      ],
      "prefixCode": "you = \"パー\"\ncom = \"グー\"",
      "rules": [
        {
          "requires": [
            " and "
          ],
          "message": "「〜かつ〜」は and だよ！"
        }
      ]
    }
  ],
  "31-40": [
    {
      "id": 1,
      "type": "quiz",
      "title": "2回呼ぶと",
      "description": "このコードを実行すると、何が出る？（出る行を「・」でならべたよ）",
      "codeToRead": "def hello():\n    print(\"こんにちは\")\nhello()\nhello()",
      "choices": [
        "こんにちは",
        "こんにちは・こんにちは",
        "何も出ない"
      ],
      "correctAnswer": 1,
      "expectedOutput": "こんにちは・こんにちは",
      "hint": "hello() は何回書いてある？",
      "explanation": "呼び出した2回だけ動くので、2行出るよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "作っただけだと",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "def hello():\n    print(\"こんにちは\")",
      "choices": [
        "何も出ない",
        "こんにちは",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "何も出ない",
      "hint": "関数は、作っただけで動くかな？",
      "explanation": "def で作っただけでは動かない。hello() で呼び出したときに動くよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "「やあ」と出したいのに、何も出ない。どう直す？",
      "codeToRead": "def hello():\n    print(\"やあ\")\nhello",
      "choices": [
        "def を消す",
        "print を2回書く",
        "hello を hello() にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "hello を hello() にする",
      "hint": "呼び出すときに、何か足りないね。",
      "explanation": "関数を動かすには、カッコをつけて hello() と書くよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "関数を作って呼ぶ",
      "description": "「おはよう」と出す関数 aisatsu を作って、呼び出そう！",
      "expectedOutput": "おはよう",
      "correctCode": "def aisatsu():\n    print(\"おはよう\")\naisatsu()",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "def",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "aisatsu",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b3",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl5",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind6",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b8",
          "text": "\"おはよう\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b9",
          "text": "return",
          "type": "keyword",
          "color": "bg-blue-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "\naisatsu()"
          ],
          "message": "作っただけでは動かないよ。さいごに aisatsu() で呼び出そう！"
        }
      ]
    },
    {
      "id": 5,
      "title": "for で3回呼ぶ",
      "description": "for を使って、hello を3回呼び出そう！",
      "expectedOutput": "こんにちは\nこんにちは\nこんにちは",
      "correctCode": "for i in range(3):\n    hello()",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "for",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "i",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "in",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b3",
          "text": "range",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b4",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "hello",
          "type": "variable",
          "color": "bg-sky-200"
        }
      ],
      "prefixCode": "def hello():\n    print(\"こんにちは\")",
      "rules": [
        {
          "requires": [
            "hello()"
          ],
          "message": "呼び出すときは hello() とカッコをつけよう！"
        }
      ]
    }
  ],
  "31-42": [
    {
      "id": 1,
      "type": "quiz",
      "title": "消費税",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "def shohizei(kingaku):\n    return kingaku * 0.1\nprint(shohizei(500))",
      "choices": [
        "500",
        "50.0",
        "5000"
      ],
      "correctAnswer": 1,
      "expectedOutput": "50.0",
      "hint": "500 × 0.1 はいくつ？",
      "explanation": "引数の kingaku に 500 が入り、500 × 0.1 = 50.0 が戻ってくるよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "引数で名前をわたす",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "def hello2(name):\n    print(name + \"さん、こんにちは\")\nhello2(\"ひかり\")",
      "choices": [
        "ひかりさん、こんにちは",
        "nameさん、こんにちは",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "ひかりさん、こんにちは",
      "hint": "name には何が入るかな？",
      "explanation": "hello2(\"ひかり\") で、name に「ひかり」が入るよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "10 を出したいのに「None」が出た。どう直す？",
      "codeToRead": "def baisu(kazu):\n    kekka = kazu * 2\nprint(baisu(5))",
      "choices": [
        "print を消す",
        "kazu を 2 にする",
        "kekka のあとに return kekka を足す"
      ],
      "correctAnswer": 2,
      "expectedOutput": "kekka のあとに return kekka を足す",
      "hint": "関数の答えを外にわたすには？",
      "explanation": "return がないと、関数は答えを返さず None になる。return kekka を足そう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "引数のある関数",
      "description": "name を受け取って「〇〇さん、ようこそ」と出す関数 welcome を作り、welcome(\"いちか\") で呼ぼう！",
      "expectedOutput": "いちかさん、ようこそ",
      "correctCode": "def welcome(name):\n    print(name + \"さん、ようこそ\")\nwelcome(\"いちか\")",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "def",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "welcome",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b3",
          "text": "name",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl6",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind7",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b9",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b10",
          "text": "\"さん、ようこそ\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b11",
          "text": "\"いちか\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b12",
          "text": "\"name\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "rules": [
        {
          "forbids": [
            "\"name\""
          ],
          "message": "\" \" でかこむと、引数の中身ではなく文字の name になるよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "関数を使う",
      "description": "shohizei を使って、1000円の消費税を表示しよう！",
      "expectedOutput": "100.0",
      "correctCode": "print(shohizei(1000))",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "shohizei",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "1000",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b4",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "kingaku",
          "type": "variable",
          "color": "bg-sky-200"
        }
      ],
      "prefixCode": "def shohizei(kingaku):\n    return kingaku * 0.1",
      "rules": [
        {
          "requires": [
            "shohizei(1000)"
          ],
          "message": "shohizei( ) のカッコに 1000 をわたそう！"
        }
      ]
    }
  ],
  "31-43": [
    {
      "id": 1,
      "type": "quiz",
      "title": "面積の関数",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "def menseki(tate, yoko):\n    return tate * yoko\nprint(menseki(6, 7))",
      "choices": [
        "13",
        "42",
        "67"
      ],
      "correctAnswer": 1,
      "expectedOutput": "42",
      "hint": "tate と yoko には何が入る？",
      "explanation": "tate に 6、yoko に 7。6 × 7 = 42 だよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "わたす順番",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "def hiku(a, b):\n    return a - b\nprint(hiku(3, 10))",
      "choices": [
        "-7",
        "7",
        "エラーになる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "-7",
      "hint": "a と b に入るのは、どっちの数？",
      "explanation": "順番どおり a に 3、b に 10。3 - 10 = -7 だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "エラーを直そう",
      "description": "実行したら「TypeError: menseki() missing 1 required positional argument: 'yoko'」と出た。どう直す？",
      "codeToRead": "def menseki(tate, yoko):\n    return tate * yoko\nprint(menseki(4))",
      "choices": [
        "return を print にする",
        "def を消す",
        "menseki(4) を menseki(4, 5) のように2つわたす"
      ],
      "correctAnswer": 2,
      "expectedOutput": "menseki(4) を menseki(4, 5) のように2つわたす",
      "hint": "引数はいくつ必要かな？",
      "explanation": "menseki は tate と yoko の2つを受け取る。カンマで区切って2つわたそう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "たし算の関数",
      "description": "a と b を受け取って足した答えを返す関数 tasu を作り、tasu(2, 3) を表示しよう！",
      "expectedOutput": "5",
      "correctCode": "def tasu(a, b):\n    return a + b\nprint(tasu(2, 3))",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "def",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "tasu",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b3",
          "text": "a",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b5",
          "text": "b",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "return",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b11",
          "text": "+",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b12",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b13",
          "text": "2",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b14",
          "text": "3",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b15",
          "text": "*",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "return "
          ],
          "message": "関数の答えは return で返そう！"
        }
      ]
    },
    {
      "id": 5,
      "title": "面積を表示",
      "description": "menseki を使って、たて 12・よこ 8 の面積を表示しよう！",
      "expectedOutput": "96",
      "correctCode": "print(menseki(12, 8))",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b1",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b2",
          "text": "menseki",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "12",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b4",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b5",
          "text": "8",
          "type": "number",
          "color": "bg-yellow-100"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": "×",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "prefixCode": "def menseki(tate, yoko):\n    return tate * yoko",
      "rules": [
        {
          "requires": [
            "menseki(12, 8)"
          ],
          "message": "たて・よこの順に、カンマで区切ってわたそう！"
        }
      ]
    }
  ],
  "31-45": [
    {
      "id": 1,
      "type": "quiz",
      "title": "judge の結果①",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "def judge(you, com):\n    if you == com:\n        return \"あいこ\"\n    elif (you == \"グー\" and com == \"チョキ\") or (you == \"チョキ\" and com == \"パー\") or (you == \"パー\" and com == \"グー\"):\n        return \"あなたの勝ち！\"\n    else:\n        return \"あなたの負け…\"\nprint(judge(\"チョキ\", \"パー\"))",
      "choices": [
        "あいこ",
        "あなたの勝ち！",
        "あなたの負け…"
      ],
      "correctAnswer": 1,
      "expectedOutput": "あなたの勝ち！",
      "hint": "チョキとパーは、どちらが勝つ？",
      "explanation": "あなたがチョキ・コンピュータがパーなので、あなたの勝ち！",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "judge の結果②",
      "description": "このコードを実行すると、何が出る？",
      "codeToRead": "def judge(you, com):\n    if you == com:\n        return \"あいこ\"\n    elif (you == \"グー\" and com == \"チョキ\") or (you == \"チョキ\" and com == \"パー\") or (you == \"パー\" and com == \"グー\"):\n        return \"あなたの勝ち！\"\n    else:\n        return \"あなたの負け…\"\nprint(judge(\"グー\", \"パー\"))",
      "choices": [
        "あなたの負け…",
        "あいこ",
        "あなたの勝ち！"
      ],
      "correctAnswer": 0,
      "expectedOutput": "あなたの負け…",
      "hint": "グーとパーは、どちらが勝つ？",
      "explanation": "パーがグーに勝つので、あなたの負け…だよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "result に「あいこ」を入れたいのに、None になった。どう直す？",
      "codeToRead": "def judge(you, com):\n    if you == com:\n        print(\"あいこ\")\nresult = judge(\"グー\", \"グー\")\nprint(result)",
      "choices": [
        "judge を Judge にする",
        "if を while にする",
        "print(\"あいこ\") を return \"あいこ\" にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "print(\"あいこ\") を return \"あいこ\" にする",
      "hint": "関数の答えを外にわたすのは？",
      "explanation": "print では result に何も入らず None になる。return で返そう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "あいこを返す",
      "description": "同じ手なら「あいこ」を返す関数 judge を作り、judge(\"パー\", \"パー\") を表示しよう！",
      "expectedOutput": "あいこ",
      "correctCode": "def judge(you, com):\n    if you == com:\n        return \"あいこ\"\nprint(judge(\"パー\", \"パー\"))",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "def",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b1",
          "text": "judge",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b2",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b3",
          "text": "you",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b4",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b5",
          "text": "com",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b6",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b7",
          "text": ":",
          "type": "colon",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "ind9",
          "text": "    ",
          "type": "indent",
          "color": "bg-gray-200"
        },
        {
          "id": "b10",
          "text": "if",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b11",
          "text": "==",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b12",
          "text": "return",
          "type": "keyword",
          "color": "bg-blue-200"
        },
        {
          "id": "b13",
          "text": "\"あいこ\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b14",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b15",
          "text": "\"パー\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b16",
          "text": "=",
          "type": "operator",
          "color": "bg-orange-200"
        }
      ],
      "rules": [
        {
          "requires": [
            "return "
          ],
          "message": "関数の答えは return で返そう！"
        },
        {
          "requires": [
            "=="
          ],
          "message": "くらべるときは == だよ！"
        }
      ]
    },
    {
      "id": 5,
      "title": "judge を使う",
      "description": "judge で「グー」と「チョキ」の結果を result に入れて、表示しよう！",
      "expectedOutput": "あなたの勝ち！",
      "correctCode": "result = judge(\"グー\", \"チョキ\")\nprint(result)",
      "availableBlocks": [
        {
          "id": "b0",
          "text": "result",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b1",
          "text": "=",
          "type": "operator",
          "color": "bg-orange-200"
        },
        {
          "id": "b2",
          "text": "judge",
          "type": "variable",
          "color": "bg-sky-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "\"グー\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b5",
          "text": ",",
          "type": "separator",
          "color": "bg-purple-200"
        },
        {
          "id": "b6",
          "text": "\"チョキ\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b7",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "nl8",
          "text": "↵",
          "type": "newline",
          "color": "bg-pink-200"
        },
        {
          "id": "b9",
          "text": "print",
          "type": "function",
          "color": "bg-yellow-200"
        },
        {
          "id": "b10",
          "text": "\"result\"",
          "type": "string",
          "color": "bg-green-200"
        }
      ],
      "prefixCode": "def judge(you, com):\n    if you == com:\n        return \"あいこ\"\n    elif (you == \"グー\" and com == \"チョキ\") or (you == \"チョキ\" and com == \"パー\") or (you == \"パー\" and com == \"グー\"):\n        return \"あなたの勝ち！\"\n    else:\n        return \"あなたの負け…\"",
      "rules": [
        {
          "forbids": [
            "\"result\""
          ],
          "message": "\" \" でかこむと、箱の中身ではなく文字のまま出るよ！"
        }
      ]
    }
  ],
  "31-49": [
    {
      "id": 1,
      "type": "quiz",
      "title": "窓の大きさ",
      "description": "この窓の「たて」の大きさは？",
      "codeToRead": "root.geometry(\"300x200\")",
      "choices": [
        "300",
        "200",
        "500"
      ],
      "correctAnswer": 1,
      "expectedOutput": "200",
      "hint": "\"よこxたて\" の順で書くよ。",
      "explanation": "300 がよこ、200 がたての大きさだよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "窓に出すには",
      "description": "ラベルとボタンを作った。窓に出すには？",
      "codeToRead": "lbl = tk.Label(text=\"ラベル\")\nbtn = tk.Button(text=\"プッシュ\")",
      "choices": [
        "lbl.pack() と btn.pack() を書く",
        "print(lbl) と書く",
        "何もしなくても出る"
      ],
      "correctAnswer": 0,
      "expectedOutput": "lbl.pack() と btn.pack() を書く",
      "hint": "作っただけでは、窓にはならばないよ。",
      "explanation": ".pack() で窓にならべると表示されるよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "実行しても、窓がすぐ消えてしまう。さいごに足りない1行は？",
      "codeToRead": "import tkinter as tk\nroot = tk.Tk()\nlbl = tk.Label(text=\"こんにちは\")\nlbl.pack()",
      "choices": [
        "root.title()",
        "lbl.config()",
        "tk.mainloop()"
      ],
      "correctAnswer": 2,
      "expectedOutput": "tk.mainloop()",
      "hint": "窓を出したままにする1行があったね。",
      "explanation": "さいごに tk.mainloop() を書くと、窓が開いたままになるよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "type": "quiz",
      "title": "command=",
      "description": "このボタンを押すと、何が起きる？",
      "codeToRead": "btn = tk.Button(text=\"プッシュ\", command=change_label)",
      "choices": [
        "ボタンが消える",
        "change_label 関数が動く",
        "「プッシュ」と2回出る"
      ],
      "correctAnswer": 1,
      "expectedOutput": "change_label 関数が動く",
      "hint": "command= には、押したときに動く関数を書くよ。",
      "explanation": "ボタンを押すと、command= に書いた change_label が動くよ。",
      "availableBlocks": []
    },
    {
      "id": 5,
      "type": "quiz",
      "title": "config",
      "description": "この行は、何をする？",
      "codeToRead": "lbl.config(text=\"こんにちは\")",
      "choices": [
        "ラベルの文字を「こんにちは」に書きかえる",
        "ボタンを作る",
        "窓の大きさを変える"
      ],
      "correctAnswer": 0,
      "expectedOutput": "ラベルの文字を「こんにちは」に書きかえる",
      "hint": "config は「設定を変える」だよ。",
      "explanation": "lbl.config(text=…) で、ラベルの文字を書きかえられるよ。",
      "availableBlocks": []
    }
  ],
  "31-50": [
    {
      "id": 1,
      "type": "quiz",
      "title": "title",
      "description": "この行で、どこの文字が変わる？",
      "codeToRead": "root.title(\"おみくじ\")",
      "choices": [
        "ラベルの文字",
        "ボタンの文字",
        "窓の上のタイトル"
      ],
      "correctAnswer": 2,
      "expectedOutput": "窓の上のタイトル",
      "hint": "title は「題名」だよ。",
      "explanation": "root.title( ) で、窓の上に出るタイトルが変わるよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "くじを引く",
      "description": "kekka に入るのは？",
      "codeToRead": "kuji = [\"大吉\", \"中吉\", \"小吉\", \"凶\"]\nkekka = random.choice(kuji)",
      "choices": [
        "いつも大吉",
        "4つのどれか1つ（毎回かわる）",
        "4つ全部"
      ],
      "correctAnswer": 1,
      "expectedOutput": "4つのどれか1つ（毎回かわる）",
      "hint": "choice は「えらぶ」だよ。",
      "explanation": "random.choice で、リストからランダムに1つえらぶよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "ボタンを押しても、くじが引けない。どう直す？",
      "codeToRead": "btn = tk.Button(text=\"占う\", command=uranau())",
      "choices": [
        "uranau() を uranau にする（カッコをとる）",
        "text を command にする",
        "占う を \"占う\" にする"
      ],
      "correctAnswer": 0,
      "expectedOutput": "uranau() を uranau にする（カッコをとる）",
      "hint": "command= に書くのは、関数の名前だけだよ。",
      "explanation": "カッコをつけると、窓を作るときに1回動くだけ。command=uranau とカッコなしで書こう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "type": "quiz",
      "title": "書く場所",
      "description": "def uranau(): は、どこに書く？",
      "codeToRead": "def uranau():",
      "choices": [
        "tk.mainloop() の下",
        "どこでもよい",
        "btn を作る行より上"
      ],
      "correctAnswer": 2,
      "expectedOutput": "btn を作る行より上",
      "hint": "使う前に作っておく必要があるよ。",
      "explanation": "command=uranau で使うので、btn の行より上で作っておくよ。",
      "availableBlocks": []
    },
    {
      "id": 5,
      "type": "quiz",
      "title": "ラベルに出るもの",
      "description": "ボタンを押したあと、ラベルに出るのは？",
      "codeToRead": "lbl.config(text=kekka)",
      "choices": [
        "kekka という文字",
        "引いたくじ（大吉など）",
        "今日のあなたの運勢は"
      ],
      "correctAnswer": 1,
      "expectedOutput": "引いたくじ（大吉など）",
      "hint": "kekka は \" \" でかこんでいないね。",
      "explanation": "kekka の中身（引いたくじ）が、ラベルに出るよ。",
      "availableBlocks": []
    }
  ],
  "31-51": [
    {
      "id": 1,
      "type": "quiz",
      "title": "PIL",
      "description": "この行は、何のため？",
      "codeToRead": "import PIL.Image",
      "choices": [
        "画像を使う道具（Pillow）を読みこむ",
        "窓を作る",
        "ファイルを消す"
      ],
      "correctAnswer": 0,
      "expectedOutput": "画像を使う道具（Pillow）を読みこむ",
      "hint": "PIL は画像の道具だったね。",
      "explanation": "Pillow（PIL）は、画像を開いたり加工したりする外部ライブラリだよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "ファイルをえらぶ",
      "description": "この行は、何をする？",
      "codeToRead": "fpath = fd.askopenfilename()",
      "choices": [
        "画像を白黒にする",
        "ボタンを作る",
        "ファイルをえらぶ画面を出して、えらんだ場所を fpath に入れる"
      ],
      "correctAnswer": 2,
      "expectedOutput": "ファイルをえらぶ画面を出して、えらんだ場所を fpath に入れる",
      "hint": "ask は「たずねる」、open は「開く」。",
      "explanation": "ファイルをえらぶ画面が出て、えらんだファイルの場所が fpath に入るよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "まちがいを直そう",
      "description": "ボタンは出るのに、えらんだ画像が窓に出ない。どう直す？",
      "codeToRead": "btn = tk.Button(text=\"ファイルを開く\", command=openFile)\nimageLabel = tk.Label()\nbtn.pack()",
      "choices": [
        "import random を足す",
        "imageLabel.pack() を足す",
        "btn.pack() を消す"
      ],
      "correctAnswer": 1,
      "expectedOutput": "imageLabel.pack() を足す",
      "hint": "作った部品は、窓にならべないと出ないよ。",
      "explanation": "imageLabel も .pack() で窓にならべると、画像が出るよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "type": "quiz",
      "title": "resize",
      "description": "resize((300, 300)) は、何をする？",
      "codeToRead": "PIL.Image.open(path).resize((300, 300))",
      "choices": [
        "画像の大きさを よこ300・たて300 にする",
        "画像を300回出す",
        "画像を白黒にする"
      ],
      "correctAnswer": 0,
      "expectedOutput": "画像の大きさを よこ300・たて300 にする",
      "hint": "resize は「大きさを変える」だよ。",
      "explanation": "開いた画像を、よこ300・たて300 の大きさにするよ。",
      "availableBlocks": []
    },
    {
      "id": 5,
      "type": "quiz",
      "title": "dispPhoto",
      "description": "openFile の中の dispPhoto(fpath) は、何をしている？",
      "codeToRead": "dispPhoto(fpath)",
      "choices": [
        "ファイルを消している",
        "窓を閉じている",
        "えらんだ画像を窓に出す関数を呼んでいる"
      ],
      "correctAnswer": 2,
      "expectedOutput": "えらんだ画像を窓に出す関数を呼んでいる",
      "hint": "dispPhoto は、自分で作った関数だったね。",
      "explanation": "えらんだファイルの場所をわたして、画像を窓に出しているよ。",
      "availableBlocks": []
    }
  ],
  "31-53": [
    {
      "id": 1,
      "type": "quiz",
      "title": "convert(\"L\")",
      "description": "convert(\"L\") をつけると？",
      "codeToRead": "PIL.Image.open(path).convert(\"L\")",
      "choices": [
        "モザイクの画像になる",
        "白黒の画像になる",
        "大きい画像になる"
      ],
      "correctAnswer": 1,
      "expectedOutput": "白黒の画像になる",
      "hint": "L は白黒のモードだよ。",
      "explanation": "convert(\"L\") で、画像を白黒にできるよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "resize を2回",
      "description": "この書き方で、画像はどうなる？",
      "codeToRead": "PIL.Image.open(path).resize((32, 32)).resize((300, 300))",
      "choices": [
        "モザイクになる",
        "白黒になる",
        "何も変わらない"
      ],
      "correctAnswer": 0,
      "expectedOutput": "モザイクになる",
      "hint": "一度小さくしてから、大きくもどしているね。",
      "explanation": "小さくすると細かいところが消えるので、大きくもどすとモザイクになるよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "細かくするには",
      "description": "モザイクの四角を、もっと小さく（細かく）したい。どう直す？",
      "codeToRead": "PIL.Image.open(path).resize((32, 32)).resize((300, 300), resample=0)",
      "choices": [
        "32 を 16 にする",
        "300 を 30 にする",
        "32 を 64 にする"
      ],
      "correctAnswer": 2,
      "expectedOutput": "32 を 64 にする",
      "hint": "小さくするときの数を大きくすると、四角は…？",
      "explanation": "64 にすると、四角が小さく細かいモザイクになる。16 にすると、もっと大きな四角になるよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "type": "quiz",
      "title": "resample=0",
      "description": "resample=0 をつけると？",
      "codeToRead": ".resize((300, 300), resample=0)",
      "choices": [
        "画像が消える",
        "四角がくっきりしたモザイクになる",
        "色がつく"
      ],
      "correctAnswer": 1,
      "expectedOutput": "四角がくっきりしたモザイクになる",
      "hint": "resample=0 は、ぼかさずに大きくするよ。",
      "explanation": "ぼかさずに大きくするので、四角がはっきりしたモザイクになるよ。",
      "availableBlocks": []
    },
    {
      "id": 5,
      "type": "quiz",
      "title": "白黒のモザイク",
      "description": "白黒のモザイクにするには、どれ？",
      "codeToRead": "newImage = （どれ？）",
      "choices": [
        "PIL.Image.open(path).convert(\"L\").resize((32, 32)).resize((300, 300))",
        "PIL.Image.open(path).resize((300, 300))",
        "PIL.Image.open(path).convert(\"L\")"
      ],
      "correctAnswer": 0,
      "expectedOutput": "PIL.Image.open(path).convert(\"L\").resize((32, 32)).resize((300, 300))",
      "hint": "白黒にする部分と、小さくして大きくもどす部分の両方が要るよ。",
      "explanation": "convert(\"L\") で白黒にして、resize を2回でモザイクにするよ。",
      "availableBlocks": []
    }
  ],
  "31-54": [
    {
      "id": 1,
      "type": "quiz",
      "title": "押すと動く関数",
      "description": "このボタンを押すと動く関数は？",
      "codeToRead": "tk.Button(window, text=\"白黒\", command=to_gray)",
      "choices": [
        "to_mosaic",
        "open_image",
        "to_gray"
      ],
      "correctAnswer": 2,
      "expectedOutput": "to_gray",
      "hint": "command= のあとを見てみよう。",
      "explanation": "「白黒」ボタンを押すと、command= の to_gray が動くよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "type": "quiz",
      "title": "// の数を変える",
      "description": "// 20 を // 10 に変えると？",
      "codeToRead": "small = original.resize((original.width // 20, original.height // 20))",
      "choices": [
        "モザイクの四角が大きくなる",
        "モザイクの四角が小さく（細かく）なる",
        "白黒になる"
      ],
      "correctAnswer": 1,
      "expectedOutput": "モザイクの四角が小さく（細かく）なる",
      "hint": "// 10 にすると、small は大きい？小さい？",
      "explanation": "// 10 だと小さくする度合いが弱くなり、四角が小さい細かいモザイクになるよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "type": "quiz",
      "title": "しくみを読もう",
      "description": "画像を開く前に「白黒」を押しても、エラーにならないのはなぜ？",
      "codeToRead": "def to_gray():\n    if original is not None:\n        show(original.convert(\"L\"))",
      "choices": [
        "画像があるときだけ白黒にするから",
        "convert が何もしないから",
        "ボタンが押せないから"
      ],
      "correctAnswer": 0,
      "expectedOutput": "画像があるときだけ白黒にするから",
      "hint": "is not None は「からっぽではない」だよ。",
      "explanation": "original に画像が入っているときだけ動くので、開く前に押してもエラーにならないよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "type": "quiz",
      "title": "side=tk.LEFT",
      "description": "ボタンの .pack( ) にこれをつけると？",
      "codeToRead": ".pack(side=tk.LEFT, expand=True)",
      "choices": [
        "ボタンをたてにならべる",
        "ボタンを消す",
        "ボタンを左から横にならべる"
      ],
      "correctAnswer": 2,
      "expectedOutput": "ボタンを左から横にならべる",
      "hint": "LEFT は「左」だよ。",
      "explanation": "side=tk.LEFT で、左から横にならべるよ。",
      "availableBlocks": []
    },
    {
      "id": 5,
      "type": "quiz",
      "title": "show",
      "description": "この show 関数は、何をする？",
      "codeToRead": "def show(img):\n    global photo\n    photo = ImageTk.PhotoImage(img)\n    label.config(image=photo)",
      "choices": [
        "画像を保存する",
        "わたされた画像を、窓のラベルに出す",
        "画像を白黒にする"
      ],
      "correctAnswer": 1,
      "expectedOutput": "わたされた画像を、窓のラベルに出す",
      "hint": "label.config(image=…) は何をする？",
      "explanation": "わたされた画像を窓に出せる形にして、ラベルに出すよ。",
      "availableBlocks": []
    }
  ]
};

export const finishStepTutorials: LessonTutorial[] = [
  {
    "lessonId": "31-2",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "print(9 - 5)  # 4"
        }
      }
    ]
  },
  {
    "lessonId": "31-3",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "print(7 % 2)  # 1"
        }
      }
    ]
  },
  {
    "lessonId": "31-4",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "tate = 10\nprint(tate)  # 10"
        }
      }
    ]
  },
  {
    "lessonId": "31-5",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "ue = 5\nshita = 10\ntakasa = 6\nprint((ue + shita) * takasa / 2)  # 45.0"
        }
      }
    ]
  },
  {
    "lessonId": "31-6",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "print(\"パイ\" + \"ソン\")  # パイソン"
        }
      }
    ]
  },
  {
    "lessonId": "31-7",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "kotae = input(\"すきなきせつは？\")  # 答えが kotae に入る"
        }
      }
    ]
  },
  {
    "lessonId": "31-8",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "ue = float(input(\"上の辺は？\"))  # 数にして箱に入れる"
        }
      }
    ]
  },
  {
    "lessonId": "31-9",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "print(type(\"ハロー\"))  # <class 'str'>"
        }
      }
    ]
  },
  {
    "lessonId": "31-10",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "point += 5  # point = point + 5 と同じ"
        }
      }
    ]
  },
  {
    "lessonId": "31-11",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "nedan = int(input(\"ねだんは？\"))  # 数を聞く"
        }
      }
    ]
  },
  {
    "lessonId": "31-12",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "print(\"-\" * 10)  # かざりの線"
        }
      }
    ]
  },
  {
    "lessonId": "31-14",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "word = \"Python\"\nprint(word[0])  # P"
        }
      }
    ]
  },
  {
    "lessonId": "31-16",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "if 5 > 3:\n    print(\"5 のほうが大きい\")"
        }
      }
    ]
  },
  {
    "lessonId": "31-18",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "score = 90\nif score >= 80:\n    print(\"大変よくできました\")"
        }
      }
    ]
  },
  {
    "lessonId": "31-23",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "colors = [\"赤\", \"青\"]\nprint(colors[1])  # 青"
        }
      }
    ]
  },
  {
    "lessonId": "31-25",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "nums = [3, 1, 2]\nprint(min(nums))  # 1"
        }
      }
    ]
  },
  {
    "lessonId": "31-28",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "a = 2\nprint(str(a) + \"こ\")  # 2こ"
        }
      }
    ]
  },
  {
    "lessonId": "31-33",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "for i in range(2):\n    print(\"やあ\")"
        }
      }
    ]
  },
  {
    "lessonId": "31-35",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "for i in range(2):\n    for j in range(2):\n        print(i, j)"
        }
      }
    ]
  },
  {
    "lessonId": "31-37",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "n = 3\nwhile n > 0:\n    print(n)\n    n -= 1"
        }
      }
    ]
  },
  {
    "lessonId": "31-38",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "作品の回で使った書き方を、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "you = \"グー\"\nif you == \"グー\":\n    print(\"グーだね\")"
        }
      }
    ]
  },
  {
    "lessonId": "31-40",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "def bye():\n    print(\"またね\")\nbye()"
        }
      }
    ]
  },
  {
    "lessonId": "31-42",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "def double(n):\n    return n * 2\nprint(double(4))  # 8"
        }
      }
    ]
  },
  {
    "lessonId": "31-43",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "def kakeru(a, b):\n    return a * b\nprint(kakeru(2, 5))  # 10"
        }
      }
    ]
  },
  {
    "lessonId": "31-45",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "作品の回で使った書き方を、5問でたしかめます。結果を予想する問題・まちがいを直す問題・ブロックをならべる問題があります。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "def kotae(x):\n    if x == 1:\n        return \"いち\"\nprint(kotae(1))"
        }
      }
    ]
  },
  {
    "lessonId": "31-49",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。コードを読んで答えるクイズです。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "root = tk.Tk()\nroot.title(\"はじめての窓\")"
        }
      }
    ]
  },
  {
    "lessonId": "31-50",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。コードを読んで答えるクイズです。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "root.geometry(\"400x300\")"
        }
      }
    ]
  },
  {
    "lessonId": "31-51",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。コードを読んで答えるクイズです。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "import tkinter as tk  # 窓を作るモジュール"
        }
      }
    ]
  },
  {
    "lessonId": "31-53",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "さっきの動画で習ったことを、5問でたしかめます。コードを読んで答えるクイズです。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "PIL.Image.open(path).resize((150, 150))"
        }
      }
    ]
  },
  {
    "lessonId": "31-54",
    "characterName": "いちか",
    "characterEmoji": "🙂",
    "characterImage": "/navi/bob_smile.webp",
    "slides": [
      {
        "title": "5問で仕上げよう",
        "content": "作品の回で使った書き方を、5問でたしかめます。コードを読んで答えるクイズです。",
        "characterMessage": "わからなくなったら、ヒントを見てね。",
        "codeExample": {
          "good": "tk.Button(window, text=\"もとにもどす\", command=to_original)"
        }
      }
    ]
  }
];
