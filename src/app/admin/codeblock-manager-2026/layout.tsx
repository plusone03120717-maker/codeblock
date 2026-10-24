import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";

const maru = Zen_Maru_Gothic({ weight: ["500", "700", "900"], subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "CodeBlock 管理画面",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${maru.className} min-h-screen bg-[#f4f3f9] text-[#2a2452]`}>{children}</div>;
}
