export default function StatsCard({ title, value, icon: Icon, color = "indigo", trend }) {
  const colorMap = {
    indigo: {
      icon: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    amber: {
      icon: "text-amber-600",
      bg: "bg-amber-50",
    },
    blue: {
      icon: "text-blue-600",
      bg: "bg-blue-50",
    },
    emerald: {
      icon: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
          {Icon && <Icon size={18} className={c.icon} />}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 tabular-nums">
        {value ?? (
          <span className="inline-block w-16 h-8 bg-slate-100 animate-pulse rounded" />
        )}
      </p>
      {trend && (
        <p className="text-xs text-slate-400 mt-1">{trend}</p>
      )}
    </div>
  );
}

