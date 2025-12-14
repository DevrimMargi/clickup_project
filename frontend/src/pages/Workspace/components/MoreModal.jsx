export default function MoreModal({ onClose }) {
  // Orijinal emojiler ve daha açıklayıcı metinler
  const modalItems = [
    { label: "Chat", icon: "💬", description: "Ekip iletişimini yönetin." },
    { label: "Docs", icon: "📄", description: "Bilgi tabanı ve notlar." },
    { label: "Dashboards", icon: "📊", description: "İlerlemeyi görselleştirin." },
    { label: "Whiteboards", icon: "🧠", description: "Görsel planlama araçları." },
    { label: "Forms", icon: "✅", description: "Veri toplama ve anketler." },
    { label: "Clips", icon: "🎬", description: "Kısa video mesajlar oluşturun." },
    { label: "Goals", icon: "🏆", description: "Hedef ve OKR takibi." },
    { label: "Timesheets", icon: "⏰", description: "Zaman takibi ve raporlama." },
    { label: "Apps", icon: "🧩", description: "Üçüncü taraf entegrasyonları." },
  ];

  return (
    // Dış katman: Ekranı kapla, merkezle, blur efekti ekle
    <div 
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      
      {/* Modal Kutusu: Daha büyük gölge, yuvarlak köşeler ve animasyon */}
      <div 
        className="bg-[#0f172a] text-white rounded-2xl p-8 w-[650px] max-w-[90%] 
                   shadow-2xl shadow-indigo-500/50 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Başlık ve Kapatma Butonu (Minimal) */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-700/50 pb-4">
          <h2 className="text-2xl font-extrabold text-indigo-400 tracking-wide">
            Tüm Uygulamalar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition text-lg font-bold"
            aria-label="Kapat"
          >
            &times;
          </button>
        </div>

        {/* İçerik: 3 Sütunlu Izgara (Daha iyi dağılım) */}
        <div className="grid grid-cols-3 gap-5">
          {modalItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-xl p-5 
                         flex flex-col items-start 
                         hover:bg-indigo-600/30 transition duration-300 
                         transform hover:-translate-y-1 hover:shadow-lg cursor-pointer 
                         border border-gray-700/50"
            >
              {/* İkon Bölgesi: Emojiyi kullan */}
              <div className="text-3xl bg-indigo-900/40 p-3 rounded-xl mb-3">
                {item.icon}
              </div>
              
              <div className="text-lg font-semibold text-white">{item.label}</div>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Kapat Butonu: Vurgulu ve modern bir stil */}
        <button
          onClick={onClose}
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 
                     py-3 rounded-xl text-md font-semibold tracking-wide 
                     transition duration-300 shadow-lg shadow-indigo-500/20"
        >
          Kapat
        </button>
        
      </div>
    </div>
  );
}