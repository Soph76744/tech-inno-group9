import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    }

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("user");
      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

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
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        <Link to="/tools" style={linkStyle}>
          Tools
        </Link>

        <Link to="/ar" style={linkStyle}>
          AR
        </Link>

        {user?.role === "admin" && (
          <>
            <Link to="/faults" style={linkStyle}>
              Fault Logs
            </Link>

            <Link to="/logs" style={linkStyle}>
              Audit Logs
            </Link>
          </>
        )}
      </div>

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