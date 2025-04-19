import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "東京ラーメンヒートマップ",
  description: "東京エリアのラーメン店舗分布をヒートマップで可視化",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
