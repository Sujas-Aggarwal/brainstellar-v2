import { useEffect, useRef, useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "~/contexts/UserContext";

export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useUser();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "Sujas-Aggarwal/brainstellar-v2");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", theme === "dark" ? "github-dark" : "github-light");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }
  }, [theme]);

  return (
    <section className="pt-24 border-t border-[var(--border)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-10 border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--muted)] transition-all group"
      >
        <div className="flex items-center gap-8">
          <MessageSquare className="w-5 h-5 text-[var(--fg)]" />
          <div className="text-left">
            <h3 className="text-[15px] font-bold tracking-tight text-[var(--fg)]">Archive Discussion</h3>
            <p className="text-[10px] font-bold text-[var(--muted-fg)] uppercase tracking-[0.15em] mt-1.5">Share your logic with the community</p>
          </div>
        </div>
        <div className="transition-transform duration-300">
          {isOpen ? <ChevronUp className="w-5 h-5 text-[var(--muted-fg)]" /> : <ChevronDown className="w-5 h-5 text-[var(--muted-fg)]" />}
        </div>
      </button>
      
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[4000px] opacity-100 mt-20 pb-20" : "max-h-0 opacity-0"
        }`}
      >
        <div 
          ref={containerRef} 
          className="utterances-container min-h-[200px]" 
        />
      </div>
    </section>
  );
}
