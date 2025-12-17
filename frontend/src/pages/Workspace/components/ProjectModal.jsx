import { useState } from "react";

export default function ProjectModal({ onCreate, onClose }) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    onCreate({
      name: projectName.trim(),
      description: description.trim(),
    });

    // 🔥 Formu temizle (UX için önemli)
    setProjectName("");
    setDescription("");
  };

  return (
    <>
      {/* Arka plan */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Yeni Proje Oluştur
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Proje adı"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              autoFocus
              required
              className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <textarea
              placeholder="Açıklama (isteğe bağlı)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition"
              >
                İptal
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
              >
                Oluştur
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
