import { Link } from "react-router";
import { useUser } from "~/contexts/UserContext";
import { Sun, Moon, Hash, Info, MessageSquare, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { theme, toggleTheme, user, loading, signIn, signOut } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-sm font-bold uppercase tracking-tighter">
              Brain<strong className="text-red-500">f</strong>uck
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-6 mr-6">
            <Link
              to="/discuss"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              Discuss
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors"
            >
              About Us
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <div className="w-px h-4 bg-[var(--border)] mx-1" />

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-[var(--border)] animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3 ml-2">
              {(() => {
                console.log("User photoURL:", user.photoURL);
                return null;
              })()}
              <div className="relative group/avatar w-8 h-8">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || "User"} 
                    className="w-full h-full rounded-full border border-[var(--border)] object-cover shadow-sm transition-transform group-hover/avatar:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[var(--muted-bg)] flex items-center justify-center border border-[var(--border)]">
                    <UserIcon className="w-4 h-4 text-[var(--muted-fg)]" />
                  </div>
                )}
              </div>
              <button
                onClick={signOut}
                className="text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="ml-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all"
            >
              Login
            </button>
          )}

          <div className="w-px h-4 bg-[var(--border)] mx-2 hidden sm:block" />

          <a
            href="https://github.com/Sujas-Aggarwal/brainstellar-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors"
            title="View Source on GitHub"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
