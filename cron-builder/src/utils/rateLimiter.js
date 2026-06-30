const MAX_STORAGE_BYTES = 2 * 1024 * 1024;

const windows = new Map();
const blockedUntil = new Map();

function getWindow(key) {
  if (!windows.has(key)) {
    windows.set(key, []);
  }
  return windows.get(key);
}

function cleanWindow(key, now) {
  const win = getWindow(key);
  const oneSecondAgo = now - 1000;
  while (win.length > 0 && win[0] < oneSecondAgo) {
    win.shift();
  }
  return win;
}

export function tryAcquire(key, maxPerSecond) {
  const now = Date.now();

  if (blockedUntil.has(key) && now < blockedUntil.get(key)) {
    return false;
  }

  const win = cleanWindow(key, now);

  if (win.length >= maxPerSecond) {
    blockedUntil.set(key, now + 1000);
    return false;
  }

  win.push(now);
  return true;
}

export function isRateLimited(key) {
  const now = Date.now();
  return blockedUntil.has(key) && now < blockedUntil.get(key);
}

export function resetLimiter(key) {
  if (key) {
    windows.delete(key);
    blockedUntil.delete(key);
  } else {
    windows.clear();
    blockedUntil.clear();
  }
}

export function getWindowSize(key) {
  const now = Date.now();
  const win = cleanWindow(key, now);
  return win.length;
}

export const RATE_LIMITS = {
  JSON_PARSING: 'json_parsing',
  SCHEMA_GENERATION: 'schema_generation',
  CRON_PARSING: 'cron_parsing',
  COPY_OPERATIONS: 'copy_operations',
};

export const RATE_LIMIT_CONFIG = {
  [RATE_LIMITS.JSON_PARSING]: 10,
  [RATE_LIMITS.SCHEMA_GENERATION]: 5,
  [RATE_LIMITS.CRON_PARSING]: 10,
  [RATE_LIMITS.COPY_OPERATIONS]: 20,
};

export function tryCronParse() {
  return tryAcquire(RATE_LIMITS.CRON_PARSING, RATE_LIMIT_CONFIG[RATE_LIMITS.CRON_PARSING]);
}

export function tryCopy() {
  return tryAcquire(RATE_LIMITS.COPY_OPERATIONS, RATE_LIMIT_CONFIG[RATE_LIMITS.COPY_OPERATIONS]);
}

export function tryJsonParse() {
  return tryAcquire(RATE_LIMITS.JSON_PARSING, RATE_LIMIT_CONFIG[RATE_LIMITS.JSON_PARSING]);
}

export function trySchemaGeneration() {
  return tryAcquire(RATE_LIMITS.SCHEMA_GENERATION, RATE_LIMIT_CONFIG[RATE_LIMITS.SCHEMA_GENERATION]);
}

export function getStorageLimitBytes() {
  return MAX_STORAGE_BYTES;
}

export function estimateStorageUsage() {
  let total = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cron_builder_')) {
        const value = localStorage.getItem(key) || '';
        total += key.length + value.length;
      }
    }
  } catch {
    return 0;
  }
  return total * 2;
}

export function pruneOldestEntry() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cron_builder_') && key !== 'cron_builder_theme' && key !== 'cron_builder_pro_status') {
        keys.push(key);
      }
    }
    if (keys.length > 0) {
      localStorage.removeItem(keys[0]);
    }
  } catch {
    // localStorage might be unavailable
  }
}

export function checkStorageQuota() {
  const usage = estimateStorageUsage();
  while (usage > MAX_STORAGE_BYTES) {
    const before = estimateStorageUsage();
    pruneOldestEntry();
    const after = estimateStorageUsage();
    if (after >= before) break;
  }
}
