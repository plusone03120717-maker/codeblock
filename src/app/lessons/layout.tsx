import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'レッスン一覧',
  description: 'Python学習レッスンの一覧。変数、条件分岐、ループ、リストなど、プログラミングの基礎を順番に学べます。',
};

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
