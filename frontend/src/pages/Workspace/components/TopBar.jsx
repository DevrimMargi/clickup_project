export default function TopBar({ workspaceId }) {
  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold">Workspace Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Workspace ID: {workspaceId}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="bg-white/10 px-4 py-2 rounded-lg outline-none"
          placeholder="Ara..."
        />
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
          D
        </div>
      </div>
    </div>
  );
}
