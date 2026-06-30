import { useState } from 'react';
import { FIELD_ORDER, FIELD_CONFIGS } from '../utils/constants.js';
import FieldSelector from './FieldSelector.jsx';

export default function CronBuilder({ fields, onModeChange, onStepChange, onSpecificChange, onRangeChange, onToggleSpecific }) {
  const [activeTab, setActiveTab] = useState(FIELD_ORDER[0]);

  const tabs = FIELD_ORDER.map((key) => ({
    key,
    label: FIELD_CONFIGS[key].label,
  }));

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="flex flex-wrap border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {FIELD_ORDER.map((key) => (
          <div key={key} className={activeTab === key ? 'block' : 'hidden'}>
            <FieldSelector
              fieldKey={key}
              field={fields[key]}
              onModeChange={(mode) => onModeChange(key, mode)}
              onStepChange={(step) => onStepChange(key, step)}
              onSpecificChange={(specific) => onSpecificChange(key, specific)}
              onRangeChange={(start, end) => onRangeChange(key, start, end)}
              onToggleSpecific={(value) => onToggleSpecific(key, value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
