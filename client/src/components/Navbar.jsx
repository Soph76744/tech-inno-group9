import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

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

      {/* LEFT */}
      <div>
        <Link to="/" style={{ color: "white", marginRight: 10 }}>Dashboard</Link>
        <Link to="/tools" style={{ color: "white", marginRight: 10 }}>Tool Tracker</Link>

        {user?.role === "admin" && (
          <Link to="/faults" style={{ color: "white", marginRight: 10 }}>
            Faults Logs
          </Link>
        )}

        <Link to="/ar" style={{ color: "white" }}>AR</Link>
      </div>

      {/* RIGHT */}
      <div>
        {user && (
          <span style={{ marginRight: 10 }}>
            Logged in as <strong>{user.username}</strong> (Role: {user.role})
          </span>
        )}
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

    </div>
  );
}