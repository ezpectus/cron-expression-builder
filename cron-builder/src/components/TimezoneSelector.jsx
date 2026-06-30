import { TIMEZONES } from '../utils/constants.js';
import PremiumBadge from './PremiumBadge.jsx';

export default function TimezoneSelector({ timezone, onChange, isPremium = false, onLockedClick }) {
  const freeAllowedIds = ['UTC', 'GMT'];

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    if (!isPremium && !freeAllowedIds.includes(selectedId)) {
      onLockedClick && onLockedClick('timezone');
      return;
    }
    onChange(selectedId);
  };

  return (
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <select
        value={timezone}
        onChange={handleSelect}
        className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
      >
        {TIMEZONES.map((tz) => {
          const isLocked = !isPremium && !freeAllowedIds.includes(tz.id);
          return (
            <option key={tz.id} value={tz.id} disabled={isLocked}>
              {tz.label}{isLocked ? ' (Pro)' : ''}
            </option>
          );
        })}
      </select>
      {!isPremium && <PremiumBadge size="sm" />}
    </div>
  );
}
