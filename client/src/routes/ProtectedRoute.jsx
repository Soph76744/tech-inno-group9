import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
        try {
        const res = await fetch("/api/auth/me", {
            credentials: "include"
        });

        setLoggedIn(res.ok);
        } catch {
        setLoggedIn(false);
        }

        setLoading(false);
    }

    checkAuth();
    }, []);

  if (loading) return <div>Loading...</div>;

  if (!loggedIn) return <Navigate to="/login" />;

  return children;
}