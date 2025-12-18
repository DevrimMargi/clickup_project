import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MembersPage() {
  const { workspaceId } = useParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) return;

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8000/workspaces/${workspaceId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // 🔥 ADMIN'İ ÜSTE AL
        const sortedMembers = [...res.data].sort((a, b) => {
          if (a.role === "admin") return -1;
          if (b.role === "admin") return 1;
          return 0;
        });

        setMembers(sortedMembers);
      })
      .catch((err) => {
        console.error("Members fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [workspaceId]);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Üyeler</h2>

      {members.length === 0 ? (
        <p className="text-gray-400">Henüz üye yok</p>
      ) : (
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex justify-between items-center bg-slate-800 p-3 rounded-lg"
            >
              <div>
                <p className="font-semibold">
                  {m.full_name}
                  {m.role === "admin" && (
                    <span className="ml-2 text-xs text-yellow-400">👑 Admin</span>
                  )}
                </p>
                <p className="text-sm text-gray-400">{m.email}</p>
              </div>

              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  m.role === "admin"
                    ? "bg-yellow-500 text-black"
                    : "bg-blue-600"
                }`}
              >
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
