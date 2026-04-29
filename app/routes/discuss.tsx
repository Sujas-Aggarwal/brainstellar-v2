import { Navbar } from "~/components/Navbar";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useRef } from "react";
import { useUser } from "~/contexts/UserContext";

export default function Discuss() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useUser();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "Sujas-Aggarwal/brainstellar-v2");
    script.setAttribute("issue-term", "Global Discussion Archive");
    script.setAttribute("theme", theme === "dark" ? "github-dark" : "github-light");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }
  }, [theme]);

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Navbar />
      
      <header className="mb-12 space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Archive
        </Link>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight flex items-center gap-4">
            Global Archive Discussion
            <MessageCircle className="w-8 h-8 text-[var(--c-overall)]" />
          </h1>
          <p className="text-sm font-medium text-[var(--muted-fg)] leading-relaxed max-w-xl">
            A collective space to discuss strategies, share variations, and connect with other archive conquerors.
          </p>
        </div>
      </header>

      <div className="border-t border-[var(--border)] pt-12">
        <div ref={containerRef} className="min-h-[400px]" />
      </div>
    </div>
  );
}
