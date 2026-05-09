import { Routes, Route, Navigate } from "react-router-dom";
// Imports 
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Layout from "./layouts/Layout";
// Different Pages
import LoginPage from "./pages/LogInPage";
import DashboardPage from "./pages/DashboardPage";
import ToolsPage from "./pages/ToolsPage";
import FaultsPage from "./pages/FaultsPage";
import ARPage from "./pages/ARPage";
import AuditLogsPage from "./pages/AuditLogsPage";

export default function App() {
  return (
    <Routes>
      {/* Public - initial log in page */}
      <Route path="/login" element={<LoginPage />} />
      {/* Protected Wrapper */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Core pages - All can see*/}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        {/* Faults page can only be seen by admin, engineers cannot see it.*/}
        <Route 
          path="/faults" 
          element={
            <RoleProtectedRoute role="admin">
              <FaultsPage />
            </RoleProtectedRoute>
          } 
        />
        {/* Logs page can only be seen by admins, engineers cannot see it.*/}
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
