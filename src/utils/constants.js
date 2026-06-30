export const FIELDS = {
  MINUTE: 'minute',
  HOUR: 'hour',
  DOM: 'dom',
  MONTH: 'month',
  DOW: 'dow',
};

export const FIELD_ORDER = [
  FIELDS.MINUTE,
  FIELDS.HOUR,
  FIELDS.DOM,
  FIELDS.MONTH,
  FIELDS.DOW,
];

export const MODES = {
  EVERY: 'every',
  STEP: 'step',
  SPECIFIC: 'specific',
  RANGE: 'range',
};

export const FIELD_CONFIGS = {
  [FIELDS.MINUTE]: {
    name: 'minute',
    label: 'Minutes',
    min: 0,
    max: 59,
    labels: Array.from({ length: 60 }, (_, i) => String(i)),
  },
  [FIELDS.HOUR]: {
    name: 'hour',
    label: 'Hours',
    min: 0,
    max: 23,
    labels: Array.from({ length: 24 }, (_, i) => String(i)),
  },
  [FIELDS.DOM]: {
    name: 'dom',
    label: 'Day of Month',
    min: 1,
    max: 31,
    labels: Array.from({ length: 31 }, (_, i) => String(i + 1)),
  },
  [FIELDS.MONTH]: {
    name: 'month',
    label: 'Month',
    min: 1,
    max: 12,
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
  },
  [FIELDS.DOW]: {
    name: 'dow',
    label: 'Day of Week',
    min: 0,
    max: 6,
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
};

export const MONTH_LABELS = FIELD_CONFIGS[FIELDS.MONTH].labels;
export const DOW_LABELS = FIELD_CONFIGS[FIELDS.DOW].labels;

export const TIMEZONES = [
  { id: 'UTC', label: 'UTC', offset: 0 },
  { id: 'EST', label: 'EST (UTC-5)', offset: -5 },
  { id: 'PST', label: 'PST (UTC-8)', offset: -8 },
  { id: 'GMT', label: 'GMT', offset: 0 },
  { id: 'CET', label: 'CET (UTC+1)', offset: 1 },
  { id: 'IST', label: 'IST (UTC+5:30)', offset: 5.5 },
  { id: 'JST', label: 'JST (UTC+9)', offset: 9 },
  { id: 'AEST', label: 'AEST (UTC+10)', offset: 10 },
];

export const DEFAULT_FIELD_VALUES = {
  [FIELDS.MINUTE]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 },
  [FIELDS.HOUR]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 23 },
  [FIELDS.DOM]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 31 },
  [FIELDS.MONTH]: { mode: MODES.EVERY, step: 1, specific: [1], rangeStart: 1, rangeEnd: 12 },
  [FIELDS.DOW]: { mode: MODES.EVERY, step: 1, specific: [0], rangeStart: 0, rangeEnd: 6 },
};
