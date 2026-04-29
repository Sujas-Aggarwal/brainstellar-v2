import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { UserProvider } from "./contexts/UserContext";
import "./app.css";


export const meta: Route.MetaFunction = () => [
  { title: "Brainstellar | Puzzles, Brain Teasers & Logical Enigmas" },
  { name: "description", content: "Master the art of logical thinking with Brainstellar. A curated collection of probability, strategy, and discrete math puzzles for tech interviews and mental gymnastics." },
  { name: "keywords", content: "puzzles, brain teasers, logic, interview questions, quantitative, probability puzzles, brainstellar, math puzzles" },
  { property: "og:title", content: "Brainstellar | The Ultimate Puzzle Collection" },
  { property: "og:description", content: "Challenge your intellect with premium logic puzzles and brain teasers. Track your progress locally." },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "theme-color", content: "#f59e0b" },
];

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
  },
  {
    rel: "preconnect",
    href: "https://utteranc.es",
  },
];


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
