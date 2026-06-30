import { FIELDS, FIELD_CONFIGS, MODES, DEFAULT_FIELD_VALUES } from './constants.js';

function createDefaultField(fieldKey) {
  return { ...DEFAULT_FIELD_VALUES[fieldKey] };
}

export function createField(fieldKey, overrides = {}) {
  const base = createDefaultField(fieldKey);
  return { ...base, ...overrides };
}

export function createMinuteField(overrides = {}) {
  return createField(FIELDS.MINUTE, overrides);
}

export function createHourField(overrides = {}) {
  return createField(FIELDS.HOUR, overrides);
}

export function createDomField(overrides = {}) {
  return createField(FIELDS.DOM, overrides);
}

export function createMonthField(overrides = {}) {
  return createField(FIELDS.MONTH, overrides);
}

export function createDowField(overrides = {}) {
  return createField(FIELDS.DOW, overrides);
}

export function createAllFields(overrides = {}) {
  return {
    [FIELDS.MINUTE]: createMinuteField(overrides.minute || {}),
    [FIELDS.HOUR]: createHourField(overrides.hour || {}),
    [FIELDS.DOM]: createDomField(overrides.dom || {}),
    [FIELDS.MONTH]: createMonthField(overrides.month || {}),
    [FIELDS.DOW]: createDowField(overrides.dow || {}),
  };
}

export function getFieldConfig(fieldKey) {
  return FIELD_CONFIGS[fieldKey];
}

export function getFieldLabel(fieldKey) {
  return FIELD_CONFIGS[fieldKey].label;
}

export { MODES };
