import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Layout from "./layouts/Layout";

import LoginPage from "./pages/LogInPage";
import DashboardPage from "./pages/DashboardPage";
import ToolsPage from "./pages/ToolsPage";
import FaultsPage from "./pages/FaultsPage";
import ARPage from "./pages/ARPage";
import AuditLogsPage from "./pages/AuditLogsPage";

export default function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Wrapper */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

        {/* Core pages */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/faults" element={<FaultsPage />} />

        <Route 
          path="/logs" 
          element={
            <RoleProtectedRoute role="admin">
              <AuditLogsPage />
            </RoleProtectedRoute>
          } 
        />

        <Route path="/ar" element={<ARPage />} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
