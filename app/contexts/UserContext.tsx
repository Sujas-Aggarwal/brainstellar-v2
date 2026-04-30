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
  onSnapshot,
  serverTimestamp 
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

  // Load data from localStorage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(prev => ({
          ...prev,
          solvedPuzzles: parsed.solvedPuzzles || [],
          favoritePuzzles: parsed.favoritePuzzles || [],
          theme: parsed.theme || "dark"
        }));
        if (parsed.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else if (parsed.theme === "light") {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Listen for auth state changes and handle merging
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser?.email || "Guest");
      
      if (currentUser) {
        // User logged in: Handle merging
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        // Current state (potentially from guest session)
        const localData = {
          solvedPuzzles: data.solvedPuzzles,
          favoritePuzzles: data.favoritePuzzles
        };

        if (userDoc.exists()) {
          const cloudData = userDoc.data() as Partial<UserData>;
          console.log("Existing cloud data found, merging...");
          
          // Merge: Unique IDs from both sources
          const mergedSolved = Array.from(new Set([...(cloudData.solvedPuzzles || []), ...localData.solvedPuzzles]));
          const mergedFavorites = Array.from(new Set([...(cloudData.favoritePuzzles || []), ...localData.favoritePuzzles]));

          const finalData = {
            solvedPuzzles: mergedSolved,
            favoritePuzzles: mergedFavorites,
            email: currentUser.email,
            displayName: currentUser.displayName,
            lastLogin: serverTimestamp(),
          };

          await setDoc(userDocRef, finalData, { merge: true });
          setData(prev => ({ 
            ...prev, 
            solvedPuzzles: mergedSolved, 
            favoritePuzzles: mergedFavorites 
          }));
        } else {
          console.log("No cloud data, uploading local progress...");
          await setDoc(userDocRef, {
            ...localData,
            email: currentUser.email,
            displayName: currentUser.displayName,
            createdAt: serverTimestamp(),
          });
        }
        
        // After merge, setup real-time listener for this user
        const unsubSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const latestData = doc.data() as Partial<UserData>;
            setData(prev => ({
              ...prev,
              solvedPuzzles: latestData.solvedPuzzles || [],
              favoritePuzzles: latestData.favoritePuzzles || [],
            }));
          }
        });

        setUser(currentUser);
        setLoading(false);
        return () => unsubSnapshot();
      } else {
        // Guest mode: Load from localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setData(prev => ({ 
              ...prev, 
              solvedPuzzles: parsed.solvedPuzzles || [], 
              favoritePuzzles: parsed.favoritePuzzles || [] 
            }));
          } catch (e) {
            console.error("Failed to parse saved data", e);
          }
        } else {
          // Reset to clean slate if no local storage
          setData(prev => ({ ...prev, solvedPuzzles: [], favoritePuzzles: [] }));
        }
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Persist guest data to localStorage whenever it changes
  useEffect(() => {
    if (!user && !loading) {
      console.log("Saving guest data to localStorage...");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    
    // Theme application (always runs)
    if (data.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [data, user, loading]);

  // Sync actions to the correct source
  const syncToCloud = async (newData: Partial<UserData>) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, newData, { merge: true });
    }
  };

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

  const toggleSolved = async (id: number) => {
    const isSolved = data.solvedPuzzles.includes(id);
    const newSolved = isSolved
      ? data.solvedPuzzles.filter(p => p !== id)
      : [...data.solvedPuzzles, id];

    setData(prev => ({ ...prev, solvedPuzzles: newSolved }));
    
    if (user) {
      await syncToCloud({ solvedPuzzles: newSolved });
    }
  };

  const toggleFavorite = async (id: number) => {
    const isFav = data.favoritePuzzles.includes(id);
    const newFav = isFav
      ? data.favoritePuzzles.filter(p => p !== id)
      : [...data.favoritePuzzles, id];

    setData(prev => ({ ...prev, favoritePuzzles: newFav }));

    if (user) {
      await syncToCloud({ favoritePuzzles: newFav });
    }
  };

  const toggleTheme = () => {
    setData(prev => ({ ...prev, theme: prev.theme === "light" ? "dark" : "light" }));
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
      toggleTheme
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
