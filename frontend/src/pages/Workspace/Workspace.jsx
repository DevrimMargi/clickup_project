import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import InviteModal from "./components/InviteModal";

export default function Workspace() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [openInvite, setOpenInvite] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">

      {/* Sol Menü */}
      <Sidebar
        workspaceId={workspaceId}
        openInviteModal={() => setOpenInvite(true)}
        handleLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      />

      {/* Ana İçerik */}
      <main className="flex-1 p-8">
        <TopBar workspaceId={workspaceId} />
        <Outlet />
      </main>

      {/* Invite Modal */}
      {openInvite && (
        <InviteModal
          workspaceId={workspaceId}
          closeModal={() => setOpenInvite(false)}
        />
      )}
    </div>
  );
}
