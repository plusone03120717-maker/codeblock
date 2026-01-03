export type SubscriptionPlan = "free" | "monthly" | "yearly" | "plusone";

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: "active" | "canceled" | "expired";
  startDate: Date | null;
  endDate: Date | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  subscription: UserSubscription;
  createdAt: Date;
  updatedAt: Date;
}

// プランの特典定義
export const PLAN_FEATURES = {
  free: {
    maxLesson: 3,           // レッスン1-3まで
    dailyHints: 3,          // 1日3回
    smartReview: "limited", // 無料範囲のみ
    dailyChallenge: false,
    detailedStats: false,
  },
  monthly: {
    maxLesson: 9,           // 全レッスン
    dailyHints: 10,         // 1日10回
    smartReview: "full",    // 全範囲
    dailyChallenge: true,
    detailedStats: true,
  },
  yearly: {
    maxLesson: 9,
    dailyHints: 10,
    smartReview: "full",
    dailyChallenge: true,
    detailedStats: true,
  },
  plusone: {
    maxLesson: 9,
    dailyHints: 10,
    smartReview: "full",
    dailyChallenge: true,
    detailedStats: true,
  },
} as const;

// 料金定義
export const PLAN_PRICES = {
  monthly: {
    price: 980,
    label: "月額プラン",
    description: "月額980円",
    period: "month",
  },
  yearly: {
    price: 6800,
    label: "年間プラン",
    description: "年間6,800円（月あたり567円）",
    period: "year",
    savings: "42%お得",
  },
} as const;

