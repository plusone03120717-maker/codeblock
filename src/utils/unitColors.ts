// ユニットごとの色定義（共通）
// ユニットボタンの色に統一
export const UNIT_COLORS = {
  gradients: [
    "from-green-400 to-green-500",    // unit 1: print関数（緑系）
    "from-blue-400 to-blue-500",       // unit 2: 変数（青系）
    "from-purple-400 to-purple-500",   // unit 3: データ型（紫系）
    "from-orange-400 to-orange-500",   // unit 4: 条件分岐（オレンジ系）
    "from-pink-400 to-pink-500",       // unit 5: ループ（ピンク系）
    "from-yellow-400 to-yellow-500",   // unit 6: リスト（黄色系）
    "from-red-400 to-red-500",         // unit 7: 関数の基本（赤系）
    "from-violet-400 to-violet-500",   // unit 8: 戻り値と応用（紫系）
  ],
  solid: [
    "bg-green-500",    // unit 1: print関数（緑系）
    "bg-blue-500",     // unit 2: 変数（青系）
    "bg-purple-500",   // unit 3: データ型（紫系）
    "bg-orange-500",   // unit 4: 条件分岐（オレンジ系）
    "bg-pink-500",     // unit 5: ループ（ピンク系）
    "bg-yellow-500",   // unit 6: リスト（黄色系）
    "bg-red-500",      // unit 7: 関数の基本（赤系）
    "bg-violet-500",   // unit 8: 戻り値と応用（紫系）
  ],
};

// ユニット番号からグラデーション色を取得
export const getUnitGradient = (unitNumber: number): string => {
  const index = (unitNumber - 1) % UNIT_COLORS.gradients.length;
  return UNIT_COLORS.gradients[index];
};

// ユニット番号から単色を取得
export const getUnitSolid = (unitNumber: number): string => {
  const index = (unitNumber - 1) % UNIT_COLORS.solid.length;
  return UNIT_COLORS.solid[index];
};

