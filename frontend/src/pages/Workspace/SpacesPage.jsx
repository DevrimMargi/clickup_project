import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProjectModal from "./components/ProjectModal";
import TaskModal from "./components/TaskModal";

const STATUS_STYLES = {
  "to do": "bg-slate-500/10 text-slate-300 border-slate-500/20",
  "in progress": "bg-rose-500/20 text-rose-100 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
  complete: "bg-emerald-500/20 text-emerald-100 border-emerald-500/30",
};

const PRIORITY_COLORS = {
  low: "text-blue-300 font-bold",
  medium: "text-yellow-300 font-bold",
  high: "text-red-400 font-bold",
};

export default function SpacesPage() {
  const { workspaceId } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState("List"); // Görünüm yönetimi
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskDraft, setTaskDraft] = useState(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const tasks = activeProject?.tasks || [];

  /* ---------------- PROJE + GÖREVLERİ YÜKLE ---------------- */
  const loadProjectsAndTasks = async () => {
    try {
      if (!workspaceId) return;

      const [projectsRes, tasksRes] = await Promise.all([
        axios.get(`http://localhost:8000/projects/workspace/${workspaceId}`),
        axios.get(`http://localhost:8000/tasks/workspace/${workspaceId}`),
      ]);

      const tasksByProject = {};
      (tasksRes.data || []).forEach((t) => {
        const pid = t.project_id;
        if (!tasksByProject[pid]) tasksByProject[pid] = [];
        tasksByProject[pid].push({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          due: t.due,
          assignee: t.assignee_fullname || null,
          assignee_id: t.assignee_id,
          project_id: pid,
        });
      });

      const loadedProjects = (projectsRes.data || []).map((p) => ({
        ...p,
        tasks: tasksByProject[p.id] || [],
      }));

      setProjects(loadedProjects);
      if (loadedProjects.length && !selectedProjectId) {
        setSelectedProjectId(loadedProjects[0].id);
      }
    } catch (err) {
      console.error("Projeler veya görevler yüklenirken hata oluştu", err);
    }
  };

  useEffect(() => {
    loadProjectsAndTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleCreateProject = async ({ name, description }) => {
    try {
      const res = await axios.post("http://localhost:8000/projects/", {
        name: name.trim(),
        description: description?.trim() || "",
        workspace_id: Number(workspaceId),
      });

      const created = { ...res.data, tasks: [] };
      setProjects((prev) => [...prev, created]);
      setSelectedProjectId(created.id);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Proje oluşturulamadı", err);
      alert("Proje oluşturulurken bir hata oluştu.");
    }
  };

  const handleDeleteProject = async (id, e) => {
  e.stopPropagation();

  if (!window.confirm("Projeyi silmek istediğinize emin misiniz?")) return;

  try {
    // ✅ 1) BACKEND'DEN PROJEYİ SİL
    await axios.delete(`http://localhost:8000/projects/${id}`);

    // ✅ 2) FRONTEND STATE'TEN SİL
    setProjects((prev) => prev.filter((p) => p.id !== id));

    // ✅ 3) Seçili proje silindiyse resetle
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  } catch (err) {
    console.error("Proje silinemedi", err);
    alert("Proje silinirken hata oluştu.");
  }
};


  /* ---------------- GÖREV İŞLEMLERİ ---------------- */
  const handleOpenTaskModal = (task = null) => {
    setTaskDraft(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId, e) => {
  e.stopPropagation();

  if (!window.confirm("Görevi silmek istediğinden emin misin?")) return;

  try {
    // ✅ 1) BACKEND'DEN SİL
    await axios.delete(`http://localhost:8000/tasks/${taskId}`);

    // ✅ 2) FRONTEND STATE'TEN SİL
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== selectedProjectId) return project;

        return {
          ...project,
          tasks: project.tasks.filter((t) => t.id !== taskId),
        };
      })
    );
  } catch (err) {
    console.error("Görev silinemedi", err);
    alert("Görev silinirken hata oluştu");
  }
};


  const handleSaveTask = async (data) => {
    try {
      // Şimdilik sadece oluşturma senaryosunu API'ye bağlıyoruz (edit için ayrı endpoint gerekebilir)
      await axios.post("http://localhost:8000/tasks/", {
        title: data.title,
        status: data.status,
        priority: data.priority,
        project_id: data.project_id || selectedProjectId,
        assignee_id: data.assignee_id || null,
        due_date: data.due || null,
      });

      await loadProjectsAndTasks();
      setShowTaskModal(false);
    } catch (err) {
      console.error("Görev kaydedilemedi", err);
      alert("Görev kaydedilirken bir hata oluştu.");
    }
  };

  /* ---------------- GÖRÜNÜM RENDER FONKSİYONLARI ---------------- */

  const renderBoard = () => (
    <div className="grid grid-cols-3 gap-6 animate-in fade-in duration-500 text-sm">
      {["to do", "in progress", "complete"].map((status) => (
        <div key={status} className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 min-h-[420px]">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-rose-500 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rose]"></div> {status}
          </h3>
          <div className="space-y-4">
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} onClick={() => handleOpenTaskModal(task)} className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 hover:border-rose-500/40 transition-all cursor-pointer group">
                <p className="font-bold text-white mb-3 uppercase text-base italic">{task.title}</p>
                <div className="flex justify-between items-center text-sm font-black text-slate-400">
                  <span>👤 {task.assignee || "—"}</span>
                  <span className={PRIORITY_COLORS[task.priority]}>{task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTable = () => (
    <div className="bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden text-base">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 text-slate-500 font-black uppercase tracking-widest text-base">
            <th className="p-4 border-b border-white/5">Task</th>
            <th className="p-4 border-b border-white/5">Assignee</th>
            <th className="p-4 border-b border-white/5">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} onClick={() => handleOpenTaskModal(t)} className="hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors text-sm">
              <td className="p-4 font-bold uppercase text-base">{t.title}</td>
              <td className="p-4 opacity-80">{t.assignee || "—"}</td>
              <td className="p-4 uppercase font-black text-sm text-rose-400">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0b0e14] text-slate-100 font-sans tracking-tight overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#10141d] border-r border-white/5 flex flex-col shadow-2xl z-20">
        <div className="p-8 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-xl shadow-indigo-600/30">T</div>
            <h2 className="font-extrabold text-xl tracking-tight text-white uppercase italic">Space Hub</h2>
          </div>
          <div className="flex items-center justify-between mb-6 px-1 text-sm font-black text-slate-500 uppercase tracking-widest">
            <span>PROJELER</span>
            <button onClick={() => setShowCreateModal(true)} className="text-indigo-400 hover:text-white transition-all bg-indigo-500/10 p-1 rounded-lg border border-indigo-500/20">＋</button>
          </div>
          <nav className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {projects.map((project) => (
              <div key={project.id} className="group relative">
                <button onClick={() => setSelectedProjectId(project.id)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-base transition-all border ${selectedProjectId === project.id ? "bg-indigo-600 text-white border-indigo-500 shadow-lg font-bold" : "hover:bg-white/5 text-slate-400 border-transparent font-medium"}`}>
                  <span className="truncate uppercase font-black italic"># {project.name}</span>
                </button>
                <button onClick={(e) => handleDeleteProject(project.id, e)} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-200 transition-all z-30">🗑️</button>
              </div>
            ))}
          </nav>
        </div>
        <div className="p-6 bg-[#0d1017]">
          <button onClick={() => setShowCreateModal(true)} className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg active:scale-95 uppercase tracking-widest transition-all">✨ PROJE EKLE</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0e14] relative">
        {!activeProject ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-pulse"><h3 className="text-3xl font-black text-white uppercase italic opacity-20 tracking-tighter">Bir Proje Seçin</h3></div>
        ) : (
          <>
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#0b0e14]/80 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-sm font-black text-indigo-500 mb-1 uppercase tracking-widest">
                    <span>WORKSPACE</span> <span className="text-slate-700">/</span> <span className="text-slate-400">{activeProject.name}</span>
                  </div>
                  <h1 className="text-2xl font-black text-white uppercase italic">{activeProject.name}</h1>
                </div>

                {/* ÇALIŞAN SEKME SİSTEMİ */}
                <div className="flex items-center bg-white/5 p-1.5 rounded-xl ml-4">
                  {["List", "Board", "Table", "Gantt"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-black shadow-lg shadow-white/10" : "text-slate-400 hover:text-white"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => handleOpenTaskModal()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl text-base font-black shadow-2xl transition-all active:scale-95 uppercase tracking-wider">GÖREV EKLE </button>
            </header>

            <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
              {activeTab === "List" && (
                <div className="rounded-[32px] border border-white/5 bg-[#10141d] shadow-2xl overflow-hidden animate-in fade-in duration-500">
                  <div className="grid grid-cols-7 text-sm font-black uppercase tracking-[0.2em] text-slate-500 px-8 py-6 bg-slate-800/40 border-b border-white/5 font-mono">
                    <div className="col-span-2">GÖREV ADI</div>
                    <div className="text-center">SORUMLU</div>
                    <div className="text-center">TARİH</div>
                    <div className="text-center">ÖNCELİK</div>
                    <div className="text-center">DURUM</div>
                    <div className="text-right">İŞLEM</div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {tasks.map((task) => (
                      <div key={task.id} onClick={() => handleOpenTaskModal(task)} className="grid grid-cols-7 px-8 py-7 hover:bg-white/[0.03] cursor-pointer transition-all items-center group">
                        <div className="col-span-2 flex items-center gap-4">
                           <div className="w-1.5 h-10 rounded-full bg-slate-800 group-hover:bg-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]"></div>
                           <span className="font-bold text-lg text-slate-100 group-hover:text-white uppercase tracking-tighter italic">{task.title}</span>
                        </div>
                        <div className="text-center font-bold text-slate-400">{task.assignee || "—"}</div>
                        <div className="text-center text-sm">{task.due ? new Date(task.due).toLocaleDateString('tr-TR') : "—"}</div>
                        <div className={`text-center text-xs uppercase italic ${PRIORITY_COLORS[task.priority] || "text-slate-500"}`}>{task.priority || "—"}</div>
                        <div className="flex justify-center"><span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase border shadow-sm ${STATUS_STYLES[task.status]}`}>{task.status}</span></div>
                        <div className="text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all"><button onClick={(e) => handleDeleteTask(task.id, e)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">🗑️</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "Board" && renderBoard()}
              {activeTab === "Table" && renderTable()}
              {activeTab === "Gantt" && (
                <div className="flex items-center justify-center py-40 text-slate-500 font-black uppercase italic opacity-20 text-4xl tracking-tighter">Gantt Görünümü Yakında . . .</div>
              )}
            </div>
          </>
        )}
      </main>

      {/* MODALS */}
      {showCreateModal && <ProjectModal onCreate={handleCreateProject} onClose={() => setShowCreateModal(false)} />}
      {showTaskModal && <TaskModal projects={projects} defaultProjectId={selectedProjectId} task={taskDraft} onSave={handleSaveTask} onClose={() => { setShowTaskModal(false); setTaskDraft(null); }} />}
    </div>
  );
}