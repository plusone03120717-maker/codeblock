"""Python ナビの「アプリの窓」：tkinter の代わり。

ブラウザの中では本物の tkinter が動かないので、同じ書き方で使える部品を用意し、
窓の中身（部品の木）を画面に送って HTML で表示する。ボタンなどの操作は画面から
_dispatch() に届く。動画 #18〜#21 で使う書き方（Tk・title・geometry・Label・Button・
Entry・pack・grid・config・mainloop・StringVar・messagebox・filedialog・PhotoImage）を中心にそろえている。
"""
import base64
import json
import os

import _navi_bridge

END = "end"
LEFT, RIGHT, TOP, BOTTOM = "left", "right", "top", "bottom"
BOTH, X, Y, NONE = "both", "x", "y", "none"
N, S, E, W, NE, NW, SE, SW, CENTER = "n", "s", "e", "w", "ne", "nw", "se", "sw", "center"
NORMAL, DISABLED, ACTIVE = "normal", "disabled", "active"
INSERT = "insert"
RAISED, SUNKEN, FLAT, RIDGE, GROOVE, SOLID = "raised", "sunken", "flat", "ridge", "groove", "solid"
HORIZONTAL, VERTICAL = "horizontal", "vertical"
WORD, CHAR = "word", "char"

_widgets = {}
_counter = 0
_default_root = None
_open = False


class TclError(Exception):
    pass


def _reset():
    global _widgets, _counter, _default_root, _open
    _widgets = {}
    _counter = 0
    _default_root = None
    _open = False


def _app_open():
    return _open and _default_root is not None


def _render():
    if _default_root is None:
        return
    _navi_bridge.render(json.dumps(_default_root._tree(), ensure_ascii=False))


def _dispatch(ev):
    w = _widgets.get(int(ev.get("id", 0)))
    if w is None:
        return
    kind = ev.get("kind")
    if kind == "entry":
        w._set_value(ev.get("value", ""))
        return
    if kind == "click":
        if isinstance(w, (Checkbutton, Radiobutton)):
            w._toggle()
        cmd = w._opts.get("command")
        if cmd:
            cmd()
        for func in w._binds.get("<Button-1>", []):
            func(_Event(w))
    if kind == "key":
        for seq in ("<Return>", "<KeyPress>", "<Key>"):
            if seq == "<Return>" and ev.get("key") != "Enter":
                continue
            for func in w._binds.get(seq, []) + _default_root._binds.get(seq, []):
                func(_Event(w, ev.get("key")))
    _render()


class _Event:
    def __init__(self, widget, key=""):
        self.widget = widget
        self.keysym = key
        self.char = key if len(key or "") == 1 else ""
        self.x = self.y = 0


def _font(value):
    if value is None:
        return None
    if isinstance(value, str):
        parts = value.split()
        value = parts
    size = None
    bold = False
    for p in value[1:] if len(value) > 1 else []:
        if isinstance(p, (int, float)) or (isinstance(p, str) and p.lstrip("-").isdigit()):
            size = abs(int(p))
        elif isinstance(p, str) and "bold" in p:
            bold = True
    return {"size": size, "bold": bold}


class Variable:
    _default = ""

    def __init__(self, master=None, value=None, name=None):
        self._value = self._default if value is None else value
        self._watchers = []

    def get(self):
        return self._value

    def set(self, value):
        self._value = value
        _render()


class StringVar(Variable):
    _default = ""


class IntVar(Variable):
    _default = 0

    def get(self):
        try:
            return int(self._value)
        except (TypeError, ValueError):
            raise TclError(f'expected integer but got "{self._value}"')


class DoubleVar(Variable):
    _default = 0.0


class BooleanVar(Variable):
    _default = False


class PhotoImage:
    def __init__(self, name=None, cnf=None, master=None, file=None, data=None, **kw):
        self._data_url = ""
        self._w = self._h = 0
        if file:
            ext = os.path.splitext(str(file))[1].lower().lstrip(".") or "png"
            with open(file, "rb") as f:
                raw = f.read()
            self._data_url = f"data:image/{ext};base64," + base64.b64encode(raw).decode()

    def width(self):
        return self._w

    def height(self):
        return self._h


class Misc:
    _kind = "widget"

    def __init__(self, master=None, cnf=None, **kw):
        global _counter
        _counter += 1
        self._id = _counter
        self._opts = {}
        self._opts.update(cnf or {})
        self._opts.update(kw)
        self._layout = None
        self._children = []
        self._binds = {}
        if master is None and not isinstance(self, Tk):
            if _default_root is None:
                Tk()
            master = _default_root
        self.master = master
        if master is not None:
            master._children.append(self)
        _widgets[self._id] = self

    # 設定
    def configure(self, cnf=None, **kw):
        self._opts.update(cnf or {})
        self._opts.update(kw)
        _render()

    config = configure

    def cget(self, key):
        return self._opts.get(key, "")

    def __getitem__(self, key):
        return self.cget(key)

    def __setitem__(self, key, value):
        self.configure(**{key: value})

    def keys(self):
        return list(self._opts)

    # ならべ方
    def pack(self, cnf=None, **kw):
        self._layout = {"type": "pack", **(cnf or {}), **kw}
        _render()

    def grid(self, cnf=None, **kw):
        self._layout = {"type": "grid", **(cnf or {}), **kw}
        _render()

    def place(self, cnf=None, **kw):
        self._layout = {"type": "place", **(cnf or {}), **kw}
        _render()

    def pack_forget(self):
        self._layout = None
        _render()

    grid_forget = place_forget = pack_forget

    def destroy(self):
        if self.master is not None and self in self.master._children:
            self.master._children.remove(self)
        _widgets.pop(self._id, None)
        _render()

    def bind(self, sequence=None, func=None, add=None):
        if sequence and func:
            self._binds.setdefault(sequence, []).append(func)

    def focus_set(self):
        pass

    focus = focus_set

    def after(self, ms, func=None, *args):
        if func is None:
            return None
        from js import setTimeout
        from pyodide.ffi import create_once_callable

        def _run():
            func(*args)
            _render()

        return setTimeout(create_once_callable(_run), int(ms))

    def update(self):
        _render()

    def winfo_width(self):
        return 300

    def winfo_height(self):
        return 200

    # 画面に送る形
    def _text(self):
        var = self._opts.get("textvariable")
        if var is not None:
            return str(var.get())
        return str(self._opts.get("text", ""))

    def _tree(self):
        o = self._opts
        image = o.get("image")
        node = {
            "id": self._id,
            "kind": self._kind,
            "text": self._text(),
            "fg": o.get("fg", o.get("foreground")),
            "bg": o.get("bg", o.get("background")),
            "font": _font(o.get("font")),
            "width": o.get("width"),
            "height": o.get("height"),
            "padx": o.get("padx"),
            "pady": o.get("pady"),
            "state": o.get("state"),
            "image": getattr(image, "_data_url", None) if image else None,
            "layout": self._layout,
            "children": [c._tree() for c in self._children if c._layout],
        }
        return node


class Tk(Misc):
    _kind = "tk"

    def __init__(self, screenName=None, baseName=None, className="Tk", useTk=True, **kw):
        global _default_root
        Misc.__init__(self, None, **kw)
        self._title = "tk"
        self._geometry = None
        _default_root = self

    def title(self, text=None):
        if text is None:
            return self._title
        self._title = str(text)
        _render()

    wm_title = title

    def geometry(self, spec=None):
        if spec is None:
            return self._geometry or "300x200"
        self._geometry = str(spec)
        _render()

    wm_geometry = geometry

    def resizable(self, *a, **k):
        pass

    def iconbitmap(self, *a, **k):
        pass

    def mainloop(self, n=0):
        global _open
        _open = True
        _render()

    def quit(self):
        global _open
        _open = False
        _navi_bridge.render(json.dumps({"closed": True}))

    def destroy(self):
        self.quit()

    def _tree(self):
        node = Misc._tree(self)
        node["title"] = self._title
        node["geometry"] = self._geometry
        return node


class Frame(Misc):
    _kind = "frame"


class Label(Misc):
    _kind = "label"


class Message(Label):
    pass


class Button(Misc):
    _kind = "button"

    def invoke(self):
        cmd = self._opts.get("command")
        if cmd:
            return cmd()


class Entry(Misc):
    _kind = "entry"

    def __init__(self, master=None, cnf=None, **kw):
        Misc.__init__(self, master, cnf, **kw)
        self._value = ""

    def _set_value(self, value):
        self._value = value
        var = self._opts.get("textvariable")
        if var is not None:
            var._value = value

    def get(self):
        var = self._opts.get("textvariable")
        if var is not None:
            return str(var.get())
        return self._value

    def insert(self, index, text):
        cur = self.get()
        pos = len(cur) if index in (END, INSERT) else int(index)
        self._set_value(cur[:pos] + str(text) + cur[pos:])
        _render()

    def delete(self, first, last=None):
        cur = self.get()
        a = 0 if first in (0, "0") else (len(cur) if first == END else int(first))
        b = len(cur) if last in (END, None) and last is not None else (a + 1 if last is None else int(last))
        self._set_value(cur[:a] + cur[b:])
        _render()

    def _tree(self):
        node = Misc._tree(self)
        node["value"] = self.get()
        return node


class Text(Entry):
    _kind = "text"

    def get(self, first="1.0", last=END):
        return self._value + "\n"

    def insert(self, index, text, *tags):
        self._set_value(self._value + str(text))
        _render()

    def delete(self, first, last=None):
        self._set_value("")
        _render()


class Checkbutton(Misc):
    _kind = "check"

    def _toggle(self):
        var = self._opts.get("variable")
        if var is not None:
            var.set(not bool(var.get()) if not isinstance(var, IntVar) else (0 if var.get() else 1))

    def _tree(self):
        node = Misc._tree(self)
        var = self._opts.get("variable")
        node["checked"] = bool(var.get()) if var is not None else False
        return node


class Radiobutton(Checkbutton):
    _kind = "radio"

    def _toggle(self):
        var = self._opts.get("variable")
        if var is not None:
            var.set(self._opts.get("value"))

    def _tree(self):
        node = Misc._tree(self)
        var = self._opts.get("variable")
        node["checked"] = var is not None and var.get() == self._opts.get("value")
        return node


def mainloop(n=0):
    """tk.mainloop()（窓ではなく tkinter そのものから呼ぶ書き方）"""
    if _default_root is not None:
        _default_root.mainloop()


def _messagebox_showinfo(title=None, message=None, **options):
    _navi_bridge.message("info", str(title or ""), str(message or ""))
    return "ok"


def _askopenfilename(**options):
    """ファイルを開く画面の代わり：見本の画像を作って、その場所を返す。"""
    path = "/home/pyodide/samples/mihon.png"
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        try:
            from PIL import Image, ImageDraw
        except ImportError:
            return ""
        img = Image.new("RGB", (480, 320), (120, 190, 240))
        d = ImageDraw.Draw(img)
        for i in range(0, 320, 40):
            d.rectangle([0, i, 480, i + 20], fill=(150 + i // 4, 210, 250))
        d.ellipse([170, 70, 310, 210], fill=(255, 210, 63))
        d.rectangle([0, 250, 480, 320], fill=(70, 170, 110))
        img.save(path)
    return path
