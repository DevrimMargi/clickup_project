// AppRouter.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

// Workspace ana sayfa
import Workspace from "../pages/Workspace/Workspace";

// Workspace Davetler sayfası (tek eklediğimiz alt sayfa)
import InvitesPage from "../pages/Workspace/InvitesPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ana Sayfa */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Workspace ana */}
        <Route path="/workspace/:workspaceId" element={<Workspace />} />

        {/* Workspace alt → sadece DAVETLER */}
        <Route
          path="/workspace/:workspaceId/invites"
          element={<InvitesPage />}
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
