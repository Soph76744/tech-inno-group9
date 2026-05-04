import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/LogInPage";
import ToolsPage from "./pages/ToolsPage";
import FaultsPage from "./pages/FaultsPage";
import ARPage from "./pages/ARPage";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

        <Route path="/" element={<ToolsPage />} />
        <Route path="/faults" element={<FaultsPage />} />
        <Route path="/ar" element={<ARPage />} />

      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}