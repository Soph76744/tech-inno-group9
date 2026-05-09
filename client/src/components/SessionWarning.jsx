import { useEffect, useState } from "react";

// For when users are about to be logged out
export default function SessionWarning() {
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft > 120) return null; // only show last 2 mins

  // Styling warning
  return (
    <div
      style={{
        position: "fixed",
        top: 70,
        right: 20,
        background: "#ff4444",
        color: "white",
        padding: 10,
        borderRadius: 8,
        zIndex: 9999,
      }}
    >
      Session expires in {timeLeft}s
    </div>
  );
}