'use client'

// Python ナビ（新しいコース）の試しの画面：左に授業動画、右にエディター
import { useState } from 'react'
import { PyEditor } from '@/components/navi/PyEditor'

type Sample = { key: string; label: string; video: string; files: Record<string, string> }

const SAMPLES: Sample[] = [
  {
    key: 's4',
    label: '#5 データ型',
    video: 'YQ916-GV0gQ',
    files: { 'step04.py': '# 動画 #5 を見ながら、同じコードを打ってみよう\nage = 10\nprint("ハロー" + str(age))\nprint("ハロー" * 3)\n' },
  },
  {
    key: 's3',
    label: '#4 台形の面積（input）',
    video: 'FmQSDPM1cNA',
    files: {
      'step03.py':
        'jotei = float(input("上底は？"))\nkatei = float(input("下底は？"))\ntakasa = float(input("高さは？"))\nmenseki = (jotei + katei) * takasa / 2\nprint("台形の面積は", menseki, "です")\n',
    },
  },
  {
    key: 's12',
    label: '#12 足し算アプリ',
    video: 'YwO1IyAnFgQ',
    files: {
      'step12.py':
        'import random\na = random.randint(1, 10)\nb = random.randint(1, 10)\nkotae = input(str(a) + " + " + str(b) + " = ")\nif int(kotae) == a + b:\n    print("せいかい！")\nelse:\n    print("ざんねん。こたえは", a + b)\n',
    },
  },
  {
    key: 's21',
    label: '#18 ボタンのアプリ',
    video: 'v8DK9sqQaA8',
    files: {
      'step21.py':
        'import tkinter as tk\n\nwin = tk.Tk()\nwin.title("あいさつアプリ")\nwin.geometry("300x200")\n\nlabel = tk.Label(win, text="ボタンをおしてね", font=("", 20))\nlabel.pack()\n\ndef aisatsu():\n    label["text"] = "こんにちは！"\n\nbtn = tk.Button(win, text="おす", command=aisatsu)\nbtn.pack()\n\nwin.mainloop()\n',
    },
  },
  {
    key: 's24',
    label: '#21 画像を白黒に',
    video: 'zP5Vhy34qwM',
    files: {
      'step24.py':
        'import tkinter as tk\nfrom tkinter import filedialog\nfrom PIL import Image, ImageTk\n\nwin = tk.Tk()\nwin.title("画像アプリ")\n\npath = filedialog.askopenfilename()\nimg = Image.open(path).convert("L")\nimg = img.resize((300, 200))\ntkimg = ImageTk.PhotoImage(img)\n\ntk.Label(win, image=tkimg).pack()\nwin.mainloop()\n',
    },
  },
]

export function TryClient() {
  const [cur, setCur] = useState(SAMPLES[0])
  return (
    <div className="min-h-screen bg-[#f5f3ff] px-8 py-5 text-[#2a2452]">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <b className="mr-3 text-lg">Python ナビ（試し）</b>
        {SAMPLES.map((s) => (
          <button
            key={s.key}
            onClick={() => setCur(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold shadow-sm ${
              s.key === cur.key ? 'bg-[linear-gradient(135deg,#a259ff,#4f7cff)] text-white' : 'bg-white text-[#6d6893]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-5">
        <div className="overflow-hidden rounded-[22px] bg-[#1d1838] shadow-lg">
          <iframe
            key={cur.video}
            className="aspect-video w-full"
            src={`https://www.youtube-nocookie.com/embed/${cur.video}?rel=0`}
            title={cur.label}
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <PyEditor key={cur.key} initialFiles={cur.files} height={640} />
      </div>
    </div>
  )
}
