import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RoleProtectedRoute({ children, role }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    async function checkRole() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include"
        });

        if (!res.ok) {
          setAllowed(false);
          return;
        }

        const data = await res.json();

        console.log("ROLE CHECK:", data); // debugging check

        // access role
        setAllowed(data.user?.role === role);

      } catch {
        setAllowed(false);
      }
    }

    checkRole();
  }, [role]);

  if (allowed === null) return <div>Loading...</div>;

  // UX: redirect instead of blocking UI
  if (!allowed) return <Navigate to="/" />;

  return children;
}