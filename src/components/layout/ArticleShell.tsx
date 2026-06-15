"use client";
import { ShareButtons } from "@/components/ui/share-buttons/ShareButtons";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function ArticleShell({ title, children }: Props) {
  return (
    <div>
      {children}
      <div className="container">
        <ShareButtons title={title} />
      </div>
    </div>
  );
}