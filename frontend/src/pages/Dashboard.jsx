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
  const today = new Date().toLocaleDateString('tr-TR', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-400 p-6 md:p-10">
      
      {/* HEADER BÖLÜMÜ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            Hoş geldin <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-3 text-lg font-medium">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            Workspace kontrol panelindesin • <span className="text-indigo-400 font-bold">{today}</span>
          </p>
        </div>

        {/* HIZLI AKSİYONLAR */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            <Plus className="w-6 h-6" />
            <span>Görev Oluştur</span>
          </button>
          <button className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all group">
            <Settings className="w-6 h-6 text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* ÖZET İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard icon={<Target size={28} />} label="Aktif Projeler" value="12" trend="+2 bu hafta" type="blue" />
        <StatCard icon={<CheckSquare size={28} />} label="Biten Görevler" value="48" trend="%12 artış" type="emerald" />
        <StatCard icon={<Users size={28} />} label="Takım Üyeleri" value="8" trend="3 yeni" type="purple" />
      </div>

      {/* ANA ÖZELLİK KARTLARI */}
      <div className="flex items-center gap-3 mb-8 ml-1">
        <div className="h-1 w-8 bg-indigo-500 rounded-full"></div>
        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Hızlı Menü</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MenuCard 
          icon={<Zap className="w-8 h-8" />} 
          title="Görev Yönetimi" 
          description="Takımının iş akışını organize et, öncelikleri belirle ve ilerlemeyi takip et."
          color="blue"
        />
        <MenuCard 
          icon={<UserPlus className="w-8 h-8" />} 
          title="Ekipler ve Davetler" 
          description="Yeni yetenekleri davet et, rollerini belirle ve departmanları oluştur."
          color="purple"
        />
        <MenuCard 
          icon={<Settings className="w-8 h-8" />} 
          title="Sistem Ayarları" 
          description="Logoyu değiştir, genel tercihleri yönet ve güvenlik politikalarını ayarla."
          color="amber"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, type }) {
  const themes = {
    blue: "text-blue-400 bg-blue-500/5 border-blue-500/10",
    emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    purple: "text-purple-400 bg-purple-500/5 border-purple-500/10"
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] hover:border-slate-700 transition-all group">
      <div className="flex items-center gap-6">
        <div className={`p-4 rounded-2xl border ${themes[type]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-black text-white">{value}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 ${themes[type].split(' ')[0]}`}>
              {trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuCard({ icon, title, description, color }) {
  const colors = {
    blue: "from-blue-500/20 to-transparent border-blue-500/20 text-blue-400",
    purple: "from-purple-500/20 to-transparent border-purple-500/20 text-purple-400",
    amber: "from-amber-500/20 to-transparent border-amber-500/20 text-amber-400"
  };

  return (
    <div className={`group relative bg-slate-900 border border-slate-800 p-10 rounded-[3rem] transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-black`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]`} />
      
      <div className="relative z-10">
        <div className={`p-4 bg-slate-800 rounded-2xl w-fit mb-8 shadow-inner ${colors[color].split(' ').pop()}`}>
          {icon}
        </div>
        <h3 className="text-2xl font-black text-white mb-4 flex items-center justify-between">
          {title}
          <ArrowUpRight className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
        </h3>
        <p className="text-slate-400 text-lg leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}