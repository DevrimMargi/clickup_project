import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MembersPage() {
  const { workspaceId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8000/workspace/${workspaceId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMembers(res.data);
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

      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex justify-between items-center bg-slate-800 p-3 rounded-lg"
          >
            <div>
              <p className="font-semibold">{m.full_name}</p>
              <p className="text-sm text-gray-400">{m.email}</p>
            </div>

            <span className="text-sm px-3 py-1 rounded-full bg-blue-600">
              {m.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
