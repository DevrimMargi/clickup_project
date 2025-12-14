import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function TasksPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  const handleAddTask = () => {
    if (!taskText.trim()) return;
    setTasks([...tasks, taskText]);
    setTaskText("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📝 Görevler - Proje ID: {projectId}</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-1/2"
          placeholder="Yeni görev ekle..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Görev Ekle
        </button>
      </div>

      <ul className="list-disc pl-6">
        {tasks.map((task, i) => (
          <li key={i}>{task}</li>
        ))}
      </ul>
    </div>
  );
}
