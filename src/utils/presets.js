import { FIELDS, MODES } from './constants.js';

export const PRESETS = [
  {
    id: 'every-minute',
    label: 'Every Minute',
    expression: '* * * * *',
    fields: {
      [FIELDS.MINUTE]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 },
      [FIELDS.HOUR]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 23 },
      [FIELDS.DOM]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 31 },
      [FIELDS.MONTH]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 12 },
      [FIELDS.DOW]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 6 },
    },
  },
  {
    id: 'every-hour',
    label: 'Every Hour',
    expression: '0 * * * *',
    fields: {
      [FIELDS.MINUTE]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 },
      [FIELDS.HOUR]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 23 },
      [FIELDS.DOM]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 31 },
      [FIELDS.MONTH]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 12 },
      [FIELDS.DOW]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 6 },
    },
  },
  {
    id: 'midnight-daily',
    label: 'Midnight Daily',
    expression: '0 0 * * *',
    fields: {
      [FIELDS.MINUTE]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 },
      [FIELDS.HOUR]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 23 },
      [FIELDS.DOM]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 31 },
      [FIELDS.MONTH]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 12 },
      [FIELDS.DOW]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 6 },
    },
  },
  {
    id: 'weekdays-9am',
    label: 'Weekdays 9am',
    expression: '0 9 * * 1-5',
    fields: {
      [FIELDS.MINUTE]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 },
      [FIELDS.HOUR]: { mode: MODES.SPECIFIC, step: 1, specific: [9], rangeStart: 0, rangeEnd: 23 },
      [FIELDS.DOM]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 31 },
      [FIELDS.MONTH]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 12 },
      [FIELDS.DOW]: { mode: MODES.RANGE, step: 1, specific: [0], rangeStart: 1, rangeEnd: 5 },
    },
  },
  {
    id: 'weekend-midnight',
    label: 'Weekend Midnight',
    expression: '0 0 * * 6,0',
    fields: {
      [FIELDS.MINUTE]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 },
      [FIELDS.HOUR]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 23 },
      [FIELDS.DOM]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 31 },
      [FIELDS.MONTH]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 12 },
      [FIELDS.DOW]: { mode: MODES.SPECIFIC, step: 1, specific: [6, 0], rangeStart: 0, rangeEnd: 6 },
    },
  },
  {
    id: 'every-monday',
    label: 'Every Monday',
    expression: '0 0 * * 1',
    fields: {
      [FIELDS.MINUTE]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 },
      [FIELDS.HOUR]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 23 },
      [FIELDS.DOM]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 31 },
      [FIELDS.MONTH]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 12 },
      [FIELDS.DOW]: { mode: MODES.SPECIFIC, step: 1, specific: [1], rangeStart: 0, rangeEnd: 6 },
    },
  },
  {
    id: 'first-day-of-month',
    label: 'First Day of Month',
    expression: '0 0 1 * *',
    fields: {
      [FIELDS.MINUTE]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 },
      [FIELDS.HOUR]: { mode: MODES.SPECIFIC, step: 1, specific: [0], rangeStart: 0, rangeEnd: 23 },
      [FIELDS.DOM]: { mode: MODES.SPECIFIC, step: 1, specific: [1], rangeStart: 1, rangeEnd: 31 },
      [FIELDS.MONTH]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 12 },
      [FIELDS.DOW]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 6 },
    },
  },
];

export function getPresetById(id) {
  return PRESETS.find((p) => p.id === id) || null;
}

export function getPresetByExpression(expression) {
  return PRESETS.find((p) => p.expression === expression) || null;
}
