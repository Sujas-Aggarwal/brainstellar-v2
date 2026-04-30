import { Link } from "react-router";
import { useUser } from "~/contexts/UserContext";
import { useRef } from "react";
import { Download, Upload } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] pt-20 pb-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
        <div className="space-y-6">
          <div className="text-xl font-bold tracking-tighter uppercase">
              Brain<strong className="text-red-500">f</strong>uck
          </div>
          <p className="text-xs font-bold text-[var(--muted-fg)] uppercase tracking-[0.3em] max-w-xs leading-relaxed">
            100+ Free high-quality logic puzzles for Quant, HFT, and SDE interviews.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 sm:gap-24">
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--fg)]">Resources</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">
              <li><Link to="/" className="hover:text-[var(--fg)] transition-colors">Free Puzzles</Link></li>
              <li><Link to="/discuss" className="hover:text-[var(--fg)] transition-colors">Discussion Forum</Link></li>
              <li><Link to="/submit" className="hover:text-[var(--fg)] transition-colors">Submit a Puzzle</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--fg)]">Maintainer</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">
              <li><a href="https://www.linkedin.com/in/sujasaggarwal/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)] transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com/Sujas-Aggarwal" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)] transition-colors">GitHub</a></li>
              <li><Link to="/about" className="hover:text-[var(--fg)] transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--fg)]">SEO</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)]">
              <li><a href="/sitemap.xml" target="_blank" className="hover:text-[var(--fg)] transition-colors">Sitemap</a></li>
              <li><a href="/robots.txt" target="_blank" className="hover:text-[var(--fg)] transition-colors">Robots</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-[var(--border)] flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.4em] text-[var(--muted-fg)]/40">
        <div>© {currentYear} BRAINFUCK ARCHIVE</div>
        <div className="hidden sm:block">PREPARE FOR INTERVIEW</div>
      </div>
    </footer>
  );
}
