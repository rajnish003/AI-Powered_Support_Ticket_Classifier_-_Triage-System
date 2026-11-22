const CATEGORY_STYLES = {
  billing: "bg-violet-50 text-violet-700 border border-violet-200",
  technical: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  account: "bg-orange-50 text-orange-700 border border-orange-200",
  security: "bg-rose-50 text-rose-700 border border-rose-200",
  other: "bg-slate-100 text-slate-600 border border-slate-200",
};

export default function CategoryBadge({ category }) {
  const key = category?.toLowerCase() || "other";
  const style = CATEGORY_STYLES[key] || CATEGORY_STYLES.other;
  const display = category
    ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    : "Unknown";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {display}
    </span>
  );
}

