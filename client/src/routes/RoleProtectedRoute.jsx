import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RoleProtectedRoute({ children, role }) {
  const [allowed, setAllowed] = useState(null); // checking access if user is allowed

  useEffect(() => {
    async function checkRole() {
      // Finds out who the current user is from backend
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include" // sends session so backend can identify
        });
        // When request fails due to not logged in or a server error
        if (!res.ok) {
          setAllowed(false);
          return;
        }
        // Response converted to JSON
        const data = await res.json();
        console.log("ROLE CHECK:", data); // debugging check

        // Access role and checks if it matches
        setAllowed(data.user?.role === role);
      } catch {
        setAllowed(false);
      }
    }
    // Checking role again if role has changed
    checkRole();
  }, [role]);

  // Loading screen
  if (allowed === null) return <div>Loading...</div>;
  // UX: redirect user instead of blocking UI
  if (!allowed) return <Navigate to="/" />;
  return children;
}