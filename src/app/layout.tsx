import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FuriganaProvider } from "@/contexts/FuriganaContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeBlock - ブロックで学ぶはじめてのPython",
  description: "小学生向けプログラミング学習プラットフォーム。ドラッグ＆ドロップでPythonを学ぼう",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <FuriganaProvider>
              {children}
            </FuriganaProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
