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
import { Footer } from "./components/Footer";
import "./app.css";


export const meta: Route.MetaFunction = () => [
  { title: "Brainfuck | 100+ Free Interview Puzzles for Quant, HFT & SDE" },
  { name: "description", content: "Access 100+ high-quality logic puzzles for free. Prepare for Quant, HFT, and SDE interviews with puzzles asked in top-tier tech companies. The most complete archive for developers and programmers." },
  { name: "keywords", content: "puzzles for interview, brainstellar, interview puzzles, puzzle questions for interview, puzzles asked in interviews, quant interview puzzles, HFT interview questions, SDE puzzles, coding interview brain teasers, maths puzzles for developers, programmer brain teasers, tech job puzzles, brainfuck logic" },
  
  // Social Meta
  { property: "og:title", content: "Brainfuck | 100+ Free Interview Puzzles" },
  { property: "og:description", content: "Free, high-quality logic puzzles for Quant, HFT, and Tech interviews. 100+ problems with detailed solutions." },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://brainfuck.site" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Brainfuck | 100+ Free Interview Puzzles" },
  { name: "twitter:description", content: "Master the puzzles asked in top-tier interviews. 100% free, high-fidelity solutions." },
  
  // SEO Technical
  { name: "robots", content: "index, follow" },
  { name: "theme-color", content: "#18181b" },
  { name: "author", content: "Sujas Aggarwal" },
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
    href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
  },
  {
    rel: "preconnect",
    href: "https://utteranc.es",
  },
  {
    rel: "canonical",
    href: "https://brainfuck.site",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Brainfuck",
              "url": "https://brainfuck.site",
              "description": "Access 100+ high-quality logic puzzles for free. Prepare for Quant, HFT, and SDE interviews.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://brainfuck.site/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
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
      <Footer />
    </UserProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
  }

  return (
    <main className="pt-24 p-6 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center text-center space-y-8">
      <h1 className="text-9xl font-black opacity-10">{message}</h1>
      <p className="text-xl font-bold uppercase tracking-tight">{details}</p>
      <Link to="/" className="px-8 py-4 border border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] font-bold uppercase tracking-widest text-[10px]">Back to Puzzles</Link>
    </main>
  );
}
