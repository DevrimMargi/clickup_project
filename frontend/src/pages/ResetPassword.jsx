import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 URL'den token al
  const token = new URLSearchParams(location.search).get("token");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!newPassword || !newPasswordRepeat) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (newPassword !== newPasswordRepeat) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (!token) {
      setError("Geçersiz veya eksik bağlantı.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8000/auth/reset-password", {
        token: token,
        new_password: newPassword,
      });

      setMessage("Şifren başarıyla güncellendi. Giriş yapabilirsin.");

      // ⏳ 2 sn sonra login’e at
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Şifre sıfırlama başarısız."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">
          Yeni Şifre Belirle
        </h2>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Yeni şifreni belirleyebilirsin.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Yeni şifre"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="password"
            placeholder="Yeni şifre (tekrar)"
            value={newPasswordRepeat}
            onChange={(e) => setNewPasswordRepeat(e.target.value)}
            disabled={loading}
            className="border px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
}
