import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FuriganaProvider } from "@/contexts/FuriganaContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { JsonLd } from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CodeBlock',
  description: '小学生でも楽しくPythonが学べる！ドラッグ&ドロップでプログラミングの基礎を身につけよう。',
  url: 'https://codeblock.example.com',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
  author: {
    '@type': 'Organization',
    name: 'plus one プログラミング教室',
  },
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
    audienceType: '小学生',
  },
  inLanguage: 'ja',
};

const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'CodeBlock Python入門コース',
  description: '小学生向けのPythonプログラミング入門。変数、条件分岐、ループ、リストなどの基礎を学習。',
  provider: {
    '@type': 'Organization',
    name: 'plus one プログラミング教室',
  },
  educationalLevel: '初級',
  inLanguage: 'ja',
  isAccessibleForFree: true,
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
  },
};

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
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={courseJsonLd} />
      </body>
    </html>
  );
}
