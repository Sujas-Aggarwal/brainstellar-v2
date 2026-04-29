import { useState, useMemo, useEffect } from "react";
import { useUser } from "~/contexts/UserContext";
import puzzlesData from "~/data/puzzles.json";
import { Navbar } from "~/components/Navbar";
import { PuzzleCard } from "~/components/PuzzleCard";
import { Search, Trophy, Target, Zap, Skull, Flame } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = ({ params }) => {
  const topic = params.category || params.difficulty || "Archive";
  const title = `100+ Free ${topic} Puzzles | Interview Prep`;
  return [
    { title },
    { name: "description", content: `Prepare for Quant, HFT, and SDE interviews with 100+ free ${topic} puzzles. High-quality solutions and tracking for top tech job interviews.` },
    { name: "keywords", content: `puzzles for interview, brainstellar, interview puzzles, puzzle questions for interview, puzzles asked in interviews, ${topic} puzzles, tech job puzzles` },
    { property: "og:title", title },
    { name: "robots", content: "index, follow" },
  ];
};

export async function loader() {
  return {};
}

function ProgressCircle({ current, total, label, icon: Icon, colorVar }: { current: number; total: number; label: string; icon: any; colorVar: string }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 p-6 border border-[var(--border)] group hover:border-[var(--fg)] transition-all bg-[var(--bg)] relative overflow-hidden">
      {percentage > 0 && (
        <div 
          className="absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.07]"
          style={{ backgroundColor: `var(${colorVar})` }}
        />
      )}
      
      <div className="relative w-16 h-16 z-10">
        <svg className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="3" />
          <circle
            cx="32" cy="32" r={radius} fill="transparent"
            stroke={`var(${colorVar})`} strokeWidth="3"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-4 h-4 transition-colors" style={{ color: percentage > 0 ? `var(${colorVar})` : 'var(--muted-fg)' }} />
        </div>
      </div>
      <div className="text-center z-10">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">{label}</div>
        <div className="text-sm font-black tracking-tighter">
          {current}<span className="opacity-20 mx-0.5">/</span>{total}
        </div>
        <div className="text-[10px] font-black mt-1" style={{ color: `var(${colorVar})` }}>{percentage}%</div>
      </div>
    </div>
  );
}

export default function Home() {
  const params = useParams();
  const navigate = useNavigate();
  const { solvedPuzzles, favoritePuzzles } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (params.category) setSelectedCategory(params.category);
    else if (!params.difficulty) setSelectedCategory("All");

    if (params.difficulty) setSelectedDifficulty(params.difficulty);
    else if (!params.category) setSelectedDifficulty("All");
  }, [params.category, params.difficulty]);

  const categories = useMemo(() => ["All", ...new Set(puzzlesData.map(p => p.category))], []);
  const difficulties = ["All", "Easy", "Medium", "Hard", "Deadly"];

  const stats = useMemo(() => {
    const total = puzzlesData.length;
    const solved = solvedPuzzles.length;
    const byDifficulty = {
      easy: { solved: 0, total: 0 },
      medium: { solved: 0, total: 0 },
      hard: { solved: 0, total: 0 },
      deadly: { solved: 0, total: 0 },
    };
    puzzlesData.forEach(p => {
      const d = p.difficulty.toLowerCase() as keyof typeof byDifficulty;
      if (byDifficulty[d]) {
        byDifficulty[d].total++;
        if (solvedPuzzles.includes(p.puzzleId)) byDifficulty[d].solved++;
      }
    });
    return { total, solved, byDifficulty };
  }, [solvedPuzzles]);

  const filteredPuzzles = useMemo(() => {
    return puzzlesData.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.puzzleId.toString().includes(searchQuery);
      const matchesCategory = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesDifficulty = selectedDifficulty === "All" || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchesFavorites = !showFavorites || favoritePuzzles.includes(p.puzzleId);
      return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorites;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, showFavorites, favoritePuzzles]);

  const handleCategorySelect = (cat: string) => {
    if (cat === "All") navigate("/");
    else navigate(`/category/${cat.toLowerCase()}`);
  };

  const handleDifficultySelect = (diff: string) => {
    if (diff === "All") navigate("/");
    else navigate(`/difficulty/${diff.toLowerCase()}`);
  };

  // Structured Data for SEO with official domain
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Interview Puzzles Archive",
    "description": "A collection of 100+ free high-quality logic puzzles for Quant, HFT, and SDE interviews.",
    "url": "https://brainfuck.sujas.me",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filteredPuzzles.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://brainfuck.sujas.me/puzzles/${p.puzzleId}`,
        "name": p.title
      }))
    }
  }), [filteredPuzzles]);

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Navbar />
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <section className="mb-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.8] flex items-center gap-4">
              Interview Puzzles
              <Flame className="w-8 h-8 text-[var(--c-hard)]" />
            </h1>
            <p className="text-xs font-bold text-[var(--muted-fg)] uppercase tracking-[0.3em]">
              High-quality interview preparation for top tech & finance roles.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">Solved</div>
              <div className="text-3xl font-black tracking-tighter text-[var(--c-overall)]">
                {stats.solved}<span className="text-lg opacity-20 ml-1">/ {stats.total}</span>
              </div>
            </div>
            <div className="w-px h-10 bg-[var(--border)]" />
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">Efficiency</div>
              <div className="text-3xl font-black tracking-tighter">
                {Math.round((stats.solved / stats.total) * 100)}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--border)] border border-[var(--border)]">
          <ProgressCircle current={stats.solved} total={stats.total} label="All Puzzles" icon={Trophy} colorVar="--c-overall" />
          <ProgressCircle current={stats.byDifficulty.easy.solved} total={stats.byDifficulty.easy.total} label="Easy" icon={Target} colorVar="--c-easy" />
          <ProgressCircle current={stats.byDifficulty.medium.solved} total={stats.byDifficulty.medium.total} label="Medium" icon={Zap} colorVar="--c-medium" />
          <ProgressCircle current={stats.byDifficulty.hard.solved} total={stats.byDifficulty.hard.total} label="Hard" icon={Flame} colorVar="--c-hard" />
          <ProgressCircle current={stats.byDifficulty.deadly.solved} total={stats.byDifficulty.deadly.total} label="Deadly" icon={Skull} colorVar="--c-deadly" />
        </div>
      </section>

      <section className="mb-16 space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-fg)]" />
            <input
              type="text"
              placeholder="SEARCH INTERVIEW PUZZLES (PROBABILITY, MATH, CODING...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] px-12 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-[var(--fg)] transition-all placeholder:text-[var(--muted-fg)]"
            />
          </div>

          <nav className="flex gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0" aria-label="Category Navigation">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-5 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.toLowerCase() 
                    ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]" 
                    : "bg-[var(--bg)] text-[var(--muted-fg)] border-[var(--border)] hover:border-[var(--fg)] hover:text-[var(--fg)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-6 border-y border-[var(--border)]">
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted-fg)]">Difficulty:</span>
            <div className="flex gap-8">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultySelect(diff)}
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-all relative py-1 ${
                    selectedDifficulty.toLowerCase() === diff.toLowerCase() 
                      ? "text-[var(--fg)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--fg)]" 
                      : "text-[var(--muted-fg)] hover:text-[var(--fg)]"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`text-[10px] font-bold uppercase tracking-[0.15em] px-6 py-2 border transition-all ${
              showFavorites 
                ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]" 
                : "bg-[var(--bg)] text-[var(--muted-fg)] border-[var(--border)] hover:border-[var(--fg)] hover:text-[var(--fg)]"
            }`}
          >
            {showFavorites ? "Viewing Starred" : "Star Filters"}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-[var(--border)]">
        {filteredPuzzles.map((puzzle) => (
          <div key={puzzle.puzzleId} className="border-r border-b border-[var(--border)]">
            <PuzzleCard puzzle={puzzle} isSolved={solvedPuzzles.includes(puzzle.puzzleId)} />
          </div>
        ))}
      </div>
    </div>
  );
}
