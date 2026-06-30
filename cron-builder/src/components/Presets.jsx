import { PRESETS } from '../utils/presets.js';

export default function Presets({ onSelect }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-slate-400 text-sm font-medium">Common Presets</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-emerald-500 hover:text-white text-slate-300 text-sm rounded-full font-medium transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
