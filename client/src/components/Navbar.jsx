import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Stores logged in user information

  useEffect(() => {
    async function loadUser() {
      try {
        // Requests the current logged in user from the backend
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }
        // Saves the current user data in state
        const data = await res.json();
        setUser(data.user);

      } catch (err) {
        console.error(err);
        setUser(null); // Resets user if errors
      }
    }
    loadUser();
  }, []);

  // For logging the user out of the system
  // Sends log out request to backend 
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
  // Removes saved user data
      localStorage.removeItem("user");
      setUser(null);
// Redirects back to log in page when logged out
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  // Styling and display of navigation bar
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        background: "#111827",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
        }}
      >
        {/* Links that every role can see and direct to, on left side*/}
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>
        <Link to="/tools" style={linkStyle}>
          Tool Tracker
        </Link>
        <Link to="/faults" style={linkStyle}>
          Fault Logs
        </Link>
        <Link to="/ar" style={linkStyle}>
          AR
        </Link>
        {/* Only admins can be directed to audit logs */}
        {user?.role === "admin" && (
          <>
            <Link to="/logs" style={linkStyle}>
              Audit Logs
            </Link>
          </>
        )}
      </div>
      {/* Styling and showing user role in right corner as well as log out button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {user && (
          <span
            style={{
              fontSize: "14px",
              opacity: 0.85,
            }}
          >
            Logged in as {user.username} ({user.role})
          </span>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: 500,
};