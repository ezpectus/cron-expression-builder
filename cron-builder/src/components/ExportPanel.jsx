import { useState, useEffect } from 'react';
import { buildCrontabLine, buildJsonExport } from '../utils/cronBuilder.js';

export default function ExportPanel({ fields, expression, description, onCopy, isPremium = false, onLockedClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
        <kbd className="text-xs text-slate-500 ml-1">Ctrl+Shift+E</kbd>
      </button>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-slate-400 text-sm font-medium">Export Options</span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-500 hover:text-slate-300 text-sm"
        >
          Close
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onCopy(buildCrontabLine(fields), 'Crontab line copied')}
          className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg text-left transition-colors"
        >
          <span className="font-medium">Copy as Crontab Line</span>
          <span className="block text-slate-500 text-xs font-mono mt-0.5 truncate">
            {buildCrontabLine(fields)}
          </span>
        </button>

        <button
          onClick={() => isPremium ? onCopy(buildJsonExport(fields, expression, description), 'JSON copied') : onLockedClick && onLockedClick('json')}
          className={`w-full px-3 py-2 text-sm rounded-lg text-left transition-colors ${isPremium ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-700/50 text-slate-500 cursor-pointer'}`}
        >
          <span className="font-medium flex items-center gap-2">
            Copy as JSON
            {!isPremium && (
              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-400 font-bold">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                PRO
              </span>
            )}
          </span>
          <span className="block text-slate-500 text-xs mt-0.5">Full structured export with fields</span>
        </button>

        <button
          onClick={() => isPremium ? onCopy(description, 'Description copied') : onLockedClick && onLockedClick('description')}
          className={`w-full px-3 py-2 text-sm rounded-lg text-left transition-colors ${isPremium ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-700/50 text-slate-500 cursor-pointer'}`}
        >
          <span className="font-medium flex items-center gap-2">
            Copy as Human Description
            {!isPremium && (
              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-400 font-bold">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                PRO
              </span>
            )}
          </span>
          <span className="block text-slate-500 text-xs mt-0.5">{description}</span>
        </button>
      </div>
    </div>
  );
}
