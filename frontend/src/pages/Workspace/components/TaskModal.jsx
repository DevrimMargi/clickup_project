import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const STATUS_OPTIONS = ["to do", "in progress", "complete"];
const PRIORITY_OPTIONS = ["low", "medium", "high"];

export default function TaskModal({
  defaultProjectId,
  task,
  onSave,
  onClose,
}) {
  const { workspaceId } = useParams();

  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("to do");
  const [projectId, setProjectId] = useState(defaultProjectId || "");

  const [members, setMembers] = useState([]);

  // ✅ Workspace üyelerini çek
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/workspace/${workspaceId}/members`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMembers(res.data);
      } catch (err) {
        console.error("Üyeler alınamadı", err);
      }
    };

    fetchMembers();
  }, [workspaceId]);

  // ✅ Edit modunda değerleri doldur
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setAssigneeId(task.assignee_id || "");
      setDue(task.due || "");
      setPriority(task.priority || "medium");
      setStatus(task.status || "to do");
      setProjectId(task.projectId || defaultProjectId || "");
    }
  }, [task, defaultProjectId]);

  // ✅ Kaydet
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    // Tabloda ismin hemen görünmesi için seçilen üyenin bilgisini de gönderiyoruz
    const selectedMember = members.find(m => m.id === Number(assigneeId));

    onSave({
      id: task?.id,
      title: title.trim(),
      project_id: projectId,
      assignee_id: assigneeId ? Number(assigneeId) : null,
      assignee: selectedMember ? { full_name: selectedMember.full_name } : null,
      due,
      priority,
      status,
    });
  };

  return (
    <>
      {/* Arka Plan */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-[#0b0f1a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">

          <form onSubmit={handleSubmit} className="p-14 space-y-12">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  {task ? "Edit Task" : "New Task"}
                </h2>
                <p className="text-slate-500 mt-2">Görev detaylarını aşağıdan güncelleyebilirsiniz.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white text-3xl hover:bg-white/10 transition-all"
              >
                ×
              </button>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-[10px] text-indigo-400 uppercase tracking-[0.3em] font-bold ml-1">Görev Başlığı</label>
              <input
                className="w-full bg-transparent border-b border-white/10 text-3xl text-white py-3 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/10"
                placeholder="Örn: Tasarım Revizeleri"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Assignee (Sorumlu) - DÜZELTİLEN KISIM */}
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                  Sorumlu
                </label>
                <div className="relative group">
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0b0f1a] text-slate-500">Kişi seçin...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#0b0f1a] text-white">
                        {m.full_name} {m.role ? `— ${m.role}` : ""}
                      </option>
                    ))}
                  </select>
                  {/* Custom Arrow Icon */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white [color-scheme:dark] outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                  Öncelik
                </label>
                <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                  {PRIORITY_OPTIONS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-tighter transition-all ${
                        priority === p
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-100"
                          : "text-slate-500 hover:text-white"
                      }`}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                  Durum
                </label>
                <div className="relative group">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-[#0b0f1a] text-white">
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-6 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-5 text-slate-400 font-semibold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-5 rounded-3xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                {task ? "Değişiklikleri Kaydet" : "Görevi Oluştur"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}