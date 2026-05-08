import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      setError("");
      navigate("/"); // navigates to tool page 

    } catch (err) {
      setError("Server error");
    }
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#1a1a2e",
      color: "white"
    }}>
      <form onSubmit={handleLogin} style={{
        background: "#16213e",
        padding: 30,
        borderRadius: 10,
        width: 300
      }}>
        <h2 style={{ textAlign: "center" }}>AR Maintenance System</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "94%", margin: "10px 0", padding: 8 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "94%", margin: "10px 0", padding: 8 }}
        />

        <button style={{ width: "100%", padding: 10 }}>
          Login
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}