import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import type { User } from "firebase/auth";

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
// Firebase sets this key when a user is signed in — we use it to decide
// whether to bother loading the Firebase SDK at all on page load.
const FIREBASE_SESSION_HINT = "brainfuck_has_firebase_session";

/** Lazily load everything Firebase-related in one chunk */
async function getFirebase() {
  const [
    { auth, db, googleProvider },
    { onAuthStateChanged, signInWithPopup, signOut: firebaseSignOut },
    { doc, getDoc, setDoc, onSnapshot, serverTimestamp },
  ] = await Promise.all([
    import("~/lib/firebase"),
    import("firebase/auth"),
    import("firebase/firestore"),
  ]);
  return { auth, db, googleProvider, onAuthStateChanged, signInWithPopup, firebaseSignOut, doc, getDoc, setDoc, onSnapshot, serverTimestamp };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserData>({
    solvedPuzzles: [],
    favoritePuzzles: [],
    theme: "dark",
  });

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<Partial<UserData>>({});
  const unsubAuthRef = useRef<(() => void) | null>(null);

  // ── 1. Read localStorage synchronously (no Firebase needed) ──────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(prev => ({
          ...prev,
          solvedPuzzles: parsed.solvedPuzzles || [],
          favoritePuzzles: parsed.favoritePuzzles || [],
          theme: parsed.theme || "dark",
        }));
        document.documentElement.classList.toggle("dark", parsed.theme !== "light");
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // ── 2. Only load Firebase if a previous session was detected ─────────────
  useEffect(() => {
    const hasSession = localStorage.getItem(FIREBASE_SESSION_HINT) === "1";

    if (!hasSession) {
      // Pure guest — Firebase never loads, auth iframe never spins up
      setLoading(false);
      return;
    }

    // User had a previous session → load Firebase and listen for auth state
    let cancelled = false;
    getFirebase().then(({ auth, db, onAuthStateChanged, serverTimestamp, doc, getDoc, setDoc, onSnapshot }) => {
      if (cancelled) return;

      const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          localStorage.setItem(FIREBASE_SESSION_HINT, "1");
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          const localData = { solvedPuzzles: data.solvedPuzzles, favoritePuzzles: data.favoritePuzzles };

          if (userDoc.exists()) {
            const cloudData = userDoc.data() as Partial<UserData>;
            const mergedSolved = Array.from(new Set([...(cloudData.solvedPuzzles || []), ...localData.solvedPuzzles]));
            const mergedFavorites = Array.from(new Set([...(cloudData.favoritePuzzles || []), ...localData.favoritePuzzles]));
            await setDoc(userDocRef, { solvedPuzzles: mergedSolved, favoritePuzzles: mergedFavorites, email: currentUser.email, displayName: currentUser.displayName, lastLogin: serverTimestamp() }, { merge: true });
            setData(prev => ({ ...prev, solvedPuzzles: mergedSolved, favoritePuzzles: mergedFavorites }));
          } else {
            await setDoc(userDocRef, { ...localData, email: currentUser.email, displayName: currentUser.displayName, createdAt: serverTimestamp() });
          }

          const unsubSnapshot = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const d = snap.data() as Partial<UserData>;
              setData(prev => ({ ...prev, solvedPuzzles: d.solvedPuzzles || [], favoritePuzzles: d.favoritePuzzles || [] }));
            }
          });

          setUser(currentUser);
          // Lazy PostHog identify — don't block auth flow
          import("~/lib/posthog").then(({ identifyUser, trackEvent }) => {
            identifyUser(currentUser.uid, { email: currentUser.email, displayName: currentUser.displayName });
            trackEvent("user_logged_in");
          });
          setLoading(false);
          return () => unsubSnapshot();
        } else {
          // Signed out
          localStorage.removeItem(FIREBASE_SESSION_HINT);
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setData(prev => ({ ...prev, solvedPuzzles: parsed.solvedPuzzles || [], favoritePuzzles: parsed.favoritePuzzles || [] }));
            } catch {}
          } else {
            setData(prev => ({ ...prev, solvedPuzzles: [], favoritePuzzles: [] }));
          }
          setUser(null);
          import("~/lib/posthog").then(({ resetUser }) => resetUser());
          setLoading(false);
        }
      });

      unsubAuthRef.current = unsubAuth;
    });

    return () => {
      cancelled = true;
      unsubAuthRef.current?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 3. Persist guest data to localStorage ────────────────────────────────
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    document.documentElement.classList.toggle("dark", data.theme === "dark");
  }, [data, user, loading]);

  // ── 4. Debounced Firestore sync ───────────────────────────────────────────
  const syncToCloud = (newData: Partial<UserData>) => {
    if (!user) return;
    pendingDataRef.current = { ...pendingDataRef.current, ...newData };
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(async () => {
      if (user && Object.keys(pendingDataRef.current).length > 0) {
        const { db, doc, setDoc } = await getFirebase();
        const userDocRef = doc(db, "users", user.uid);
        const dataToSync = { ...pendingDataRef.current };
        pendingDataRef.current = {};
        try {
          await setDoc(userDocRef, dataToSync, { merge: true });
        } catch (error) {
          console.error("Failed to sync to Firestore:", error);
          pendingDataRef.current = { ...dataToSync, ...pendingDataRef.current };
        }
      }
    }, 1000);
  };

  // ── 5. Sign in — this is the first time Firebase loads for pure guests ───
  const signIn = async () => {
    const { auth, googleProvider, signInWithPopup } = await getFirebase();
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem(FIREBASE_SESSION_HINT, "1");
      // Re-initialise the auth listener now that Firebase is loaded
      const { onAuthStateChanged, db, doc, getDoc, setDoc, onSnapshot, serverTimestamp } = await getFirebase();
      const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          const localData = { solvedPuzzles: data.solvedPuzzles, favoritePuzzles: data.favoritePuzzles };
          if (userDoc.exists()) {
            const cloudData = userDoc.data() as Partial<UserData>;
            const mergedSolved = Array.from(new Set([...(cloudData.solvedPuzzles || []), ...localData.solvedPuzzles]));
            const mergedFavorites = Array.from(new Set([...(cloudData.favoritePuzzles || []), ...localData.favoritePuzzles]));
            await setDoc(userDocRef, { solvedPuzzles: mergedSolved, favoritePuzzles: mergedFavorites, email: currentUser.email, displayName: currentUser.displayName, lastLogin: serverTimestamp() }, { merge: true });
            setData(prev => ({ ...prev, solvedPuzzles: mergedSolved, favoritePuzzles: mergedFavorites }));
          } else {
            await setDoc(userDocRef, { ...localData, email: currentUser.email, displayName: currentUser.displayName, createdAt: serverTimestamp() });
          }
          const unsubSnapshot = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const d = snap.data() as Partial<UserData>;
              setData(prev => ({ ...prev, solvedPuzzles: d.solvedPuzzles || [], favoritePuzzles: d.favoritePuzzles || [] }));
            }
          });
          setUser(currentUser);
          import("~/lib/posthog").then(({ identifyUser, trackEvent }) => {
            identifyUser(currentUser.uid, { email: currentUser.email, displayName: currentUser.displayName });
            trackEvent("user_logged_in");
          });
          setLoading(false);
          unsubAuthRef.current = () => { unsubAuth(); unsubSnapshot(); };
        }
      });
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const signOut = async () => {
    const { auth, firebaseSignOut } = await getFirebase();
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem(FIREBASE_SESSION_HINT);
      import("~/lib/posthog").then(({ trackEvent }) => trackEvent("user_logged_out"));
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const toggleSolved = (id: number) => {
    const isSolved = data.solvedPuzzles.includes(id);
    const newSolved = isSolved ? data.solvedPuzzles.filter(p => p !== id) : [...data.solvedPuzzles, id];
    setData(prev => ({ ...prev, solvedPuzzles: newSolved }));
    if (user) syncToCloud({ solvedPuzzles: newSolved });
  };

  const toggleFavorite = (id: number) => {
    const isFav = data.favoritePuzzles.includes(id);
    const newFav = isFav ? data.favoritePuzzles.filter(p => p !== id) : [...data.favoritePuzzles, id];
    setData(prev => ({ ...prev, favoritePuzzles: newFav }));
    if (user) syncToCloud({ favoritePuzzles: newFav });
  };

  const toggleTheme = () => {
    setData(prev => ({ ...prev, theme: prev.theme === "light" ? "dark" : "light" }));
  };

  return (
    <UserContext.Provider value={{ ...data, user, loading, signIn, signOut, toggleSolved, toggleFavorite, toggleTheme }}>
      <div className="theme-transition min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        {children}
      </div>
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error("useUser must be used within a UserProvider");
  return context;
}
