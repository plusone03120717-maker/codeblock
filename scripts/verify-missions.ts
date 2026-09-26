/**
 * 全ミッションの正解コードを検証する。
 *   npx jiti scripts/verify-missions.ts
 *
 * 1. 正解コードを、そのミッションのブロックだけで組み立てられるか
 * 2. 組み立てたブロックから generateCode した結果が正解コードと一致するか
 * 3. prefixCode + 正解コードを Python で実行した出力が expectedOutput と一致するか
 * 4. checkAnswer（構造チェック）を通るか
 */
import { execFileSync } from "child_process";
import { getLessonMissions } from "../src/data/missions";
import { lessons } from "../src/data/lessons";
import { generateCode, normalizeCode, NEWLINE_BLOCK, INDENT_BLOCK } from "../src/utils/codeGen";
import { checkAnswer } from "../src/utils/answerCheck";
import type { WordBlock } from "../src/types";

/** 正解コードをブロック列に分解する（最長一致）。組めなければ null */
function tokenize(code: string, blocks: WordBlock[]): WordBlock[] | null {
  const texts = blocks
    .filter((b) => b.text !== NEWLINE_BLOCK && b.type !== "indent")
    .sort((a, b) => b.text.length - a.text.length);
  const nl = blocks.find((b) => b.text === NEWLINE_BLOCK);
  const indent = blocks.find((b) => b.type === "indent" || b.text === INDENT_BLOCK);
  const out: WordBlock[] = [];
  let i = 0;
  let lineStart = true;
  while (i < code.length) {
    if (code[i] === "\n") {
      if (!nl) return null;
      out.push(nl);
      i++;
      lineStart = true;
      continue;
    }
    if (lineStart && code.startsWith(INDENT_BLOCK, i)) {
      if (!indent) return null;
      out.push(indent);
      i += INDENT_BLOCK.length;
      continue;
    }
    lineStart = false;
    if (code[i] === " ") {
      i++;
      continue;
    }
    const hit = texts.find((b) => code.startsWith(b.text, i));
    if (!hit) return null;
    out.push(hit);
    i += hit.text.length;
  }
  return out;
}

function runPython(code: string): string {
  try {
    return execFileSync("python", ["-c", "import sys\nsys.stdout.reconfigure(encoding='utf-8')\nexec(sys.stdin.read())"], {
      input: code,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).replace(/\r\n/g, "\n");
  } catch (e) {
    return "__ERROR__ " + String((e as { stderr?: string }).stderr ?? e);
  }
}

const only = process.argv[2]; // 例: "2-4" で絞り込み
let checked = 0;
let skippedQuiz = 0;
const failures: string[] = [];

for (const lesson of lessons) {
  if (only && !lesson.id.startsWith(only)) continue;
  for (const m of getLessonMissions(lesson.id) ?? []) {
    if (m.type === "quiz") {
      // クイズは codeToRead を実行して、正解の選択肢と一致するかを見る（ランダム・エラーは除く）
      if (!m.codeToRead || m.codeToRead.includes("random")) continue;
      const out = runPython(m.codeToRead).trim();
      const answer = (m.choices?.[m.correctAnswer ?? -1] ?? "").trim();
      const printable = out.startsWith("__ERROR__") ? "エラー" : out === "" ? "何も出力されない" : out;
      // 選択肢のどれかが実行結果そのものの形なら、それが正解になっているかを確認する。
      // 「3行」のような説明文の選択肢しかない問題は自動判定できないので数えるだけ
      const literal = m.choices?.some((c) => c.trim() === printable) ?? false;
      if (!literal) {
        skippedQuiz++;
        continue;
      }
      checked++;
      if (answer !== printable) {
        failures.push(`${lesson.id}#${m.id} quiz: 実行結果「${printable.slice(0, 60)}」≠ 正解の選択肢「${answer}」`);
      }
      continue;
    }
    if (!m.correctCode) continue;
    checked++;
    const tag = `${lesson.id}#${m.id}`;
    const seq = tokenize(m.correctCode, m.availableBlocks);
    if (!seq) {
      failures.push(`${tag}: 正解コードをブロックで組み立てられない`);
      continue;
    }
    const generated = generateCode(seq);
    if (generated !== m.correctCode) {
      failures.push(`${tag}: 生成コードが正解コードと違う\n    生成: ${JSON.stringify(generated)}\n    正解: ${JSON.stringify(m.correctCode)}`);
    }
    const full = (m.prefixCode ? m.prefixCode + "\n" : "") + normalizeCode(generated);
    const output = runPython(full);
    const result = checkAnswer(lesson.id, m, generated, output);
    if (!result.correct) {
      failures.push(`${tag}: checkAnswer 不合格「${result.message}」 出力=${JSON.stringify(output.trim().slice(0, 60))}`);
    }
  }
}

console.log(`checked ${checked} missions (選択肢が説明文のクイズ ${skippedQuiz} 問は対象外)`);
if (failures.length) {
  console.log(`${failures.length} failures:\n` + failures.join("\n"));
  process.exit(1);
}
console.log("all OK");
