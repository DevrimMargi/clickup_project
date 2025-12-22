import { 
  Plus, 
  UserPlus, 
  Users, 
  LayoutDashboard, 
  CheckSquare, 
  Settings, 
  ArrowUpRight,
  Target,
  Zap
} from "lucide-react";

export default function Dashboard() {
  // Bugünün tarihini şık bir formatta alalım
  const today = new Date().toLocaleDateString('tr-TR', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-10">
      
      {/* HEADER BÖLÜMÜ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Hoş geldin, Devrim! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Workspace kontrol panelindesin • <span className="text-indigo-400">{today}</span>
          </p>
        </div>

        {/* HIZLI AKSİYONLAR */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Görev Oluştur</span>
          </button>
          <button className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* ÖZET İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Target className="text-blue-400" />} label="Aktif Projeler" value="12" trend="+2 bu hafta" />
        <StatCard icon={<CheckSquare className="text-emerald-400" />} label="Biten Görevler" value="48" trend="%12 artış" />
        <StatCard icon={<Users className="text-purple-400" />} label="Takım Üyeleri" value="8" trend="3 yeni" />
      </div>

      {/* ANA ÖZELLİK KARTLARI */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 ml-1">Hızlı Menü</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Görev Yönetimi Kartı */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-25 transition"></div>
          <div className="relative bg-slate-900/50 border border-white/5 p-8 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden">
            <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-6 text-blue-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              Görev Yönetimi
              <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition" />
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Takımının iş akışını organize et, öncelikleri belirle ve ilerlemeyi takip et.
            </p>
          </div>
        </div>

        {/* Takım Yönetimi Kartı */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-10 group-hover:opacity-25 transition"></div>
          <div className="relative bg-slate-900/50 border border-white/5 p-8 rounded-2xl hover:border-purple-500/50 transition-all cursor-pointer">
            <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-6 text-purple-400">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              Ekipler ve Davetler
              <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition" />
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Yeni yetenekleri davet et, rollerini belirle ve departmanları oluştur.
            </p>
          </div>
        </div>

        {/* Workspace Ayarları Kartı */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-10 group-hover:opacity-25 transition"></div>
          <div className="relative bg-slate-900/50 border border-white/5 p-8 rounded-2xl hover:border-amber-500/50 transition-all cursor-pointer">
            <div className="p-3 bg-amber-500/10 rounded-xl w-fit mb-6 text-amber-400">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
              Workspace Yapılandırma
              <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition" />
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Logoyu değiştir, genel tercihleri yönet ve güvenlik politikalarını ayarla.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Küçük Yardımcı Bileşen: İstatistik Kartı
function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-900/60 transition-colors shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-white leading-none mt-1">{value}</span>
            <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}