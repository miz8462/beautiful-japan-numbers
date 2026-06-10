// src/components/layout/ArticleShell.tsx
"use client";
import { ShareButtons } from "@/components/ui/ShareButtons/ShareButtons";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function ArticleShell({ title, children }: Props) {
  return (
    <div>
      {children}
      <div className="container">
        <ShareButtons title={title}/>
      </div>
    </div>
  );
}