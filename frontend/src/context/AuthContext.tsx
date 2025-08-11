"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseReady } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const setupAuth = async () => {
      try {
        // Wait a bit for Firebase to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if Firebase is ready
        if (!isFirebaseReady()) {
          console.error('Firebase not ready, retrying...');
          // Retry after a short delay
          setTimeout(setupAuth, 500);
          return;
        }
        
        // Ensure auth is properly initialized
        if (auth) {
          console.log('Setting up auth listener...');
          unsubscribe = onAuthStateChanged(auth, 
            (user) => {
              console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
              setUser(user);
              setLoading(false);
              
              // Set auth cookie for middleware
              if (user) {
                document.cookie = `auth=1; path=/; max-age=3600; secure; samesite=strict`;
              } else {
                document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
              }
            }, 
            (error) => {
              console.error("Auth state change error:", error);
              setLoading(false);
              setUser(null);
            }
          );
        } else {
          console.error('Firebase auth not initialized');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error setting up auth listener:', error);
        setLoading(false);
      }
    };

    setupAuth();

    return () => {
      if (unsubscribe) {
        console.log('Cleaning up auth listener...');
        unsubscribe();
      }
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      if (auth && isFirebaseReady()) {
        await signOut(auth);
        document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        router.push("/login");
      } else {
        throw new Error("Firebase not ready");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if Firebase fails
      document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      router.push("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
