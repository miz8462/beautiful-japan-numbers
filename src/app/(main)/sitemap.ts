import { articles } from "@/app/(main)/articles/articles";
import { SITE_URL } from "@/lib/site";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const articleRoutes = articles.map((article) => ({
    url: `${SITE_URL}${article.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...articleRoutes,
  ];
}