import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ToolsPage from "./pages/ToolsPage";
import FaultsPage from "./pages/FaultsPage";
import ARPage from "./pages/ARPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/faults" element={<FaultsPage />} />
        <Route path="/ar" element={<ARPage />} />
      </Routes>
    </BrowserRouter>
  );
}