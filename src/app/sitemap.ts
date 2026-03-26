import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jlpt.howlrs.net";
  const levels = ["n1", "n2", "n3", "n4", "n5"];

  // コンテンツ最終更新日（デプロイ時に更新する）
  const contentUpdated = new Date("2026-03-26");
  const staticUpdated = new Date("2026-03-18");

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticUpdated,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: staticUpdated,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: staticUpdated,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const levelPages: MetadataRoute.Sitemap = levels.map((level) => ({
    url: `${baseUrl}/${level}`,
    lastModified: contentUpdated,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const mainCategories = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const quizPages: MetadataRoute.Sitemap = [];
  for (const level of levels) {
    for (const cat of mainCategories) {
      quizPages.push({
        url: `${baseUrl}/${level}/quiz?category=${cat}`,
        lastModified: contentUpdated,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...levelPages, ...quizPages];
}
