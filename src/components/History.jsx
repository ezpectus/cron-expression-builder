import { useState, useEffect } from 'react';

export default function History({ history, onSelect, onClear, onRemove, isPremium = false, onLockedClick }) {
  const [visible, setVisible] = useState(false);
  const FREE_HISTORY_LIMIT = 3;
  const displayedHistory = isPremium ? history : history.slice(0, FREE_HISTORY_LIMIT);
  const hasLockedSlots = !isPremium && history.length >= FREE_HISTORY_LIMIT;

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'h' && !e.shiftKey) {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        History
        <kbd className="text-xs text-slate-500 ml-1">Ctrl+H</kbd>
      </button>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-slate-400 text-sm font-medium">Recent Expressions</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-slate-500 hover:text-red-400 text-sm"
          >
            Clear
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-slate-500 hover:text-slate-300 text-sm"
          >
            Close
          </button>
        </div>
      </div>
      {history.length === 0 ? (
        <p className="text-slate-500 text-sm">No history yet. Build some cron expressions!</p>
      ) : (
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {displayedHistory.map((expr, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-3 bg-slate-900 rounded-lg group"
            >
              <button
                onClick={() => onSelect(expr)}
                className="font-mono text-slate-200 text-sm hover:text-emerald-400 transition-colors flex-1 text-left"
              >
                {expr}
              </button>
              <button
                onClick={() => onRemove(expr)}
                className="text-slate-600 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity ml-2"
              >
                ×
              </button>
            </div>
          ))}
          {hasLockedSlots && (
            <button
              onClick={() => onLockedClick && onLockedClick('history')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-900/50 rounded-lg border border-dashed border-slate-700 hover:border-emerald-500 transition-colors"
            >
              <span className="text-slate-500 text-sm font-mono">+{history.length - FREE_HISTORY_LIMIT} more expressions</span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Upgrade
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
