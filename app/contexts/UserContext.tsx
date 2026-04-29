import React, { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  solvedPuzzles: number[];
  favoritePuzzles: number[];
}

interface UserContextType {
  solvedPuzzles: number[];
  favoritePuzzles: number[];
  toggleSolved: (id: number) => void;
  toggleFavorite: (id: number) => void;
  exportData: () => void;
  importData: (data: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "brainstellar_user_data";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UserData>({
    solvedPuzzles: [],
    favoritePuzzles: [],
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brainstellar_progress_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      if (Array.isArray(imported.solvedPuzzles) && Array.isArray(imported.favoritePuzzles)) {
        setData(imported);
        return true;
      }
    } catch (e) {
      console.error("Import failed", e);
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ 
      solvedPuzzles: data.solvedPuzzles, 
      favoritePuzzles: data.favoritePuzzles, 
      toggleSolved, 
      toggleFavorite,
      exportData,
      importData
    }}>
      {children}
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
