import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '復習',
  description: '学んだ内容を復習して定着させよう。スマートレビューシステムで効率的に復習できます。',
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
