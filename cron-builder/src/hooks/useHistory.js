import { useState, useEffect, useCallback } from 'react';
import { sanitizeForStorage, validateStoredData } from '../utils/sanitizer.js';
import { checkStorageQuota } from '../utils/rateLimiter.js';

const STORAGE_KEY = 'cron_builder_history';
const MAX_HISTORY = 20;

export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (validateStoredData(parsed, 'array')) {
          const sanitized = parsed
            .map((item) => sanitizeForStorage(item))
            .filter((item) => item.length > 0);
          setHistory(sanitized.slice(0, MAX_HISTORY));
        }
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const saveToHistory = useCallback((expression) => {
    if (!expression) return;
    const sanitized = sanitizeForStorage(expression);
    if (!sanitized) return;
    setHistory((prev) => {
      const filtered = prev.filter((e) => e !== sanitized);
      const updated = [sanitized, ...filtered].slice(0, MAX_HISTORY);
      try {
        checkStorageQuota();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage might be unavailable or quota exceeded
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage might be unavailable
    }
  }, []);

  const removeFromHistory = useCallback((expression) => {
    const sanitized = sanitizeForStorage(expression);
    setHistory((prev) => {
      const updated = prev.filter((e) => e !== sanitized);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage might be unavailable
      }
      return updated;
    });
  }, []);

  return { history, saveToHistory, clearHistory, removeFromHistory };
}
