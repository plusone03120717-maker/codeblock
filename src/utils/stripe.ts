export type PlanType = "monthly" | "yearly";

interface CreateCheckoutParams {
  plan: PlanType;
  userId: string;
  userEmail: string;
}

export const createCheckoutSession = async ({
  plan,
  userId,
  userEmail,
}: CreateCheckoutParams): Promise<string | null> => {
  try {
    // 環境変数の値を確認（ビルド時に埋め込まれる値）
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    // 本番環境の判定（codeblock.jpでアクセスしている場合）
    const isProduction = typeof window !== 'undefined' && (
      window.location.hostname === 'codeblock.jp' || 
      window.location.hostname === 'www.codeblock.jp'
    );
    // API URLの決定: 環境変数がある場合はそれを使い、なければ本番環境では固定値、ローカルではlocalhost
    const API_URL = envApiUrl || (isProduction ? "https://codeblock-api.onrender.com" : "http://localhost:8000");
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan,
        user_id: userId,
        user_email: userEmail,
        success_url: `${window.location.origin}/subscription/success?plan=${plan}`,
        cancel_url: `${window.location.origin}/subscription/cancel`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Checkout error:", error);
      throw new Error(error.detail || "Failed to create checkout session");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Checkout error:", error);
    return null;
  }
};

