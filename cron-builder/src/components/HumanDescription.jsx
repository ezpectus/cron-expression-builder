export default function HumanDescription({ description }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-slate-400 text-sm font-medium">Human-Readable Description</span>
      </div>
      <p className="text-slate-100 text-base leading-relaxed">{description}</p>
    </div>
  );
}
