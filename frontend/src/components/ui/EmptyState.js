import { InboxIcon } from "lucide-react";

export default function EmptyState({
  title = "No results found",
  description = "There is nothing to display here yet.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
        <InboxIcon size={24} className="text-slate-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

