import Course from "../models/Course.js";
import Blog from "../models/Blog.js";

const SITE_URL = "https://www.itsparkstech.com";

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/courses", changefreq: "weekly", priority: "0.9" },
  { path: "/placements", changefreq: "monthly", priority: "0.6" },
  { path: "/gallery", changefreq: "monthly", priority: "0.5" },
  { path: "/blog", changefreq: "weekly", priority: "0.6" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
];

const escapeXml = (str = "") =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const buildUrlTag = ({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

export const getSitemap = async (req, res) => {
  try {
    const urls = [];

    staticRoutes.forEach((route) => {
      urls.push(
        buildUrlTag({
          loc: `${SITE_URL}${route.path}`,
          changefreq: route.changefreq,
          priority: route.priority,
        })
      );
    });

    const courses = await Course.find({ isVisible: true }).select(
      "slug updatedAt"
    );
    courses.forEach((course) => {
      if (!course.slug) return; // skip courses without a slug — no clean URL to list
      urls.push(
        buildUrlTag({
          loc: `${SITE_URL}/courses/${course.slug}`,
          lastmod: course.updatedAt
            ? new Date(course.updatedAt).toISOString()
            : undefined,
          changefreq: "weekly",
          priority: "0.8",
        })
      );
    });

    const blogs = await Blog.find({ isVisible: true }).select(
      "slug updatedAt"
    );
    blogs.forEach((blog) => {
      urls.push(
        buildUrlTag({
          loc: `${SITE_URL}/blog/${blog.slug}`,
          lastmod: blog.updatedAt
            ? new Date(blog.updatedAt).toISOString()
            : undefined,
          changefreq: "monthly",
          priority: "0.5",
        })
      );
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
};