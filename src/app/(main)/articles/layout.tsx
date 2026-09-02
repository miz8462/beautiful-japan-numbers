import { PageLayout } from "@/components/layout/Page";
import type { ReactNode } from "react";

export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
