import type { LoaderFunctionArgs } from "react-router";
import puzzles from "../data/puzzles.json";

export async function loader({ request }: LoaderFunctionArgs) {
  const baseUrl = "https://www.brainfuck.online";

  const categories = Array.from(new Set(puzzles.map((p: any) => p.category?.toLowerCase()))).filter(Boolean);
  const difficulties = Array.from(new Set(puzzles.map((p: any) => p.difficulty?.toLowerCase()))).filter(Boolean);
  const puzzleIds = Array.from(new Set(puzzles.map((p: any) => p.puzzleId))).filter(Boolean);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/discuss</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/submit</loc>
    <priority>0.8</priority>
  </url>
  ${categories
    .map(
      (category) => `
  <url>
    <loc>${baseUrl}/category/${encodeURIComponent(category)}</loc>
    <priority>0.7</priority>
  </url>`
    )
    .join("")}
  ${difficulties
    .map(
      (difficulty) => `
  <url>
    <loc>${baseUrl}/difficulty/${encodeURIComponent(difficulty)}</loc>
    <priority>0.7</priority>
  </url>`
    )
    .join("")}
  ${puzzleIds
    .map(
      (id) => `
  <url>
    <loc>${baseUrl}/puzzles/${id}</loc>
    <priority>0.6</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
