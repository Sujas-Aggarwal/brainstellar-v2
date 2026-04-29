import { Link } from "react-router";
import { useUser } from "~/contexts/UserContext";
import { Download, Upload, Brain, Heart, CheckCircle2 } from "lucide-react";
import { useRef } from "react";

export function Navbar() {
  const { exportData, importData, solvedPuzzles, favoritePuzzles } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importData(content)) {
          alert("Progress imported successfully!");
        } else {
          alert("Failed to import progress. Invalid file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Brain className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Brainstellar
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* Stats */}
          <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-bold text-white/60">{solvedPuzzles.length}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-xs font-bold text-white/60">{favoritePuzzles.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              className="hidden"
              accept=".json"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import Progress"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={exportData}
              title="Export Progress"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
