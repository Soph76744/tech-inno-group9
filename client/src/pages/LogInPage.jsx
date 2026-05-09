import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Stores username and password
export default function LoginPage() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
// Stores login errors and remaining lock out time
  const [error, setError] = useState("");
  const [lockTime, setLockTime] = useState(0);

  const navigate = useNavigate(); // Redirects user once logged in

  const isLocked = lockTime > 0; // Account locked out 

  // Input validation for basic SQL injection phrases
  function isMalicious(input) {
    return /('|--|;|OR\s+1=1|DROP|SELECT)/i.test(input);
  }

  // Countdown for when account is locked to stop repeated attempts
  useEffect(() => {
    if (lockTime <= 0) return;
    const interval = setInterval(() => {
      setLockTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockTime]);

  // Log in form submission
  async function handleLogin(e) {
    e.preventDefault();
    // Block input during lockout
    if (isLocked) return;
    // Blocking suspicious inputs 
    if (isMalicious(username) || isMalicious(password)) {
      setError("Invalid input detected");
      return;
    }
    // Used to send log in request to backend and session
    // Also sends username and password
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });
      // Converts response to JSON
      const data = await res.json();
      // For when log in fails, the user will be locked out for 5 minutes if there are repeated failed attempts
      if (!res.ok) {
        if (res.status === 429) {
          setLockTime(data.remainingTime || 300);
          setError("Account locked for 5 minutes");
          return;
        }

        setError(data.error);
        return;
      }
      setError("");
      // Redirecting to homepage
      navigate("/");
    } catch {
      setError("Server error");
    }
  }
  // Main page styling, including log in form
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#1a1a2e",
        color: "white",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#16213e",
          padding: 30,
          borderRadius: 10,
          width: 300,
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          AR Maintenance Support System
        </h2>
        {/* Username input, only allowed when not locked out */}
        <input
          placeholder="Username"
          value={username}
          disabled={isLocked}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "94%",
            margin: "10px 0",
            padding: 8,
            opacity: isLocked ? 0.5 : 1,
          }}
        />
{/* Password input, only allowed when not locked out */}
        <input
          type="password"
          value={password}
          placeholder="Password"
          disabled={isLocked}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "94%",
            margin: "10px 0",
            padding: 8,
            opacity: isLocked ? 0.5 : 1,
          }}
        />

        <button
          disabled={isLocked}
          style={{
            width: "100%",
            padding: 10,
            background: isLocked ? "#555" : "#0f3460",
            color: "white",
            border: "none",
            cursor: isLocked ? "not-allowed" : "pointer",
          }}
        >
          {isLocked ? "Locked..." : "Login"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {isLocked && (
          <p
            style={{
              color: "#ff4444",
              fontWeight: "bold",
            }}
          >
            Try again in {lockTime}s
          </p>
        )}
      </form>
    </div>
  );
}
