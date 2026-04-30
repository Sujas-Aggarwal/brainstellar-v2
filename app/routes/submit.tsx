import { Navbar } from "~/components/Navbar";
import { ChevronLeft, Send } from "lucide-react";
import { Link } from "react-router";

import type { Route } from "./+types/submit";

export const meta: Route.MetaFunction = () => [
  { title: "Submit a Puzzle | Brainfuck" },
  { name: "description", content: "Contribute to the Brainfuck archive. Submit high-quality logic puzzles for Quant, HFT, and SDE interview preparation." },
  { property: "og:title", content: "Submit a Puzzle | Brainfuck" },
  { property: "og:url", content: "https://brainfuck.site/submit" },
  { rel: "canonical", href: "https://brainfuck.site/submit" },
];

export default function Submit() {
  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Navbar />
      
      <header className="mb-20 space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Archive
        </Link>
        <h1 className="text-5xl font-bold tracking-tight">Expand the Archive</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)]">
        <div className="p-10 bg-[var(--bg)] space-y-6">
          <h2 className="text-xl font-bold tracking-tight uppercase">Method A: Pull Request</h2>
          <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
            The most efficient way to contribute is directly through GitHub. Fork the repository and add your puzzle to the <code>puzzles.json</code> file.
          </p>
          <a 
            href="https://github.com/Sujas-Aggarwal/brainstellar-v2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 border border-[var(--fg)] font-bold uppercase text-[10px] tracking-[0.2em] bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 transition-all"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub Repo
          </a>
        </div>

        <div className="p-10 bg-[var(--bg)] space-y-6">
          <h2 className="text-xl font-bold tracking-tight uppercase">Method B: Direct Submit</h2>
          <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
            Have a lethal puzzle but not comfortable with code? Share it in our global discussion with heading "Question Submit".
          </p>
          <Link 
            to="/discuss"
            className="inline-flex items-center gap-3 px-6 py-3 border border-[var(--border)] font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-[var(--muted)] transition-all"
          >
            <Send className="w-4 h-4" />
            Submit via Discussion
          </Link>
        </div>
      </div>

      <article className="prose mt-20 border-t border-[var(--border)] pt-16">
        <h2>Submission Guidelines</h2>
        <ul>
          <li><strong>Originality</strong>: We prefer unique puzzles or interesting variations.</li>
          <li><strong>Clarity</strong>: The question must be unambiguous.</li>
          <li><strong>Completeness</strong>: Always provide a detailed solution.</li>
          <li><strong>Intensity</strong>: Puzzles should ideally fit into our difficulty tiers.</li>
        </ul>
      </article>
    </div>
  );
}
