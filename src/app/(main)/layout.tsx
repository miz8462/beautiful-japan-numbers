import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/app/(main)/components/SiteHeader";
import "./globals.css";
import { SITE_URL } from "../../lib/site";

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
    description: "偏見やイメージではなく、信頼できるデータで、日本を正しく見る。数字は、嘘をつかない。",
    url: "/",
  },

  twitter: {
    card: "summary_large_image",
    title: "美しい日本の数字",
    description: "偏見やイメージではなく、信頼できるデータで、日本を正しく見る。数字は、嘘をつかない。",
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
        <footer className="site-footer">
          <div className="container site-footer-grid">
            <section>
              <h2>リソース</h2>
              <a href="https://www.mof.go.jp/policy/budget/reference/statistics/data.htm">
                財務省 統計表
              </a>
            </section>
            <section>
              <h2>SNS</h2>
              <p>準備中</p>
            </section>
            <section>
              <h2>美しい日本の数字</h2>
              <p>© 2026 Beautiful Japan Numbers</p>
            </section>
          </div>
        </footer>
      </body>
    </html>
  );
}
