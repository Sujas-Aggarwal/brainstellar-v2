import { useEffect, useRef, useState } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Inject script immediately
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "Sujas-Aggarwal/brainstellar-v2");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "github-dark");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <section className="pt-8 border-t border-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 rounded-[1.5rem] bg-white/2 border border-white/5 hover:bg-white/5 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">Join the Discussion</h3>
            <p className="text-xs text-white/30 font-medium">Read comments or share your solution</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </button>
      
      {/* 
        CRITICAL: We use height/opacity/pointer-events instead of display:none.
        This ensures the Utterances iframe actually renders and fetches content 
        in the background while being completely invisible to the user.
      */}
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen 
            ? "max-h-[2000px] opacity-100 mt-8 pointer-events-auto" 
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-2 sm:px-6">
          <div 
            ref={containerRef} 
            className="utterances-container min-h-[200px]" 
          />
        </div>
      </div>
    </section>
  );
}
