export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="w-full flex justify-between items-center px-10 py-6 bg-white shadow-sm">
        <h1 className="text-3xl font-extrabold text-blue-600">
          ClickUp Clone
        </h1>

        <div className="flex gap-4">
          <a
            href="/login"
            className="px-5 py-2 font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </a>

          <a
            href="/signup"
            className="px-5 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-24 text-center px-5">
        <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
          Organize Your Work & Boost Productivity 🚀
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          ClickUp Clone, bireylerin ve ekiplerin projelerini yönetmesini,
          görevleri takip etmesini, hedef belirlemesini ve daha verimli
          çalışmasını sağlayan modern bir görev yönetim platformudur.
        </p>
      </section>

      {/* FEATURES GRID */}
      <section className="mt-20 px-10">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Platformun Temel Özellikleri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {/* FEATURE 1 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-bold text-blue-600 mb-3">Görev Yönetimi</h4>
            <p className="text-gray-600 leading-relaxed">
              Görev oluşturabilir, ekip üyelerine atayabilir, son tarihler
              belirleyebilir ve her bir görevin durumunu kolayca takip
              edebilirsiniz. Listeler, board görünümü ve önceliklendirme desteği bulunur.
            </p>
          </div>

          {/* FEATURE 2 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-bold text-purple-600 mb-3">Ekip İşbirliği</h4>
            <p className="text-gray-600 leading-relaxed">
              Ekip arkadaşlarınızla yorum yaparak, dosya paylaşarak ve anlık geri
              bildirim sağlayarak birlikte çalışabilirsiniz. Mention sistemi
              sayesinde herkes gelişmelerden haberdar olur.
            </p>
          </div>

          {/* FEATURE 3 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-bold text-green-600 mb-3">Projeler & Listeler</h4>
            <p className="text-gray-600 leading-relaxed">
              Projeler oluşturabilir, her proje altında görev listeleri
              oluşturup düzenleyebilir ve ekibinizin bütün iş akışını tek bir
              ekranda görüntüleyebilirsiniz.
            </p>
          </div>

          {/* FEATURE 4 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-bold text-orange-500 mb-3">Performans İzleme</h4>
            <p className="text-gray-600 leading-relaxed">
              Üyelerin görev tamamlama hızını, proje ilerleme yüzdesini ve genel
              performansı grafiksel bir arayüzde takip edebilirsiniz.
            </p>
          </div>

          {/* FEATURE 5 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-bold text-pink-500 mb-3">Bildirim Sistemi</h4>
            <p className="text-gray-600 leading-relaxed">
              Görev atamaları, son teslim tarihleri ve yorumlar için anında
              bildirim alarak iş akışından kopmazsınız.
            </p>
          </div>

          {/* FEATURE 6 */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="text-2xl font-bold text-teal-600 mb-3">Mobil Uyumlu Tasarım</h4>
            <p className="text-gray-600 leading-relaxed">
              Platform tüm cihazlarda kusursuz şekilde çalışır. Masaüstü,
              tablet ve mobil ekranlarda aynı deneyimi sunar.
            </p>
          </div>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center mt-24 pb-20">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          Hemen Ücretsiz Kullanmaya Başlayın
        </h3>
        <p className="text-gray-600 mb-8">
          Ekibinizi düzenlemek, projelerinizi kolaylaştırmak ve verimliliğinizi artırmak artık çok kolay.
        </p>

        <a
          href="/signup"
          className="px-10 py-3 text-lg font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
        >
          Ücretsiz Başla
        </a>
      </section>
    </div>
  );
}
