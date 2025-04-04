export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/dashboard/*",
      },
    ],
    sitemap: "https://blogify.pankri.com/sitemap.xml",
  };
}
