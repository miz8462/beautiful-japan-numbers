import { SiteHeader } from "@/app/(main)/components/SiteHeader";
import { SITE_URL } from "@/lib/site";
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from "next";
import { SiteFooter } from "./components/SiteFooter";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "美しい日本の数字",
    template: "%s | 美しい日本の数字",
  },
  description: "この国のデータをわかりやすく",

  metadataBase: new URL(SITE_URL),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "美しい日本の数字",
    title: "美しい日本の数字",
    description: "偏見やイメージではなく、信頼できるデータから、日本の今を見つめよう。",
    url: "/",
  },

  twitter: {
    card: "summary_large_image",
    title: "美しい日本の数字",
    description: "偏見やイメージではなく、信頼できるデータから、日本の今を見つめよう。",
  },

  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-icon.png",
  },

  manifest: "/manifest.json",

  appleWebApp: {
    title: "BJN",
  },
};

export const viewport: Viewport = {
  themeColor: "#5BBEE4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
