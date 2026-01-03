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
    const response = await fetch("http://localhost:8000/api/create-checkout-session", {
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

