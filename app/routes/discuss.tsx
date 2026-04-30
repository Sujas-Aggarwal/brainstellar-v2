import { Navbar } from "~/components/Navbar";
import { ChevronLeft, MessageCircle, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { Comments } from "~/components/Comments";
import type { Route } from "./+types/discuss";

export const meta: Route.MetaFunction = () => [
  { title: "Puzzle Discussion Forum | Brainfuck" },
  { name: "description", content: "Join the Brainfuck community to discuss interview puzzles, share solutions, and prepare for Quant, HFT, and SDE roles." },
  { property: "og:title", content: "Puzzle Discussion Forum | Brainfuck" },
  { property: "og:url", content: "https://brainfuck.site/discuss" },
  { rel: "canonical", href: "https://brainfuck.site/discuss" },
];

export default function Discuss() {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Navbar />
      
      <header className="mb-12 space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Archive
        </Link>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight flex items-center gap-4">
            Discussion Forum
            <MessageCircle className="w-8 h-8 text-[var(--c-overall)]" />
          </h1>
          <p className="text-sm font-medium text-[var(--muted-fg)] leading-relaxed max-w-xl">
            A collective space to discuss strategies, share variations, and connect with other archive conquerors.
          </p>
        </div>
      </header>

      <div className="space-y-8">
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-3 px-8 py-4 border border-[var(--border)] hover:border-[var(--fg)] transition-all text-[10px] font-bold uppercase tracking-widest"
        >
          <MessageSquare className="w-4 h-4" />
          {showComments ? "Hide Discussion Forum" : "Enter Discussion Forum"}
        </button>

        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${showComments ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="pt-12 mt-4 border-t border-[var(--border)]">
            <Comments />
          </div>
        </div>
      </div>
    </div>
  );
}
