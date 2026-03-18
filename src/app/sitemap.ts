import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jlpt.howlrs.net";
  const levels = ["n1", "n2", "n3", "n4", "n5"];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const levelPages: MetadataRoute.Sitemap = levels.map((level) => ({
    url: `${baseUrl}/${level}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Main category IDs per level for quiz pages
  const mainCategories = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const quizPages: MetadataRoute.Sitemap = [];
  for (const level of levels) {
    for (const cat of mainCategories) {
      quizPages.push({
        url: `${baseUrl}/${level}/quiz?category=${cat}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...levelPages, ...quizPages];
}
