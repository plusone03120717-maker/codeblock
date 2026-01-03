import { doc, getDoc, setDoc, updateDoc, Timestamp, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, UserSubscription, SubscriptionPlan, PLAN_FEATURES } from "@/types/user";

// デフォルトのサブスクリプション（無料プラン）
export const getDefaultSubscription = (): UserSubscription => ({
  plan: "free",
  status: "active",
  startDate: null,
  endDate: null,
});

// ユーザープロファイルを取得
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      
      // 既存のユーザーデータからUserProfileを構築
      // subscriptionが存在しない場合はデフォルトを設定
      const subscription = data.subscription || getDefaultSubscription();
      
      return {
        uid,
        email: data.email || data.contactEmail || "",
        displayName: data.displayName || "",
        subscription: {
          ...subscription,
          startDate: subscription.startDate instanceof Timestamp 
            ? subscription.startDate.toDate() 
            : (subscription.startDate ? new Date(subscription.startDate) : null),
          endDate: subscription.endDate instanceof Timestamp 
            ? subscription.endDate.toDate() 
            : (subscription.endDate ? new Date(subscription.endDate) : null),
        },
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt instanceof Timestamp 
          ? data.updatedAt.toDate() 
          : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// ユーザープロファイルを作成
export const createUserProfile = async (
  uid: string,
  email: string,
  displayName: string
): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid,
    email,
    displayName,
    subscription: getDefaultSubscription(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...userProfile,
    subscription: {
      ...userProfile.subscription,
      startDate: userProfile.subscription.startDate || null,
      endDate: userProfile.subscription.endDate || null,
    },
    createdAt: Timestamp.fromDate(userProfile.createdAt),
    updatedAt: Timestamp.fromDate(userProfile.updatedAt),
  }, { merge: true });
  
  return userProfile;
};

// サブスクリプションを更新
export const updateSubscription = async (
  uid: string,
  subscription: Partial<UserSubscription>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  const subscriptionData: any = {
    ...subscription,
  };
  
  if (subscription.startDate) {
    subscriptionData.startDate = Timestamp.fromDate(subscription.startDate);
  }
  if (subscription.endDate) {
    subscriptionData.endDate = Timestamp.fromDate(subscription.endDate);
  }
  
  await updateDoc(userRef, {
    subscription: subscriptionData,
    updatedAt: Timestamp.now(),
  });
};

// プランの特典を取得
export const getPlanFeatures = (plan: SubscriptionPlan) => {
  return PLAN_FEATURES[plan];
};

// 有料プランかどうか
export const isPremiumPlan = (plan: SubscriptionPlan): boolean => {
  return plan === "monthly" || plan === "yearly" || plan === "plusone";
};

// レッスンにアクセスできるか
export const canAccessLesson = (plan: SubscriptionPlan, lessonNumber: number): boolean => {
  const features = PLAN_FEATURES[plan];
  return lessonNumber <= features.maxLesson;
};

// 1日のヒント上限を取得
export const getDailyHintLimit = (plan: SubscriptionPlan): number => {
  return PLAN_FEATURES[plan].dailyHints;
};

// サブスクリプションが有効か
export const isSubscriptionActive = (subscription: UserSubscription): boolean => {
  if (subscription.status !== "active") return false;
  if (subscription.plan === "free" || subscription.plan === "plusone") return true;
  if (!subscription.endDate) return false;
  return new Date() < subscription.endDate;
};

// サブスクリプションを有料プランに更新
export const upgradeToPremium = async (
  uid: string,
  plan: "monthly" | "yearly"
): Promise<void> => {
  const now = new Date();
  let endDate: Date;
  
  if (plan === "monthly") {
    // 1ヶ月後
    endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    // 1年後
    endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  
  const subscription: UserSubscription = {
    plan,
    status: "active",
    startDate: now,
    endDate,
  };
  
  await updateSubscription(uid, subscription);
};

// 全ユーザーを取得
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users: UserProfile[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "",
        subscription: {
          plan: data.subscription?.plan || "free",
          status: data.subscription?.status || "active",
          startDate: data.subscription?.startDate?.toDate() || null,
          endDate: data.subscription?.endDate?.toDate() || null,
        },
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

// プランを手動で変更
export const changeUserPlan = async (
  uid: string,
  plan: SubscriptionPlan
): Promise<void> => {
  const now = new Date();
  let endDate: Date | null = null;
  
  if (plan === "monthly") {
    endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (plan === "yearly") {
    endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else if (plan === "plusone") {
    // plus oneは無期限
    endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 10); // 10年後
  }
  
  const subscription: UserSubscription = {
    plan,
    status: "active",
    startDate: plan === "free" ? null : now,
    endDate,
  };
  
  await updateSubscription(uid, subscription);
};

