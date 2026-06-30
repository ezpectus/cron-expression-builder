export default function NextRuns({ runs }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-slate-400 text-sm font-medium">Next 10 Run Times</span>
      </div>
      {runs.length === 0 ? (
        <p className="text-slate-500 text-sm">No upcoming runs found.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {runs.map((run, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-3 bg-slate-900 rounded-lg"
            >
              <span className="font-mono text-slate-200 text-sm">{run.formatted}</span>
              <span className="text-emerald-400 text-xs font-medium">{run.relative}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
