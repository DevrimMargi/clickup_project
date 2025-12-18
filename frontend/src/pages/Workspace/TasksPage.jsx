import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function TasksPage() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 TASKLARI BACKEND’DEN ÇEK
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/tasks/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("TASKS FROM API:", res.data);
        setTasks(res.data);
      } catch (err) {
        console.error("Tasklar alınamadı", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-black text-white tracking-tighter mb-10">
          Görevler <span className="text-indigo-500">.</span>
        </h1>

        <div className="grid gap-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all"
              >
                <div className="flex flex-col gap-1">
                  {/* BAŞLIK */}
                  <p className="text-lg font-semibold text-white">
                    {task.title}
                  </p>

                  {/* SORUMLU */}
                  <span className="text-xs text-slate-400">
                    {task.assignee_fullname ?? "—"}
                  </span>

                  {/* TARİH */}
                  {task.due && (
                    <span className="text-xs text-slate-500">
                      {task.due}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-yellow-400 uppercase">
                    {task.priority}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs">
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
              Henüz görev yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
