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

  return [...staticPages, ...levelPages];
}
