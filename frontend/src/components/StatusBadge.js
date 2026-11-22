const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
  Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const STATUS_DOTS = {
  Pending: "bg-amber-400",
  "In Progress": "bg-blue-400",
  Resolved: "bg-emerald-400",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600 border border-slate-200";
  const dot = STATUS_DOTS[status] || "bg-slate-400";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

