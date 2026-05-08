import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

// Navbar becomes global and automatically within every page
export default function Layout() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}