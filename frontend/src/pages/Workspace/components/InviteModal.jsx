import { useState, useEffect } from "react";

export default function InviteModal({ closeModal, workspaceId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false);

  // ESC ile kapatma
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  const handleInvite = async () => {
    if (!email.trim()) {
      alert("Lütfen bir email girin.");
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

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Davet başarıyla gönderildi!");
        setEmail("");
        closeModal();
      } else {
        alert(data.detail || "Bir hata oluştu!");
      }
    } catch (err) {
      alert("Sunucuya ulaşılamadı.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeModal}
      />

      {/* Modal Box */}
      <div className="relative bg-[#0f172a] w-[450px] rounded-xl p-6 shadow-lg text-white z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Invite people</h2>
          <button
            className="text-gray-400 hover:text-white text-2xl"
            onClick={closeModal}
          >
            ×
          </button>
        </div>

        {/* Email Input */}
        <label className="block text-sm text-gray-300 mb-1">Invite by email</label>
        <input
          type="email"
          placeholder="Email, comma or space separated"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-[#1e293b] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Role Selection */}
        <label className="block text-sm text-gray-300 mb-1">Invite as</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded bg-[#1e293b] border border-gray-600"
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>
        <p className="text-xs text-gray-400 mb-4">
          Can access all public items in your Workspace.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={loading}
            className="px-4 py-2 rounded bg-white text-black font-semibold hover:bg-gray-300 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
