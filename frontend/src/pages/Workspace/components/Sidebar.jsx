import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import MoreModal from "../components/MoreModal";

export default function Sidebar({
  handleLogout,
  openInviteModal,
  workspaceName,
  setActivePanel        // 🔥 EKLENDİ
}) {
  const { workspaceId } = useParams();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <aside className="w-64 bg-[#0f172a] text-gray-200 border-r border-white/10 p-6 flex flex-col justify-between">
        <div>
          {/* WORKSPACE ADI */}
          <h1 className="text-xl font-extrabold mb-10 text-blue-400 leading-tight break-words">
            🚀 {workspaceName || "Workspace"}
          </h1>

          <nav className="space-y-4">
            <Link
              to={`/workspace/${workspaceId}`}
              onClick={() => setActivePanel("content")}
              className="block px-4 py-2 rounded-lg hover:bg-white/10"
            >
              🏠 Dashboard
            </Link>

            <Link
              to={`/workspace/${workspaceId}/spaces`}
              onClick={() => setActivePanel("content")}
              className="block px-4 py-2 rounded-lg hover:bg-white/10"
            >
              📂 Çalışma Alanları
            </Link>

            <Link
              to={`/workspace/${workspaceId}/planner`}
              onClick={() => setActivePanel("content")}
              className="block px-4 py-2 rounded-lg hover:bg-white/10"
            >
              📅 Planlamacı
            </Link>

            <Link
              to={`/workspace/${workspaceId}/members`}
              onClick={() => setActivePanel("content")}
              className="block px-4 py-2 rounded-lg hover:bg-white/10"
            >
              👥 Üyeler
            </Link>

            <button
              onClick={openInviteModal}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
            >
              ✉️ Davet Et
            </button>

            <button
              onClick={() => setShowMore(true)}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
            >
              ⋯ Daha Fazla
            </button>

            {/* 🔥 AYARLAR → STATE DEĞİŞTİRİR */}
            <button
              onClick={() => setActivePanel("settings")}
              className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 text-gray-300"
            >
              ⚙️ Ayarlar
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-600 hover:bg-red-700 h-11 rounded-lg font-semibold transition"
        >
          🚪 Çıkış Yap
        </button>
      </aside>

      {showMore && <MoreModal onClose={() => setShowMore(false)} />}
    </>
  );
}
