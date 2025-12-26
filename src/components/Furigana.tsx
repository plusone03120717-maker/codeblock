"use client";

import { ReactNode } from "react";
import { useFurigana } from "@/contexts/FuriganaContext";

interface FuriganaProps {
  children: string;
  reading: string;
}

// 単語にふりがなを付けるコンポーネント
export function F({ children, reading }: FuriganaProps) {
  const { furiganaEnabled } = useFurigana();

  if (furiganaEnabled) {
    return <>{children}（{reading}）</>;
  }

  return <>{children}</>;
}

// よく使う単語のふりがな付きテキスト
// 小学6年生以上の漢字にふりがなを付ける
export const words = {
  変数: { text: "変数", reading: "へんすう" },
  関数: { text: "関数", reading: "かんすう" },
  引数: { text: "引数", reading: "ひきすう" },
  条件: { text: "条件", reading: "じょうけん" },
  分岐: { text: "分岐", reading: "ぶんき" },
  演算: { text: "演算", reading: "えんざん" },
  代入: { text: "代入", reading: "だいにゅう" },
  出力: { text: "出力", reading: "しゅつりょく" },
  入力: { text: "入力", reading: "にゅうりょく" },
  宣言: { text: "宣言", reading: "せんげん" },
  定義: { text: "定義", reading: "ていぎ" },
  実行: { text: "実行", reading: "じっこう" },
  結果: { text: "結果", reading: "けっか" },
  値: { text: "値", reading: "あたい" },
  型: { text: "型", reading: "かた" },
  文字列: { text: "文字列", reading: "もじれつ" },
  整数: { text: "整数", reading: "せいすう" },
  小数: { text: "小数", reading: "しょうすう" },
  余り: { text: "余り", reading: "あまり" },
  連結: { text: "連結", reading: "れんけつ" },
  復習: { text: "復習", reading: "ふくしゅう" },
  完了: { text: "完了", reading: "かんりょう" },
  進捗: { text: "進捗", reading: "しんちょく" },
  挑戦: { text: "挑戦", reading: "ちょうせん" },
  正解: { text: "正解", reading: "せいかい" },
  不正解: { text: "不正解", reading: "ふせいかい" },
  期待: { text: "期待", reading: "きたい" },
  表示: { text: "表示", reading: "ひょうじ" },
  選択: { text: "選択", reading: "せんたく" },
  確認: { text: "確認", reading: "かくにん" },
  説明: { text: "説明", reading: "せつめい" },
  基本: { text: "基本", reading: "きほん" },
  応用: { text: "応用", reading: "おうよう" },
  理解: { text: "理解", reading: "りかい" },
  練習: { text: "練習", reading: "れんしゅう" },
  問題: { text: "問題", reading: "もんだい" },
  解答: { text: "解答", reading: "かいとう" },
  累計: { text: "累計", reading: "るいけい" },
  連続: { text: "連続", reading: "れんぞく" },
  命令: { text: "命令", reading: "めいれい" },
  画面: { text: "画面", reading: "がめん" },
  文字: { text: "文字", reading: "もじ" },
  使い方: { text: "使い方", reading: "つかいかた" },
  改行: { text: "改行", reading: "かいぎょう" },
  方法: { text: "方法", reading: "ほうほう" },
  数字: { text: "数字", reading: "すうじ" },
  計算: { text: "計算", reading: "けいさん" },
  意味: { text: "意味", reading: "いみ" },
  準備: { text: "準備", reading: "じゅんび" },
  実際: { text: "実際", reading: "じっさい" },
  第一歩: { text: "第一歩", reading: "だいいっぽ" },
  四則: { text: "四則", reading: "しそく" },
  四則演算: { text: "四則演算", reading: "しそくえんざん" },
  中身: { text: "中身", reading: "なかみ" },
  上書き: { text: "上書き", reading: "うわがき" },
  同士: { text: "同士", reading: "どうし" },
  組み合わせ: { text: "組み合わせ", reading: "くみあわせ" },
  複数: { text: "複数", reading: "ふくすう" },
};

// 単語キーから直接ふりがな付きテキストを返すヘルパー
export function FW({ word }: { word: keyof typeof words }) {
  const { furiganaEnabled } = useFurigana();
  const w = words[word];

  if (furiganaEnabled) {
    return <>{w.text}（{w.reading}）</>;
  }

  return <>{w.text}</>;
}

// テキスト内の既知の単語にふりがなを付けるコンポーネント
export function FuriganaText({ text }: { text: string }) {
  const { furiganaEnabled } = useFurigana();
  
  if (!furiganaEnabled) {
    return <>{text}</>;
  }

  // 長い単語から順にマッチさせるため、文字数の降順でソート
  const sortedWords = Object.entries(words).sort((a, b) => b[0].length - a[0].length);
  
  let result: ReactNode[] = [];
  let remainingText = text;
  let key = 0;

  while (remainingText.length > 0) {
    let matched = false;
    
    // 既知の単語を探す
    for (const [word, data] of sortedWords) {
      if (remainingText.startsWith(word)) {
        // 単語が見つかった
        result.push(
          <span key={key++}>
            {data.text}（{data.reading}）
          </span>
        );
        remainingText = remainingText.slice(word.length);
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      // マッチしなかった場合は1文字ずつ追加
      result.push(<span key={key++}>{remainingText[0]}</span>);
      remainingText = remainingText.slice(1);
    }
  }

  return <>{result}</>;
}


