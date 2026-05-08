import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

import LoginPage from "./pages/LogInPage";
import DashboardPage from "./pages/DashboardPage";
import ToolsPage from "./pages/ToolsPage";
import FaultsPage from "./pages/FaultsPage";
import ARPage from "./pages/ARPage";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED WRAPPER */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

        {/* CORE PAGES */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tools" element={<ToolsPage />} />

        <Route 
          path="/faults" 
          element={
            <RoleProtectedRoute role="admin">
              <FaultsPage />
            </RoleProtectedRoute>
          } 
        />

        <Route path="/ar" element={<ARPage />} />

      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}