import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("puzzles/:id", "routes/puzzle-detail.tsx"),
  route("about", "routes/about.tsx"),
  route("discuss", "routes/discuss.tsx"),
  route("submit", "routes/submit.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
