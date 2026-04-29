import { useState, useMemo } from "react";
import { useUser } from "~/contexts/UserContext";
import puzzlesData from "~/data/puzzles.json";
import { Navbar } from "~/components/Navbar";
import { PuzzleCard } from "~/components/PuzzleCard";
import { Search, Filter, SlidersHorizontal, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "Brainstellar | The Ultimate Collection of Logic Puzzles" },
  { name: "description", content: "Solve over 500+ logic puzzles, probability riddles, and brain teasers. Track your progress, save favorites, and master interview-style challenges." },
];


export default function Home() {
  const { solvedPuzzles, favoritePuzzles } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showFavorites, setShowFavorites] = useState(false);

  const categories = useMemo(() => 
    ["All", ...new Set(puzzlesData.map(p => p.category))], 
  []);
  
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filteredPuzzles = useMemo(() => {
    return puzzlesData.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.puzzleId.toString().includes(searchQuery);
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || 
                               p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchesFavorites = !showFavorites || favoritePuzzles.includes(p.puzzleId);
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorites;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, showFavorites, favoritePuzzles]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <Navbar />
      
      <main className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white"
          >
            Master the <span className="text-primary">Art of Puzzles</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/50 max-w-2xl leading-relaxed"
          >
            Your progress is saved automatically on your device. No account needed.
          </motion.p>
        </section>

        {/* Filters Section */}
        <section className="glass rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search puzzles by title or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-white/20 text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              <Filter className="w-4 h-4 text-white/20 shrink-0" />
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white/20 uppercase tracking-widest">
                  <SlidersHorizontal className="w-3 h-3" />
                  Difficulty
                </div>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        selectedDifficulty === diff
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-transparent border-transparent text-white/30 hover:text-white/50"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-6 bg-white/5 hidden sm:block" />

              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  showFavorites 
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
                    : "bg-white/5 border-white/5 text-white/30 hover:text-white/50"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showFavorites ? "fill-rose-500" : ""}`} />
                Favorites Only
              </button>
            </div>

            <div className="text-xs font-bold text-white/20 uppercase tracking-widest">
              {filteredPuzzles.length} Challenges found
            </div>
          </div>
        </section>

        {/* Puzzles Grid */}
        <section>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPuzzles.map((puzzle) => (
                <motion.div
                  key={puzzle.puzzleId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <PuzzleCard 
                    puzzle={puzzle} 
                    isSolved={solvedPuzzles.includes(puzzle.puzzleId)} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPuzzles.length === 0 && (
            <div className="text-center py-24 glass rounded-3xl">
              <p className="text-white/40 text-lg">No puzzles found matching your criteria.</p>
              {showFavorites && (
                <button 
                  onClick={() => setShowFavorites(false)}
                  className="mt-4 text-primary font-bold hover:underline"
                >
                  Clear Favorites filter
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
