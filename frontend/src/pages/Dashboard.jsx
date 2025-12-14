export default function Dashboard() {
  return (
    <div className="text-gray-200">

      {/* Hoş geldin */}
      <h1 className="text-3xl font-bold mb-2">Hoş geldin 👋</h1>
      <p className="text-sm mb-6 text-gray-400">
        Workspace kontrol paneline buradan ulaşabilirsin.
      </p>

      {/* Üst aksiyon butonları */}
      <div className="flex gap-4 mb-8">
        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          ➕ Görev Oluştur
        </button>

        <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium">
          ✉️ Davet Gönder
        </button>

        <button className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium">
          👥 Takım Oluştur
        </button>
      </div>

      {/* 3 ana kart */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition cursor-pointer">
          <h2 className="font-semibold text-lg mb-2">Görev Yönetimi</h2>
          <p className="text-gray-400">Görev oluştur, düzenle ve takım üyelerine ata.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition cursor-pointer">
          <h2 className="font-semibold text-lg mb-2">Takımlar</h2>
          <p className="text-gray-400">Takım oluştur ve üyeleri yönet.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition cursor-pointer">
          <h2 className="font-semibold text-lg mb-2">Ayarlar</h2>
          <p className="text-gray-400">Workspace ayarlarını düzenle.</p>
        </div>

      </div>
    </div>
  );
}
