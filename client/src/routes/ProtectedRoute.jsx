import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Tracks checking authentication status
  const [loading, setLoading] = useState(true);
  // Tracks if user is logged in/out
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Chceks if user is authenticated through verifying user session
    async function checkAuth() {
        try {
        const res = await fetch("/api/auth/me", {
            credentials: "include"
        });
        setLoggedIn(res.ok); // Logs user in 
        } catch {
        setLoggedIn(false); // Request failure or server error: Logged out
        }
        setLoading(false);
    }
    checkAuth();
    }, []);

  // Loading screen
  if (loading) return <div>Loading...</div>;
  if (!loggedIn) return <Navigate to="/login" />; // when not logged in, redirects to login page
// When logged in, allowed to go to actual protected pages
  return children;
}