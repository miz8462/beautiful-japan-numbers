import "@/app/(main)/globals.css"; // グローバルCSSは共有

export default function FullscreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}