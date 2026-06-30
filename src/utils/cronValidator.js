import { FIELDS, FIELD_CONFIGS, MODES } from './constants.js';

function validateField(field, fieldKey) {
  const config = FIELD_CONFIGS[fieldKey];

  if (!field || !field.mode) {
    return `Missing mode for ${config.label}`;
  }

  switch (field.mode) {
    case MODES.EVERY:
      return null;

    case MODES.STEP:
      if (!Number.isInteger(field.step) || field.step < 1 || field.step > config.max) {
        return `Invalid step value for ${config.label}: must be between 1 and ${config.max}`;
      }
      return null;

    case MODES.SPECIFIC:
      if (!Array.isArray(field.specific) || field.specific.length === 0) {
        return `${config.label}: at least one value must be selected`;
      }
      for (const v of field.specific) {
        if (!Number.isInteger(v) || v < config.min || v > config.max) {
          return `${config.label}: value ${v} is out of range (${config.min}-${config.max})`;
        }
      }
      return null;

    case MODES.RANGE:
      if (!Number.isInteger(field.rangeStart) || !Number.isInteger(field.rangeEnd)) {
        return `${config.label}: range start and end must be integers`;
      }
      if (field.rangeStart < config.min || field.rangeStart > config.max) {
        return `${config.label}: range start ${field.rangeStart} is out of range (${config.min}-${config.max})`;
      }
      if (field.rangeEnd < config.min || field.rangeEnd > config.max) {
        return `${config.label}: range end ${field.rangeEnd} is out of range (${config.min}-${config.max})`;
      }
      if (field.rangeStart > field.rangeEnd) {
        return `${config.label}: range start ${field.rangeStart} is greater than end ${field.rangeEnd}`;
      }
      return null;

    default:
      return `Unknown mode "${field.mode}" for ${config.label}`;
  }
}

export function validateFields(fields) {
  const fieldKeys = [FIELDS.MINUTE, FIELDS.HOUR, FIELDS.DOM, FIELDS.MONTH, FIELDS.DOW];

  for (const key of fieldKeys) {
    const error = validateField(fields[key], key);
    if (error) return { valid: false, error };
  }

  return { valid: true, error: null };
}

export function validateExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return { valid: false, error: 'Expression is empty' };
  }

  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, error: `Expected 5 fields, got ${parts.length}` };
  }

  const fieldKeys = [FIELDS.MINUTE, FIELDS.HOUR, FIELDS.DOM, FIELDS.MONTH, FIELDS.DOW];

  for (let i = 0; i < 5; i++) {
    const part = parts[i];
    const config = FIELD_CONFIGS[fieldKeys[i]];

    if (part === '*') continue;

    if (part.match(/^\*\/\d+$/)) {
      const step = parseInt(part.split('/')[1], 10);
      if (step < 1 || step > config.max) {
        return { valid: false, error: `Invalid step in ${config.label}: ${part}` };
      }
      continue;
    }

    if (part.match(/^\d+-\d+$/)) {
      const [start, end] = part.split('-').map((v) => parseInt(v, 10));
      if (start < config.min || end > config.max || start > end) {
        return { valid: false, error: `Invalid range in ${config.label}: ${part}` };
      }
      continue;
    }

    if (part.includes(',')) {
      const values = part.split(',');
      for (const v of values) {
        const num = parseInt(v.trim(), 10);
        if (isNaN(num) || num < config.min || num > config.max) {
          return { valid: false, error: `Invalid value in ${config.label}: ${v}` };
        }
      }
      continue;
    }

    const num = parseInt(part, 10);
    if (isNaN(num) || num < config.min || num > config.max) {
      return { valid: false, error: `Invalid value in ${config.label}: ${part}` };
    }
  }

  return { valid: true, error: null };
}

export function isValid(expression) {
  return validateExpression(expression).valid;
}
