import { Link } from "react-router";
import { useUser } from "~/contexts/UserContext";
import { useRef } from "react";
import { Download, Upload } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { exportData, importData } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importData(content)) {
          alert("Progress Imported Successfully.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] pt-20 pb-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
        <div className="space-y-6">
          <div className="text-xl font-bold tracking-tighter uppercase">Brainfuck</div>
          <p className="text-xs font-bold text-[var(--muted-fg)] uppercase tracking-[0.3em] max-w-xs leading-relaxed">
            The ultimate archive of lethal logic and mathematical challenges.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 sm:gap-24">
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--fg)]">Archive</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">
              <li><Link to="/" className="hover:text-[var(--fg)] transition-colors">Puzzles</Link></li>
              <li><Link to="/discuss" className="hover:text-[var(--fg)] transition-colors">Discussion Forum</Link></li>
              <li><Link to="/submit" className="hover:text-[var(--fg)] transition-colors">Submit a Puzzle</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--fg)]">Maintainer</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">
              <li><a href="https://www.linkedin.com/in/sujasaggarwal/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)] transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com/Sujas-Aggarwal" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)] transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--fg)]">Sync</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">
              <li>
                <button onClick={exportData} className="flex items-center gap-2 hover:text-[var(--fg)] transition-colors">
                  <Download className="w-3 h-3" />
                  Export Progress
                </button>
              </li>
              <li>
                <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 hover:text-[var(--fg)] transition-colors">
                  <Upload className="w-3 h-3" />
                  Import Progress
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-[var(--border)] flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--muted-fg)]/40">
        <div>© {currentYear} BRAINFUCK ARCHIVE</div>
        <div className="hidden sm:block">CONQUER THE VOID</div>
      </div>
    </footer>
  );
}
