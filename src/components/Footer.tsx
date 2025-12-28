"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFurigana } from "@/contexts/FuriganaContext";

export default function Footer() {
  const pathname = usePathname();
  const { furiganaEnabled, toggleFurigana } = useFurigana();

  const navItems = [
    {
      href: "/",
      label: "ホーム",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      href: "/lessons",
      label: "レッスン",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
    },
    {
      href: "/achievements",
      label: "実績",
      icon: (
        <span className="text-2xl">🏆</span>
      ),
    },
    {
      href: "/options",
      label: "オプション",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      <nav className="max-w-md mx-auto">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-500 hover:text-purple-500"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-bold">{item.label}</span>
                </Link>
              </li>
            );
          })}
          
          {/* ふりがな切り替えボタン */}
          <li>
            <button
              onClick={toggleFurigana}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                furiganaEnabled
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              <span className="text-xl">あ</span>
              <span className="text-xs font-bold">
                {furiganaEnabled ? "ふりがなON" : "ふりがな"}
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </footer>
  );
}





