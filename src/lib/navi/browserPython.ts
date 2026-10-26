// 仕上げ5問（31-N）の答え合わせを、ブラウザの中の Python（Pyodide）で動かす（2026-10-26 依頼主）。
// これまでの答え合わせのサーバー（Render の無料プラン）は、使われないと眠り、1回目に30秒ほどかかっていた。
// Python ナビのエディターと同じ係（/py/worker.js）を使う。返し方はサーバーの /api/execute と同じ
// （output：出力の前後の空白を落としたもの／error：「実行エラー: …」・5秒で打ち切り）。
// 読みこめないとき（古いブラウザ・CDN に届かない）は null を返し、呼ぶ側がサーバーで動かす

type RunResult = { output: string | null; error: string | null }

let worker: Worker | null = null
let ready: Promise<boolean> | null = null

function boot(): Promise<boolean> {
  if (ready) return ready
  ready = new Promise<boolean>((resolve) => {
    try {
      worker = new Worker('/py/worker.js', { type: 'module' })
    } catch {
      resolve(false)
      return
    }
    const onBoot = (e: MessageEvent) => {
      if (e.data?.type === 'ready') resolve(true)
      else if (e.data?.type === 'boot-error') resolve(false)
      else return
      worker?.removeEventListener('message', onBoot)
    }
    worker.addEventListener('message', onBoot)
    worker.addEventListener('error', () => resolve(false))
  })
  return ready
}

// 問題の画面を開いたときに呼んで、Python を先に読みこんでおく
export function warmPython() {
  void boot()
}

function reset() {
  worker?.terminate()
  worker = null
  ready = null
}

export async function runPythonInBrowser(code: string, timeoutMs = 5000): Promise<RunResult | null> {
  if (!(await boot()) || !worker) {
    reset()
    return null
  }
  const w = worker
  return new Promise<RunResult>((resolve) => {
    let out = ''
    const finish = (r: RunResult) => {
      clearTimeout(timer)
      w.removeEventListener('message', onMsg)
      resolve(r)
    }
    // 止まらないコード（くりかえしが終わらないなど）は、サーバーと同じく打ち切って、係を作り直す
    const timer = setTimeout(() => {
      reset()
      finish({ output: null, error: `コードの実行がタイムアウトしました（${timeoutMs / 1000}秒）` })
    }, timeoutMs)
    const onMsg = (e: MessageEvent) => {
      const m = e.data
      if (m.type === 'stdout') out += m.text
      else if (m.type === 'input-request') w.postMessage({ type: 'input', value: '' }) // 仕上げ5問に input はない
      else if (m.type === 'done') {
        if (m.ok) finish({ output: out.trim() ? out.trim() : null, error: null })
        else finish({ output: null, error: `実行エラー: ${m.error?.message ?? m.error?.type ?? ''}` })
      }
    }
    w.addEventListener('message', onMsg)
    w.postMessage({ type: 'run', files: { 'main.py': code }, main: 'main.py' })
  })
}
