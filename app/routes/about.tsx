import { Navbar } from "~/components/Navbar";
import { ChevronLeft, Zap, Shield, Rocket, Globe } from "lucide-react";
import { Link } from "react-router";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () => [
  { title: "The Manifesto | Brainfuck Logic Archive" },
  { name: "description", content: "The revolutionary archive of lethal logic puzzles, probability challenges, and quantitative riddles. Derived from the legendary Brainstellar collection." },
  { name: "keywords", content: "logic puzzles, math riddles, interview puzzles, quantitative finance puzzles, brain teasers, brainstellar, brainfuck logic" },
];

export default function About() {
  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Navbar />
      
      <header className="mb-24 space-y-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Return to Hub
        </Link>
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
            The <br /> Manifesto
          </h1>
          <p className="text-xs font-bold text-[var(--muted-fg)] uppercase tracking-[0.4em]">Revolutionizing Intellectual Conquest</p>
        </div>
      </header>

      <section className="space-y-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight uppercase border-b-2 border-[var(--fg)] pb-4 inline-block">The Vision</h2>
            <p className="text-lg font-medium leading-relaxed text-[var(--muted-fg)]">
              Brainfuck is not just an archive; it is a movement toward <span className="text-[var(--fg)]">intellectual sovereignty</span>. We believe that logic is the ultimate weapon in an era of information noise. Our mission is to sharpen that weapon for everyone.
            </p>
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight uppercase border-b-2 border-[var(--fg)] pb-4 inline-block">The Origin</h2>
            <p className="text-lg font-medium leading-relaxed text-[var(--muted-fg)]">
              This archive stands on the shoulders of giants. We are eternally grateful to <a href="https://brainstellar.com" target="_blank" rel="noopener noreferrer" className="text-[var(--fg)] underline underline-offset-4 font-bold">Brainstellar.com</a>, the legendary repository where many of these logical enigmas were born and nurtured. We have reimagined this heritage for a new era of performance and minimalism.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)]">
          <div className="p-12 bg-[var(--bg)] space-y-6">
            <Zap className="w-8 h-8 text-[var(--c-medium)]" />
            <h3 className="text-xl font-bold uppercase tracking-tight">Lethal Efficiency</h3>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              We removed the clutter. No distractions, no ads, no filler. Only the raw, unadulterated challenge of logic, served at the speed of thought.
            </p>
          </div>
          <div className="p-12 bg-[var(--bg)] space-y-6">
            <Shield className="w-8 h-8 text-[var(--c-easy)]" />
            <h3 className="text-xl font-bold uppercase tracking-tight">Absolute Privacy</h3>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              In a world of data extraction, we extract nothing. Your progress is yours alone, stored locally, and never transmitted. Your mind remains your own territory.
            </p>
          </div>
          <div className="p-12 bg-[var(--bg)] space-y-6">
            <Rocket className="w-8 h-8 text-[var(--c-hard)]" />
            <h3 className="text-xl font-bold uppercase tracking-tight">Future Ready</h3>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              Designed as an offline-first experience, Brainfuck is your resilient archive. It stays with you, whether you're at the edge of the world or in the heart of a data blackout.
            </p>
          </div>
          <div className="p-12 bg-[var(--bg)] space-y-6">
            <Globe className="w-8 h-8 text-[var(--c-overall)]" />
            <h3 className="text-xl font-bold uppercase tracking-tight">Community Core</h3>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              Built on transparency and contribution. Our discussion forums and open submission policy ensure that the archive continues to evolve with the collective intelligence of the community.
            </p>
          </div>
        </div>

        <footer className="pt-20 border-t border-[var(--border)] space-y-12">
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <h4 className="text-sm font-bold uppercase tracking-[0.5em] text-[var(--fg)]">Join the Conquest</h4>
            <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
              The archive is growing. Every solved puzzle is a victory. Every shared strategy is a reinforcement. Welcome to the frontline of logic.
            </p>
          </div>
        </footer>
      </section>

      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "The Brainfuck Manifesto",
          "description": "Revolutionary logic puzzle archive with a focus on quantitative and mathematical challenges.",
          "publisher": {
            "@type": "Organization",
            "name": "Brainfuck Archive"
          }
        })}
      </script>
    </div>
  );
}
