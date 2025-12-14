import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProjectModal from "./components/ProjectModal";
import TaskModal from "./components/TaskModal";

const STATUS_STYLES = {
  "to do": "bg-slate-800 text-white border-white/10",
  "in progress": "bg-amber-500/20 text-amber-200 border-amber-200/40",
  complete: "bg-emerald-500/20 text-emerald-200 border-emerald-200/40",
};

export default function SpacesPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [taskDraft, setTaskDraft] = useState(null);

  const tasks = useMemo(
    () =>
      projects.flatMap((project) =>
        (project.tasks || []).map((task) => ({
          ...task,
          projectId: project.id,
          projectName: project.name,
        }))
      ),
    [projects]
  );

  const handleCreateProject = ({ name, description }) => {
    const newProject = {
      id: Date.now(), // ileride backend'den alınacak
      name: name.trim(),
      description: description.trim(),
      tasks: [],
    };

    setProjects((prev) => [...prev, newProject]);
    setShowCreateModal(false);
  };

  const handleOpenTaskModal = (projectId, task = null) => {
    setSelectedProjectId(projectId);
    setTaskDraft(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = ({ projectId, title, status }) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;

        const newTask = {
          id: Date.now(),
          title: title.trim(),
          status,
        };

        return {
          ...project,
          tasks: [...(project.tasks || []), newTask],
        };
      })
    );
    setShowTaskModal(false);
    setTaskDraft(null);
  };

  return (
    <div className="p-6 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">📁 Çalışma Alanları</h1>
        <p className="text-sm text-slate-300 mt-2">
          Yeni proje açıp ekip arkadaşlarına görev atayın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proje Oluştur (küçük sütun) */}
        <section className="lg:col-span-1">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Proje Oluştur</h2>
                <p className="text-xs text-slate-300">
                  Hızlıca yeni bir çalışma alanı açın.
                </p>
              </div>
              <span className="text-sm text-slate-400">Küçük panel</span>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-4 py-3 rounded-xl"
            >
              ➕ Proje Oluştur
            </button>
          </div>
        </section>

        {/* Görevlendirme (büyük sütun) */}
        <section className="lg:col-span-2">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-5 shadow-lg h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Görevlendirme</h2>
                <p className="text-xs text-slate-300">
                  Projeleri ve görevleri tablo görünümünde takip edin.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                {tasks.length} görev / {projects.length} proje
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="text-sm text-slate-300 border border-dashed border-white/20 rounded-xl p-6 text-center">
                Henüz proje oluşturulmadı. Sol panelden yeni bir proje ekleyin.
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900">
                {/* Header row */}
                <div className="grid grid-cols-7 text-xs uppercase tracking-wide text-slate-400 bg-slate-950/60 px-4 py-3">
                  <div className="col-span-2">Name</div>
                  <div className="text-center">Assignee</div>
                  <div className="text-center">Due date</div>
                  <div className="text-center">Priority</div>
                  <div className="text-center">Status</div>
                  <div className="text-center">Comments</div>
                </div>

                <div className="divide-y divide-white/5">
                  {tasks.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-300">
                      Bu projelerde henüz görev yok. “Add Task” ile ekleyin.
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="grid grid-cols-7 items-center px-4 py-3 hover:bg-slate-800/70 cursor-pointer transition"
                        onClick={() => handleOpenTaskModal(task.projectId, task)}
                      >
                        <div className="col-span-2 flex items-center gap-2 text-sm">
                          <span className="text-slate-500">○</span>
                          <div>
                            <div className="font-medium text-white">
                              {task.title || "Untitled"}
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-1">
                              {task.projectName}
                            </div>
                          </div>
                        </div>

                        <div className="text-center text-xs text-slate-300">
                          {task.assignee || "—"}
                        </div>
                        <div className="text-center text-xs text-slate-300">
                          {task.due || "—"}
                        </div>
                        <div className="text-center text-xs text-slate-300">
                          {task.priority || "—"}
                        </div>

                        <div className="text-center">
                          <span
                            className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[task.status] || STATUS_STYLES["to do"]
                              }`}
                          >
                            <span className="h-2 w-2 rounded-full border border-white/70 inline-block"></span>
                            {task.status?.toUpperCase() || "TO DO"}
                          </span>
                        </div>

                        <div className="text-center text-slate-400 text-lg">💬</div>
                      </div>
                    ))
                  )}

                  {/* Add Task row */}
                  <div className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleOpenTaskModal(projects[0]?.id || null)}
                      className="text-sm text-blue-300 hover:text-blue-200 flex items-center gap-2"
                    >
                      <span className="text-lg">＋</span>
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Proje oluştur modalı */}
      {showCreateModal && (
        <ProjectModal
          onCreate={handleCreateProject}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Görev modalı */}
      {showTaskModal && (
        <TaskModal
          projects={projects}
          defaultProjectId={selectedProjectId}
          task={taskDraft}
          onClose={() => {
            setShowTaskModal(false);
            setTaskDraft(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
