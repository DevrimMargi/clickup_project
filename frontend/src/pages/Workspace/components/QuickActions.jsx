export default function QuickActions({ setOpenInvite }) {
  return (
    <div className="mt-10 bg-white/10 rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">🎯 Bugün Ne Yapmak İstersin?</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          className="bg-blue-600/20 p-5 rounded-xl hover:scale-105 transition cursor-pointer"
          onClick={() => setOpenInvite(true)}
        >
          👥 Yeni Üye Davet Et
        </div>

        <div className="bg-green-600/20 p-5 rounded-xl hover:scale-105 transition cursor-pointer">
          ✅ Yeni Görev Oluştur
        </div>

        <div className="bg-purple-600/20 p-5 rounded-xl hover:scale-105 transition cursor-pointer">
          ⚙️ Workspace Ayarları
        </div>

      </div>
    </div>
  );
}
