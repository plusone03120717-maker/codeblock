// レッスンの問題の画面（/lesson/[id]/editor）の見た目。
// ・CB_SKIN：今までの CodeBlock のレッスン（1-1 など）。まだ使っている生徒がいるので、前のクラスのまま（変えない）
// ・NAVI_SKIN：Python ナビから来た「仕上げ5問」（31-N）。ナビと同じ色・形にそろえる（2026-10-26 依頼主）
import type { CSSProperties } from 'react'

export type LessonSkin = {
  navi: boolean
  root: string
  container: string
  progressLabel: string
  progressRest: string
  retryLabel: string
  retryRest: string
  seg: { base: string; done: string; wrong: string; current: string; rest: string }
  missionCard: string
  avatar: string
  quizCodeBox: string
  quizCode: string
  heading: string
  choiceGrid: string
  choice: { base: string; right: string; wrong: string; idle: string; letter: string }
  feedback: { box: string; title: string; body: string; retry: string }
  explanation: { box: string; text: string }
  answerArea: string
  answerEmpty: string
  palette: string
  paletteBlock: string
  bottomBar: CSSProperties
  bottomInner: string
  result: { box: string; ok: string; okTitle: string; okText: string; ng: string; ngTitle: string; ngText: string; ngBold: string }
  quizResult: { ok: string; okTitle: string; okText: string; ng: string; ngTitle: string; ngText: string }
  nextBtn: CSSProperties
  quizNextBtn: CSSProperties
  resetBtn: CSSProperties
  checkBtn: (executing: boolean) => CSSProperties
}

const cbButtonShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'

export const CB_SKIN: LessonSkin = {
  navi: false,
  root: 'min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 p-2 md:p-4',
  container: 'max-w-5xl mx-auto',
  progressLabel: 'text-sm font-bold text-gray-700',
  progressRest: 'text-xs text-gray-500',
  retryLabel: 'text-sm font-bold text-orange-600',
  retryRest: 'text-xs text-orange-500',
  seg: { base: 'flex-1 h-2 rounded-full', done: 'bg-green-400', wrong: 'bg-orange-400', current: 'bg-purple-400', rest: 'bg-gray-300' },
  missionCard: 'bg-white rounded-2xl shadow-lg p-4 md:p-5 mb-3 border-2 border-blue-300',
  avatar:
    'w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-purple-400 shadow-lg overflow-hidden',
  quizCodeBox: 'bg-gray-900 rounded-xl p-4 mb-4',
  quizCode: 'text-green-400 font-mono text-sm whitespace-pre-wrap',
  heading: 'text-sm font-bold mb-2 text-gray-700',
  choiceGrid: 'grid grid-cols-2 gap-2',
  choice: {
    base: 'p-3 rounded-xl font-bold text-left transition-all border-2',
    right: 'bg-green-100 border-green-500 text-green-700',
    wrong: 'bg-red-100 border-red-500 text-red-700',
    idle: 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50',
    letter: 'text-purple-500 mr-2',
  },
  feedback: {
    box: 'mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl',
    title: 'text-amber-900 font-bold text-sm mb-1',
    body: 'text-amber-800 text-sm leading-relaxed',
    retry: 'mt-3 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-5 rounded-full text-sm transition-all',
  },
  explanation: { box: 'mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl', text: 'text-blue-800 text-sm leading-relaxed' },
  answerArea: 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-4 min-h-[60px]',
  answerEmpty: 'text-gray-400 text-center py-2 text-sm',
  palette: 'bg-gray-50 border-2 border-gray-200 rounded-2xl p-4',
  paletteBlock: 'text-gray-700 px-3 py-2 rounded-xl text-sm font-mono shadow hover:shadow-md hover:scale-105 transition-all border border-white',
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: 'white',
    borderTop: '2px solid #e5e7eb',
    boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  bottomInner: 'p-3',
  result: {
    box: 'p-3 border-b',
    ok: 'bg-green-100 border-2 border-green-500 rounded-2xl p-3 flex items-center gap-3',
    okTitle: 'text-green-800 font-bold text-sm',
    okText: 'text-green-700 text-xs',
    ng: 'bg-red-100 border-2 border-red-500 rounded-2xl p-3 flex items-center gap-3',
    ngTitle: 'text-red-800 font-bold text-sm',
    ngText: 'text-red-700 text-xs',
    ngBold: 'text-red-700 text-xs font-bold',
  },
  quizResult: {
    ok: 'bg-green-100 border-2 border-green-500 rounded-2xl p-4 flex items-center gap-3 mb-3',
    okTitle: 'text-green-800 font-bold',
    okText: 'text-green-700 text-sm',
    ng: 'bg-red-100 border-2 border-red-500 rounded-2xl p-4 flex items-center gap-3 mb-3',
    ngTitle: 'text-red-800 font-bold',
    ngText: 'text-red-700 text-sm',
  },
  nextBtn: {
    background: 'linear-gradient(to right, #10b981, #059669)',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '9999px',
    fontWeight: 'bold',
    fontSize: '16px',
    border: '2px solid white',
    boxShadow: cbButtonShadow,
    width: '100%',
    maxWidth: '300px',
  },
  quizNextBtn: {
    background: 'linear-gradient(to right, #10b981, #059669)',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '9999px',
    fontWeight: 'bold',
    fontSize: '16px',
    border: '2px solid white',
    boxShadow: cbButtonShadow,
    width: '100%',
  },
  resetBtn: {
    background: 'linear-gradient(to right, #e5e7eb, #d1d5db)',
    color: '#374151',
    padding: '12px 20px',
    borderRadius: '9999px',
    fontWeight: 'bold',
    fontSize: '14px',
    border: '2px solid white',
    boxShadow: cbButtonShadow,
  },
  checkBtn: (executing) => ({
    background: executing ? '#9ca3af' : 'linear-gradient(to right, #a855f7, #6366f1)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '9999px',
    fontWeight: 'bold',
    fontSize: '14px',
    border: '2px solid white',
    boxShadow: cbButtonShadow,
    opacity: executing ? 0.5 : 1,
  }),
}

// ナビのボタン（オレンジ＝すすむ・白＝やり直す）。ナビのホーム・クリア画面と同じ形
const orange: CSSProperties = {
  background: '#ff8a1f',
  color: 'white',
  borderRadius: '9999px',
  fontWeight: 900,
  border: 'none',
  boxShadow: '0 5px 0 #db6500, 0 12px 24px rgba(255,138,31,.28)',
}

export const NAVI_SKIN: LessonSkin = {
  navi: true,
  root: 'pb-6',
  container: 'mx-auto max-w-[980px] px-8 pt-5',
  progressLabel: 'text-[15px] font-black text-[#2a2452]',
  progressRest: 'text-[13px] font-bold text-[#6d6893]',
  retryLabel: 'text-[15px] font-black text-[#db6500]',
  retryRest: 'text-[13px] font-bold text-[#ff8a1f]',
  seg: {
    base: 'flex-1 h-2.5 rounded-full',
    done: 'bg-[#22b573]',
    wrong: 'bg-[#ff8a1f]',
    current: 'bg-[linear-gradient(90deg,#a259ff,#4f7cff)]',
    rest: 'bg-[#e6e1fa]',
  },
  missionCard: 'mb-4 rounded-[26px] bg-white p-6 shadow-[0_14px_40px_rgba(42,36,82,.08)]',
  avatar:
    'flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(closest-side,#ffffff,#d9ecfb)] shadow-[inset_0_0_0_5px_rgba(255,255,255,.9),0_6px_16px_rgba(42,36,82,.1)]',
  quizCodeBox: 'mb-5 rounded-[20px] bg-[#23203b] px-6 py-5 shadow-lg',
  quizCode: 'whitespace-pre-wrap font-mono text-[17px] leading-[1.8] text-[#dcdcf0]',
  heading: 'mb-2 text-[15px] font-black text-[#6d6893]',
  choiceGrid: 'grid grid-cols-2 gap-3',
  choice: {
    base: 'flex items-center gap-3 rounded-[18px] px-5 py-4 text-left text-[17px] font-bold transition-all',
    right: 'bg-[#e3f7ee] text-[#16905a] shadow-[inset_0_0_0_3px_#22b573]',
    wrong: 'bg-[#ffecec] text-[#c13f3f] shadow-[inset_0_0_0_3px_#ef5a5a]',
    idle: 'bg-white text-[#2a2452] shadow-[inset_0_0_0_2px_#e6e1fa,0_4px_0_#e6e1fa] hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_2px_#b9a6ff,0_4px_0_#d9cffb]',
    letter: 'grid h-8 w-8 flex-none place-items-center rounded-full bg-[#efe9ff] text-[15px] font-black text-[#7448f0]',
  },
  feedback: {
    box: 'mt-4 rounded-[20px] bg-[#fff7e0] p-5 shadow-[inset_0_0_0_2px_#ffe08a]',
    title: 'mb-1 text-[16px] font-black text-[#8a5a00]',
    body: 'text-[15px] font-bold leading-relaxed text-[#6b4a00]',
    retry: 'mt-3 rounded-full bg-[#7448f0] px-6 py-2.5 text-[15px] font-black text-white shadow-[0_4px_0_#5a33c9] transition-transform active:translate-y-[3px] active:shadow-none',
  },
  explanation: { box: 'mt-4 rounded-[20px] bg-[#eaf4fd] p-5', text: 'text-[15px] font-bold leading-relaxed text-[#1f4f7a]' },
  answerArea:
    'min-h-[72px] rounded-[20px] bg-white p-4 shadow-[inset_0_0_0_2px_#c9b8ff] [background-image:radial-gradient(#ece6ff_1.2px,transparent_1.2px)] [background-size:16px_16px]',
  answerEmpty: 'py-3 text-center text-[15px] font-bold text-[#b0a8d6]',
  palette: 'rounded-[20px] bg-[#efeafd] p-4',
  paletteBlock:
    'rounded-[12px] px-3.5 py-2 font-mono text-[16px] font-bold text-[#2a2452] shadow-[0_3px_0_rgba(42,36,82,.15)] transition-all hover:-translate-y-0.5',
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(255,255,255,.96)',
    borderTop: '1px solid #e6e1fa',
    boxShadow: '0 -10px 30px rgba(42,36,82,.08)',
    backdropFilter: 'blur(8px)',
  },
  bottomInner: 'mx-auto max-w-[980px] px-8 py-3',
  result: {
    box: 'mx-auto max-w-[980px] border-b border-[#efeafd] px-8 py-3',
    ok: 'flex items-center gap-3 rounded-[18px] bg-[#e3f7ee] p-3 shadow-[inset_0_0_0_2px_#22b573]',
    okTitle: 'text-[16px] font-black text-[#16905a]',
    okText: 'text-[13px] font-bold text-[#1f7a52]',
    ng: 'flex items-center gap-3 rounded-[18px] bg-[#ffecec] p-3 shadow-[inset_0_0_0_2px_#ef5a5a]',
    ngTitle: 'text-[16px] font-black text-[#c13f3f]',
    ngText: 'text-[13px] font-bold text-[#a33a3a]',
    ngBold: 'text-[13px] font-black text-[#a33a3a]',
  },
  quizResult: {
    ok: 'mb-3 flex items-center gap-3 rounded-[18px] bg-[#e3f7ee] p-4 shadow-[inset_0_0_0_2px_#22b573]',
    okTitle: 'text-[17px] font-black text-[#16905a]',
    okText: 'text-[14px] font-bold text-[#1f7a52]',
    ng: 'mb-3 flex items-center gap-3 rounded-[18px] bg-[#ffecec] p-4 shadow-[inset_0_0_0_2px_#ef5a5a]',
    ngTitle: 'text-[17px] font-black text-[#c13f3f]',
    ngText: 'text-[14px] font-bold text-[#a33a3a]',
  },
  nextBtn: { ...orange, padding: '14px 36px', fontSize: '17px', width: '100%', maxWidth: '320px' },
  quizNextBtn: { ...orange, padding: '14px 36px', fontSize: '17px', width: '100%' },
  resetBtn: {
    background: 'white',
    color: '#7448f0',
    padding: '12px 22px',
    borderRadius: '9999px',
    fontWeight: 900,
    fontSize: '15px',
    border: 'none',
    boxShadow: 'inset 0 0 0 2px #e6e1fa, 0 4px 0 #e6e1fa',
  },
  checkBtn: (executing) => ({
    ...orange,
    background: executing ? '#c9c2ee' : '#ff8a1f',
    boxShadow: executing ? 'none' : orange.boxShadow,
    padding: '12px 32px',
    fontSize: '16px',
  }),
}
