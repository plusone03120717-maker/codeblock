// Python ナビ（新しいコース）専用の CodeBlock レッスン 21-1〜21-5。
// 今までの生徒のレッスン一覧には出さない（getLesson などで見つかるだけ）。
// このファイルは scratchpad の build_lessons21.py で作り、答えのコードは Python で動かして確かめてある。
import type { Lesson, Mission } from "@/types";
import type { LessonTutorial } from "@/data/tutorials";

export const naviLessons: Lesson[] = [
  {
    "id": "21-1",
    "unitNumber": 21,
    "subNumber": 1,
    "title": "文字数を数えて、取り出そう",
    "description": "len( ) で文字数、[ ] で文字の一部を取り出そう",
    "difficulty": "ふつう"
  },
  {
    "id": "21-2",
    "unitNumber": 21,
    "subNumber": 2,
    "title": "リストの便利な道具",
    "description": "sum・max・min・sorted・len を使ってみよう",
    "difficulty": "ふつう"
  },
  {
    "id": "21-3",
    "unitNumber": 21,
    "subNumber": 3,
    "title": "ランダムと入力のクイズ",
    "description": "random と input のきまりを、クイズでたしかめよう",
    "difficulty": "ふつう"
  },
  {
    "id": "21-4",
    "unitNumber": 21,
    "subNumber": 4,
    "title": "アプリの窓クイズ",
    "description": "tkinter（アプリの窓）のきまりを、クイズでたしかめよう",
    "difficulty": "ふつう"
  },
  {
    "id": "21-5",
    "unitNumber": 21,
    "subNumber": 5,
    "title": "画像クイズ",
    "description": "Pillow で白黒やモザイクにするしくみを、クイズでたしかめよう",
    "difficulty": "ふつう"
  }
];

export const naviMissions: Record<string, Mission[]> = {
  "21-1": [
    {
      "id": 1,
      "title": "つぶやきの文字数を数えよう",
      "description": "tweet の文字数を表示しよう",
      "prefixCode": "tweet = \"今日はいい天気\"",
      "expectedOutput": "7",
      "correctCode": "print(len(tweet))",
      "explanation": "「今日はいい天気」は7文字。len( ) は文字の数を数えてくれるよ！",
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
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "tweet",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "str",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 2,
      "title": "名前の文字数",
      "description": "name の文字数を表示しよう",
      "prefixCode": "name = \"そうた\"",
      "expectedOutput": "3",
      "correctCode": "print(len(name))",
      "explanation": "「そうた」は3文字だね。",
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
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "name",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "max",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 3,
      "title": "英語の文字数",
      "description": "word の文字数を表示しよう",
      "prefixCode": "word = \"Python\"",
      "expectedOutput": "6",
      "correctCode": "print(len(word))",
      "explanation": "P・y・t・h・o・n の6文字。英語も1文字ずつ数えるよ。",
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
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "word",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "sum",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 4,
      "title": "1文字目を取り出そう",
      "description": "word の1文字目を表示しよう（番号は0から）",
      "prefixCode": "word = \"Python\"",
      "expectedOutput": "P",
      "correctCode": "print(word[0])",
      "explanation": "文字の番号は 0 から始まるよ。word[0] は1文字目の P！",
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
          "text": "word",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b3",
          "text": "[",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "0",
          "type": "number",
          "color": "bg-blue-200"
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
          "text": "1",
          "type": "number",
          "color": "bg-blue-200"
        }
      ]
    },
    {
      "id": 5,
      "title": "前から2文字",
      "description": "word の前から2文字を表示しよう",
      "prefixCode": "word = \"Python\"",
      "expectedOutput": "Py",
      "correctCode": "print(word[0:2])",
      "explanation": "[0:2] は「0番から、2番の手前まで」。だから P と y の2文字だよ。",
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
          "text": "word",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b3",
          "text": "[",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "0",
          "type": "number",
          "color": "bg-blue-200"
        },
        {
          "id": "b5",
          "text": ":",
          "type": "operator",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "2",
          "type": "number",
          "color": "bg-blue-200"
        },
        {
          "id": "b7",
          "text": "]",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "3",
          "type": "number",
          "color": "bg-blue-200"
        }
      ]
    },
    {
      "id": 6,
      "title": "あいさつの後ろ半分",
      "description": "aisatsu の「私は瞳です。」の部分を表示しよう",
      "prefixCode": "aisatsu = \"こんにちは、私は瞳です。\"",
      "expectedOutput": "私は瞳です。",
      "correctCode": "print(aisatsu[6:12])",
      "explanation": "「こんにちは、」が6文字（0〜5番）。6番から12番の手前までが「私は瞳です。」だね。",
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
          "text": "aisatsu",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b3",
          "text": "[",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "6",
          "type": "number",
          "color": "bg-blue-200"
        },
        {
          "id": "b5",
          "text": ":",
          "type": "operator",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "12",
          "type": "number",
          "color": "bg-blue-200"
        },
        {
          "id": "b7",
          "text": "]",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "5",
          "type": "number",
          "color": "bg-blue-200"
        }
      ]
    },
    {
      "id": 7,
      "title": "前から6文字",
      "description": "aisatsu の前から6文字を表示しよう",
      "prefixCode": "aisatsu = \"こんにちは、私は瞳です。\"",
      "expectedOutput": "こんにちは、",
      "correctCode": "print(aisatsu[:6])",
      "explanation": "[:6] のように前の数を書かないと「はじめから」という意味になるよ。",
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
          "text": "aisatsu",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b3",
          "text": "[",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": ":",
          "type": "operator",
          "color": "bg-gray-200"
        },
        {
          "id": "b5",
          "text": "6",
          "type": "number",
          "color": "bg-blue-200"
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
          "text": "-6",
          "type": "number",
          "color": "bg-blue-200"
        }
      ]
    },
    {
      "id": 8,
      "title": "後ろから6文字",
      "description": "aisatsu の後ろから6文字を表示しよう",
      "prefixCode": "aisatsu = \"こんにちは、私は瞳です。\"",
      "expectedOutput": "私は瞳です。",
      "correctCode": "print(aisatsu[-6:])",
      "explanation": "マイナスの番号は後ろから数えるよ。[-6:] は「後ろから6文字め から 最後まで」。",
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
          "text": "aisatsu",
          "type": "variable",
          "color": "bg-red-200"
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
          "color": "bg-blue-200"
        },
        {
          "id": "b5",
          "text": ":",
          "type": "operator",
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
          "color": "bg-blue-200"
        }
      ]
    },
    {
      "id": 9,
      "title": "つぶやきの最後の4文字",
      "description": "tweet の最後の4文字を表示しよう",
      "prefixCode": "tweet = \"Pythonたのしい\"",
      "expectedOutput": "たのしい",
      "correctCode": "print(tweet[-4:])",
      "explanation": "[-4:] で後ろから4文字。「たのしい」だね！",
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
          "text": "tweet",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b3",
          "text": "[",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "-4",
          "type": "number",
          "color": "bg-blue-200"
        },
        {
          "id": "b5",
          "text": ":",
          "type": "operator",
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
          "text": "4",
          "type": "number",
          "color": "bg-blue-200"
        }
      ]
    },
    {
      "id": 10,
      "title": "まとめ：文字数を知らせよう",
      "description": "「文字数は 6」と表示しよう",
      "prefixCode": "tweet = \"あしたは遠足\"",
      "expectedOutput": "文字数は 6",
      "correctCode": "print(\"文字数は\", len(tweet))",
      "explanation": "カンマで区切ると、文字と数をならべて表示できるね。つぶやきアプリの文字数チェックのもとになるよ！",
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
          "text": "\"文字数は\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": ",",
          "type": "operator",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "len",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b5",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "tweet",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b7",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "+",
          "type": "operator",
          "color": "bg-gray-200"
        }
      ]
    }
  ],
  "21-2": [
    {
      "id": 1,
      "title": "点数の合計",
      "description": "scores の合計を表示しよう",
      "prefixCode": "scores = [80, 65, 92, 70]",
      "expectedOutput": "307",
      "correctCode": "print(sum(scores))",
      "explanation": "sum( ) はリストの数をぜんぶ足してくれるよ。80+65+92+70=307！",
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
          "text": "sum",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "scores",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "max",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 2,
      "title": "いちばん高い点",
      "description": "scores の最高点を表示しよう",
      "prefixCode": "scores = [80, 65, 92, 70]",
      "expectedOutput": "92",
      "correctCode": "print(max(scores))",
      "explanation": "max( ) はいちばん大きい数を見つけてくれるよ。",
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
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "scores",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "min",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 3,
      "title": "いちばん低い点",
      "description": "scores の最低点を表示しよう",
      "prefixCode": "scores = [80, 65, 92, 70]",
      "expectedOutput": "65",
      "correctCode": "print(min(scores))",
      "explanation": "min( ) はいちばん小さい数だね。",
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
          "text": "min",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "scores",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "max",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 4,
      "title": "テストの数",
      "description": "scores にいくつ点数が入っているか表示しよう",
      "prefixCode": "scores = [80, 65, 92, 70]",
      "expectedOutput": "4",
      "correctCode": "print(len(scores))",
      "explanation": "len( ) はリストの中の数（要素の数）を数えるよ。文字のときと同じだね。",
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
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "scores",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "sum",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 5,
      "title": "小さい順にならべよう",
      "description": "scores を小さい順にならべて表示しよう",
      "prefixCode": "scores = [80, 65, 92, 70]",
      "expectedOutput": "[65, 70, 80, 92]",
      "correctCode": "print(sorted(scores))",
      "explanation": "sorted( ) は小さい順にならべかえたリストを作ってくれるよ。",
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
          "text": "sorted",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "scores",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "max",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 6,
      "title": "お買いものの合計",
      "description": "prices の合計金額を表示しよう",
      "prefixCode": "prices = [120, 300, 150]",
      "expectedOutput": "570",
      "correctCode": "print(sum(prices))",
      "explanation": "120+300+150=570円。sum( ) はお金の計算にも使えるね。",
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
          "text": "sum",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "prices",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "len",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 7,
      "title": "いちばん高い人",
      "description": "heights の中でいちばん高い身長を表示しよう",
      "prefixCode": "heights = [132, 128, 140, 125]",
      "expectedOutput": "140",
      "correctCode": "print(max(heights))",
      "explanation": "身長のリストでも max( ) が使えるね。",
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
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "heights",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "min",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 8,
      "title": "いちばん速いタイム",
      "description": "times の中でいちばん小さいタイムを表示しよう",
      "prefixCode": "times = [52, 48, 50]",
      "expectedOutput": "48",
      "correctCode": "print(min(times))",
      "explanation": "タイムは小さいほど速いから min( ) を使うよ。",
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
          "text": "min",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "times",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "max",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 9,
      "title": "ことばをならべよう",
      "description": "words をあいうえお順にならべて表示しよう",
      "prefixCode": "words = [\"みかん\", \"いちご\", \"りんご\"]",
      "expectedOutput": "['いちご', 'みかん', 'りんご']",
      "correctCode": "print(sorted(words))",
      "explanation": "sorted( ) は文字のリストなら、あいうえお順にならべてくれるよ。",
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
          "text": "sorted",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "words",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b5",
          "text": ")",
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
          "text": "sum",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    },
    {
      "id": 10,
      "title": "まとめ：合計と最高点",
      "description": "「合計 307 最高 92」と表示しよう",
      "prefixCode": "scores = [80, 65, 92, 70]",
      "expectedOutput": "合計 307 最高 92",
      "correctCode": "print(\"合計\", sum(scores), \"最高\", max(scores))",
      "explanation": "sum と max をいっしょに使えたね。自分の点数でもためしてみよう！",
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
          "text": "\"合計\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b3",
          "text": ",",
          "type": "operator",
          "color": "bg-gray-200"
        },
        {
          "id": "b4",
          "text": "sum",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b5",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b6",
          "text": "scores",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b7",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b8",
          "text": ",",
          "type": "operator",
          "color": "bg-gray-200"
        },
        {
          "id": "b9",
          "text": "\"最高\"",
          "type": "string",
          "color": "bg-green-200"
        },
        {
          "id": "b10",
          "text": ",",
          "type": "operator",
          "color": "bg-gray-200"
        },
        {
          "id": "b11",
          "text": "max",
          "type": "function",
          "color": "bg-green-200"
        },
        {
          "id": "b12",
          "text": "(",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b13",
          "text": "scores",
          "type": "variable",
          "color": "bg-red-200"
        },
        {
          "id": "b14",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b15",
          "text": ")",
          "type": "bracket",
          "color": "bg-gray-200"
        },
        {
          "id": "b16",
          "text": "min",
          "type": "function",
          "color": "bg-green-200"
        }
      ]
    }
  ],
  "21-3": [
    {
      "id": 1,
      "title": "クイズ1",
      "description": "このコードで、表示されない数はどれ？",
      "type": "quiz",
      "choices": [
        "2",
        "3",
        "4",
        "1"
      ],
      "correctAnswer": 2,
      "expectedOutput": "4",
      "explanation": "randint(1, 3) は 1・2・3 のどれか。さいごの 3 も入るけど、4 は出ないよ。",
      "availableBlocks": [],
      "codeToRead": "import random\nprint(random.randint(1, 3))"
    },
    {
      "id": 2,
      "title": "クイズ2",
      "description": "random.choice( ) は何をする？",
      "type": "quiz",
      "choices": [
        "いつも大吉を出す",
        "リストからどれか1つをえらぶ",
        "リストをならべかえる",
        "エラーになる"
      ],
      "correctAnswer": 1,
      "expectedOutput": "リストからどれか1つをえらぶ",
      "explanation": "choice は「えらぶ」という意味。リストの中からランダムに1つえらんでくれるよ。",
      "availableBlocks": [],
      "codeToRead": "import random\nkuji = [\"大吉\", \"中吉\", \"小吉\"]\nprint(random.choice(kuji))"
    },
    {
      "id": 3,
      "title": "クイズ3",
      "description": "random を使う前に、さいしょに書く1行はどれ？",
      "type": "quiz",
      "choices": [
        "import random",
        "print(random)",
        "random = 1",
        "def random():"
      ],
      "correctAnswer": 0,
      "expectedOutput": "import random",
      "explanation": "import random で、ランダムの道具を借りてこられるよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "クイズ4",
      "description": "input( ) で入れた 7 は、どんな種類のデータになる？",
      "type": "quiz",
      "choices": [
        "小数（float）",
        "リスト",
        "数（int）",
        "文字（str）"
      ],
      "correctAnswer": 3,
      "expectedOutput": "文字（str）",
      "explanation": "input( ) で入れたものは、数に見えても文字（str）なんだ。",
      "availableBlocks": [],
      "codeToRead": "kotae = input(\"すきな数は？\")"
    },
    {
      "id": 5,
      "title": "クイズ5",
      "description": "このコードを実行すると何が表示される？",
      "type": "quiz",
      "choices": [
        "エラー",
        "True",
        "False",
        "8"
      ],
      "correctAnswer": 2,
      "expectedOutput": "False",
      "explanation": "\"8\" は文字、8 は数。種類がちがうので == は False になるよ。",
      "availableBlocks": [],
      "codeToRead": "print(\"8\" == 8)"
    },
    {
      "id": 6,
      "title": "クイズ6",
      "description": "入れた数に 5 を足したい。どう書けばいい？",
      "type": "quiz",
      "choices": [
        "print(input(\"数は？\") + 5)",
        "print(int(input(\"数は？\")) + 5)",
        "print(str(input(\"数は？\")) + 5)",
        "print(\"input\" + 5)"
      ],
      "correctAnswer": 1,
      "expectedOutput": "print(int(input(\"数は？\")) + 5)",
      "explanation": "int( ) で文字を数にしてから足すよ。int(input( )) の形をおぼえよう。",
      "availableBlocks": []
    },
    {
      "id": 7,
      "title": "クイズ7",
      "description": "足し算アプリで、正しい答えを入れたのに「不正解」になった。どこを直す？",
      "type": "quiz",
      "choices": [
        "if kotae == a + b: を int(kotae) == a + b にする",
        "print(\"正解\") の行",
        "else: の行",
        "a = 3 の行"
      ],
      "correctAnswer": 0,
      "expectedOutput": "if kotae == a + b: を int(kotae) == a + b にする",
      "explanation": "kotae は文字なので、int( ) で数にしてからくらべると正しく判定できるよ。",
      "availableBlocks": [],
      "codeToRead": "a = 3\nb = 4\nkotae = input(\"3 + 4 = \")\nif kotae == a + b:\n    print(\"正解\")\nelse:\n    print(\"不正解\")"
    },
    {
      "id": 8,
      "title": "クイズ8",
      "description": "random.randint(1, 10) で出る数はどれ？",
      "type": "quiz",
      "choices": [
        "0〜10",
        "0〜9",
        "1〜9",
        "1〜10"
      ],
      "correctAnswer": 3,
      "expectedOutput": "1〜10",
      "explanation": "randint は、さいしょの数とさいごの数のどちらも入るよ。だから 1〜10。",
      "availableBlocks": []
    },
    {
      "id": 9,
      "title": "クイズ9",
      "description": "このコードで、入れた名前を使ってあいさつしたい。表示は？（名前に「ゆい」と入れた）",
      "type": "quiz",
      "choices": [
        "エラー",
        "こんにちは name",
        "こんにちは ゆい",
        "こんにちはゆい"
      ],
      "correctAnswer": 2,
      "expectedOutput": "こんにちは ゆい",
      "explanation": "name には入れた「ゆい」が入る。カンマで区切ると、あいだにスペースが入るよ。",
      "availableBlocks": [],
      "codeToRead": "name = input(\"名前は？\")\nprint(\"こんにちは\", name)"
    },
    {
      "id": 10,
      "title": "クイズ10",
      "description": "このコードを実行すると何が表示される？",
      "type": "quiz",
      "choices": [
        "121",
        "13",
        "12 + 1",
        "エラー"
      ],
      "correctAnswer": 1,
      "expectedOutput": "13",
      "explanation": "int(\"12\") で数の 12 になり、1 を足して 13 だね。",
      "availableBlocks": [],
      "codeToRead": "kotae = \"12\"\nprint(int(kotae) + 1)"
    }
  ],
  "21-4": [
    {
      "id": 1,
      "title": "クイズ1",
      "description": "root.geometry(\"200x100\") の 200 は何？",
      "type": "quiz",
      "choices": [
        "窓のたての長さ",
        "文字の大きさ",
        "ボタンの数",
        "窓のよこの長さ"
      ],
      "correctAnswer": 3,
      "expectedOutput": "窓のよこの長さ",
      "explanation": "\"よこ x たて\" の順。200 がよこ、100 がたてだよ。",
      "availableBlocks": [],
      "codeToRead": "root = tk.Tk()\nroot.geometry(\"200x100\")"
    },
    {
      "id": 2,
      "title": "クイズ2",
      "description": "Label を作ったのに、窓に出てこない。たりないのはどれ？",
      "type": "quiz",
      "choices": [
        "lbl = 0",
        "tk.Label()",
        "lbl.pack()",
        "print(lbl)"
      ],
      "correctAnswer": 2,
      "expectedOutput": "lbl.pack()",
      "explanation": "作っただけでは窓に出ないよ。pack( ) で窓にならべると見えるようになる。",
      "availableBlocks": [],
      "codeToRead": "lbl = tk.Label(text=\"ラベル\")"
    },
    {
      "id": 3,
      "title": "クイズ3",
      "description": "ボタンを押したら change_label を動かしたい。正しい書き方は？",
      "type": "quiz",
      "choices": [
        "tk.Button(command=\"change_label\")",
        "tk.Button(text=\"プッシュ\", command=change_label)",
        "tk.Button(text=\"プッシュ\", command=change_label())",
        "tk.Button(text=\"プッシュ\", change_label)"
      ],
      "correctAnswer": 1,
      "expectedOutput": "tk.Button(text=\"プッシュ\", command=change_label)",
      "explanation": "command= には関数の名前だけを書くよ。( ) をつけると、押す前に動いてしまう。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "クイズ4",
      "description": "ラベルの文字を「こんにちは」に変えるのはどれ？",
      "type": "quiz",
      "choices": [
        "lbl.config(text=\"こんにちは\")",
        "lbl = \"こんにちは\"",
        "print(\"こんにちは\")",
        "lbl.pack(\"こんにちは\")"
      ],
      "correctAnswer": 0,
      "expectedOutput": "lbl.config(text=\"こんにちは\")",
      "explanation": "config(text=...) で、ラベルの文字をあとから変えられるよ。",
      "availableBlocks": []
    },
    {
      "id": 5,
      "title": "クイズ5",
      "description": "mainloop( ) はどこに書く？",
      "type": "quiz",
      "choices": [
        "いちばん最初",
        "Label の前",
        "どこでもいい",
        "いちばん最後"
      ],
      "correctAnswer": 3,
      "expectedOutput": "いちばん最後",
      "explanation": "mainloop( ) は「窓を開いて待つ」合図。部品をぜんぶ作ってから、最後に書くよ。",
      "availableBlocks": []
    },
    {
      "id": 6,
      "title": "クイズ6",
      "description": "tkinter を tk という短い名前で使うための1行はどれ？",
      "type": "quiz",
      "choices": [
        "tkinter = tk",
        "from tk import tkinter",
        "import tkinter as tk",
        "import tk"
      ],
      "correctAnswer": 2,
      "expectedOutput": "import tkinter as tk",
      "explanation": "as tk をつけると、tkinter を tk と書けるようになるよ。",
      "availableBlocks": []
    },
    {
      "id": 7,
      "title": "クイズ7",
      "description": "窓のタイトルを「おみくじ」にするのはどれ？",
      "type": "quiz",
      "choices": [
        "print(\"おみくじ\")",
        "root.title(\"おみくじ\")",
        "root.geometry(\"おみくじ\")",
        "tk.Label(text=\"おみくじ\")"
      ],
      "correctAnswer": 1,
      "expectedOutput": "root.title(\"おみくじ\")",
      "explanation": "title( ) で窓の上に出る名前を決められるよ。",
      "availableBlocks": []
    },
    {
      "id": 8,
      "title": "クイズ8",
      "description": "このコードで、ボタンには何と書いてある？",
      "type": "quiz",
      "choices": [
        "うらなう",
        "uranau",
        "btn",
        "command"
      ],
      "correctAnswer": 0,
      "expectedOutput": "うらなう",
      "explanation": "text= に書いた文字がボタンに出るよ。uranau は押したときに動く関数の名前。",
      "availableBlocks": [],
      "codeToRead": "btn = tk.Button(text=\"うらなう\", command=uranau)\nbtn.pack()"
    },
    {
      "id": 9,
      "title": "クイズ9",
      "description": "ボタンを押すたびに、ちがうくじを出したい。関数の中で使うのはどれ？",
      "type": "quiz",
      "choices": [
        "kuji[0]",
        "len(kuji)",
        "sorted(kuji)",
        "random.choice(kuji)"
      ],
      "correctAnswer": 3,
      "expectedOutput": "random.choice(kuji)",
      "explanation": "random.choice で毎回ランダムにえらぶと、押すたびに結果が変わるよ。",
      "availableBlocks": []
    },
    {
      "id": 10,
      "title": "クイズ10",
      "description": "Label と Button を作って pack( ) した。窓の中で上に出るのは？",
      "type": "quiz",
      "choices": [
        "ならばない",
        "エラー",
        "ラベル",
        "プッシュ"
      ],
      "correctAnswer": 2,
      "expectedOutput": "ラベル",
      "explanation": "pack( ) は、先に書いたものから上にならべていくよ。",
      "availableBlocks": [],
      "codeToRead": "lbl = tk.Label(text=\"ラベル\")\nbtn = tk.Button(text=\"プッシュ\")\nlbl.pack()\nbtn.pack()"
    }
  ],
  "21-5": [
    {
      "id": 1,
      "title": "クイズ1",
      "description": "newImage = img.convert(\"L\") をすると、画像はどうなる？",
      "type": "quiz",
      "choices": [
        "白黒になる",
        "大きくなる",
        "モザイクになる",
        "消える"
      ],
      "correctAnswer": 0,
      "expectedOutput": "白黒になる",
      "explanation": "\"L\" は白黒（明るさだけ）のこと。convert(\"L\") で白黒の画像になるよ。",
      "availableBlocks": []
    },
    {
      "id": 2,
      "title": "クイズ2",
      "description": "モザイクにするには、どうすればいい？",
      "type": "quiz",
      "choices": [
        "白黒にする",
        "上下を入れかえる",
        "色をこくする",
        "小さくしてから、もとの大きさにもどす"
      ],
      "correctAnswer": 3,
      "expectedOutput": "小さくしてから、もとの大きさにもどす",
      "explanation": "一度うんと小さくして、また大きくすると、細かいところが四角くなってモザイクになるよ。",
      "availableBlocks": []
    },
    {
      "id": 3,
      "title": "クイズ3",
      "description": "resize((32, 32)) の 32 を 16 にすると、モザイクはどうなる？",
      "type": "quiz",
      "choices": [
        "変わらない",
        "白黒になる",
        "四角が大きく、あらくなる",
        "四角が小さく、細かくなる"
      ],
      "correctAnswer": 2,
      "expectedOutput": "四角が大きく、あらくなる",
      "explanation": "小さくするほど、もどしたときの四角は大きくなる。だから 16 のほうがあらいモザイクだよ。",
      "availableBlocks": []
    },
    {
      "id": 4,
      "title": "クイズ4",
      "description": "Pillow のような、あとから足して使う道具のまとまりを何という？",
      "type": "quiz",
      "choices": [
        "コメント",
        "外部ライブラリ",
        "変数",
        "リスト"
      ],
      "correctAnswer": 1,
      "expectedOutput": "外部ライブラリ",
      "explanation": "Python に最初から入っていない道具を外部ライブラリというよ。このアプリには Pillow が入っている。",
      "availableBlocks": []
    },
    {
      "id": 5,
      "title": "クイズ5",
      "description": "コードの中の # のあとに書いた文字は？",
      "type": "quiz",
      "choices": [
        "メモ（実行されない）",
        "エラーになる",
        "画面に表示される",
        "変数になる"
      ],
      "correctAnswer": 0,
      "expectedOutput": "メモ（実行されない）",
      "explanation": "# のあとはメモ（コメント）。プログラムは読みとばすので、自由に説明を書けるよ。",
      "availableBlocks": [],
      "codeToRead": "# ここで画像を開く\nimg = PIL.Image.open(path)"
    },
    {
      "id": 6,
      "title": "クイズ6",
      "description": "(300, 300) のようにカッコで2つの数をまとめたものは、何を表している？",
      "type": "quiz",
      "choices": [
        "色",
        "ファイルの名前",
        "回数",
        "よことたての大きさ"
      ],
      "correctAnswer": 3,
      "expectedOutput": "よことたての大きさ",
      "explanation": "(よこ, たて) の大きさだよ。カッコでまとめたものは、あとのタプルの回でくわしく習うよ。",
      "availableBlocks": [],
      "codeToRead": "img = img.resize((300, 300))"
    },
    {
      "id": 7,
      "title": "クイズ7",
      "description": "画像ファイルを開くのはどれ？",
      "type": "quiz",
      "choices": [
        "tk.Label(path)",
        "path.pack()",
        "PIL.Image.open(path)",
        "print(path)"
      ],
      "correctAnswer": 2,
      "expectedOutput": "PIL.Image.open(path)",
      "explanation": "Image.open( ) で画像ファイルを開いて、プログラムで使えるようにするよ。",
      "availableBlocks": []
    },
    {
      "id": 8,
      "title": "クイズ8",
      "description": "画像を窓に出すために、ImageTk.PhotoImage( ) をするのはなぜ？",
      "type": "quiz",
      "choices": [
        "小さくするため",
        "tkinter で表示できる形にするため",
        "白黒にするため",
        "保存するため"
      ],
      "correctAnswer": 1,
      "expectedOutput": "tkinter で表示できる形にするため",
      "explanation": "Pillow の画像を、tkinter のラベルに出せる形にかえているんだ。",
      "availableBlocks": []
    },
    {
      "id": 9,
      "title": "クイズ9",
      "description": "白黒にしてからモザイクにしたい。正しい順番は？",
      "type": "quiz",
      "choices": [
        "convert(\"L\") → 小さく → もとの大きさ",
        "もとの大きさ → convert(\"L\") → 小さく",
        "小さく → 保存 → 開く",
        "順番は関係ない"
      ],
      "correctAnswer": 0,
      "expectedOutput": "convert(\"L\") → 小さく → もとの大きさ",
      "explanation": "白黒にしてから小さく→大きくすると、白黒のモザイクになるよ。",
      "availableBlocks": []
    },
    {
      "id": 10,
      "title": "クイズ10",
      "description": "「ファイルを開く」ボタンを押したときに画像を選ぶ画面を出すのはどれ？",
      "type": "quiz",
      "choices": [
        "random.choice()",
        "len()",
        "root.title()",
        "filedialog.askopenfilename()"
      ],
      "correctAnswer": 3,
      "expectedOutput": "filedialog.askopenfilename()",
      "explanation": "askopenfilename( ) でファイルを選ぶ画面が出るよ。このアプリでは見本の画像を選べる。",
      "availableBlocks": []
    }
  ]
};

export const naviTutorials: LessonTutorial[] = [
  {
    "lessonId": "21-1",
    "characterName": "コーディ",
    "characterEmoji": "🐍",
    "characterImage": "/images/characters/cody.png",
    "slides": [
      {
        "title": "文字数を数えよう",
        "content": "len( ) のカッコに文字を入れると、何文字あるか数えてくれます。つぶやきアプリの文字数チェックに使えます。",
        "characterMessage": "len は length（長さ）の略だよ！",
        "codeExample": {
          "good": "tweet = \"今日はいい天気\"\nprint(len(tweet))  # 7"
        }
      },
      {
        "title": "文字には番号がある",
        "content": "文字には 0 から順に番号がついています。word[0] で1文字目を取り出せます。",
        "characterMessage": "番号は 0 から始まるのがポイント！",
        "codeExample": {
          "good": "word = \"Python\"\nprint(word[0])  # P"
        }
      },
      {
        "title": "一部を取り出そう",
        "content": "[はじめ:おわり] で、はじめの番号から、おわりの番号の手前までを取り出せます。はじめを書かないと「最初から」、おわりを書かないと「最後まで」です。",
        "characterMessage": "[0:2] は 0番と1番の2文字だよ",
        "codeExample": {
          "good": "word = \"Python\"\nprint(word[0:2])  # Py\nprint(word[:2])   # Py"
        }
      },
      {
        "title": "後ろから数えよう",
        "content": "マイナスの番号は後ろから数えます。[-6:] は後ろから6文字めから最後までです。",
        "characterMessage": "動画 #7 のあいさつでためしてみよう！",
        "codeExample": {
          "good": "aisatsu = \"こんにちは、私は瞳です。\"\nprint(aisatsu[-6:])  # 私は瞳です。"
        }
      }
    ]
  },
  {
    "lessonId": "21-2",
    "characterName": "アリー",
    "characterEmoji": "🐜",
    "characterImage": "/images/characters/ari.png",
    "slides": [
      {
        "title": "合計を出そう",
        "content": "sum( ) はリストの数をぜんぶ足してくれます。",
        "characterMessage": "テストの合計点もすぐ出せるよ！",
        "codeExample": {
          "good": "scores = [80, 65, 92, 70]\nprint(sum(scores))  # 307"
        }
      },
      {
        "title": "いちばん大きい・小さい",
        "content": "max( ) はいちばん大きい数、min( ) はいちばん小さい数を見つけます。",
        "characterMessage": "最高点と最低点だね",
        "codeExample": {
          "good": "print(max(scores))  # 92\nprint(min(scores))  # 65"
        }
      },
      {
        "title": "数とならべかえ",
        "content": "len( ) はリストの中の数、sorted( ) は小さい順にならべたリストを作ります。",
        "characterMessage": "文字のリストなら、あいうえお順になるよ",
        "codeExample": {
          "good": "print(len(scores))     # 4\nprint(sorted(scores))  # [65, 70, 80, 92]"
        }
      },
      {
        "title": "動画 #11 とつながる",
        "content": "動画 #11 で使った道具を、ブロックでもう一度ためしてみましょう。",
        "characterMessage": "自分の点数でもやってみよう！"
      }
    ]
  },
  {
    "lessonId": "21-3",
    "characterName": "リコ",
    "characterEmoji": "🐭",
    "characterImage": "/images/characters/rico.png",
    "slides": [
      {
        "title": "ランダムの道具",
        "content": "import random で道具を借りると、randint(1, 3) で 1〜3 のどれか、choice(リスト) でリストのどれか1つが出ます。",
        "characterMessage": "おみくじアプリで使ったね！",
        "codeExample": {
          "good": "import random\nprint(random.randint(1, 3))\nprint(random.choice([\"大吉\", \"中吉\", \"小吉\"]))"
        }
      },
      {
        "title": "input の答えは文字",
        "content": "input( ) で入れたものは、数に見えても文字（str）です。数として使うときは int( ) で数にします。",
        "characterMessage": "\"8\" と 8 はちがうものだよ",
        "codeExample": {
          "good": "kotae = input(\"すきな数は？\")\nprint(int(kotae) + 5)"
        }
      },
      {
        "title": "クイズに答えよう",
        "content": "コードを読んで、何が起きるかを考えてみましょう。",
        "characterMessage": "わからなくなったら、エディターでためしてもいいよ"
      }
    ]
  },
  {
    "lessonId": "21-4",
    "characterName": "デックス",
    "characterEmoji": "🤖",
    "characterImage": "/images/characters/dex.png",
    "slides": [
      {
        "title": "窓を作る",
        "content": "import tkinter as tk のあと、tk.Tk( ) で窓を作り、geometry(\"よこxたて\") で大きさを決めます。最後に mainloop( ) で窓を開きます。",
        "characterMessage": "このアプリでは「アプリの窓」に出るよ",
        "codeExample": {
          "good": "import tkinter as tk\nroot = tk.Tk()\nroot.geometry(\"200x100\")\ntk.mainloop()"
        }
      },
      {
        "title": "部品をならべる",
        "content": "Label（文字）や Button（ボタン）を作ったら、pack( ) で窓にならべます。",
        "characterMessage": "pack しないと見えないよ！",
        "codeExample": {
          "good": "lbl = tk.Label(text=\"ラベル\")\nlbl.pack()"
        }
      },
      {
        "title": "ボタンで動かす",
        "content": "command= に関数の名前を書くと、ボタンを押したときにその関数が動きます。( ) はつけません。",
        "characterMessage": "config(text=...) で文字を変えられるよ",
        "codeExample": {
          "good": "def change_label():\n    lbl.config(text=\"こんにちは\")\nbtn = tk.Button(text=\"プッシュ\", command=change_label)"
        }
      }
    ]
  },
  {
    "lessonId": "21-5",
    "characterName": "ニコ",
    "characterEmoji": "🐱",
    "characterImage": "/images/characters/chef-cat.png",
    "slides": [
      {
        "title": "外部ライブラリ",
        "content": "Pillow のように、あとから足して使う道具のまとまりを外部ライブラリといいます。このアプリには最初から入っています。",
        "characterMessage": "動画の pip の場面は飛ばして大丈夫！"
      },
      {
        "title": "白黒にする",
        "content": "convert(\"L\") で、画像を白黒（明るさだけ）にできます。",
        "characterMessage": "L は明るさのことだよ",
        "codeExample": {
          "good": "newImage = img.convert(\"L\")"
        }
      },
      {
        "title": "モザイクにする",
        "content": "一度うんと小さくしてから、もとの大きさにもどすとモザイクになります。小さくするほど、あらいモザイクです。",
        "characterMessage": "数を変えてためしてみよう",
        "codeExample": {
          "good": "small = img.resize((32, 32))\nnewImage = small.resize((300, 300), resample=0)"
        }
      }
    ]
  }
];
