import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 get logged-in user
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include "})
        .then(res => {
        if (!res.ok) return null; // 👈 prevents 401 crash
        return res.json();
        })
        .then(data => {
        if (data && data.user) {
            setUser(data.user);
        }
        })
        .catch(() => setUser(null));
    }, []);

  // 🔹 logout
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    navigate("/login");
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#16213e",
      color: "white",
      padding: "10px 20px",
      marginBottom: 20
    }}>

      {/* LEFT SIDE NAV */}
      <div>
        <Link to="/" style={{ color: "white", marginRight: 10 }}>Tools</Link>
        <Link to="/faults" style={{ color: "white", marginRight: 10 }}>Faults Logs</Link>
        <Link to="/ar" style={{ color: "white" }}>AR</Link>
      </div>

      {/* RIGHT SIDE USER */}
      <div>
        {user && (
          <span style={{ marginRight: 10 }}>
            Logged in as <strong>{user}</strong>
          </span>
        )}

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

    </div>
  );
}