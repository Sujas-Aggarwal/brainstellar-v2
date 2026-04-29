import { Navbar } from "~/components/Navbar";
import { MoveLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--fg)] px-6">
      <Navbar />
      <div className="text-center space-y-10">
        <div className="space-y-4">
          <h1 className="text-9xl font-black tracking-tighter opacity-10">404</h1>
          <h2 className="text-4xl font-bold tracking-tight uppercase">Segment Not Found</h2>
          <p className="text-sm font-medium text-[var(--muted-fg)] uppercase tracking-[0.3em]">
            This logical path does not exist in the archive.
          </p>
        </div>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-4 px-10 py-5 border-2 border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-transparent hover:text-[var(--fg)] transition-all"
        >
          <MoveLeft className="w-4 h-4" />
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
