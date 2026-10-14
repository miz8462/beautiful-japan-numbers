"use client";

import dynamic from "next/dynamic";

export const IssueBarLoader = dynamic(
  () => import("./IssueBar").then((mod) => mod.IssueBar),
  { ssr: false }
);
