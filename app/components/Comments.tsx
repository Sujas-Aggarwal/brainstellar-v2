import { useEffect, useRef } from "react";
import { useUser } from "~/contexts/UserContext";

export function Comments({ 
  puzzleId, 
  puzzleTitle, 
  issueTerm = "pathname" 
}: { 
  puzzleId?: number; 
  puzzleTitle?: string; 
  issueTerm?: string 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useUser();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "Sujas-Aggarwal/brainstellar-v2");
    script.setAttribute("issue-term", issueTerm);
    script.setAttribute("theme", theme === "dark" ? "github-dark" : "github-light");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="utterances-container min-h-[400px] mt-8" 
    />
  );
}
