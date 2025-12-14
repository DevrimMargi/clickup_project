import { useState, useEffect } from "react";

const STATUS_OPTIONS = [
  { value: "to do", label: "To Do" },
  { value: "in progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
];

export default function TaskModal({
  projects,
  defaultProjectId,
  task,
  onClose,
  onSave,
}) {
  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [title, setTitle] = useState(task?.title || "");
  const [status, setStatus] = useState(task?.status || "to do");

  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(projects[0].id);
    }
  }, [projectId, projects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    onSave({
      projectId,
      title,
      status,
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700 relative">
          <h2 className="text-xl font-semibold text-white mb-4">
            Görev Oluştur / Düzenle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Proje</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(Number(e.target.value))}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-300">Görev Adı</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: API entegrasyonu"
                className="w-full p-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-300">Durum</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

