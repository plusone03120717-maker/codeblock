// ナビ（ホームの VTuber）が声で言う文。
// 画面の吹き出しと同じ中身を、読みまちがえない書き方にしたもの。
// ・生徒の名前は言わない（漢字の名前を読みまちがえるため）
// ・英語はカタカナ、記号や「#7」「3:20」「21-1」は読み方に直す
// ・見出しの名前（print など）は言わず、画面を見てもらう
import type { NaviStep } from './types'
import type { NextAction } from './progress'

const videoNo = (no: string) => no.replace('#', '').replace('.', 'の') + '番'
const lessonNo = (id: string) => id.replace('-', 'の')
// 「分」は「ふん／ぷん」をまちがえやすいので、ひらがなで書く（3分 → さんぷん）
const FUN = ['', 'いっぷん', 'にふん', 'さんぷん', 'よんぷん', 'ごふん', 'ろっぷん', 'ななふん', 'はっぷん', 'きゅうふん']
const DIGIT = ['', '', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう']
const minutes = (m: number) => {
  const tens = Math.floor(m / 10)
  const ones = m % 10
  if (tens === 0) return FUN[ones]
  return ones === 0 ? `${DIGIT[tens]}じゅっぷん` : `${DIGIT[tens]}じゅう${FUN[ones]}`
}
const minSec = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return m > 0 ? `${minutes(m)}${s > 0 ? `${s}秒` : ''}` : `${s}秒`
}

export const FIRST_TIME_SPEECH =
  'はじめまして！ わたしは、いちか。よろしくね！ プログラミングは、コンピューターへの命令を、文字で書くこと。' +
  'パイソンは、エーアイなどでも使われていて、短く書けるのがいいところ。' +
  'スクラッチのブロックが、文字になったと思ってね。「はじめる」を押してみよう！'

function actionSpeech(step: NaviStep, a: NextAction): string {
  if (a.kind === 'video') return a.from > 0 ? '動画のつづきを、10秒もどして見よう' : `動画${videoNo(step.video?.no ?? '')}を見ながら、コードを打っていこう`
  if (a.kind === 'section') return '動画で打ったコードの、結果を出すところからだよ'
  if (a.kind === 'codeblock') return a.mission > 0 ? `コードブロックの${lessonNo(a.lessonId)}を、${a.mission + 1}問目からやろう` : `コードブロックの${lessonNo(a.lessonId)}をやろう`
  return 'つぎのステップへ進もう'
}

export function returnSpeech(step: NaviStep, a: NextAction, videoPos: number, needReview: boolean): string {
  const last = a.kind === 'video' && a.from > 0 && step.video ? `前回は、動画${videoNo(step.video.no)}の、${minSec(videoPos)}のところで、おわりにしたね。` : '前回のつづきから始めよう。'
  const review = needReview ? 'まずは、おさらいを1問。そのあと、' : '今日は、'
  return `おかえり！ ${last}${review}${actionSpeech(step, a)}。「はじめる」を押してね。`
}

export const REVIEW_RIGHT_SPEECH = 'せいかい！ よく覚えていたね。'
export const REVIEW_WRONG_SPEECH = 'おしい！ 正しいのは、チェックのついた答えだよ。'
