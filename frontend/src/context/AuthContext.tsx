"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseReady } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

/**
 * Authentication context interface defining the structure of auth-related data
 * @interface AuthContextType
 * @property {User | null} user - Current authenticated user or null if not logged in
 * @property {boolean} loading - Whether authentication state is being checked
 * @property {() => Promise<void>} logout - Function to log out the current user
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

/**
 * Default authentication context with initial values
 * Provides fallback values before the provider is initialized
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

/**
 * Authentication provider component that wraps the app and manages user authentication state
 * 
 * This component:
 * - Sets up Firebase authentication listeners
 * - Manages user login/logout state
 * - Handles authentication cookies for middleware
 * - Provides authentication context to child components
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped with auth context
 * @returns {JSX.Element} Provider component with authentication context
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    /**
     * Sets up Firebase authentication state listener
     * Handles user authentication state changes and manages cookies
     * 
     * @async
     * @function setupAuth
     * @returns {Promise<void>}
     */
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
            /**
             * Callback function for authentication state changes
             * @param {User | null} user - The authenticated user or null if logged out
             */
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
            /**
             * Error callback for authentication state changes
             * @param {Error} error - Authentication error that occurred
             */
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

    /**
     * Cleanup function to unsubscribe from auth state changes
     * Prevents memory leaks when component unmounts
     */
    return () => {
      if (unsubscribe) {
        console.log('Cleaning up auth listener...');
        unsubscribe();
      }
    };
  }, []);

  /**
   * Logs out the current user and redirects to login page
   * 
   * This function:
   * - Signs out the user from Firebase
   * - Clears authentication cookies
   * - Redirects to login page
   * - Handles errors gracefully with fallback logout
   * 
   * @async
   * @function logout
   * @returns {Promise<void>}
   * @throws {Error} When Firebase is not ready or signout fails
   * 
   * @example
   * ```tsx
   * const { logout } = useAuth();
   * await logout(); // User will be logged out and redirected
   * ```
   */
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

/**
 * Custom hook to access authentication context
 * 
 * This hook provides access to:
 * - Current user information
 * - Authentication loading state
 * - Logout function
 * 
 * @returns {AuthContextType} Authentication context with user state and functions
 * @throws {Error} When used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading, logout } = useAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (!user) return <div>Please log in</div>;
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user.email}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
