import { WordBlock } from "@/types";

/**
 * ブロック列 → Pythonコードの変換。
 *
 * このファイルが唯一の実装。レッスン／復習／デイリーチャレンジの
 * 3画面すべてがここを参照する（以前は3か所にコピーがあり、
 * スペースの入れ方が画面ごとに違っていた）。
 */

/** 改行ブロック */
export const NEWLINE_BLOCK = "↵";
/** インデントブロック（半角スペース4つ） */
export const INDENT_BLOCK = "    ";

/** 直前に空白を入れない記号 */
const NO_SPACE_BEFORE = new Set([")", "]", "}", ",", ":", "."]);
/** 直後に空白を入れない記号 */
const NO_SPACE_AFTER = new Set(["(", "[", "{", "."]);
/** 前後に空白を入れる演算子 */
const OPERATORS = new Set([
  "=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "+=",
  "-=",
  "*=",
  "/=",
]);
/** 前後に必ず空白が必要なキーワード */
const SPACED_KEYWORDS = new Set([
  "if",
  "elif",
  "else",
  "while",
  "for",
  "in",
  "and",
  "or",
  "not",
  "return",
  "def",
  "import",
  "is",
]);

/** Pythonの識別子として使える文字列か（関数呼び出し・添字の判定に使う） */
function isIdentifierLike(text: string): boolean {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(text);
}

/**
 * 2つのブロックの間に半角スペースを入れるか判定する。
 * 判定順が意味を持つので、並べ替えないこと。
 */
export function shouldAddSpace(current: WordBlock, next: WordBlock): boolean {
  const cur = current.text;
  const nxt = next.text;

  // 改行・インデントの前後は空白なし
  if (cur === NEWLINE_BLOCK || nxt === NEWLINE_BLOCK) return false;
  if (cur === INDENT_BLOCK || current.type === "indent") return false;

  // 閉じ括弧・カンマ・コロン・ドットの直前は詰める（ else: / fruits[0] / , など）
  if (NO_SPACE_BEFORE.has(nxt)) return false;
  // 開き括弧・ドットの直後は詰める（ print( / person. など）
  if (NO_SPACE_AFTER.has(cur)) return false;

  // キーワードの前後は必ず空ける（ return "Hello" / "name" in person / not flag ）
  if (SPACED_KEYWORDS.has(cur)) return true;
  if (SPACED_KEYWORDS.has(nxt)) return true;

  // カンマ・コロン・演算子の直後は必ず空ける（ "A", "B" / {"a": 1} / x = 5 ）
  if (cur === "," || cur === ":" || OPERATORS.has(cur)) return true;
  // 演算子の直前も空ける（ "A" + "B" ）
  if (OPERATORS.has(nxt)) return true;

  // クォートブロックで文字列を組み立てる問題（ " + Hello + " ）は詰める
  if (cur === '"' || nxt === '"') return false;

  // 関数呼び出し print( は詰め、演算子のあとの (2 + 3) は空ける
  if (nxt === "(") return !isIdentifierLike(cur);
  // 添字 fruits[0] は詰め、代入のあとの = [1, 2] は空ける
  if (nxt === "[") return !isIdentifierLike(cur);

  // 残り（演算子・カンマの直後・コロンの直後など）はすべて空ける
  return true;
}

/** 選択されたブロック列からPythonコードを生成する */
export function generateCode(selectedBlocks: WordBlock[]): string {
  let code = "";
  // 開いている括弧の種類。スライス hello[6:11] のコロンを辞書 {"a": 1} と区別するのに使う
  const brackets: string[] = [];

  selectedBlocks.forEach((block, index) => {
    if (block.text === "[" || block.text === "(" || block.text === "{") {
      brackets.push(block.text);
    } else if (block.text === "]" || block.text === ")" || block.text === "}") {
      brackets.pop();
    }

    if (block.text === NEWLINE_BLOCK) {
      code += "\n";
    } else if (block.text === INDENT_BLOCK) {
      code += INDENT_BLOCK;
    } else {
      code += block.text;
    }

    const nextBlock = selectedBlocks[index + 1];
    const isSliceColon =
      block.text === ":" && brackets[brackets.length - 1] === "[";
    if (
      nextBlock &&
      !isSliceColon &&
      !block.text.includes("\n") &&
      !nextBlock.text.includes("\n") &&
      shouldAddSpace(block, nextBlock)
    ) {
      code += " ";
    }
  });

  // 行末の余分な空白だけ落とす（インデントは保持する）
  return code
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .trim();
}

/**
 * 省略形（+= など）を展開形に直す。
 * += 系のブロックは 2-4・5-5 の一部の問題で使う。
 * 構造チェックは展開前のコードで行うので、「+= を使ったか」も判定できる。
 */
export function normalizeCode(code: string): string {
  return code
    .split("\n")
    .map((line) =>
      line
        .replace(/^(\s*)([A-Za-z_]\w*)\s*-=\s*(.+)$/, "$1$2 = $2 - $3")
        .replace(/^(\s*)([A-Za-z_]\w*)\s*\+=\s*(.+)$/, "$1$2 = $2 + $3")
        .replace(/^(\s*)([A-Za-z_]\w*)\s*\*=\s*(.+)$/, "$1$2 = $2 * $3")
        .replace(/^(\s*)([A-Za-z_]\w*)\s*\/=\s*(.+)$/, "$1$2 = $2 / $3")
    )
    .join("\n");
}
