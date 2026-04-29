import React, { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  solvedPuzzles: number[];
  favoritePuzzles: number[];
  theme: "light" | "dark";
}

interface UserContextType {
  solvedPuzzles: number[];
  favoritePuzzles: number[];
  theme: "light" | "dark";
  toggleSolved: (id: number) => void;
  toggleFavorite: (id: number) => void;
  toggleTheme: () => void;
  exportData: () => void;
  importData: (data: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "brainfuck_user_data_v2";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UserData>({
    solvedPuzzles: [],
    favoritePuzzles: [],
    theme: "dark",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (data.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [data]);

  const toggleSolved = (id: number) => {
    setData(prev => ({
      ...prev,
      solvedPuzzles: prev.solvedPuzzles.includes(id)
        ? prev.solvedPuzzles.filter(p => p !== id)
        : [...prev.solvedPuzzles, id]
    }));
  };

  const toggleFavorite = (id: number) => {
    setData(prev => ({
      ...prev,
      favoritePuzzles: prev.favoritePuzzles.includes(id)
        ? prev.favoritePuzzles.filter(p => p !== id)
        : [...prev.favoritePuzzles, id]
    }));
  };

  const toggleTheme = () => {
    setData(prev => ({ ...prev, theme: prev.theme === "light" ? "dark" : "light" }));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brainfuck_v2_progress_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      if (Array.isArray(imported.solvedPuzzles) && Array.isArray(imported.favoritePuzzles)) {
        setData(prev => ({ ...prev, ...imported }));
        return true;
      }
    } catch (e) {
      console.error("Import failed", e);
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ 
      ...data,
      toggleSolved, 
      toggleFavorite,
      toggleTheme,
      exportData,
      importData
    }}>
      <div className="theme-transition min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        {children}
      </div>
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
