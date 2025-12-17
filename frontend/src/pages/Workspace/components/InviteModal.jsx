import { useState, useEffect } from "react";

export default function InviteModal({ closeModal, workspaceId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => (e.key === "Escape" ? closeModal() : null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  const handleInvite = async () => {
    if (!email.trim() || !email.includes("@")) {
      alert("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/invite/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          workspace_id: Number(workspaceId),
          role: role,
        }),
      });
      if (response.ok) {
        alert("Davet başarıyla gönderildi! 🎉");
        closeModal();
      }
    } catch (err) {
      alert("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={closeModal} />

      {/* Modal Kutusu: 600px genişlik - Tam kararında */}
      <div className="relative bg-[#0f172a] w-full max-w-[600px] rounded-[2.5rem] p-10 shadow-[0_0_60px_rgba(79,70,229,0.25)] border border-white/5 animate-fade-in-up z-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">
              DAVET ET <span className="text-indigo-500 italic">!</span>
            </h2>
            <p className="text-slate-400 text-base font-medium">
              Ekibini büyütmek için e-posta gönder.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            <span className="text-xl font-light">×</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Email Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
              E-POSTA ADRESİ
            </label>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 focus-within:border-indigo-500/50 transition-all duration-300">
              <input
                type="email"
                autoFocus
                placeholder="arkadasin@sirket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white text-lg font-medium outline-none placeholder:text-slate-700"
              />
            </div>
          </div>

          {/* Rol Seçimi: MoreModal Esintili Kartlar */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
              YETKİ SEVİYESİ
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Member Card */}
              <button
                onClick={() => setRole("Member")}
                className={`flex flex-col items-start p-6 rounded-3xl border-2 transition-all duration-300 group ${
                  role === "Member"
                    ? "bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className={`text-3xl mb-3 transition-transform duration-300 ${role === "Member" ? "scale-110" : "opacity-40"}`}>
                  👤
                </div>
                <h3 className={`text-lg font-bold ${role === "Member" ? "text-white" : "text-slate-400"}`}>
                  Üye
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed text-left line-clamp-2">
                  Görevlerde çalışır ve iş birliği yapar.
                </p>
              </button>

              {/* Admin Card */}
              <button
                onClick={() => setRole("Admin")}
                className={`flex flex-col items-start p-6 rounded-3xl border-2 transition-all duration-300 group ${
                  role === "Admin"
                    ? "bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className={`text-3xl mb-3 transition-transform duration-300 ${role === "Admin" ? "scale-110" : "opacity-40"}`}>
                  ⚡
                </div>
                <h3 className={`text-lg font-bold ${role === "Admin" ? "text-white" : "text-slate-400"}`}>
                  Yönetici
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed text-left line-clamp-2">
                  Tüm ayarları ve üyeleri yönetir.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={handleInvite}
            disabled={loading || !email}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl text-white font-black 
                       text-sm tracking-[0.2em] uppercase transition-all shadow-xl shadow-indigo-500/20
                       active:scale-[0.97] disabled:opacity-20 flex items-center justify-center gap-3"
          >
            {loading ? "GÖNDERİLİYOR..." : "DAVET ET 🚀"}
          </button>
          <button
            onClick={closeModal}
            className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-colors py-2"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}

