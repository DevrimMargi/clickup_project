import { useState, useEffect } from "react";
import { X, Mail, ShieldCheck, User, Send } from "lucide-react";

export default function InviteModal({ closeModal, workspaceId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closeModal();
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
          role,
        }),
      });

      if (!response.ok) throw new Error();
      alert("Davet başarıyla gönderildi 🚀");
      closeModal();
    } catch {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* BACKDROP */}
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div
        className="relative w-full max-w-[680px] rounded-[40px]
        bg-white dark:bg-slate-900
        p-12 shadow-2xl shadow-indigo-200/40 dark:shadow-black/60"
      >
        {/* CLOSE */}
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 rounded-full p-2
          hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={26} className="text-slate-400 dark:text-slate-500" />
        </button>

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center
            rounded-2xl bg-indigo-50 dark:bg-indigo-500/10">
            <UserPlusIcon />
          </div>

          <h2 className="text-[30px] font-black tracking-tight text-slate-900 dark:text-white">
            Ekibine Birini Davet Et
          </h2>

          <p className="mt-3 text-lg font-medium text-slate-500 dark:text-slate-400">
            Workspace’ine yeni bir ekip arkadaşı ekle
          </p>
        </div>

        <div className="space-y-10">
          {/* EMAIL */}
          <div>
            <label className="ml-1 text-sm font-extrabold uppercase tracking-widest
              text-slate-400 dark:text-slate-500">
              E-posta Adresi
            </label>

            <div className="relative mt-3">
              <Mail
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2
                text-slate-400 dark:text-slate-500"
              />

              <input
                type="email"
                placeholder="ornek@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border-2 border-transparent
                bg-slate-50 dark:bg-slate-800
                py-5 pl-12 pr-4 text-[19px] font-semibold
                text-slate-900 dark:text-white
                placeholder:text-slate-300 dark:placeholder:text-slate-500
                focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="ml-1 text-sm font-extrabold uppercase tracking-widest
              text-slate-400 dark:text-slate-500">
              Rol Seç
            </label>

            <div className="mt-4 flex gap-6">
              <RoleCard
                selected={role === "Member"}
                onClick={() => setRole("Member")}
                icon={<User size={24} />}
                label="Üye"
                desc="Görevleri görüntüler ve yönetir"
              />

              <RoleCard
                selected={role === "Admin"}
                onClick={() => setRole("Admin")}
                icon={<ShieldCheck size={24} />}
                label="Admin"
                desc="Tüm ayarlara ve üyelere erişir"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <button
              onClick={closeModal}
              className="flex-1 py-5 text-[18px] font-bold
              text-slate-400 dark:text-slate-500
              hover:text-slate-600 dark:hover:text-slate-300"
            >
              Vazgeç
            </button>

            <button
              onClick={handleInvite}
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-3
              rounded-2xl bg-indigo-600 py-5
              text-[19px] font-black text-white
              shadow-lg shadow-indigo-200
              hover:bg-indigo-700 active:scale-95
              disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "Davet Gönder"}
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ROLE CARD */
function RoleCard({ selected, onClick, icon, label, desc }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-2xl border-2 p-6 text-left transition-all
        ${
          selected
            ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-500/10"
            : "border-slate-100 bg-slate-50 hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800"
        }`}
    >
      <div className={`${selected ? "text-indigo-600" : "text-slate-400"}`}>
        {icon}
      </div>

      <div
        className={`mt-2 text-lg font-bold
        ${selected ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"}`}
      >
        {label}
      </div>

      <div className="mt-1 text-xs font-semibold uppercase tracking-wide
        text-slate-400 dark:text-slate-500">
        {desc}
      </div>
    </button>
  );
}

/* ICON */
function UserPlusIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M16 21V19C16 17.94 15.58 16.92 14.83 16.17C14.08 15.42 13.06 15 12 15H5C3.94 15 2.92 15.42 2.17 16.17C1.42 16.92 1 17.94 1 19V21"
        stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M8.5 11C10.71 11 12.5 9.21 12.5 7C12.5 4.79 10.71 3 8.5 3C6.29 3 4.5 4.79 4.5 7C4.5 9.21 6.29 11 8.5 11Z"
        stroke="#4F46E5" strokeWidth="2.5"/>
      <path d="M20 8V14M17 11H23"
        stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
