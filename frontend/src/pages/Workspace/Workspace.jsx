import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StatsCards from "./components/StatsCards";
import QuickActions from "./components/QuickActions";
import InviteModal from "./components/InviteModal";

export default function Workspace() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [openInvite, setOpenInvite] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#020617] text-white">

      {/* SIDEBAR */}
      <Sidebar handleLogout={handleLogout} setOpenInvite={setOpenInvite} />

      {/* ANA İÇERİK */}
      <main className="flex-1 p-10">

        {/* ÜST BAR */}
        <TopBar workspaceId={workspaceId} />

        {/* ÜST BİLGİLER */}
        <StatsCards />

        {/* HIZLI AKSİYONLAR */}
        <QuickActions setOpenInvite={setOpenInvite} />

      </main>

      {/* MODAL */}
      {openInvite && (
        <InviteModal
          workspaceId={workspaceId}
          closeModal={() => setOpenInvite(false)}
        />
      )}
    </div>
  );
}
