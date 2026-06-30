import { FIELDS, FIELD_CONFIGS, MODES, DEFAULT_FIELD_VALUES } from './constants.js';

const parseCache = new Map();

function parseField(part, fieldKey) {
  const config = FIELD_CONFIGS[fieldKey];
  const defaults = DEFAULT_FIELD_VALUES[fieldKey];

  if (part === '*') {
    return { ...defaults, mode: MODES.EVERY };
  }

  const stepMatch = part.match(/^\*\/(\d+)$/);
  if (stepMatch) {
    const step = parseInt(stepMatch[1], 10);
    if (step < 1 || step > config.max) return null;
    return { ...defaults, mode: MODES.STEP, step };
  }

  const rangeMatch = part.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const rangeStart = parseInt(rangeMatch[1], 10);
    const rangeEnd = parseInt(rangeMatch[2], 10);
    if (rangeStart < config.min || rangeEnd > config.max || rangeStart > rangeEnd) return null;
    return { ...defaults, mode: MODES.RANGE, rangeStart, rangeEnd };
  }

  if (part.includes(',')) {
    const values = part.split(',').map((v) => parseInt(v.trim(), 10));
    for (const v of values) {
      if (isNaN(v) || v < config.min || v > config.max) return null;
    }
    return { ...defaults, mode: MODES.SPECIFIC, specific: values };
  }

  const singleValue = parseInt(part, 10);
  if (!isNaN(singleValue) && singleValue >= config.min && singleValue <= config.max) {
    return { ...defaults, mode: MODES.SPECIFIC, specific: [singleValue] };
  }

  return null;
}

export function parseCronExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return { success: false, error: 'Expression is empty or invalid', fields: null };
  }

  const trimmed = expression.trim();

  if (parseCache.has(trimmed)) {
    return parseCache.get(trimmed);
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) {
    const result = {
      success: false,
      error: `Expected 5 fields, got ${parts.length}`,
      fields: null,
    };
    parseCache.set(trimmed, result);
    return result;
  }

  const fieldKeys = [FIELDS.MINUTE, FIELDS.HOUR, FIELDS.DOM, FIELDS.MONTH, FIELDS.DOW];
  const parsedFields = {};

  for (let i = 0; i < 5; i++) {
    const parsed = parseField(parts[i], fieldKeys[i]);
    if (!parsed) {
      const result = {
        success: false,
        error: `Invalid value "${parts[i]}" for ${FIELD_CONFIGS[fieldKeys[i]].label}`,
        fields: null,
      };
      parseCache.set(trimmed, result);
      return result;
    }
    parsedFields[fieldKeys[i]] = parsed;
  }

  const result = { success: true, error: null, fields: parsedFields };
  parseCache.set(trimmed, result);
  return result;
}

export function parseToFields(expression) {
  const result = parseCronExpression(expression);
  if (!result.success) return null;
  return result.fields;
}

export function clearParseCache() {
  parseCache.clear();
}

export function getCacheSize() {
  return parseCache.size;
}
