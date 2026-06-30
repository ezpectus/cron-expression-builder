export default function CronPreview({ expression, validation, onCopy }) {
  const parts = expression.split(' ');

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm font-medium">Cron Expression</span>
        <button
          onClick={() => onCopy(expression)}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {parts.map((part, idx) => (
          <span
            key={idx}
            className="font-mono text-2xl text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg"
          >
            {part}
          </span>
        ))}
      </div>
      {validation && !validation.valid && (
        <div className="mt-3 flex items-start gap-2 text-red-400 text-sm">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{validation.error}</span>
        </div>
      )}
    </div>
  );
}
