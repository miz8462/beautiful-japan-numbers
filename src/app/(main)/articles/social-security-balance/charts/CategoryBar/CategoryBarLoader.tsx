"use client";

import dynamic from "next/dynamic";

export const CategoryBarLoader = dynamic(
  () => import("./CategoryBar").then((mod) => mod.CategoryBar),
  { ssr: false }
);
