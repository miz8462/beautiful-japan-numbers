"use client";

import dynamic from "next/dynamic";

const SocialSecurityTrend = dynamic(
  () => import("./SocialSecurityTrend").then((mod) => mod.SocialSecurityTrend),
  { ssr: false }
);

export default function SocialSecurityTrendLoader() {
  return <SocialSecurityTrend />;
}
