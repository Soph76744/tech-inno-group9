import Navbar from "../components/Navbar";
import SessionWarning from "../components/SessionWarning";
import { Outlet } from "react-router-dom";

// Navbar becomes global and automatically within every page
export default function Layout() {
  return (
    <div>
      <Navbar />
      <SessionWarning />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}