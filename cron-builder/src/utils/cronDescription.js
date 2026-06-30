import { FIELDS, MODES, MONTH_LABELS, DOW_LABELS } from './constants.js';

function describeMinute(field) {
  switch (field.mode) {
    case MODES.EVERY:
      return 'every minute';
    case MODES.STEP:
      return field.step === 1 ? 'every minute' : `every ${field.step} minutes`;
    case MODES.SPECIFIC: {
      if (field.specific.length === 0) return 'every minute';
      if (field.specific.length === 1) return `at minute ${field.specific[0]}`;
      const sorted = [...field.specific].sort((a, b) => a - b);
      return `at minutes ${sorted.join(', ')}`;
    }
    case MODES.RANGE:
      return `at every minute from ${field.rangeStart} through ${field.rangeEnd}`;
    default:
      return '';
  }
}

function describeHour(field, minuteField) {
  const hasSpecificMinute = minuteField.mode === MODES.SPECIFIC && minuteField.specific.length === 1;
  const minuteVal = hasSpecificMinute ? minuteField.specific[0] : null;

  switch (field.mode) {
    case MODES.EVERY:
      return '';
    case MODES.STEP:
      return field.step === 1 ? '' : `every ${field.step} hours`;
    case MODES.SPECIFIC: {
      if (field.specific.length === 0) return '';
      if (field.specific.length === 1) {
        const h = field.specific[0];
        const timeStr = minuteVal !== null
          ? `at ${String(h).padStart(2, '0')}:${String(minuteVal).padStart(2, '0')}`
          : `at hour ${h}`;
        return timeStr;
      }
      const sorted = [...field.specific].sort((a, b) => a - b);
      return `at hours ${sorted.join(', ')}`;
    }
    case MODES.RANGE:
      return `every hour from ${field.rangeStart} through ${field.rangeEnd}`;
    default:
      return '';
  }
}

function describeDom(field) {
  switch (field.mode) {
    case MODES.EVERY:
      return '';
    case MODES.STEP:
      return field.step === 1 ? '' : `every ${field.step} days of the month`;
    case MODES.SPECIFIC: {
      if (field.specific.length === 0) return '';
      if (field.specific.length === 1) return `on day-of-month ${field.specific[0]}`;
      const sorted = [...field.specific].sort((a, b) => a - b);
      return `on days-of-month ${sorted.join(', ')}`;
    }
    case MODES.RANGE:
      return `on days-of-month from ${field.rangeStart} through ${field.rangeEnd}`;
    default:
      return '';
  }
}

function describeMonth(field) {
  switch (field.mode) {
    case MODES.EVERY:
      return '';
    case MODES.STEP:
      return field.step === 1 ? '' : `every ${field.step} months`;
    case MODES.SPECIFIC: {
      if (field.specific.length === 0) return '';
      if (field.specific.length === 1) return `in ${MONTH_LABELS[field.specific[0] - 1]}`;
      const sorted = [...field.specific].sort((a, b) => a - b);
      const names = sorted.map((v) => MONTH_LABELS[v - 1]);
      return `in ${names.join(', ')}`;
    }
    case MODES.RANGE:
      return `from ${MONTH_LABELS[field.rangeStart - 1]} through ${MONTH_LABELS[field.rangeEnd - 1]}`;
    default:
      return '';
  }
}

function describeDow(field) {
  switch (field.mode) {
    case MODES.EVERY:
      return '';
    case MODES.STEP:
      return field.step === 1 ? '' : `every ${field.step} days of the week`;
    case MODES.SPECIFIC: {
      if (field.specific.length === 0) return '';
      if (field.specific.length === 1) return `on ${DOW_LABELS[field.specific[0]]}`;
      const sorted = [...field.specific].sort((a, b) => a - b);
      const names = sorted.map((v) => DOW_LABELS[v]);
      return `on ${names.join(', ')}`;
    }
    case MODES.RANGE:
      return `on every day-of-week from ${DOW_LABELS[field.rangeStart]} through ${DOW_LABELS[field.rangeEnd]}`;
    default:
      return '';
  }
}

export function generateDescription(fields) {
  const minute = fields[FIELDS.MINUTE];
  const hour = fields[FIELDS.HOUR];
  const dom = fields[FIELDS.DOM];
  const month = fields[FIELDS.MONTH];
  const dow = fields[FIELDS.DOW];

  const parts = [];

  const hourPart = describeHour(hour, minute);
  if (hourPart) parts.push(hourPart);

  const minutePart = describeMinute(minute);
  if (minutePart && minutePart !== 'every minute') {
    if (!hourPart) parts.push(minutePart);
  } else if (minutePart === 'every minute' && !hourPart && minute.mode === MODES.EVERY) {
    parts.push('every minute');
  } else if (minutePart === 'every minute' && !hourPart && minute.mode === MODES.STEP) {
    parts.push(minutePart);
  }

  const domPart = describeDom(dom);
  if (domPart) parts.push(domPart);

  const monthPart = describeMonth(month);
  if (monthPart) parts.push(monthPart);

  const dowPart = describeDow(dow);
  if (dowPart) parts.push(dowPart);

  if (parts.length === 0) {
    return 'Every minute of every hour of every day';
  }

  const result = parts.join(' ');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
