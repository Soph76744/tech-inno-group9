import { createContext, useContext, useEffect, useState } from "react";

// Allows user session data to be accessed globally
const AuthContext = createContext();

// Wraps the application and provides authentication state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Loading state used while checking session status
  const [loading, setLoading] = useState(true);

  // Currently logged in user is fetched from backend
  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include"
      });

      // If user is authenticated 
      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      console.log("Auth Data:", data) // debugging
      setUser(data.user); // Stores authenticated user state
    } catch {
      setUser(null);
    } finally {
      setLoading(false); // Authentication check completed 
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refresh: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for easier access to authentication check 
export const useAuth = () => useContext(AuthContext);