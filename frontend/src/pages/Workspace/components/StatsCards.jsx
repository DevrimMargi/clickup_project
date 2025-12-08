export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">👥 Üyeler</h3>
        <h2 className="text-4xl font-bold mb-1">1</h2>
        <p className="text-gray-400">Şu an sadece sensin</p>
      </div>

      <div className="bg-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">✅ Görevler</h3>
        <h2 className="text-4xl font-bold mb-1">0</h2>
        <p className="text-gray-400">Henüz görev yok</p>
      </div>

      <div className="bg-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">✉️ Davetler</h3>
        <h2 className="text-4xl font-bold mb-1">0</h2>
        <p className="text-gray-400">Davet gönderilmedi</p>
      </div>

    </div>
  );
}
