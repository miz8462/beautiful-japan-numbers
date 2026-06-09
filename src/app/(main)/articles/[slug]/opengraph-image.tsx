import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/app/(main)/articles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> }

export default async function OGImage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const title = article?.title ?? "美しい日本の数字";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#5bbee4",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px 96px",
        }}
      >
        <div style={{ color: "#ffffff", fontSize: 52, fontWeight: 500, lineHeight: 1.3, marginBottom: 24 }}>
          {title}
        </div>
        <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.4)", marginBottom: 16 }} />
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, letterSpacing: "0.1em" }}>
          美しい日本の数字
        </div>
      </div>
    ),
    size
  );
}