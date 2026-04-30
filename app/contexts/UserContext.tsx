import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  type User 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from "firebase/firestore";
import { auth, db, googleProvider } from "~/lib/firebase";

interface UserData {
  solvedPuzzles: number[];
  favoritePuzzles: number[];
  theme: "light" | "dark";
}

interface UserContextType extends UserData {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleSolved: (id: number) => void;
  toggleFavorite: (id: number) => void;
  toggleTheme: () => void;
  exportData: () => void;
  importData: (data: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "brainfuck_user_data_v2";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserData>({
    solvedPuzzles: [],
    favoritePuzzles: [],
    theme: "dark",
  });

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up Auth listener...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser?.email || "No user");
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error("Auth listener error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync with Firestore if logged in, otherwise localStorage
  useEffect(() => {
    if (user) {
      console.log("Syncing with Firestore for user:", user.uid);
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as Partial<UserData>;
          console.log("Firestore data received:", userData);
          setData(prev => ({
            ...prev,
            solvedPuzzles: userData.solvedPuzzles || [],
            favoritePuzzles: userData.favoritePuzzles || [],
          }));
        } else {
          console.log("No user doc found, creating one...");
          // Initialize user doc if it doesn't exist
          setDoc(userDocRef, {
            solvedPuzzles: data.solvedPuzzles,
            favoritePuzzles: data.favoritePuzzles,
            email: user.email,
            displayName: user.displayName,
          }, { merge: true }).catch(err => console.error("Error creating user doc:", err));
        }
      }, (error) => {
        console.error("Firestore sync error:", error);
      });
      return () => unsubscribe();
    } else {
      console.log("No user, loading from localStorage...");
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to parse saved data", e);
        }
      }
    }
  }, [user]);

  // Persist local changes to storage/firestore
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        solvedPuzzles: data.solvedPuzzles,
        favoritePuzzles: data.favoritePuzzles,
        theme: data.theme
      }));
    } else {
      const userDocRef = doc(db, "users", user.uid);
      setDoc(userDocRef, {
        solvedPuzzles: data.solvedPuzzles,
        favoritePuzzles: data.favoritePuzzles,
      }, { merge: true }).catch(err => console.error("Error updating user doc:", err));
    }

    if (data.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [data, user]);

  const signIn = async () => {
    console.log("Initiating Google Sign-In...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Sign-in successful:", result.user.email);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const signOut = async () => {
    console.log("Initiating Sign-Out...");
    try {
      await firebaseSignOut(auth);
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

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
      user,
      loading,
      signIn,
      signOut,
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
