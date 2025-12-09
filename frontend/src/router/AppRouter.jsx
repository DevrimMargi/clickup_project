import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

// Workspace ana sayfa
import Workspace from "../pages/Workspace/Workspace";

// Workspace → Davet listesi
import InvitesPage from "../pages/Workspace/InvitesPage";

// 📬 Davet kabul sayfası
import AcceptInvite from "../pages/AcceptInvite";

// 📌 Invite Signup sayfası — EKLEMEN GEREKEN KISIM
import InviteSignup from "../pages/InviteSignup";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ana Sayfa */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Workspace Ana */}
        <Route path="/workspace/:workspaceId" element={<Workspace />} />

        {/* Workspace → Invite List */}
        <Route
          path="/workspace/:workspaceId/invites"
          element={<InvitesPage />}
        />

        {/* 📬 Invite Accept Page */}
        <Route path="/accept-invite/:token" element={<AcceptInvite />} />
        <Route path="/invite-signup/:token" element={<InviteSignup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
