import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/app/(main)/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "美しい日本の数字",
  description: "この国のデータをわかりやすく",

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
