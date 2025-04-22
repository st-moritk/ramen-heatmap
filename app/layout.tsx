import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "東京ラーメンヒートマップ",
  description: "東京エリアのラーメン店舗分布をヒートマップで可視化",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://yourdomain.com/",
    title: "東京ラーメンヒートマップ",
    description: "東京エリアのラーメン店舗分布をヒートマップで可視化",
    images: ["/screenshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "東京ラーメンヒートマップ",
    description: "東京エリアのラーメン店舗分布をヒートマップで可視化",
    images: ["/screenshot.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
