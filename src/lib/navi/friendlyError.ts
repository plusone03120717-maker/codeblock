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
      return `${where}：文字と数は + でつなげないよ。str() で数を文字にしよう`
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
