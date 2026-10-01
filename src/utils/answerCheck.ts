import { Mission, CodeRule } from "@/types";

/**
 * 解答の判定。レッスン／復習／デイリーチャレンジの3画面が共通で使う。
 *
 * 「出力が一致していれば正解」だけだと、そのレッスンで学ぶ文法を
 * 一切使わない答えが通ってしまう（例: for文のレッスンで print を並べる、
 * return のレッスンで値を直接 print する）。
 * そこで出力一致に加えて、コードの構造もチェックする。
 */

export type CheckResult = {
  correct: boolean;
  /** 不正解のときに表示するメッセージ */
  message?: string;
};

/**
 * レッスン単位の既定ルール。
 * ミッション個別の `rules` が定義されていればそちらが優先される。
 */
const LESSON_RULES: Record<string, CodeRule[]> = {
  "1-1": [{ requires: ["print("], message: "print()を使って表示してね！" }],
  "1-2": [{ requires: ["print("], message: "print()を使って表示してね！" }],
  "1-3": [
    {
      requiresAny: ["+", "-", "*", "/"],
      message: "答えを直接書くのではなく、計算の式（+ − * /）を書いてね！",
    },
  ],
  "1-4": [{ requires: ["+"], message: "「+」を使って文字列をつなげてね！" }],
  "1-5": [
    {
      requiresPattern: "[\"'][^\"']*[\"']\\s*\\*\\s*\\d+|\\d+\\s*\\*\\s*[\"'][^\"']*[\"']",
      message: '文字列と「*」と数字を使って繰り返してね！例: "Hi" * 3',
    },
  ],
  "1-6": [{ requires: ["%"], message: "「%」を使って余りを求めてね！" }],
  "1-7": [
    { requires: [","], message: "カンマ（,）で区切って複数の値を表示してね！" },
  ],

  "3-2": [
    { requires: ["type("], message: "type()を使ってデータの型を調べてね！" },
  ],

  "4-1": [{ requires: ["if "], message: "if文を使って条件分岐を書こう！" }],
  "4-2": [
    {
      requiresAny: ["==", "!=", "<=", ">=", "<", ">"],
      message: "比較演算子（==, !=, <, >, <=, >=）を使って条件を書こう！",
    },
  ],
  "4-3": [
    { requires: ["if "], message: "if文を使って条件分岐を書こう！" },
    { requires: ["else:"], message: "elseを使ってどちらの場合も書こう！" },
    { requires: ["\n"], message: "↵（エンター）ブロックを使って改行しよう！" },
  ],
  "4-4": [
    { requires: ["elif "], message: "elifを使って複数の条件を書こう！" },
    {
      requires: ["else:"],
      message: "elseを使ってどれにも当てはまらない場合を書こう！",
    },
  ],
  "4-5": [
    {
      requiresAny: [" and ", " or ", "not "],
      message: "論理演算子（and, or, not）を使って条件を組み合わせよう！",
    },
  ],

  "5-1": [
    { requires: ["for "], message: "for文を使って繰り返しを書こう！" },
    { requires: ["range("], message: "range()で繰り返す回数を指定しよう！" },
  ],
  "5-2": [
    {
      requires: ["for "],
      message: "print()を並べるのではなく、for文で繰り返そう！",
    },
    { requires: ["range("], message: "range()で繰り返す回数を指定しよう！" },
  ],
  "5-3": [
    {
      requires: ["for "],
      message: "print()を並べるのではなく、for文で繰り返そう！",
    },
    { requires: ["range("], message: "range()で繰り返す回数を指定しよう！" },
    { requires: ["i"], message: "ループ変数 i を使って出力しよう！" },
  ],
  "5-4": [
    { requires: ["for "], message: "for文を使って繰り返し計算しよう！" },
    { requires: ["range("], message: "range()で繰り返す回数を指定しよう！" },
    {
      requires: ["total ="],
      message: "答えを直接書くのではなく、total に足していこう！",
    },
  ],
  "5-5": [{ requires: ["while "], message: "while文を使って繰り返しを書こう！" }],

  "6-1": [{ requires: ["["], message: "角カッコ [ ] を使ってリストを作ろう！" }],
  "6-2": [
    {
      requires: ["["],
      message: "リスト名[番号] の形で、インデックスを使って取り出そう！",
    },
  ],
  "6-3": [
    { requires: [".append("], message: "append()を使って追加してね！" },
  ],
  "6-4": [{ requires: ["len("], message: "len()を使って長さを調べてね！" }],
  "6-5": [
    { requires: ["for "], message: "for文でリストの要素を順番に取り出そう！" },
    { requires: [" in "], message: "for 変数 in リスト: の形で書こう！" },
  ],

  "7-1": [
    { requires: ["def "], message: "defを使って関数を作ろう！" },
    { requires: [":"], message: "関数名()のあとにコロン「:」を付けよう！" },
    {
      requires: ["print("],
      message: "関数の中に print() を書いて、出力する処理を入れよう！",
    },
  ],
  "7-2": [{ requires: ["()"], message: "関数名()の形で呼び出そう！" }],
  "7-3": [{ requires: ["()"], message: "関数名()の形で呼び出そう！" }],
  "7-4": [{ requires: ["("], message: "関数にカッコで引数を渡して呼び出そう！" }],
  "7-5": [
    { requires: [","], message: "カンマ（,）で区切って2つの引数を渡そう！" },
  ],

  "8-1": [
    { requires: ["def "], message: "defを使って関数を作ろう！" },
    {
      requires: ["return "],
      message: "値を直接 print するのではなく、return で返す関数を作ろう！",
    },
    { requires: ["print("], message: "関数の戻り値を print() で表示しよう！" },
  ],
  "8-2": [
    {
      requires: ["="],
      message: "戻り値を変数で受け取ってね！「変数名 = 関数名()」だよ！",
    },
    { requires: ["print("], message: "受け取った変数を print() で表示しよう！" },
  ],
  "8-3": [
    {
      requires: ["="],
      message: "計算結果を変数で受け取ってね！「変数名 = 関数名(値)」だよ！",
    },
    { requires: ["print("], message: "受け取った変数を print() で表示しよう！" },
  ],
  "8-4": [
    {
      requires: ["="],
      message: "結果を変数で受け取ってね！「変数名 = 関数名(リスト)」だよ！",
    },
    { requires: ["print("], message: "受け取った変数を print() で表示しよう！" },
  ],
  "8-5": [
    { requires: ["for "], message: "for文の中で関数を呼び出そう！" },
    { requires: ["print("], message: "print()で結果を表示しよう！" },
  ],

  "9-1": [{ requires: ["{"], message: "波カッコ { } を使って辞書を作ろう！" }],
  "9-2": [
    { requires: ["{"], message: "波カッコ { } を使って辞書を作ろう！" },
    { requires: ["="], message: "辞書を変数に入れてね！" },
  ],
  "9-3": [
    {
      requires: ["["],
      message: "値を直接書くのではなく、辞書[\"キー\"] の形で取り出そう！",
    },
  ],
  "9-4": [
    { requires: ["["], message: "辞書[\"キー\"] の形で指定しよう！" },
    { requires: ["="], message: "「= 値」で追加・変更してね！" },
  ],
};

/** 文字列ルールを1件評価する */
function evaluateRule(rule: CodeRule, code: string): boolean {
  if (rule.requires && !rule.requires.every((needle) => code.includes(needle))) {
    return false;
  }
  if (rule.forbids && rule.forbids.some((needle) => code.includes(needle))) {
    return false;
  }
  if (
    rule.requiresAny &&
    !rule.requiresAny.some((needle) => code.includes(needle))
  ) {
    return false;
  }
  if (rule.requiresPattern && !new RegExp(rule.requiresPattern).test(code)) {
    return false;
  }
  return true;
}

/** 空白を潰して構造比較しやすい形にする */
function squash(code: string): string {
  return code
    .replace(/\s+/g, " ")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .trim();
}

type BranchKind = "if" | "elif" | "else";
type Branch = { kind: BranchKind; condition: string | null; print: string };

/** if / elif / else の構造を取り出す（4-4用） */
function extractBranches(code: string): Branch[] {
  const branches: Branch[] = [];

  const ifMatch = code.match(/if\s+(.+?):/);
  if (ifMatch) {
    const rest = code.substring(ifMatch.index ?? 0);
    const printMatch = rest.match(/print\s*\(\s*"([^"]*)"\s*\)/);
    branches.push({
      kind: "if",
      condition: ifMatch[1].trim().replace(/\s+/g, " "),
      print: printMatch ? printMatch[1] : "",
    });
  }

  for (const match of Array.from(code.matchAll(/elif\s+(.+?):/g))) {
    const rest = code.substring(match.index ?? 0);
    const printMatch = rest.match(/print\s*\(\s*"([^"]*)"\s*\)/);
    branches.push({
      kind: "elif",
      condition: match[1].trim().replace(/\s+/g, " "),
      print: printMatch ? printMatch[1] : "",
    });
  }

  const elseMatch = code.match(/else\s*:/);
  if (elseMatch) {
    const rest = code.substring(elseMatch.index ?? 0);
    const printMatch = rest.match(/print\s*\(\s*"([^"]*)"\s*\)/);
    branches.push({
      kind: "else",
      condition: null,
      print: printMatch ? printMatch[1] : "",
    });
  }

  return branches;
}

/** 4-4（elif）の構造チェック */
function checkElifStructure(code: string, correctCode: string): string | null {
  if (squash(code) === squash(correctCode)) return null;

  const user = extractBranches(code);
  const correct = extractBranches(correctCode);

  if (user.length !== correct.length) {
    return "elifとelseの構造が正しくありません。もう一度確認してね！";
  }

  for (let i = 0; i < correct.length; i++) {
    if (correct[i].kind !== user[i].kind) {
      return "正しい順序でelifとelseを使ってね！";
    }
    if (
      correct[i].condition &&
      user[i].condition &&
      correct[i].condition !== user[i].condition
    ) {
      return `条件式が正しくありません。「${correct[i].condition}」を使ってね！`;
    }
    // 実行されないブロックの中身も見る（そこを print 以外にしても出力は変わらないため）
    if (correct[i].print && correct[i].print !== user[i].print) {
      return `「${correct[i].print}」を print() で出力してね！`;
    }
  }
  return null;
}

/** if の条件式を論理演算子で分解する（4-5用） */
function extractCondition(
  code: string
): { op: string | null; conditions: string[] } | null {
  const match = code.match(/if\s+(.+?):/);
  if (!match) return null;
  const condition = match[1].trim();
  const parts = condition.split(/\s+(and|or)\s+/);
  const hasNot = condition.includes("not ");
  return {
    op: parts.find((p) => p === "and" || p === "or") ?? (hasNot ? "not" : null),
    conditions: parts
      .filter((_, i) => i % 2 === 0)
      .map((c) => c.trim().replace(/^not\s+/, ""))
      .sort(),
  };
}

/** 4-5（論理演算子）の構造チェック */
function checkLogicStructure(code: string, correctCode: string): string | null {
  if (squash(code) === squash(correctCode)) return null;

  const user = extractCondition(code);
  const correct = extractCondition(correctCode);
  if (!user || !correct) {
    return "if文の構造が正しくありません。もう一度確認してね！";
  }
  if (user.op !== correct.op) {
    return `正しい論理演算子（${correct.op ?? "and / or / not"}）を使ってね！`;
  }
  if (user.conditions.join("|") !== correct.conditions.join("|")) {
    return "条件式が正しくありません。もう一度確認してね！";
  }
  return null;
}

/**
 * レッスン固有の込み入ったチェック。
 * 単純な文字列ルールでは書けないものだけをここに置く。
 */
function checkLessonSpecific(
  lessonId: string,
  mission: Mission,
  code: string
): string | null {
  // 3-3: 型変換関数を使っているか（print( の中の int( を誤検出しないようマスクする）
  if (lessonId === "3-3") {
    const masked = code.replace(/print\s*\(/g, "___PRINT___(");
    const hasConversion =
      masked.includes("int(") ||
      masked.includes("str(") ||
      masked.includes("float(");
    if (!hasConversion) {
      return "int()、str()、float()のどれかを使って型を変換してね！";
    }
  }

  // 4-1〜4-4: 条件式と出力を正解コードと突き合わせる。
  // 出力一致だけだと「条件と処理を両方ひっくり返した答え」も通ってしまうため。
  if (
    (lessonId === "4-1" ||
      lessonId === "4-2" ||
      lessonId === "4-3" ||
      lessonId === "4-4") &&
    mission.correctCode
  ) {
    const structureError = checkElifStructure(code, mission.correctCode);
    if (structureError) return structureError;
    // 条件と出力が合っていても、変数に入れる値が問題文とちがうことがある
    // （例: 「x = 10 のとき」なのに x = 13 と書いても x > 5 は成り立ってしまう）
    if (squash(code) !== squash(mission.correctCode)) {
      return "変数に入れる値が問題文とちがうみたい。もう一度確認してね！";
    }
    return null;
  }
  if (lessonId === "4-5" && mission.correctCode) {
    return checkLogicStructure(code, mission.correctCode);
  }

  // ユニット2: 変数を作って、それを print() の中で使っているか
  if (lessonId.startsWith("2-")) {
    if (!code.includes("=")) {
      return "変数を使って値を入れてね！「=」を使おう！";
    }
    if (lessonId === "2-4" && (code.match(/=/g) || []).length < 2) {
      return "変数に値を入れた後、もう一度値を入れ直してね！";
    }
    if (lessonId === "2-5" && (code.match(/=/g) || []).length < 2) {
      return "2つ以上の変数を作って組み合わせてね！";
    }

    const variableNames = Array.from(code.matchAll(/(\w+)\s*=/g)).map(
      (m) => m[1]
    );
    if (variableNames.length > 0) {
      const usedInPrint = Array.from(code.matchAll(/print\s*\([^)]*\)/g)).some(
        (printMatch) => {
          const withoutStrings = printMatch[0].replace(/["'][^"']*["']/g, "");
          return variableNames.some((name) => withoutStrings.includes(name));
        }
      );
      if (!usedInPrint) {
        return "変数をprint()内で使ってね！";
      }
    }
  }

  return null;
}

/**
 * コードの構造チェック。問題なければ null、問題があればメッセージを返す。
 */
export function checkCodeStructure(
  lessonId: string,
  mission: Mission,
  code: string
): string | null {
  const rules = mission.rules ?? LESSON_RULES[lessonId] ?? [];
  for (const rule of rules) {
    if (!evaluateRule(rule, code)) {
      return rule.message;
    }
  }
  return checkLessonSpecific(lessonId, mission, code);
}

/**
 * 出力一致と構造チェックをまとめて行う。
 */
export function checkAnswer(
  lessonId: string,
  mission: Mission,
  code: string,
  actualOutput: string
): CheckResult {
  const structureError = checkCodeStructure(lessonId, mission, code);
  if (structureError) {
    return { correct: false, message: structureError };
  }

  const matches = actualOutput.trim() === (mission.expectedOutput || "").trim();
  if (!matches) {
    return {
      correct: false,
      message: "期待される出力と異なります。もう一度試してみましょう！",
    };
  }
  return { correct: true };
}
