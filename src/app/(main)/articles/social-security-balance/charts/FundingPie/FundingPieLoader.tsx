"use client";

import dynamic from "next/dynamic";

export const FundingPieLoader = dynamic(
  () => import("./FundingPie").then((mod) => mod.FundingPie),
  { ssr: false }
);
