import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://labs.krokbit.cz";
  const locales = ["en", "cs"] as const;

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/library", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/templates", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/library/wavy-sphere", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/library/particles", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/library/buttons", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/library/cards", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/library/installation", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/library/cli", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const lastModified = new Date();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route.path}`,
            cs: `${baseUrl}/cs${route.path}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}