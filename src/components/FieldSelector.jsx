import { FIELD_CONFIGS, MODES } from '../utils/constants.js';

const MODE_LABELS = {
  [MODES.EVERY]: 'Every',
  [MODES.STEP]: 'Every N',
  [MODES.SPECIFIC]: 'Specific',
  [MODES.RANGE]: 'Range',
};

export default function FieldSelector({ fieldKey, field, onModeChange, onStepChange, onSpecificChange, onRangeChange, onToggleSpecific }) {
  const config = FIELD_CONFIGS[fieldKey];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(MODE_LABELS).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              field.mode === mode
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {field.mode === MODES.EVERY && (
        <div className="text-slate-400 text-sm py-2">
          Matches every value ({config.min}–{config.max})
        </div>
      )}

      {field.mode === MODES.STEP && (
        <div className="flex items-center gap-3">
          <label className="text-slate-300 text-sm">Every</label>
          <input
            type="number"
            min={1}
            max={config.max}
            value={field.step}
            onChange={(e) => onStepChange(parseInt(e.target.value, 10) || 1)}
            className="w-20 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
          />
          <span className="text-slate-400 text-sm">
            {config.label.toLowerCase()}(s)
          </span>
        </div>
      )}

      {field.mode === MODES.SPECIFIC && (
        <div className="space-y-2">
          <div className="text-slate-400 text-sm">Select specific values:</div>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
            {config.labels.map((label, idx) => {
              const value = config.min + idx;
              const selected = field.specific.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => onToggleSpecific(value)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    selected
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {field.mode === MODES.RANGE && (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-slate-300 text-sm">From</label>
          <select
            value={field.rangeStart}
            onChange={(e) => onRangeChange(parseInt(e.target.value, 10), field.rangeEnd)}
            className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
          >
            {config.labels.map((label, idx) => (
              <option key={idx} value={config.min + idx}>{label}</option>
            ))}
          </select>
          <label className="text-slate-300 text-sm">to</label>
          <select
            value={field.rangeEnd}
            onChange={(e) => onRangeChange(field.rangeStart, parseInt(e.target.value, 10))}
            className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
          >
            {config.labels.map((label, idx) => (
              <option key={idx} value={config.min + idx}>{label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
