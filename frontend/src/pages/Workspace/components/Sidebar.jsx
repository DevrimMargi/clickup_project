import { Link, useParams } from "react-router-dom";

export default function Sidebar({ handleLogout, setOpenInvite }) {
  const { workspaceId } = useParams();

  return (
    <aside className="w-64 bg-[#020617] border-r border-white/10 p-6 flex flex-col justify-between">

      <div>
        <h2 className="text-2xl font-extrabold mb-8 text-blue-400">🚀 Workspace</h2>

        <nav className="space-y-3">

          <Link
            to={`/workspace/${workspaceId}`}
            className="block px-4 py-2 rounded-lg hover:bg-white/10"
          >
            🏠 Dashboard
          </Link>

          <Link
            to={`/workspace/${workspaceId}/members`}
            className="block px-4 py-2 rounded-lg hover:bg-white/10"
          >
            👥 Üyeler
          </Link>

          <Link
            to={`/workspace/${workspaceId}/tasks`}
            className="block px-4 py-2 rounded-lg hover:bg-white/10"
          >
            ✅ Görevler
          </Link>

          {/* 🔥 ARTIK ROUTE DEĞİL, MODAL AÇAN BUTON OLDU */}
          <button
            onClick={() => setOpenInvite(true)}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
          >
            ✉️ Davetler
          </button>

          <Link
            to={`/workspace/${workspaceId}/settings`}
            className="block px-4 py-2 rounded-lg hover:bg-white/10"
          >
            ⚙️ Ayarlar
          </Link>

        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 bg-red-600 hover:bg-red-700 h-11 rounded-lg font-semibold transition"
      >
        🚪 Çıkış Yap
      </button>

    </aside>
  );
}
