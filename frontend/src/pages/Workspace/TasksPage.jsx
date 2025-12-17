import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function TasksPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([
    { id: 1, text: "Backend entegrasyonunu tamamla", status: "todo", priority: "high" },
    { id: 2, text: "UI tasarımını iyileştir", status: "in-progress", priority: "medium" }
  ]);
  const [taskText, setTaskText] = useState("");

  const handleAddTask = (e) => {
    if (e.key && e.key !== "Enter") return;
    if (!taskText.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: taskText,
      status: "todo",
      priority: "medium"
    };
    
    setTasks([newTask, ...tasks]);
    setTaskText("");
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-8 font-sans relative overflow-hidden">
      {/* Arka Plan Dekoratif Işıklar */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Bölümü */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                Project Dashboard
              </span>
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
                ID: {projectId}
              </span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">
              Görevler <span className="text-indigo-500">.</span>
            </h1>
          </div>

          {/* Yeni Görev Input - Ultra Modern */}
          <div className="relative flex-1 max-w-md group">
            <input
              type="text"
              placeholder="Yeni bir görev tanımla..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/30 transition-all text-white placeholder:text-slate-600 shadow-2xl"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              onKeyDown={handleAddTask}
            />
            <button
              onClick={handleAddTask}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              Ekle
            </button>
          </div>
        </header>

        {/* Görev Listesi */}
        <div className="grid gap-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center gap-6">
                  {/* Status Checkbox Simülasyonu */}
                  <div className="w-6 h-6 rounded-full border-2 border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-indigo-500 transition-all" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors tracking-tight">
                      {task.text}
                    </p>
                    <div className="flex gap-4 mt-1">
                       <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500 italic">
                         Priority: {task.priority}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                    Düzenle
                  </button>
                  <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all">
                    Sil
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-slate-600 font-medium">Henüz görev eklenmemiş. Başlamak için yukarıyı kullan!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}