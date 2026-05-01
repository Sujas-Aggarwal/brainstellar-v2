import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useState, useEffect } from "react";

import type { Route } from "./+types/root";
import { UserProvider } from "./contexts/UserContext";
import { Footer } from "./components/Footer";
import "./app.css";

export const meta: Route.MetaFunction = () => [
  { title: "Brainfuck | 100+ Free Interview Puzzles for Quant, HFT & SDE" },
  {
    name: "description",
    content:
      "Access 100+ high-quality logic puzzles for free. Prepare for Quant, HFT, and SDE interviews with puzzles asked in top-tier tech companies. The most complete archive for developers and programmers.",
  },
  {
    name: "keywords",
    content:
      "puzzles for interview, brainstellar, interview puzzles, puzzle questions for interview, puzzles asked in interviews, quant interview puzzles, HFT interview questions, SDE puzzles, coding interview brain teasers, maths puzzles for developers, programmer brain teasers, tech job puzzles, brainfuck logic",
  },

  // Social Meta
  { property: "og:title", content: "Brainfuck | 100+ Free Interview Puzzles" },
  {
    property: "og:description",
    content:
      "Free, high-quality logic puzzles for Quant, HFT, and Tech interviews. 100+ problems with detailed solutions.",
  },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://www.brainfuck.online" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Brainfuck | 100+ Free Interview Puzzles" },
  {
    name: "twitter:description",
    content:
      "Master the puzzles asked in top-tier interviews. 100% free, high-fidelity solutions.",
  },

  // SEO Technical
  { name: "robots", content: "index, follow" },
  { name: "theme-color", content: "#18181b" },
  { name: "author", content: "Sujas Aggarwal" },
];

export const links: Route.LinksFunction = () => [
  // Preconnect to font origins
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  // Non-render-blocking font load (preload → swap to stylesheet via JS in Layout)
  {
    rel: "preload",
    as: "style",
    href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // Non-render-blocking KaTeX (same preload trick)
  {
    rel: "preload",
    as: "style",
    href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
  },
  { rel: "canonical", href: "https://www.brainfuck.online" },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "icon", type: "image/png", href: "/favicon.png" },
];

// Inline SVGs for the migration modal – avoids importing lucide-react in root
const IconGlobe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconExternalLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Script that converts preload links to actual stylesheets without blocking render
const NON_BLOCKING_STYLE_SCRIPT = `
(function(){
  var links=document.querySelectorAll('link[rel="preload"][as="style"]');
  for(var i=0;i<links.length;i++){
    links[i].rel='stylesheet';
  }
})();
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Activate preloaded stylesheets without blocking render */}
        <script dangerouslySetInnerHTML={{ __html: NON_BLOCKING_STYLE_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Brainfuck",
              url: "https://www.brainfuck.online",
              description:
                "Access 100+ high-quality logic puzzles for free. Prepare for Quant, HFT, and SDE interviews.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.brainfuck.online/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
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
  const [showMigrationModal, setShowMigrationModal] = useState(false);

  const location = useLocation();

  // Defer PostHog entirely until the browser is idle so it never blocks paint
  useEffect(() => {
    const load = () =>
      import("~/lib/posthog").then(({ initPostHog, trackEvent }) => {
        initPostHog();
        trackEvent("$pageview");
      });

    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(load, { timeout: 3000 });
    } else {
      setTimeout(load, 1000);
    }
  }, []);

  // Track subsequent page views after navigation
  useEffect(() => {
    import("~/lib/posthog").then(({ trackEvent }) => {
      trackEvent("$pageview");
    });
  }, [location.pathname]);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (
      hostname.includes("sujas.me") ||
      hostname.includes("brainfuck.site") ||
      hostname.includes("brainfuck.com") ||
      hostname.includes("localhost")
    ) {
      setShowMigrationModal(true);
    }
  }, []);

  return (
    <UserProvider>
      <Outlet />
      <Footer />

      {/* Migration Modal – only rendered on legacy domains */}
      {showMigrationModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-6 bg-(--bg)/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="w-full max-w-lg bg-(--bg) border border-(--border) shadow-2xl overflow-hidden relative group">
            {/* Accent Bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-(--c-hard) via-(--c-overall) to-(--c-easy)" />

            <div className="p-8 sm:p-12 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-(--muted) rounded-2xl text-(--fg)">
                  <IconGlobe />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">
                    New Home Found
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--muted-fg)">
                    Domain Migration Announcement
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium leading-relaxed text-(--muted-fg)">
                  Brainfuck is evolving. We are moving our entire puzzle archive to our new permanent home at{" "}
                  <span className="text-(--fg) font-bold">brainfuck.online</span>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://www.brainfuck.online"
                  className="flex-1 flex items-center justify-center gap-2 bg-(--fg) text-(--bg) px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-(--fg)/10"
                >
                  Go to brainfuck.online
                  <IconExternalLink />
                </a>
                <button
                  onClick={() => setShowMigrationModal(false)}
                  className="flex-1 border border-(--border) text-(--muted-fg) px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:text-(--fg) hover:border-(--fg) transition-all"
                >
                  Stay Here
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowMigrationModal(false)}
              className="absolute top-6 right-6 p-2 text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors"
            >
              <IconX />
            </button>
          </div>
        </div>
      )}
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
      <Link
        to="/"
        className="px-8 py-4 border border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] font-bold uppercase tracking-widest text-[10px]"
      >
        Back to Puzzles
      </Link>
    </main>
  );
}
