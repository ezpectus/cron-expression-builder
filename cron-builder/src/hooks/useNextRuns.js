import { useState, useEffect } from 'react';
import { formatInTimezone } from '../utils/timezoneUtils.js';
import { getNextRuns } from '../utils/cronNextRuns.js';

function formatRelative(date, now) {
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMinutes < 1) return 'in less than a minute';
  if (diffMinutes === 1) return 'in 1 minute';
  if (diffMinutes < 60) return `in ${diffMinutes} minutes`;
  if (diffHours === 1) return 'in 1 hour';
  if (diffHours < 24) return `in ${diffHours} hours`;
  if (diffDays === 1) return 'in 1 day';
  return `in ${diffDays} days`;
}

export function useNextRuns(fields, timezone, count = 10) {
  const [now, setNow] = useState(() => new Date());
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const nextRuns = getNextRuns(fields, now, count);
      const formatted = nextRuns.map((date) => ({
        date,
        formatted: formatInTimezone(date, timezone),
        relative: formatRelative(date, now),
      }));
      setRuns(formatted);
    } catch {
      setRuns([]);
    }
  }, [fields, timezone, count, now]);

  return runs;
}
