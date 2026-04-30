import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useState, useEffect } from "react";
import { ExternalLink, Globe, ShieldAlert, X } from "lucide-react";

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
    rel: "canonical",
    href: "https://www.brainfuck.online",
  },
  {
    rel: "preconnect",
    href: "https://www.brainfuck.online",
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
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const targetDomain = "www.brainfuck.online";

    // Redirect logic
    if (
      hostname !== targetDomain &&
      hostname !== "localhost" &&
      !hostname.includes("127.0.0.1")
    ) {
      window.location.replace(`https://${targetDomain}${window.location.pathname}${window.location.search}`);
      return;
    }

    // Show migration modal if on legacy domain or for testing
    if (hostname.includes("sujas.me") || hostname.includes("localhost")) {
      setShowMigrationModal(true);
      checkConnectivity();
    }
  }, []);

  const checkConnectivity = () => {
    setChecking(true);
    const img = new Image();
    const timeout = setTimeout(() => {
      setIsAvailable(false);
      setChecking(false);
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      setIsAvailable(true);
      setChecking(false);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      setIsAvailable(false);
      setChecking(false);
    };
    // Ping the site image with a cache-buster
    img.src = `https://www.brainfuck.online/ping.png?t=${Date.now()}`;
  };

  return (
    <UserProvider>
      <Outlet />
      <Footer />

      {/* Migration Modal */}
      {showMigrationModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-6 bg-(--bg)/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="w-full max-w-lg bg-(--bg) border border-(--border) shadow-2xl overflow-hidden relative group">
            {/* Accent Bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-(--c-hard) via-(--c-overall) to-(--c-easy)" />
            
            <div className="p-8 sm:p-12 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-(--muted) rounded-2xl">
                  <Globe className="w-6 h-6 text-(--fg)" />
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
                  Brainfuck is evolving. We are moving our entire puzzle archive to our new permanent home at <span className="text-(--fg) font-bold italic">www.brainfuck.online</span>.
                </p>
                
                <div className="p-6 border border-(--border) bg-(--muted)/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-(--muted-fg)">
                      Network Status
                    </span>
                    {checking ? (
                      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-(--muted-fg)">
                        <div className="w-1.5 h-1.5 rounded-full bg-(--muted-fg) animate-pulse" />
                        Verifying...
                      </span>
                    ) : isAvailable ? (
                      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-(--c-easy)">
                        <div className="w-1.5 h-1.5 rounded-full bg-(--c-easy)" />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-(--c-deadly)">
                        <div className="w-1.5 h-1.5 rounded-full bg-(--c-deadly)" />
                        Blocked
                      </span>
                    )}
                  </div>
                  
                  {!checking && isAvailable === false && (
                    <div className="flex gap-3 text-xs font-bold text-(--c-deadly) items-start">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <p className="uppercase tracking-tight leading-tight">
                        It seems our new domain is currently unavailable on your local network. You can stay here for now.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {isAvailable && (
                  <a
                    href="https://www.brainfuck.online"
                    className="flex-1 flex items-center justify-center gap-2 bg-(--fg) text-(--bg) px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-(--fg)/10"
                  >
                    Go to www.brainfuck.online
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
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
              <X className="w-4 h-4" />
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
