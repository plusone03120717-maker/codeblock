// Python のエラーを、小学生〜中学生向けのやさしい説明に言いかえる
export type PyError = {
  type: string
  message: string
  file: string
  line: number | null
  trace: string
}

export function friendlyError(err: PyError): string {
  const { type, message } = err
  const where = err.line ? `${err.line}行目` : 'どこか'

  if (message.includes('NAVI_NO_INPUT')) {
    return 'このブラウザでは input() が使えません。先生に、Chrome か Edge の新しいものにしてもらおう'
  }
  if (type === 'SyntaxError' || type === 'IndentationError' || type === 'TabError') {
    const full = message.match(/invalid character '(.)'/)
    // × ÷ には半角がないので、「半角で」ではなく、パイソンの記号を教える
    if (full && full[1] === '×') return `${where}の × は、パイソンではつかえないよ。かけ算は * で書こう`
    if (full && full[1] === '÷') return `${where}の ÷ は、パイソンではつかえないよ。わり算は / で書こう`
    if (full) return `${where}に、全角の「${full[1]}」が入っているよ。半角（英数字モード）で打ち直そう`
    if (message.includes('was never closed')) return `${where}のカッコ ( が閉じていないよ。 ) を足そう`
    if (message.includes('unterminated string literal') || message.includes('EOL while scanning'))
      return `${where}の " " が片方だけになっているよ。文字のおわりにも " をつけよう`
    if (message.includes('expected an indented block')) return `${where}の行のはじめに、半角スペース4つ（字下げ）が必要だよ`
    if (message.includes('unexpected indent')) return `${where}の行のはじめに、いらないスペースがあるよ`
    if (message.includes("expected ':'")) return `${where}の行のおわりに : （コロン）をつけよう`
    if (message.includes('unmatched')) return `${where}に、開いていないカッコの ) があるよ`
    if (message.includes('invalid syntax')) return `${where}の書き方がPythonのきまりと合っていないよ。動画のコードと1文字ずつ見くらべよう`
    return `${where}の書き方をもう一度見てみよう（${message}）`
  }
  if (type === 'NameError') {
    const name = message.match(/name '(.+?)' is not defined/)
    if (name) return `${where}の「${name[1]}」という名前が、まだ作られていないよ。つづり・大文字小文字・" " のつけわすれを確かめよう`
  }
  if (type === 'TypeError') {
    if (message.includes('can only concatenate str') || message.includes("unsupported operand type(s) for +: 'int' and 'str'"))
      return `${where}：文字と数は + でつなげないよ。数も " " でかこもう`
    // input の答え（文字）のまま計算したとき（ステップ8：(ue + shita) * takasa など・動画と同じ説明）
    if (message.includes("can't multiply sequence") || (message.includes('unsupported operand') && message.includes("'str'")))
      return `${where}：文字のままでは計算できないよ。float( ) で数にしよう`
    if (message.includes('takes') && message.includes('positional argument'))
      return `${where}：関数に渡すもの（引数）の数が合っていないよ`
    if (message.includes('not callable')) return `${where}：( ) をつけて呼べないものに ( ) がついているよ`
  }
  if (type === 'ValueError' && (message.includes('invalid literal for int()') || message.includes('could not convert string to float')))
    return `${where}：数ではない文字を数にしようとしたよ。答えは半角の数字で入れよう`
  if (type === 'ZeroDivisionError') return `${where}：0 でわり算はできないよ`
  if (type === 'IndexError') return `${where}：リストの番号が大きすぎるよ。番号は 0 から始まるよ`
  if (type === 'KeyError') return `${where}：辞書にない名前（キー）を使ったよ。つづりを確かめよう`
  if (type === 'AttributeError') return `${where}：その道具には、その名前の使い方がないよ。つづりを確かめよう`
  if (type === 'ModuleNotFoundError') {
    const mod = message.match(/No module named '(.+?)'/)
    return `${where}：「${mod ? mod[1] : ''}」というファイルや道具が見つからないよ。ファイル名とつづりを確かめよう`
  }
  return `${where}でエラーが出たよ（${type}）。動画のコードと見くらべよう`
}

// 先生の画面の「苦手」で数えるエラーの種類（friendlyError と同じ分け方）
export function errorKind(err: PyError): string {
  const { type, message } = err
  if (message.includes('NAVI_NO_INPUT')) return 'other'
  if (type === 'SyntaxError' || type === 'IndentationError' || type === 'TabError') {
    if (/invalid character '[×÷]'/.test(message)) return 'mathSign'
    if (message.includes('invalid character')) return 'fullwidth'
    if (message.includes('was never closed') || message.includes('unmatched')) return 'paren'
    if (message.includes('unterminated string literal') || message.includes('EOL while scanning')) return 'quote'
    if (message.includes('indent')) return 'indent'
    if (message.includes("expected ':'")) return 'colon'
    return 'syntax'
  }
  if (type === 'NameError') return 'name'
  if (type === 'TypeError') {
    if (message.includes('can only concatenate str') || message.includes("unsupported operand type(s) for +: 'int' and 'str'")) return 'concat'
    if (message.includes("can't multiply sequence") || (message.includes('unsupported operand') && message.includes("'str'"))) return 'strCalc'
    return 'type'
  }
  if (type === 'ValueError') return 'value'
  if (type === 'IndexError' || type === 'KeyError') return 'index'
  return 'other'
}

// エラーの種類ごとの名前と、先生の声かけの例
export const ERROR_TALK: Record<string, { label: string; talk: string }> = {
  fullwidth: { label: '全角で打った', talk: '「キーボードの『半角/全角』を押して、A にしてから打ってみよう」' },
  mathSign: { label: '× ÷ を使った', talk: '「Python のかけ算は * 、わり算は / だよ。キーボードのどこにあるかな？」' },
  paren: { label: 'カッコの閉じわすれ', talk: '「( と ) の数を、指でかぞえてみよう」' },
  quote: { label: '" の閉じわすれ', talk: '「文字のはじめと おわりに " があるか、見てみよう」' },
  indent: { label: '字下げ（行のはじめの空白）', talk: '「if や for の次の行は、Tab キーで字下げしよう」' },
  colon: { label: ': のつけわすれ', talk: '「if や for の行のおわりに : はある？」' },
  syntax: { label: '書き方のまちがい', talk: '「💡 ヒントのコードと、1文字ずつくらべてみよう」' },
  name: { label: '名前のつづり・作りわすれ', talk: '「その名前、上の行で = で作ってある？ つづりは同じ？」' },
  concat: { label: '文字と数を + でつないだ', talk: '「数も \" \" でかこむと、文字としてつなげられるよ」' },
  strCalc: { label: 'input の答えのまま計算', talk: '「input の答えは文字だよ。float( ) で数にしてから計算しよう」' },
  type: { label: '型のまちがい', talk: '「黄色い説明を、いっしょに読もう。何行目って書いてある？」' },
  value: { label: '数にできない値', talk: '「答えは半角の数字で入れてみよう」' },
  index: { label: 'リストの番号・辞書の名前', talk: '「番号は 0 から始まるよ。いくつ入っているか数えてみよう」' },
  other: { label: 'そのほかのエラー', talk: '「黄色い説明を、いっしょに読もう。何行目って書いてある？」' },
}
