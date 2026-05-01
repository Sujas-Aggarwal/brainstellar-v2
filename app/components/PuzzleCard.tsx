import { Link } from "react-router";
import { useUser } from "~/contexts/UserContext";
import { Heart, Circle, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

interface PuzzleCardProps {
  puzzle: {
    puzzleId: number;
    title: string;
    difficulty: string;
    category: string;
  };
  isSolved: boolean;
}

export function PuzzleCard({ puzzle, isSolved }: PuzzleCardProps) {
  const { favoritePuzzles, toggleFavorite } = useUser();
  const isFavorite = favoritePuzzles.includes(puzzle.puzzleId);

  return (
    <Link
      to={`/puzzles/${puzzle.puzzleId}`}
      className="group block card-minimal h-full border-0"
    >
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] border border-[var(--border)] px-2 py-0.5 text-[var(--muted-fg)]">
              {puzzle.difficulty}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] bg-[var(--muted)] text-[var(--muted-fg)] px-2 py-0.5">
              {puzzle.category}
            </span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(puzzle.puzzleId); }}
            className={clsx("transition-colors p-1 -m-1", isFavorite ? "text-[var(--fg)]" : "text-[var(--muted-fg)] hover:text-[var(--fg)]")}
          >
            <Heart className={clsx("w-3.5 h-3.5", isFavorite && "fill-[var(--c-deadly)] text-[var(--c-deadly)]")} />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-[15px] font-semibold leading-relaxed tracking-normal text-[var(--fg)] group-hover:text-[var(--muted-fg)] transition-colors">
            {puzzle.title}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] opacity-50">
            ID: {puzzle.puzzleId}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto">
          <div className="flex items-center gap-2">
            {isSolved ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-(--c-easy)" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-[var(--muted-fg)]/30" />
            )}
            <span className={clsx("text-[10px] font-bold uppercase tracking-[0.1em]", isSolved ? "text-(--c-easy)" : "text-[var(--muted-fg)]")}>
              {isSolved ? "Solved" : "Unsolved"}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted-fg)] group-hover:text-[var(--fg)] transition-colors">
            Open
          </span>
        </div>
      </div>
    </Link>
  );
}
