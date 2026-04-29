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
import { ChevronLeft, Lightbulb, CheckCircle2, Circle, Eye, EyeOff, Heart, Award, Info, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import type { Route } from "./+types/puzzle-detail";

export const meta: Route.MetaFunction = ({ params }) => {
  const puzzle = (puzzlesData as any[]).find(p => p.puzzleId.toString() === params.id);
  if (!puzzle) return [{ title: "Puzzle Not Found | Brainstellar" }];
  
  const description = puzzle.question.slice(0, 155).replace(/[#*`]/g, "") + "...";
  
  return [
    { title: `${puzzle.title} | ${puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)} Logic Puzzle` },
    { name: "description", content: description },
    { name: "keywords", content: `${puzzle.category}, ${puzzle.difficulty}, logic puzzle, ${puzzle.title} solution` },
    { property: "og:title", content: puzzle.title },
    { property: "og:description", content: description },
  ];
};

const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
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

  const jsonLd = puzzle ? {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": puzzle.title,
    "description": puzzle.question.slice(0, 200),
    "educationalLevel": puzzle.difficulty,
    "genre": puzzle.category,
  } : null;

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Puzzle Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const extraFields = Object.keys(puzzle).filter(key => !IGNORED_KEYS.includes(key));

  const toggleSection = (key: string) => {
    setRevealedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6">
      <Navbar />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main className="max-w-4xl mx-auto space-y-12">
        {/* Navigation & Header */}
        <div className="space-y-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Challenges
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  {puzzle.difficulty}
                </span>
                <span className="bg-white/5 text-white/40 border border-white/10 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  {puzzle.category}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                {puzzle.title}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleFavorite(puzzleId)}
                className={clsx(
                  "p-3.5 rounded-2xl transition-all border",
                  isFavorite 
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
                    : "bg-white/5 border-white/5 text-white/60 hover:text-white"
                )}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart className={clsx("w-6 h-6", isFavorite && "fill-rose-500")} />
              </button>
              <button
                onClick={() => toggleSolved(puzzleId)}
                className={clsx(
                  "flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all border",
                  isSolved 
                    ? "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                    : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {isSolved ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                {isSolved ? "Solved" : "Mark as Solved"}
              </button>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <section className="glass rounded-[2rem] p-8 sm:p-12 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Award className="w-32 h-32" />
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none relative z-10">
            <ReactMarkdown 
              remarkPlugins={[remarkMath, remarkGfm]} 
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {puzzle.question.replace(/assets\/images\//g, "/assets/images/")}
            </ReactMarkdown>
          </div>

          {/* Hint Section */}
          {puzzle.hint && (
            <div className="space-y-4 relative z-10">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity"
              >
                <Lightbulb className="w-5 h-5" />
                {showHint ? "Hide Hint" : "Need a Hint?"}
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-primary/80 italic leading-relaxed">
                      {puzzle.hint}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Answer/Solution Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              Comprehensive Solution
            </h3>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-sm font-bold border border-white/5"
            >
              {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showSolution ? "Hide Details" : "Reveal Solution"}
            </button>
          </div>

          <AnimatePresence>
            {showSolution ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="glass rounded-[2rem] p-8 sm:p-12 border-primary/20 space-y-12">
                  {/* Final Answer Summary */}
                  {puzzle.answer && (
                    <div className="space-y-3">
                      <span className="inline-block text-[10px] uppercase tracking-widest font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        Final Answer
                      </span>
                      <div className="text-2xl font-bold text-white leading-tight bg-white/5 p-6 rounded-2xl border border-white/5">
                        {puzzle.answer}
                      </div>
                    </div>
                  )}

                  {/* Main Solution */}
                  {puzzle.solution && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-white/20 uppercase tracking-widest">Initial Explanation</h4>
                      <div className="prose prose-invert prose-lg max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath, remarkGfm]} 
                          rehypePlugins={[rehypeKatex, rehypeRaw]}
                        >
                          {puzzle.solution.replace(/assets\/images\//g, "/assets/images/")}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Extra Fields */}
                  {extraFields.map((key) => {
                    const value = puzzle[key];
                    if (!value) return null;

                    const isHiddenByDefault = key.toLowerCase().includes("solution") || 
                                             key.toLowerCase().includes("answer") ||
                                             key.toLowerCase().includes("misstep");
                    const isRevealed = revealedSections[key] || !isHiddenByDefault;

                    return (
                      <div key={key} className="space-y-4 pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary/40" />
                            <h4 className="text-sm font-black text-white/80 uppercase tracking-widest">
                              {formatKey(key)}
                            </h4>
                          </div>
                          {isHiddenByDefault && (
                            <button
                              onClick={() => toggleSection(key)}
                              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                            >
                              {isRevealed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              {isRevealed ? "Hide Details" : "Reveal Details"}
                            </button>
                          )}
                        </div>
                        
                        <AnimatePresence initial={false}>
                          {isRevealed && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className={clsx(
                                "prose prose-invert prose-lg max-w-none",
                                key.toLowerCase().includes("followup") && "bg-white/2 p-6 rounded-2xl border border-white/5"
                              )}>
                                <ReactMarkdown 
                                  remarkPlugins={[remarkMath, remarkGfm]} 
                                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                                >
                                  {String(value).replace(/assets\/images\//g, "/assets/images/")}
                                </ReactMarkdown>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {/* Meta Details Footer */}
                  {(puzzle.source || puzzle.comment) && (
                    <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
                      {puzzle.source && (
                        <div className="flex items-center gap-2 text-white/30 italic">
                          <ExternalLink className="w-3 h-3" />
                          Source: {puzzle.source}
                        </div>
                      )}
                      {puzzle.comment && (
                        <div className="text-white/20">
                          {puzzle.comment}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-[2rem] p-12 text-center border-dashed border-white/10">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-8 h-8 text-white/20" />
                  </div>
                  <h4 className="text-white font-bold text-lg">Detailed Solution is hidden</h4>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Brainstellar is about mental gymnastics! Take your time to think through the logic before revealing the deep dive.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Discussion Section */}
        <Comments />
      </main>
    </div>
  );
}
