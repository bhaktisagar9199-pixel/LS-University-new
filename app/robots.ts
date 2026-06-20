export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      }
    ],
    sitemap: "https://lsuniversity.in/sitemap.xml",
  };
}
