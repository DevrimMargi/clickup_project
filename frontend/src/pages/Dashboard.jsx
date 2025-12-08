export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">ClickUp Clone</h1>

        <nav className="space-y-3">
          <a className="block text-gray-700 hover:text-blue-600 cursor-pointer">
            🏠 Dashboard
          </a>
          <a className="block text-gray-700 hover:text-blue-600 cursor-pointer">
            🗂 Çalışma Alanlarım
          </a>
          <a className="block text-gray-700 hover:text-blue-600 cursor-pointer">
            ⚙️ Ayarlar
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-semibold mb-6">Hoş geldin! 👋</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold">Workspace 1</h3>
            <p className="text-gray-600 mt-2">Proje ve görevlerini yönet.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold">Workspace 2</h3>
            <p className="text-gray-600 mt-2">Takım çalışmalarını planla.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold">Yeni Workspace Oluştur +</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
