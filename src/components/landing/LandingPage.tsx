"use client";

// ログインしていない人に見せる最初のページ（紹介ページ）。
// 見た目は Python ナビ・管理画面と同じ（丸ゴシック・白い角丸のカード・紫・黄・オレンジのボタン）にそろえた。
import Image from "next/image";
import Link from "next/link";
import { Zen_Maru_Gothic } from "next/font/google";
import ToggleImage from "@/components/ToggleImage";

const maru = Zen_Maru_Gothic({ weight: ["500", "700", "900"], subsets: ["latin"], display: "swap" });

// 白い文字をのせても読める濃さのオレンジ（大きい太字で 3:1 以上）
const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#ec6c00] font-black text-white shadow-[0_5px_0_#b45200] transition-transform hover:bg-[#f47a10] active:translate-y-[3px] active:shadow-[0_2px_0_#b45200]";
const BTN_GHOST =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white font-black text-[#5a3fd6] shadow-[inset_0_0_0_2px_#d9cffd,0_4px_0_#d9cffd] transition-transform hover:bg-[#f7f4ff] active:translate-y-[3px] active:shadow-[inset_0_0_0_2px_#d9cffd,0_1px_0_#d9cffd]";

// ヒーローの見本：ブロックが順に入って、実行すると「Hello World」が出る（8秒でくり返す）
const DEMO_SECONDS = 8;
const CHIP_TIMES = [0.6, 1.3, 2.0, 2.7];
const OUTPUT_TIME = 3.5;
const RESET_TIME = 7.0;
const pct = (t: number) => `${((t / DEMO_SECONDS) * 100).toFixed(2)}%`;
const DEMO_CSS = [
  ...CHIP_TIMES.map(
    (t, i) => `
    @keyframes cb-in-${i}{0%,${pct(t)}{opacity:0;transform:translateY(18px) scale(.85)}${pct(t + 0.35)},${pct(RESET_TIME)}{opacity:1;transform:none}${pct(RESET_TIME + 0.4)},100%{opacity:0;transform:none}}
    @keyframes cb-used-${i}{0%,${pct(t)}{opacity:1}${pct(t + 0.2)},${pct(RESET_TIME)}{opacity:.28}${pct(RESET_TIME + 0.4)},100%{opacity:1}}`,
  ),
  `@keyframes cb-out{0%,${pct(OUTPUT_TIME)}{opacity:0;transform:translateY(6px)}${pct(OUTPUT_TIME + 0.4)},${pct(RESET_TIME)}{opacity:1;transform:none}${pct(RESET_TIME + 0.4)},100%{opacity:0}}`,
  `@keyframes cb-run{0%,${pct(OUTPUT_TIME - 0.5)}{transform:none;box-shadow:0 3px 0 #b45200}${pct(OUTPUT_TIME - 0.3)}{transform:translateY(2px);box-shadow:0 1px 0 #b45200}${pct(OUTPUT_TIME)},100%{transform:none;box-shadow:0 3px 0 #b45200}}`,
  `@keyframes cb-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`,
  `@media (prefers-reduced-motion: no-preference){
    ${CHIP_TIMES.map((_, i) => `.cb-in-${i}{animation:cb-in-${i} ${DEMO_SECONDS}s ease-out infinite}.cb-used-${i}{animation:cb-used-${i} ${DEMO_SECONDS}s ease-out infinite}`).join("")}
    .cb-out{animation:cb-out ${DEMO_SECONDS}s ease-out infinite}
    .cb-run{animation:cb-run ${DEMO_SECONDS}s ease-out infinite}
    .cb-float{animation:cb-float 5s ease-in-out infinite}
  }`,
].join("");

const CHIPS = [
  { text: "print", cls: "bg-[#fff0a3] text-[#5c4200]" },
  { text: "(", cls: "bg-[#ece9f6] text-[#4a4470]" },
  { text: '"Hello World"', cls: "bg-[#c9f2dc] text-[#0f6b45]" },
  { text: ")", cls: "bg-[#ece9f6] text-[#4a4470]" },
];
// 下のブロック置き場は、答えと順番を変えて並べる
const PALETTE_ORDER = [2, 0, 3, 1];

const WORRIES = [
  { icon: "💭", text: "プログラミングは将来必要なスキルだと分かっている" },
  { icon: "😰", text: "でも教材を見ると英語や専門用語ばかりで難しそう" },
  { icon: "😓", text: "いきなりコードを書かせるのはハードルが高い" },
  { icon: "😟", text: "子どもが挫折しないか心配" },
  { icon: "🤔", text: "何から始めればいいか分からない" },
  { icon: "⌨️", text: "タイピングがまだできない小学生には難しすぎる" },
];

const STEPS = [
  { title: "チュートリアルで学ぶ", body: "キャラクターがやさしく解説。新しい概念をわかりやすく説明してくれるよ！", color: "#7448f0" },
  { title: "ブロックで問題を解く", body: "ドラッグ＆ドロップでコードを組み立て。タイピングなしでプログラミング！", color: "#4f7cff" },
  { title: "困ったらヒントをもらう", body: "わからなくても大丈夫！AIがキャラクターになってヒントを教えてくれるよ", color: "#ffb800" },
  { title: "復習で定着させる", body: "AIが最適なタイミングで復習問題を出題。忘れる前に思い出して、しっかり定着！", color: "#22b573" },
];

const BADGES = [
  { icon: "🌱", label: "学習進捗", count: 10 },
  { icon: "🔥", label: "連続学習", count: 5 },
  { icon: "✅", label: "正解数", count: 5 },
  { icon: "⚡", label: "XP・レベル", count: 5 },
  { icon: "💯", label: "チャレンジ", count: 9 },
];

const FRIENDS = [
  { name: "コーディ", src: "/images/characters/cody.png", body: "プログラミングの基本を教えてくれる、元気いっぱいのヘビ！", bg: "bg-[#e3ecff]" },
  { name: "ディジー", src: "/images/characters/dizzy.png", body: "変数について楽しく教えてくれる、好奇心旺盛な仲間！", bg: "bg-[#fff3c4]" },
  { name: "デックス", src: "/images/characters/dex.png", body: "データ型を論理的に教えてくれる、頼れるロボット！", bg: "bg-[#e2f7ec]" },
];

const REVIEW_LEVELS = [
  { label: "未定着", after: "1日後", color: "#ff6b6b" },
  { label: "学習中", after: "3日後", color: "#ff8a1f" },
  { label: "定着中", after: "1週間後", color: "#ffc21a" },
  { label: "定着済み", after: "2週間後", color: "#22b573" },
  { label: "マスター", after: "1ヶ月後", color: "#7448f0" },
];

const COMPARE = [
  { item: "入力方法", other: "キーボードでタイピング", ours: "ブロックを選んで並べる" },
  { item: "対象年齢", other: "中高生〜大人向けが多い", ours: "小学生（10〜12歳）に特化" },
  { item: "学習体験", other: "教科書的・説明が多い", ours: "ゲーム感覚で楽しく" },
  { item: "難易度", other: "最初からハードルが高い", ours: "やさしくステップアップ" },
];

const PARENTS = [
  { icon: "🔒", title: "安心・安全な環境", body: "広告なし、外部リンクなしの安全な学習環境です。お子さまが安心して学習に集中できます。" },
  { icon: "📚", title: "教育的なカリキュラム", body: "プログラミング教育の専門家が監修したカリキュラム。基礎から応用まで段階的に学べます。" },
  { icon: "🎯", title: "自分のペースで学習", body: "時間制限なし。お子さまが自分のペースで、何度でも繰り返し学習できます。" },
  { icon: "💡", title: "つまずいても安心", body: "AIがキャラクターとしてヒントを提供。答えを教えるのではなく、考え方を導くので、自分で解く力が身につきます。" },
  { icon: "🏆", title: "達成感を実感", body: "XPやレベルアップ機能で、学習の成果を実感できます。お子さまのやる気を引き出します。" },
  { icon: "🌱", title: "将来につながるスキル", body: "Pythonは世界で最も人気のあるプログラミング言語の一つ。今から学ぶことで、将来の選択肢が広がります。" },
];

const FAQ = [
  { q: "対象年齢は何歳ですか？", a: "10〜15歳を主な対象としていますが、プログラミング初心者の方であれば年齢問わずお使いいただけます。ふりがな機能もあるので、漢字が苦手なお子さまでも安心です。" },
  { q: "プログラミング未経験でも大丈夫？", a: "はい、大丈夫です！CodeBlockはプログラミング未経験のお子さま向けに作られています。ドラッグ＆ドロップでコードを組み立てるので、タイピングが苦手でも楽しく学べます。" },
  { q: "スマホやタブレットでも使えますか？", a: "はい、スマートフォンやタブレットのブラウザからご利用いただけます。ただし、画面が大きいパソコンやタブレットでの学習をおすすめします。" },
  { q: "無料でどこまで遊べますか？", a: "無料でレッスン1-1〜1-3まで学習できます。print関数の基本を学び、プログラミングの楽しさを体験できます。気に入ったら有料プランでさらに学習を進めましょう！" },
  { q: "支払い方法は何がありますか？", a: "クレジットカード（Visa、Mastercard、JCB、American Express）でお支払いいただけます。" },
  { q: "解約はいつでもできますか？", a: "はい、いつでも解約できます。解約後も契約期間中はサービスをご利用いただけます。" },
  { q: "学校や塾で使うことはできますか？", a: "はい、教育機関でのご利用も歓迎です。団体向けプランについてはお問い合わせください。" },
];

function Mark() {
  return (
    <i className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[linear-gradient(135deg,#a259ff,#4f7cff)] text-[15px] not-italic text-white shadow-sm">▶</i>
  );
}

function Eyebrow({ children, tone = "purple" }: { children: React.ReactNode; tone?: "purple" | "yellow" | "green" }) {
  const cls = {
    purple: "bg-[#efe9ff] text-[#5a3fd6]",
    yellow: "bg-[#fff1b8] text-[#6b4d00]",
    green: "bg-[#e2f7ec] text-[#0f6b45]",
  }[tone];
  return <span className={`inline-block rounded-full px-3.5 py-1 text-[13px] font-black tracking-wide ${cls}`}>{children}</span>;
}

function SectionTitle({ eyebrow, title, lead, tone }: { eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; tone?: "purple" | "yellow" | "green" }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-[28px] font-black leading-tight md:text-[36px]">{title}</h2>
      {lead && <p className="mt-3 text-[15.5px] font-bold leading-relaxed text-[#6d6893]">{lead}</p>}
    </div>
  );
}

// ヒーローの見本：CodeBlock の問題画面を小さくしたもの
function HeroDemo() {
  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div className="absolute -inset-4 -z-0 rounded-[40px] bg-[linear-gradient(160deg,#d6eefb_0%,#ece6ff_60%,#fff6d1_100%)]" aria-hidden />
      <div className="relative rounded-[28px] bg-white p-5 shadow-[0_18px_40px_-18px_rgba(42,36,82,.35)] md:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f3ff] py-1 pl-1 pr-3.5 text-[13px] font-bold">
            <b className="rounded-full bg-[linear-gradient(135deg,#a259ff,#4f7cff)] px-2.5 py-0.5 text-white">Lv.1</b>
            ミッション 1 / 10
          </span>
          <span className="text-[13px] font-bold text-[#6d6893]">残り 9 問</span>
        </div>

        <div className="mt-4 flex items-center gap-3.5 rounded-[20px] bg-[#f7f6fc] p-3.5">
          <div className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-full bg-[#e3ecff]">
            <Image src="/images/characters/cody.png" alt="コーディ" width={64} height={64} />
          </div>
          <p className="text-[14px] font-bold leading-snug sm:text-[15px]">
            print() を使って
            <br />
            「Hello World」と表示しよう！
          </p>
        </div>

        <div className="mt-4 text-[12.5px] font-black tracking-wider text-[#6d6893]">あなたの答え</div>
        <div className="mt-1.5 flex min-h-[58px] flex-wrap items-center gap-1.5 rounded-[16px] border-2 border-dashed border-[#c9bdfa] bg-[#faf8ff] px-3 py-2.5 font-mono text-[15px] font-bold">
          {CHIPS.map((c, i) => (
            <span key={i} className={`cb-in-${i} rounded-[10px] px-2.5 py-1.5 shadow-[0_2px_0_rgba(42,36,82,.12)] ${c.cls}`}>
              {c.text}
            </span>
          ))}
        </div>

        <div className="mt-3 text-[12.5px] font-black tracking-wider text-[#6d6893]">ブロックを選んでね</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5 font-mono text-[15px] font-bold">
          {PALETTE_ORDER.map((i) => (
            <span key={i} className={`cb-used-${i} rounded-[10px] px-2.5 py-1.5 shadow-[0_2px_0_rgba(42,36,82,.12)] ${CHIPS[i].cls}`}>
              {CHIPS[i].text}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-stretch gap-2.5">
          <span className="cb-run grid flex-none place-items-center rounded-full bg-[#ec6c00] px-4 text-[14px] font-black text-white shadow-[0_3px_0_#b45200]">▶ 実行</span>
          <div className="flex-1 rounded-[14px] bg-[#1f1b3a] px-3.5 py-2.5 font-mono text-[14px] leading-tight">
            <div className="text-[11px] font-bold text-[#9a95c0]">出力</div>
            <div className="cb-out font-bold text-[#5ff2a5]">Hello World</div>
          </div>
        </div>
      </div>

      <div className="cb-out absolute -right-3 -top-6 rounded-[16px] bg-white px-3.5 py-2 text-[13px] font-black shadow-[0_10px_24px_-12px_rgba(42,36,82,.45)] md:-right-8">
        <span className="text-[#11845a]">✔ せいかい！</span>
        <span className="ml-1.5 inline-grid h-5 w-5 place-items-center rounded-full bg-[#ffd23f] text-[12px] text-[#5c4200]">+</span>
        <span className="ml-1 text-[#8a6400]">10 XP</span>
      </div>
    </div>
  );
}

// Python ナビの見本：ホームの「今日やること」を小さくしたもの
function NaviDemo() {
  return (
    <div className="rounded-[22px] bg-white p-5 shadow-[0_18px_40px_-20px_rgba(42,36,82,.35)]">
      <div className="flex items-center gap-2">
        <b className="text-[16px] font-black">ステップ5　データ型</b>
        <span className="rounded-full bg-[#ffd23f] px-2.5 py-0.5 text-[12px] font-bold text-[#5c4200]">前回のつづき</span>
      </div>
      <div className="mt-3 rounded-[18px] border-2 border-[#ffc21a] px-4 py-3.5 shadow-[0_0_0_5px_#fff6d1]">
        <div className="text-[12px] font-black tracking-widest text-[#8a6400]">
          <span className="mr-1.5 inline-grid h-5 w-5 place-items-center rounded-full bg-[#ffd23f] text-[11px] text-[#5c4200]">1</span>つぎにやること
        </div>
        <div className="mt-1 text-[17px] font-black leading-snug">動画 #5 を 3:20 から</div>
        <div className="mt-2.5 grid grid-cols-[64px_1fr] items-center gap-2 text-[12px] font-bold text-[#6d6893]">
          動画
          <span className="h-2 overflow-hidden rounded-full bg-[#ece9f6]">
            <i className="block h-full w-[55%] rounded-full bg-[#ff8a1f]" />
          </span>
          見出し
          <span className="h-2 overflow-hidden rounded-full bg-[#ece9f6]">
            <i className="block h-full w-[33%] rounded-full bg-[#22b573]" />
          </span>
        </div>
        <div className="mt-3 flex justify-end">
          <span className="rounded-full bg-[#ec6c00] px-5 py-2 text-[14px] font-black text-white shadow-[0_4px_0_#b45200]">はじめる ▶</span>
        </div>
      </div>
      <div className="mt-3 flex gap-1" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={`h-2.5 flex-1 rounded ${i < 4 ? "bg-[#22b573]" : i === 4 ? "bg-[#ffd23f] shadow-[0_0_0_2px_#fff0b3]" : "bg-[#ece9f6]"}`} />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className={`${maru.className} min-h-screen overflow-x-hidden bg-[#f5f3ff] text-[#2a2452] [word-break:auto-phrase]`}>
      <style>{DEMO_CSS}</style>

      {/* ヘッダー */}
      <header className="sticky top-0 z-40 border-b border-[#e6e1fa] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[64px] max-w-6xl items-center gap-3 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 text-[20px] font-bold">
            <Mark />
            CodeBlock
          </Link>
          <span className="flex-1" />
          <Link href="/login" className="rounded-full px-3 py-2 text-[14px] font-bold text-[#5a3fd6] hover:bg-[#f5f3ff] md:px-4">
            ログイン
          </Link>
          <Link href="/login?mode=register" className={`${BTN_PRIMARY} h-10 px-4 text-[14px] md:px-5`}>
            新規登録
          </Link>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:px-6 md:pb-24 md:pt-16">
          <div>
            <Eyebrow tone="yellow">＋ 小学生からはじめるプログラミング</Eyebrow>
            <h1 className="mt-4 text-[40px] font-black leading-[1.18] tracking-tight md:text-[58px]">
              ブロックで学ぶ
              <br />
              はじめての
              <mark className="bg-transparent bg-[linear-gradient(transparent_70%,#ffd23f_70%,#ffd23f_94%,transparent_94%)] px-1 text-inherit">Python</mark>
            </h1>
            <p className="mt-5 max-w-[30em] text-[17px] font-bold leading-relaxed text-[#4a4470]">
              小学生でもかんたん！ ドラッグ＆ドロップで
              <br className="hidden sm:block" />
              プログラミングを学ぼう。タイピングが苦手でも、
              <br className="hidden sm:block" />
              ブロックを並べればコードになる。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login?mode=register" className={`${BTN_PRIMARY} h-14 px-8 text-[18px]`}>
                無料ではじめる ▶
              </Link>
              <Link href="/login" className={`${BTN_GHOST} h-14 px-7 text-[16px]`}>
                ログイン
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] font-bold text-[#6d6893]">
              <li>✔ レッスン1-1〜1-3は無料</li>
              <li>✔ ふりがなワンタッチ</li>
              <li>✔ 広告なし</li>
            </ul>
          </div>
          <HeroDemo />
        </div>
      </section>

      {/* 保護者の心配 */}
      <section className="bg-white px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="こんなお悩み、ありませんか？"
            title={
              <>
                子どもにプログラミングを
                <br />
                学ばせたい。でも…
              </>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WORRIES.map((w) => (
              <div key={w.text} className="flex items-center gap-3.5 rounded-[20px] bg-[#f7f6fc] px-5 py-4">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white text-[22px] shadow-sm">{w.icon}</span>
                <p className="text-[15px] font-bold leading-snug text-[#4a4470]">{w.text}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-xl rounded-full bg-[#efe9ff] px-6 py-3.5 text-center text-[17px] font-black text-[#5a3fd6]">
            CodeBlock なら、ブロックを並べるだけ。
          </p>
        </div>
      </section>

      {/* 特徴 */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="CodeBlock の特徴" title="つまずかないしかけが、3つ" />
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard title="ブロックで学ぶ" body="ドラッグ＆ドロップでコードを組み立て。タイピングが苦手でも大丈夫！" band="bg-[#fff0a3]">
              <Image src="/images/features/block-learning.png" alt="ブロックを並べてコードを作る画面" width={500} height={500} className="h-full w-full object-cover object-top" />
            </FeatureCard>
            <FeatureCard
              title="ふりがなワンタッチ"
              body="ボタンひとつでふりがなのオン／オフを切り替え。わからない漢字が出たときだけ表示できるから、画面がスッキリ読みやすい！"
              band="bg-[#d6eefb]"
            >
              <ToggleImage
                image1="/images/features/furigana-off.png"
                image2="/images/features/furigana-on.png"
                alt1="ふりがなオフの画面"
                alt2="ふりがなオンの画面"
                interval={2500}
                className="h-full w-full"
              />
            </FeatureCard>
            <FeatureCard title="困ったらヒント" body="わからなくても大丈夫！個性豊かなキャラクターたちが、正解へ導くヒントを教えてくれるよ" band="bg-[#c9f2dc]">
              <Image src="/images/features/hint.png" alt="キャラクターがヒントを出す画面" width={500} height={500} className="h-full w-full object-cover object-center" />
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* 学習の流れ */}
      <section className="bg-white px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="学習の流れ" title="4つのステップで、一本道" lead="ひとつずつ進めば、自然とコードが読めるようになります。" />
          <div className="mb-8 hidden gap-1.5 md:flex" aria-hidden>
            {STEPS.map((s) => (
              <span key={s.title} className="h-3 flex-1 rounded-full" style={{ background: s.color }} />
            ))}
          </div>
          <ol className="grid gap-4 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-[22px] bg-[#f7f6fc] px-5 py-6">
                <span className="grid h-10 w-10 place-items-center rounded-full text-[17px] font-black text-white" style={{ background: s.color }}>
                  {i + 1}
                </span>
                <h3 className="mt-3 text-[17px] font-black">{s.title}</h3>
                <p className="mt-1.5 text-[14px] font-bold leading-relaxed text-[#6d6893]">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-[14.5px] font-bold text-[#6d6893]">🎮 問題を解くとXPがもらえる！レベルアップを目指して楽しく学ぼう！</p>
        </div>
      </section>

      {/* Python ナビ（いちか） */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[linear-gradient(160deg,#d6eefb_0%,#eef7fd_55%,#fff_100%)] shadow-sm">
          <div className="grid gap-8 md:grid-cols-[380px_1fr]">
            <div className="relative h-[340px] md:h-auto md:min-h-[520px]">
              <Image
                src="/navi/bob_smile.webp"
                alt="ナビのいちか"
                width={520}
                height={520}
                className="absolute bottom-0 left-1/2 w-[360px] max-w-none -translate-x-1/2 md:w-[500px]"
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white py-1 pl-1.5 pr-3.5 text-sm font-black shadow-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ffd23f] text-[15px] font-black text-[#8a6400]">+</span>いちか
              </span>
            </div>
            <div className="px-5 pb-8 md:py-12 md:pr-12">
              <Eyebrow>plus one の教室で使っている新しいコース</Eyebrow>
              <h2 className="mt-3 text-[28px] font-black leading-tight md:text-[36px]">
                いちかといっしょに進む
                <br />
                「Python ナビ」
              </h2>
              <div className="relative mt-5 rounded-[20px] bg-white px-5 py-4 text-[15.5px] font-bold leading-[1.8] shadow-sm">
                <span className="absolute -left-2 top-6 h-4 w-4 rotate-45 bg-white max-md:hidden" aria-hidden />
                はじめまして！ いちかだよ。
                <br />
                プログラミングは、コンピューターへの<em className="not-italic text-[#5a3fd6]">命令を文字で書くこと</em>。
                <br />
                いっしょに一歩ずつ進もう！
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
                <ul className="flex flex-col gap-3">
                  {[
                    ["🎬", "動画を見ながら打つ", "授業の動画とエディターが同じ画面。見出しの終わりで動画が止まり、結果を出してから次へ"],
                    ["💻", "エディターもアプリの中", "コードを書くところと結果が出るところ（ターミナル）が、ブラウザの中にそろっている"],
                    ["🧩", "CodeBlock でたしかめる", "動画で学んだことを、そのまま CodeBlock の問題でおさらい"],
                    ["🏁", "つづきから始められる", "「今日はおわる」を押せば、次はいちかが前回のつづきを案内してくれる"],
                  ].map(([icon, title, body]) => (
                    <li key={title} className="flex gap-3">
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white text-[19px] shadow-sm">{icon}</span>
                      <div>
                        <b className="text-[16px] font-black">{title}</b>
                        <p className="text-[13.5px] font-bold leading-relaxed text-[#4a4470]">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <NaviDemo />
              </div>
              <p className="mt-5 text-[13px] font-bold text-[#6d6893]">※ Python ナビは plus one の Python コースの生徒が使えます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ゲームのように */}
      <section className="bg-white px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="🎮 ゲームのように" title="XPとレベルアップで、もっと楽しく" tone="yellow" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] bg-[#fff6d1] px-6 py-6">
              <div className="text-[28px]">⚡</div>
              <h3 className="mt-1 text-[18px] font-black">XPシステム</h3>
              <ul className="mt-2 space-y-1 text-[14.5px] font-bold text-[#4a4470]">
                <li>1問正解 = 10XP</li>
                <li>レッスン完了 = 50XP</li>
                <li>復習完了 = 20XP</li>
              </ul>
            </div>
            <div className="rounded-[22px] bg-[#efe9ff] px-6 py-6">
              <div className="text-[28px]">📈</div>
              <h3 className="mt-1 text-[18px] font-black">レベルシステム</h3>
              <p className="mt-2 text-[14.5px] font-bold leading-relaxed text-[#4a4470]">Lv.1 ビギナーからレジェンドまで、段階的にレベルアップ！</p>
            </div>
            <div className="rounded-[22px] bg-[#ffe7d4] px-6 py-6">
              <div className="text-[28px]">🔥</div>
              <h3 className="mt-1 text-[18px] font-black">ストリークボーナス</h3>
              <p className="mt-2 text-[14.5px] font-bold leading-relaxed text-[#4a4470]">3問連続正解ごとにボーナスXPがもらえる！</p>
            </div>
          </div>
          <div className="mt-6 rounded-[22px] bg-[#f7f6fc] px-6 py-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[18px] font-black">🏆 実績・バッジ</h3>
              <span className="text-[13px] font-bold text-[#6d6893]">たくさんの実績を集めよう（順次追加）</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {BADGES.map((b) => (
                <div key={b.label} className="rounded-[18px] bg-white px-3 py-4 text-center shadow-sm">
                  <div className="text-[26px]">{b.icon}</div>
                  <div className="mt-1 text-[13.5px] font-bold text-[#6d6893]">{b.label}</div>
                  <div className="text-[20px] font-black text-[#5a3fd6]">{b.count}種類</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[13px] font-bold text-[#6d6893]">例：「はじめの一歩」「連続学習30日」「パーフェクト」「スピードスター」など</p>
          </div>
        </div>
      </section>

      {/* なかまたち */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="なかまたち"
            title={
              <>
                個性豊かなキャラクターが、
                <br />
                きみの学習をサポート
              </>
            }
            tone="green"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {FRIENDS.map((f) => (
              <div key={f.name} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
                <div className={`${f.bg} flex justify-center pt-4`}>
                  <Image src={f.src} alt={f.name} width={200} height={200} className="h-[180px] w-[180px] object-contain" />
                </div>
                <div className="px-6 py-5">
                  <h3 className="text-[20px] font-black">{f.name}</h3>
                  <p className="mt-1 text-[14.5px] font-bold leading-relaxed text-[#6d6893]">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[14.5px] font-bold text-[#6d6893]">他にもたくさんのなかまが待っているよ…！</p>
        </div>
      </section>

      {/* スマート復習 */}
      <section className="bg-white px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            eyebrow="スマート復習システム"
            title="忘れる前に、ちょうどよく復習"
            lead="エビングハウスの忘却曲線に基づいた、科学的な復習システム。AIが最適なタイミングで復習問題を出題し、知識をしっかり定着させます。"
          />
          <div className="rounded-[24px] bg-[#f7f6fc] px-5 py-7 md:px-8">
            <h3 className="text-center text-[16px] font-black">📅 自動調整される復習間隔</h3>
            <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {REVIEW_LEVELS.map((r) => (
                <li key={r.label} className="rounded-[18px] bg-white px-3 pb-4 pt-3 text-center shadow-sm">
                  <span className="mx-auto block h-2 w-12 rounded-full" style={{ background: r.color }} />
                  <div className="mt-3 text-[13.5px] font-bold text-[#6d6893]">{r.label}</div>
                  <div className="text-[20px] font-black">{r.after}</div>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-center text-[13.5px] font-bold text-[#6d6893]">連続正解数に応じて、復習間隔が自動的に延長されます</p>
          </div>
        </div>
      </section>

      {/* 他の教材との違い */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="くらべてみると" title="他のPython教材との違い" />
          <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_1.2fr_1.3fr] bg-[#f7f6fc] text-[13px] font-black tracking-wider text-[#6d6893] max-sm:hidden">
              <span className="px-5 py-3">項目</span>
              <span className="px-5 py-3">他の教材</span>
              <span className="bg-[#efe9ff] px-5 py-3 text-[#5a3fd6]">CodeBlock</span>
            </div>
            {COMPARE.map((c) => (
              <div key={c.item} className="grid border-t border-[#f0eef7] sm:grid-cols-[1fr_1.2fr_1.3fr]">
                <span className="px-5 pt-4 text-[15px] font-black sm:py-4">{c.item}</span>
                <span className="px-5 py-1 text-[14.5px] font-bold text-[#6d6893] sm:py-4">
                  <span className="sm:hidden">他の教材：</span>
                  {c.other}
                </span>
                <span className="bg-[#faf8ff] px-5 pb-4 pt-1 text-[15px] font-black text-[#5a3fd6] sm:py-4">✓ {c.ours}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["🐍", "キャラクターと一緒に学べる"],
              ["📱", "スマホでもタブレットでもOK"],
              ["🔄", "間隔反復学習で定着する"],
              ["🏆", "XPやバッジでモチベーション維持"],
            ].map(([icon, text]) => (
              <div key={text} className="rounded-[18px] bg-white px-4 py-4 text-center shadow-sm">
                <div className="text-[24px]">{icon}</div>
                <p className="mt-1 text-[13.5px] font-bold leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 保護者の方へ */}
      <section className="bg-white px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="保護者の方へ" title="安心して見守れる学習環境" lead="お子さまの学習を安心してサポートできる環境をご用意しています。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARENTS.map((p) => (
              <div key={p.title} className="rounded-[22px] bg-[#f7f6fc] px-6 py-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[21px] shadow-sm">{p.icon}</span>
                  <h3 className="text-[17px] font-black">{p.title}</h3>
                </div>
                <p className="mt-3 text-[14.5px] font-bold leading-relaxed text-[#6d6893]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="料金プラン" title="まずは無料でお試し" lead="レッスン1-1〜1-3が無料で遊べます。" />
          <div className="grid gap-5 md:grid-cols-2">
            <PlanCard
              name="月額プラン"
              price="¥980"
              unit="/月"
              sub="いつでも解約OK"
              items={["すべてのレッスン", "AIヒント機能", "新レッスンも追加予定"]}
              cta="月額で始める"
            />
            <PlanCard
              featured
              name="年間プラン"
              price="¥6,800"
              sub="月あたり567円"
              badge="42%お得"
              items={["すべてのレッスン", "AIヒント機能", "新レッスンも追加予定", "1年間利用可能"]}
              cta="年間プランで始める"
            />
          </div>
          <div className="mt-8 text-center">
            <Link href="/login?mode=register" className={`${BTN_PRIMARY} h-14 px-9 text-[18px]`}>
              無料ではじめる ▶
            </Link>
            <p className="mt-4 text-[13px] font-bold text-[#6d6893]">※ 料金は税込みです。有料プランはいつでもキャンセル可能です。</p>
          </div>
        </div>
      </section>

      {/* 運営者 */}
      <section className="bg-white px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="運営者について" title="プログラミングスクール plus one" lead="〜一つ一つの成長を大事に。〜" />
          <div className="rounded-[24px] bg-[#f7f6fc] px-6 py-7 md:px-9">
            <h3 className="text-[17px] font-black">私たちの想い</h3>
            <p className="mt-3 text-[15px] font-bold leading-[1.9] text-[#4a4470] [word-break:normal]">
              CodeBlockは、実際のプログラミング教室で子どもたちを指導している現役講師が開発した学習アプリです。教室での指導経験を通じて、子どもたちがつまずきやすいポイントや、楽しく学べる方法を日々研究してきました。その経験を活かし、お子さま一人ひとりの「わからない」に寄り添い、一つ一つの成長を大切にできるよう、CodeBlockを開発いたしました。プログラミングは難しいものではなく、楽しく学べるもの。その想いを込めて、お子さまの学習をサポートします。
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a href="mailto:plus.one.0312.0717@gmail.com" className="flex items-center gap-3 rounded-[20px] bg-[#f7f6fc] px-5 py-4 hover:bg-[#efe9ff]">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white text-[18px] shadow-sm">✉️</span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-bold text-[#6d6893]">お問い合わせ</span>
                <span className="block truncate text-[14.5px] font-black text-[#5a3fd6]">plus.one.0312.0717@gmail.com</span>
              </span>
            </a>
            <a href="https://plus-one-naruse.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-[20px] bg-[#f7f6fc] px-5 py-4 hover:bg-[#efe9ff]">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white text-[18px] shadow-sm">🏫</span>
              <span>
                <span className="block text-[12.5px] font-bold text-[#6d6893]">公式サイト</span>
                <span className="block text-[14.5px] font-black text-[#5a3fd6]">plus one のホームページ ↗</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* よくある質問 */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="よくある質問" title="気になることは、ここで" />
          <div className="flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-[20px] bg-white px-5 shadow-sm open:pb-4">
                <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-[15.5px] font-black [&::-webkit-details-marker]:hidden">
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#efe9ff] text-[13px] text-[#5a3fd6]">Q</span>
                  <span className="flex-1">{f.q}</span>
                  <span className="text-[18px] text-[#9893b5] transition-transform group-open:rotate-45" aria-hidden>
                    ＋
                  </span>
                </summary>
                <p className="pl-10 text-[14.5px] font-bold leading-relaxed text-[#6d6893] [word-break:normal]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* さいごの申しこみ */}
      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#7448f0,#4f7cff)] px-6 py-14 text-center text-white md:py-16">
          <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" aria-hidden />
          <span className="pointer-events-none absolute -bottom-20 right-6 h-56 w-56 rounded-full bg-white/10" aria-hidden />
          <span className="cb-float pointer-events-none absolute right-[8%] top-8 grid h-14 w-14 place-items-center rounded-full bg-[#ffd23f] text-[30px] font-black text-[#5c4200] shadow-[0_6px_0_#d9a800] max-md:hidden" aria-hidden>
            +
          </span>
          <span className="pointer-events-none absolute bottom-10 left-[9%] grid h-9 w-9 place-items-center rounded-full bg-[#ffd23f] text-[20px] font-black text-[#5c4200] max-md:hidden" aria-hidden>
            +
          </span>
          <h2 className="relative text-[30px] font-black md:text-[40px]">さあ、はじめよう！</h2>
          <p className="relative mt-3 text-[16px] font-bold text-white/90">無料でアカウントを作成して、今すぐ学習スタート</p>
          <Link href="/login?mode=register" className={`${BTN_PRIMARY} relative mt-8 h-14 px-9 text-[18px]`}>
            無料ではじめる ▶
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#e6e1fa] bg-white px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 text-[17px] font-bold">
            <Mark />
            CodeBlock
          </span>
          <span className="text-[13px] font-bold text-[#6d6893]">© 2024 CodeBlock. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, body, band, children }: { title: string; body: string; band: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[26px] bg-white shadow-sm">
      <div className={`${band} px-6 pt-6`}>
        <div className="aspect-[4/3] overflow-hidden rounded-t-[18px] bg-white shadow-[0_-2px_14px_rgba(42,36,82,.08)]">{children}</div>
      </div>
      <div className="px-6 py-5">
        <h3 className="text-[19px] font-black">{title}</h3>
        <p className="mt-1.5 text-[14.5px] font-bold leading-relaxed text-[#6d6893]">{body}</p>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  unit,
  sub,
  badge,
  items,
  cta,
  featured,
}: {
  name: string;
  price: string;
  unit?: string;
  sub: string;
  badge?: string;
  items: string[];
  cta: string;
  featured?: boolean;
}) {
  return (
    <div className={`relative flex flex-col rounded-[26px] px-7 py-7 ${featured ? "bg-white shadow-[0_0_0_3px_#7448f0,0_18px_40px_-20px_rgba(116,72,240,.6)]" : "bg-white shadow-sm"}`}>
      {featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#ffd23f] px-4 py-1 text-[13px] font-black text-[#5c4200] shadow-sm">おすすめ</span>
      )}
      <h3 className="text-center text-[16px] font-black text-[#6d6893]">{name}</h3>
      <div className="mt-2 text-center text-[40px] font-black leading-none">
        {price}
        {unit && <span className="text-[16px] font-bold text-[#6d6893]">{unit}</span>}
      </div>
      <p className="mt-2 text-center text-[13.5px] font-bold text-[#6d6893]">
        {sub}
        {badge && <span className="ml-2 rounded-full bg-[#fff1b8] px-2 py-0.5 text-[12.5px] font-black text-[#6b4d00]">{badge}</span>}
      </p>
      <ul className="mt-5 flex-1 space-y-2.5 text-[14.5px] font-bold">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2.5">
            <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-[#e2f7ec] text-[11px] text-[#11845a]">✓</span>
            {it}
          </li>
        ))}
      </ul>
      <Link href="/login?mode=register" className={`${featured ? BTN_PRIMARY : BTN_GHOST} mt-6 h-12 w-full text-[15px]`}>
        {cta}
      </Link>
    </div>
  );
}
