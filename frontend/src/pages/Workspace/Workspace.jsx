import { useState, useEffect } from "react";
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

  // ✔ Token yoksa kullanıcıyı login sayfasına at
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ✔ Çıkış işlemi
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // workspaceId number’a çevrildi (güvenli kullanım)
  const wsId = Number(workspaceId);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#020617] text-white">

      {/* SIDEBAR */}
      <Sidebar 
        handleLogout={handleLogout} 
        setOpenInvite={setOpenInvite} 
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">

        {/* TOP BAR */}
        <TopBar workspaceId={wsId} />

        {/* STATS SECTION */}
        <StatsCards />

        {/* QUICK ACTIONS */}
        <QuickActions setOpenInvite={setOpenInvite} />

      </main>

      {/* INVITE MODAL */}
      {openInvite && (
        <InviteModal
          workspaceId={wsId}   // ✔ her zaman number
          closeModal={() => setOpenInvite(false)}
        />
      )}
    </div>
  );
}
