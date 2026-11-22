import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {message && (
          <p className="text-sm text-slate-400 mt-1 max-w-sm">{message}</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
}

