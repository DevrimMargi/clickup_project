import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [inviteInfo, setInviteInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/invite/accept/${token}`)
      .then((res) => setInviteInfo(res.data))
      .catch(() => alert("Geçersiz veya süresi dolmuş davet linki."));
  }, [token]);

  if (!inviteInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        
        <h1 className="text-2xl font-bold mb-4">Davet Bulundu 🎉</h1>

        <p className="text-gray-700 mb-4">
          <strong>{inviteInfo.email}</strong> adresine bir çalışma alanı daveti bulundu.
        </p>

        <button
          onClick={() => navigate(`/invite-signup/${token}`)}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-lg mt-4 transition"
        >
          Kayıt Ol ve Workspace'e Katıl
        </button>

      </div>
    </div>
  );
}
