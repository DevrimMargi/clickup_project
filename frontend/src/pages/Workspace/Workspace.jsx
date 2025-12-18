import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import InviteModal from "./components/InviteModal";

export default function Workspace() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [openInvite, setOpenInvite] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  // 🔐 Auth kontrolü
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // 🔥 Workspace adını backend’den çek (fetch)
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/workspaces/${workspaceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Workspace fetch error");
        return res.json();
      })
      .then((data) => {
        setWorkspaceName(data.name);
      })
      .catch(() => {
        setWorkspaceName("Workspace");
      });
  }, [workspaceId]);

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      {/* Sol Menü */}
      <Sidebar
        workspaceName={workspaceName}
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
