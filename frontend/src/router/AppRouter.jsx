// src/router/AppRouter.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AcceptInvite from "../pages/AcceptInvite";
import InviteSignup from "../pages/InviteSignup";

// Workspace Layout
import Workspace from "../pages/Workspace/Workspace";

// Workspace Inner Pages
import Dashboard from "../pages/Dashboard"; // Ana dashboard
import TasksPage from "../pages/Workspace/TasksPage";
import InvitesPage from "../pages/Workspace/InvitesPage";
import SpacesPage from "../pages/Workspace/SpacesPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/accept-invite/:token" element={<AcceptInvite />} />
        <Route path="/invite-signup/:token" element={<InviteSignup />} />

        {/* WORKSPACE ROUTES */}
        <Route path="/workspace/:workspaceId" element={<Workspace />}>

          {/* Workspace Ana Sayfa */}
          <Route index element={<Dashboard />} />

          {/* Workspace iç sayfalar */}
          <Route path="tasks" element={<TasksPage />} />
          <Route path="invites" element={<InvitesPage />} />
          <Route path="spaces" element={<SpacesPage />} />
          <Route path="spaces/:projectId/tasks" element={<TasksPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
