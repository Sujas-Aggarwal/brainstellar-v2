import { Link } from "react-router";
import { CheckCircle2, ChevronRight, Heart } from "lucide-react";
import { clsx } from "clsx";
import { useUser } from "~/contexts/UserContext";

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

  const difficultyColor = {
    easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  }[puzzle.difficulty.toLowerCase()] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(puzzle.puzzleId);
  };

  return (
    <Link
      to={`/puzzles/${puzzle.puzzleId}`}
      className="group relative block rounded-2xl glass-card p-6 overflow-hidden"
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={handleFavoriteClick}
          className={clsx(
            "p-2 rounded-lg transition-all",
            isFavorite ? "text-rose-500 bg-rose-500/10" : "text-white/20 hover:text-white/40 bg-white/5"
          )}
        >
          <Heart className={clsx("w-4 h-4", isFavorite && "fill-rose-500")} />
        </button>
        {isSolved && (
          <div className="text-emerald-500 p-2 rounded-lg bg-emerald-500/10">
            <CheckCircle2 className="w-4 h-4 fill-emerald-500/10" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className={clsx("text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border", difficultyColor)}>
            {puzzle.difficulty}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">
            {puzzle.category}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight mb-2 pr-12">
            {puzzle.title}
          </h3>
          <p className="text-sm text-white/40 line-clamp-1">
            Puzzle #{puzzle.puzzleId}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-white transition-colors mt-auto">
          <span>Solve Challenge</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors" />
    </Link>
  );
}
