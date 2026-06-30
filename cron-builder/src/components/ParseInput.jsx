import { useState, useRef, useEffect } from 'react';
import { sanitizeCronInput } from '../utils/sanitizer.js';
import { tryCronParse } from '../utils/rateLimiter.js';
import { getHoneypotFieldName, checkHoneypot } from '../utils/botProtection.js';

export default function ParseInput({ onParse, onRateLimited }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [honeypot, setHoneypot] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleParse = () => {
    if (checkHoneypot(honeypot)) {
      return;
    }

    if (!input.trim()) {
      setError('Please enter a cron expression');
      return;
    }

    if (!tryCronParse()) {
      setError('Too many requests, please slow down');
      if (onRateLimited) onRateLimited();
      return;
    }

    const sanitized = sanitizeCronInput(input.trim());
    if (!sanitized) {
      setError('Invalid characters in cron expression');
      return;
    }
    const result = onParse(sanitized);
    if (result.success) {
      setError(null);
      setInput('');
    } else {
      setError(result.error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleParse();
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span className="text-slate-400 text-sm font-medium">Parse Existing Cron</span>
        <kbd className="ml-auto text-xs text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded">Ctrl+P</kbd>
      </div>
      <input
        type="text"
        name={getHoneypotFieldName()}
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="*/5 * * 1-5 1-12"
          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleParse}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg font-medium transition-colors"
        >
          Parse
        </button>
      </div>
      {error && (
        <p className="mt-2 text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
