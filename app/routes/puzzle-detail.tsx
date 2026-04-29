import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import puzzlesData from "~/data/puzzles.json";
import { Navbar } from "~/components/Navbar";
import { Comments } from "~/components/Comments";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { useUser } from "~/contexts/UserContext";
import { ChevronLeft, ChevronRight, Star, CheckCircle, MessageSquare } from "lucide-react";
import type { Route } from "./+types/puzzle-detail";

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) return [{ title: "Puzzle Not Found | Brainfuck" }];
  const { puzzle } = data as { puzzle: typeof puzzlesData[0] };
  return [
    { title: `${puzzle.title} | Interview Puzzle Solution` },
    { name: "description", content: `Solution for ${puzzle.title}. A ${puzzle.difficulty} level ${puzzle.category} puzzle often asked in Quant, HFT, and SDE interviews. Reimagined from Brainstellar.` },
    { name: "keywords", content: `puzzles for interview, interview puzzles, ${puzzle.title} solution, ${puzzle.category} puzzles, ${puzzle.difficulty} logic puzzles, Brainstellar puzzles, quant interview questions` }
  ];
};

export async function loader({ params }: { params: { id: string } }) {
  const puzzleId = parseInt(params.id);
  const puzzle = puzzlesData.find((p) => p.puzzleId === puzzleId);
  if (!puzzle) throw new Response("Not Found", { status: 404 });
  return { puzzle };
}

export default function PuzzleDetail({ loaderData }: { loaderData: { puzzle: typeof puzzlesData[0] } }) {
  const { puzzle } = loaderData;
  const { solvedPuzzles, toggleSolved, favoritePuzzles, toggleFavorite } = useUser();
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const isSolved = solvedPuzzles.includes(puzzle.puzzleId);
  const isFavorite = favoritePuzzles.includes(puzzle.puzzleId);

  const prevPuzzle = puzzlesData.find(p => p.puzzleId === puzzle.puzzleId - 1);
  const nextPuzzle = puzzlesData.find(p => p.puzzleId === puzzle.puzzleId + 1);

  const excludedKeys = ["puzzleId", "title", "difficulty", "category", "question", "solution", "answer", "hint"];
  const additionalFields = Object.entries(puzzle)
    .filter(([key, value]) => !excludedKeys.includes(key) && value && typeof value === "string" && value.trim().length > 0)
    .sort((a, b) => {
      const order = ["followUpQuestion", "followUpAnswer", "followUpSolution", "observation", "generalization"];
      const idxA = order.indexOf(a[0]);
      const idxB = order.indexOf(b[0]);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a[0].localeCompare(b[0]);
    })
    .map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/(\d+)/g, ' $1').replace(/^./, str => str.toUpperCase()),
      content: value as string,
      key
    }));

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Navbar />
      
      <header className="mb-12 space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Archive
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toggleFavorite(puzzle.puzzleId)}
              className={`p-2 border transition-all ${isFavorite ? 'bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]' : 'border-[var(--border)] text-[var(--muted-fg)] hover:text-[var(--fg)] hover:border-[var(--fg)]'}`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => toggleSolved(puzzle.puzzleId)}
              className={`flex items-center gap-2 px-4 py-2 border font-bold uppercase text-[10px] tracking-widest transition-all ${isSolved ? 'bg-[var(--c-easy)]/10 text-[var(--c-easy)] border-[var(--c-easy)]' : 'border-[var(--border)] text-[var(--muted-fg)] hover:text-[var(--fg)] hover:border-[var(--fg)]'}`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {isSolved ? "Conquered" : "Mark Solved"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] px-2 py-1 bg-[var(--muted)] text-[var(--muted-fg)]">
              #{puzzle.puzzleId}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--muted-fg)]">
              {puzzle.category}
            </span>
            <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: `var(--c-${puzzle.difficulty.toLowerCase()})` }}>
              {puzzle.difficulty}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
            {puzzle.title}
          </h1>
        </div>
      </header>

      <main className="space-y-16">
        <article className="prose max-w-none border-t border-[var(--border)] pt-12">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex, rehypeRaw]}
          >
            {puzzle.question}
          </ReactMarkdown>
        </article>

        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className={`py-4 border-2 font-bold uppercase tracking-[0.2em] text-[10px] transition-all ${showHint ? 'bg-[var(--bg)] border-[var(--fg)] text-[var(--fg)]' : 'bg-[var(--muted)] border-[var(--border)] text-[var(--muted-fg)] hover:border-[var(--fg)] hover:text-[var(--fg)]'}`}
            >
              {showHint ? "Hide Hint" : "Get a Hint"}
            </button>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className={`py-4 border-2 font-bold uppercase tracking-[0.2em] text-[10px] transition-all ${showAnswer ? 'bg-[var(--bg)] border-[var(--fg)] text-[var(--fg)]' : 'bg-[var(--muted)] border-[var(--border)] text-[var(--muted-fg)] hover:border-[var(--fg)] hover:text-[var(--fg)]'}`}
            >
              {showAnswer ? "Hide Answer" : "See Answer"}
            </button>
            <button
              onClick={() => {
                setShowSolution(!showSolution);
                if (!showSolution) {
                  setShowHint(true);
                  setShowAnswer(true);
                }
              }}
              className={`py-4 border-2 font-bold uppercase tracking-[0.2em] text-[10px] transition-all ${showSolution ? 'bg-[var(--bg)] border-[var(--fg)] text-[var(--fg)]' : 'bg-[var(--fg)] border-[var(--fg)] text-[var(--bg)] hover:opacity-90'}`}
            >
              {showSolution ? "Hide Solution" : "Full Revelation"}
            </button>
          </div>

          {(showHint || showAnswer || showSolution) && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              {showHint && puzzle.hint && (
                <div className="p-8 border border-[var(--border)] bg-[var(--muted)]/20 italic text-sm">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] mb-3 not-italic">Nudge</h3>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]} 
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {puzzle.hint}
                  </ReactMarkdown>
                </div>
              )}

              {showAnswer && puzzle.answer && (
                <div className="p-8 border border-[var(--border)] bg-[var(--bg)]">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] mb-4">Official Answer</h3>
                  <div className="text-xl font-black tracking-tight">{puzzle.answer}</div>
                </div>
              )}

              {showSolution && (
                <div className="space-y-12">
                  {puzzle.solution && (
                    <div className="p-10 border border-[var(--border)] bg-[var(--muted)]/30 prose max-w-none">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] mb-8 border-b border-[var(--border)] pb-4">Detailed Solution</h3>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]} 
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                      >
                        {puzzle.solution}
                      </ReactMarkdown>
                    </div>
                  )}

                  {additionalFields.map(field => (
                    <div key={field.key} className="p-10 border border-[var(--border)] bg-[var(--bg)] prose max-w-none">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] mb-8 border-b border-[var(--border)] pb-4">{field.label}</h3>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]} 
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                      >
                        {field.content}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-12 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-1">
            {prevPuzzle && (
              <Link to={`/puzzles/${prevPuzzle.puzzleId}`} className="group flex flex-col items-start p-4 border border-[var(--border)] hover:border-[var(--fg)] transition-all">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-fg)] flex items-center gap-1 group-hover:text-[var(--fg)]">
                  <ChevronLeft className="w-3 h-3" /> Previous
                </span>
                <span className="text-xs font-bold uppercase tracking-tight mt-1 line-clamp-1 max-w-[150px]">
                  {prevPuzzle.title}
                </span>
              </Link>
            )}
            {nextPuzzle && (
              <Link to={`/puzzles/${nextPuzzle.puzzleId}`} className="group flex flex-col items-end p-4 border border-[var(--border)] hover:border-[var(--fg)] transition-all text-right">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-fg)] flex items-center gap-1 group-hover:text-[var(--fg)]">
                   Next <ChevronRight className="w-3 h-3" />
                </span>
                <span className="text-xs font-bold uppercase tracking-tight mt-1 line-clamp-1 max-w-[150px]">
                  {nextPuzzle.title}
                </span>
              </Link>
            )}
          </div>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-3 px-8 py-4 border border-[var(--border)] hover:border-[var(--fg)] transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <MessageSquare className="w-4 h-4" />
            {showComments ? "Hide Discussions" : "Join Discussion"}
          </button>
        </div>

        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${showComments ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="pt-12 mt-12 border-t border-[var(--border)]">
            <Comments puzzleId={puzzle.puzzleId} puzzleTitle={puzzle.title} />
          </div>
        </div>
      </main>
    </div>
  );
}
