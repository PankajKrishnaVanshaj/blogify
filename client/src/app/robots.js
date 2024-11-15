export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard/*", // Disallow /dashboard path
    },
    sitemap: "https://blogify.pankri.com/sitemap.xml", // Location of the sitemap
  };
}
