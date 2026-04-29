import { Navbar } from "~/components/Navbar";
import { ChevronLeft, Zap, Shield, Rocket, Globe } from "lucide-react";
import { Link } from "react-router";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () => [
  { title: "Free Interview Puzzle Preparation | Brainfuck" },
  { name: "description", content: "Access 100+ free logic puzzles for Quant, HFT, and SDE interviews. Detailed solutions and community discussions for top tech job preparation." },
  { name: "keywords", content: "free interview puzzles, brainstellar, interview puzzles, puzzle questions for interview, puzzles asked in interviews, quant interview puzzles, HFT interview questions, SDE puzzles, coding interview brain teasers, maths puzzles for developers, programmer brain teasers, tech job puzzles" },
];

export default function About() {
  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Navbar />
      
      <header className="mb-24 space-y-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> All Puzzles
        </Link>
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
            Prepare for <br /> Interview
          </h1>
          <p className="text-xs font-bold text-[var(--muted-fg)] uppercase tracking-[0.4em]">100+ High-Quality Logic Challenges</p>
        </div>
      </header>

      <section className="space-y-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight uppercase border-b-2 border-[var(--fg)] pb-4 inline-block">The Goal</h2>
            <p className="text-lg font-medium leading-relaxed text-[var(--muted-fg)]">
              Brainfuck is designed to be the ultimate resource for <span className="text-[var(--fg)]">interview preparation</span>. We provide free access to complex puzzles that are frequently asked in Quant, HFT, and SDE interviews at top firms.
            </p>
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight uppercase border-b-2 border-[var(--fg)] pb-4 inline-block">The Legacy</h2>
            <p className="text-lg font-medium leading-relaxed text-[var(--muted-fg)]">
              We credit the legendary <a href="https://brainstellar.com" target="_blank" rel="noopener noreferrer" className="text-[var(--fg)] underline underline-offset-4 font-bold">Brainstellar.com</a> as our primary source of inspiration. We have updated and curated this collection to help modern developers and quantitative analysts succeed in their job search.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)]">
          <div className="p-12 bg-[var(--bg)] space-y-6">
            <Zap className="w-8 h-8 text-[var(--c-medium)]" />
            <h3 className="text-xl font-bold uppercase tracking-tight">100% Free Access</h3>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              Every puzzle and solution is completely free. We believe quality educational resources should be accessible to everyone preparing for their career.
            </p>
          </div>
          <div className="p-12 bg-[var(--bg)] space-y-6">
            <Shield className="w-8 h-8 text-[var(--c-easy)]" />
            <h3 className="text-xl font-bold uppercase tracking-tight">Zero Tracking</h3>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              Your preparation is private. We use local storage to track your progress, meaning your data never leaves your device. No login required.
            </p>
          </div>
          <div className="p-12 bg-[var(--bg)] space-y-6">
            <Rocket className="w-8 h-8 text-[var(--c-hard)]" />
            <item h3 className="text-xl font-bold uppercase tracking-tight">High Fidelity</item>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              All solutions are meticulously checked for accuracy and clarity, ensuring you learn the underlying logical principles needed for HFT and SDE roles.
            </p>
          </div>
          <div className="p-12 bg-[var(--bg)] space-y-6">
            <Globe className="w-8 h-8 text-[var(--c-overall)]" />
            <h3 className="text-xl font-bold uppercase tracking-tight">Open Community</h3>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              Join the discussion on any puzzle to see alternative solutions, share insights, and connect with others preparing for similar roles.
            </p>
          </div>
        </div>

        <footer className="pt-20 border-t border-[var(--border)] space-y-12">
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <h4 className="text-sm font-bold uppercase tracking-[0.5em] text-[var(--fg)]">Start Your Prep</h4>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              Browse the archive, mark your progress, and conquer your next technical interview with confidence.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
