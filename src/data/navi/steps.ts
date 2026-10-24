// Python ナビ（新しいコース）の本編のステップ。
// 中身は授業動画の字幕から作る（カリキュラムは Obsidian の「Pythonコース_新しいカリキュラム」）。
import type { NaviStep } from '@/lib/navi/types'

export const NAVI_STEPS: NaviStep[] = [
  {
    step: 4,
    unit: 1,
    title: '#5 データ型',
    video: { no: '#5', id: 'YQ916-GV0gQ', length: 420, end: 395 },
    fileName: 'step04.py',
    sections: [
      { title: '文字列と数値', start: 0, code: 'print("10")\nprint(10)', expected: ['10', '10'] },
      { title: '文字列のたし算', start: 76, code: 'print("ハロー" + "10")', expected: ['ハロー10'] },
      { title: 'str() で数を文字に', start: 193, code: 'age = 10\nprint("ハロー" + str(age))', expected: ['ハロー10'], mustUse: ['str('] },
      { title: '文字列のかけ算', start: 302, code: 'print("ハロー" * 3)', expected: ['ハローハローハロー'], mustUse: ['*'] },
    ],
    learn: ['"10" と 10 はちがうもの', '文字どうしは + でつなげる', 'str() で数を文字にかえる', '文字に * でくりかえす'],
    codeblock: ['3-1', '3-2', '3-3'],
    review: { question: '"ハロー" + 10 を実行すると？', choices: ['ハロー10 と出る', 'エラーになる', 'ハロー と出る'], answer: 1 },
  },
]

export const getNaviStep = (n: number) => NAVI_STEPS.find((s) => s.step === n)
export const lastNaviStep = () => Math.max(...NAVI_STEPS.map((s) => s.step))
