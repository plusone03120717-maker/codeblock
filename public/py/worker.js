// Python ナビのエディター用：ブラウザの中で Python（Pyodide）を動かす係。
// 画面（PyEditor）とはメッセージでやりとりする。
//   画面 → 係：run（ファイルと実行するファイル名）／input（ターミナルで打った答え）／tk-event（アプリの窓のボタンなど）
//   係 → 画面：ready／stdout／stderr／input-request／done／tk-render／tk-message
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.mjs";

const decoder = new TextDecoder();
let pyodide = null;
let pendingInput = null;
let pillowLoaded = false;

function post(msg) {
  self.postMessage(msg);
}

function requestInput(prompt) {
  return new Promise((resolve) => {
    pendingInput = resolve;
    post({ type: "input-request", prompt });
  });
}

function tkRender(treeJson) {
  post({ type: "tk-render", tree: JSON.parse(treeJson) });
}

function tkMessage(kind, title, text) {
  post({ type: "tk-message", kind, title, text });
}

async function boot() {
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/",
  });
  pyodide.setStdout({
    write: (buf) => {
      post({ type: "stdout", text: decoder.decode(buf) });
      return buf.length;
    },
  });
  pyodide.setStderr({
    write: (buf) => {
      post({ type: "stderr", text: decoder.decode(buf) });
      return buf.length;
    },
  });
  pyodide.globals.set("__navi_request_input", requestInput);
  pyodide.globals.set("__navi_tk_render", tkRender);
  pyodide.globals.set("__navi_tk_message", tkMessage);

  // tkinter の代わり（アプリの窓）を読みこむ
  const shim = await (await fetch(new URL("./tkinter_shim.py", import.meta.url))).text();
  pyodide.FS.mkdirTree("/navi/tkinter");
  pyodide.FS.writeFile("/navi/tkinter/__init__.py", shim);
  pyodide.FS.writeFile("/navi/tkinter/messagebox.py", "from tkinter import _messagebox_showinfo as showinfo, _messagebox_showinfo as showwarning, _messagebox_showinfo as showerror\n");
  pyodide.FS.writeFile("/navi/tkinter/filedialog.py", "from tkinter import _askopenfilename as askopenfilename\n");
  const imagetk = await (await fetch(new URL("./imagetk_shim.py", import.meta.url))).text();
  pyodide.FS.writeFile("/navi/tkinter/_imagetk.py", imagetk);

  pyodide.runPython(`
import sys, types, builtins
sys.path.insert(0, "/navi")
from pyodide.ffi import run_sync, can_run_sync

_bridge = types.ModuleType("_navi_bridge")
_bridge.render = __navi_tk_render
_bridge.message = __navi_tk_message
_bridge.request_input = __navi_request_input
sys.modules["_navi_bridge"] = _bridge

def _navi_input(prompt=""):
    sys.stdout.flush()
    if not can_run_sync():
        raise RuntimeError("NAVI_NO_INPUT")
    return run_sync(_bridge.request_input(str(prompt)))

builtins.input = _navi_input
`);
  post({ type: "ready" });
}

const ready = boot().catch((err) => {
  post({ type: "boot-error", message: String(err && err.message ? err.message : err) });
});

async function run({ files, main }) {
  await ready;
  const workdir = "/home/pyodide/navi";
  pyodide.FS.mkdirTree(workdir);
  // 前の実行のファイルとモジュールを片づけてから、今のファイルを書く
  for (const name of pyodide.FS.readdir(workdir)) {
    if (name.endsWith(".py")) pyodide.FS.unlink(`${workdir}/${name}`);
  }
  for (const [name, code] of Object.entries(files)) {
    pyodide.FS.writeFile(`${workdir}/${name}`, code);
  }
  const allCode = Object.values(files).join("\n");
  if (!pillowLoaded && /\bPIL\b/.test(allCode)) {
    post({ type: "stdout", text: "（画像の道具を準備しています…）\n" });
    await pyodide.loadPackage("pillow", { messageCallback: () => {}, errorCallback: () => {} });
    pillowLoaded = true;
  }
  pyodide.globals.set("__navi_main", main);
  pyodide.globals.set("__navi_workdir", workdir);
  pyodide.globals.set("__navi_user_modules", Object.keys(files).map((n) => n.replace(/\.py$/, "")));
  try {
    await pyodide.runPythonAsync(`
import os, sys, runpy
os.chdir(__navi_workdir)
if __navi_workdir not in sys.path:
    sys.path.insert(0, __navi_workdir)
for _m in list(__navi_user_modules):
    sys.modules.pop(_m, None)
import tkinter as _navi_tk
_navi_tk._reset()
try:
    import PIL
    import tkinter._imagetk as _navi_imagetk
    sys.modules["PIL.ImageTk"] = _navi_imagetk
    PIL.ImageTk = _navi_imagetk
except ImportError:
    pass
runpy.run_path(__navi_main, run_name="__main__")
`);
    const appOpen = pyodide.runPython("import tkinter as _t; _t._app_open()");
    post({ type: "done", ok: true, appOpen });
  } catch (err) {
    post({ type: "done", ok: false, error: describeError(err, main) });
  }
}

// エラーを「種類・行・元の文」に分ける（やさしい説明は画面の側で作る）
function describeError(err, main) {
  const text = String(err && err.message ? err.message : err);
  const lines = text.trim().split("\n");
  const last = lines[lines.length - 1] || "";
  const m = last.match(/^(\w+(?:Error|Exception|Interrupt)?):\s?(.*)$/);
  let line = null;
  let file = null;
  const re = /File "([^"]+)", line (\d+)/g;
  let hit;
  while ((hit = re.exec(text))) {
    const f = hit[1].split("/").pop();
    if (!hit[1].startsWith("/lib/") && !hit[1].startsWith("<exec>") && !hit[1].startsWith("/navi/")) {
      file = f;
      line = Number(hit[2]);
    }
  }
  // 自分のファイルの行だけを残した、短い traceback
  const userTrace = [];
  let keep = false;
  for (const l of lines) {
    const fm = l.match(/File "([^"]+)"/);
    if (fm) keep = !fm[1].startsWith("/lib/") && !fm[1].startsWith("<") && !fm[1].startsWith("/navi/");
    if (keep && l !== last) userTrace.push(l.replace(/\/home\/pyodide\/navi\//g, ""));
  }
  if (last) userTrace.push(last);
  return {
    type: m ? m[1] : "Error",
    message: m ? m[2] : last,
    file: file || main,
    line,
    trace: userTrace.join("\n"),
  };
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === "run") {
    await run(msg);
  } else if (msg.type === "input") {
    const resolve = pendingInput;
    pendingInput = null;
    if (resolve) resolve(msg.value);
  } else if (msg.type === "tk-event") {
    await ready;
    try {
      pyodide.globals.set("__navi_event", pyodide.toPy(msg));
      await pyodide.runPythonAsync("import tkinter as _t; _t._dispatch(__navi_event)");
    } catch (err) {
      post({ type: "done", ok: false, error: describeError(err, "") });
    }
  }
};
