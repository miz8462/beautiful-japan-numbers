"use client";

import dynamic from "next/dynamic";

export const TrendLineLoader = dynamic(
  () => import("./TrendLine").then((mod) => mod.TrendLine),
  { ssr: false }
);
