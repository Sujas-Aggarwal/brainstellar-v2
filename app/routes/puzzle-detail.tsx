import { useState } from "react";
import { useParams, Link } from "react-router";
import { useUser } from "~/contexts/UserContext";
import puzzlesData from "~/data/puzzles.json";
import { Navbar } from "~/components/Navbar";
import { Comments } from "~/components/Comments";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { ChevronLeft, Heart, Circle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import type { Route } from "./+types/puzzle-detail";

export const meta: Route.MetaFunction = ({ params }) => {
  const puzzle = (puzzlesData as any[]).find(p => p.puzzleId.toString() === params.id);
  if (!puzzle) return [{ title: "Puzzle Not Found" }];
  return [{ title: `${puzzle.title} | Archive` }];
};

const formatKey = (key: string) => {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
};

const IGNORED_KEYS = ["puzzleId", "title", "difficulty", "category", "question", "hint", "answer", "solution", "source", "comment"];

export default function PuzzleDetail() {
  const { id } = useParams();
  const { solvedPuzzles, favoritePuzzles, toggleSolved, toggleFavorite } = useUser();
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({});
  
  const puzzleId = Number(id);
  const puzzle = (puzzlesData as any[]).find(p => p.puzzleId === puzzleId);
  const isSolved = solvedPuzzles.includes(puzzleId);
  const isFavorite = favoritePuzzles.includes(puzzleId);

  if (!puzzle) return <div className="p-24 text-center font-bold uppercase tracking-widest text-[var(--muted-fg)]">Not Found</div>;

  const extraFields = Object.keys(puzzle).filter(key => !IGNORED_KEYS.includes(key));

  const toggleSection = (key: string) => {
    setRevealedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="pt-20 pb-20 px-6 max-w-4xl mx-auto min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Navbar />

      <header className="mb-12 space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Archive
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] border border-[var(--border)] px-2 py-0.5 text-[var(--muted-fg)]">
                {puzzle.difficulty}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-[var(--muted)] text-[var(--muted-fg)] px-2 py-0.5">
                {puzzle.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              {puzzle.title}
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => toggleFavorite(puzzleId)}
              className={clsx(
                "p-3.5 border transition-all",
                isFavorite 
                  ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]" 
                  : "bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--fg)]"
              )}
            >
              <Heart className={clsx("w-4 h-4", isFavorite && "fill-current")} />
            </button>
            <button
              onClick={() => toggleSolved(puzzleId)}
              className={clsx(
                "flex items-center gap-2 px-6 py-3.5 border font-bold uppercase text-[10px] tracking-[0.2em] transition-all",
                isSolved 
                  ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]" 
                  : "bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--fg)]"
              )}
            >
              {isSolved ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-[var(--muted-fg)]/40" />}
              {isSolved ? "Solved" : "Solve"}
            </button>
          </div>
        </div>
      </header>

      <article className="border-t border-[var(--border)] pt-12 space-y-12">
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
            {puzzle.question.replace(/assets\/images\//g, "/assets/images/")}
          </ReactMarkdown>
        </div>

        {puzzle.hint && (
          <div className="border border-[var(--border)] p-8 space-y-4 bg-[var(--muted)]/20">
            <button onClick={() => setShowHint(!showHint)} className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-[var(--fg)] pb-0.5 hover:text-[var(--muted-fg)] hover:border-[var(--muted-fg)] transition-all">
              {showHint ? "Hide Hint" : "Hint"}
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="text-sm font-medium text-[var(--muted-fg)] italic leading-relaxed"
                >
                  {puzzle.hint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <section className="space-y-8">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className={clsx(
              "w-full py-6 border font-bold uppercase tracking-[0.2em] text-[11px] transition-all",
              showSolution 
                ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]" 
                : "bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--fg)]"
            )}
          >
            {showSolution ? "Hide Solution" : "Reveal Solution"}
          </button>

          <AnimatePresence>
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-[var(--border)] p-8 sm:p-12 space-y-12"
              >
                {puzzle.answer && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">Answer:</span>
                    <div className="text-xl sm:text-2xl font-bold tracking-tight border-l-2 border-[var(--fg)] pl-6 py-1">
                      {puzzle.answer}
                    </div>
                  </div>
                )}

                {puzzle.solution && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">Explanation:</span>
                    <div className="prose">
                      <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
                        {puzzle.solution.replace(/assets\/images\//g, "/assets/images/")}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {extraFields.map(key => {
                  const isHidden = key.toLowerCase().includes("solution") || key.toLowerCase().includes("answer");
                  const isRevealed = revealedSections[key] || !isHidden;

                  return (
                    <div key={key} className="space-y-4 pt-12 border-t border-[var(--border)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">{formatKey(key)}:</span>
                        {isHidden && (
                          <button onClick={() => toggleSection(key)} className="text-[10px] font-bold uppercase tracking-[0.15em] underline underline-offset-4">
                            {isRevealed ? "Hide" : "Reveal"}
                          </button>
                        )}
                      </div>
                      {isRevealed && (
                        <div className="prose">
                          <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex, rehypeRaw]}>
                            {String(puzzle[key]).replace(/assets\/images\//g, "/assets/images/")}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  );
                })}

                {(puzzle.source || puzzle.comment) && (
                  <footer className="pt-12 border-t border-[var(--border)] flex flex-col gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]/60">
                    {puzzle.source && <div>Source: {puzzle.source}</div>}
                    {puzzle.comment && <div className="leading-relaxed whitespace-pre-wrap">{puzzle.comment}</div>}
                  </footer>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <Comments />
      </article>
    </div>
  );
}
