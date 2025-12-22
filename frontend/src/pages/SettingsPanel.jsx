import { useState } from "react";

export default function SettingsPanel() {
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");

  // 🔐 Şifre state'leri
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

  // UI state'leri
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 ŞİFRE DEĞİŞTİR
  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !newPasswordRepeat) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (newPassword !== newPasswordRepeat) {
      setError("Yeni şifreler birbiriyle uyuşmuyor.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Şifre değiştirilemedi.");
        return;
      }

      setSuccess("Şifre başarıyla güncellendi.");

      // inputları temizle
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordRepeat("");
    } catch (err) {
      setError("Sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        ⚙️ Ayarlar
      </h1>

      <div className="bg-[#020617] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🔐 Şifre Değiştir
        </h2>

        {!showForgot && (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {success && (
  <div className="relative bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
    <span>{success}</span>

    <button
      onClick={() => setSuccess("")}
      className="text-green-400 hover:text-green-200 font-bold text-lg leading-none ml-4"
      aria-label="Kapat"
    >
      ×
    </button>
  </div>
)}



            <input
              type="password"
              placeholder="Mevcut şifre"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none focus:border-indigo-500 transition"
            />

            <input
              type="password"
              placeholder="Yeni şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none focus:border-indigo-500 transition"
            />

            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              value={newPasswordRepeat}
              onChange={(e) => setNewPasswordRepeat(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none focus:border-indigo-500 transition"
            />

            <div className="flex justify-between items-center text-sm">
              <button
                onClick={() => setShowForgot(true)}
                className="text-indigo-400 hover:underline"
              >
                Şifremi unuttum?
              </button>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </div>
        )}

        {showForgot && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              E-posta adresini gir, sana şifre sıfırlama linki gönderelim.
            </p>

            <input
              type="email"
              placeholder="E-posta adresin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none focus:border-indigo-500 transition"
            />

            <div className="flex gap-3">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold transition">
                Sıfırlama Linki Gönder
              </button>

              <button
                onClick={() => setShowForgot(false)}
                className="flex-1 border border-white/10 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition"
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
