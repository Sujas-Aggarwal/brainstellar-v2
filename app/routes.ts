import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("category/:category", "routes/category.tsx"),
  route("difficulty/:difficulty", "routes/difficulty.tsx"),
  route("puzzles/:id", "routes/puzzle-detail.tsx"),
  route("about", "routes/about.tsx"),
  route("discuss", "routes/discuss.tsx"),
  route("submit", "routes/submit.tsx"),
  route("solved/:filter", "routes/solved.tsx"),
  route("sitemap.xml", "routes/sitemap.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
