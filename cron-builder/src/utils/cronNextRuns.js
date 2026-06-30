import { FIELDS, MODES } from './constants.js';

function matchesValue(field, value) {
  switch (field.mode) {
    case MODES.EVERY:
      return true;
    case MODES.STEP:
      return value % field.step === 0;
    case MODES.SPECIFIC:
      return field.specific.includes(value);
    case MODES.RANGE:
      return value >= field.rangeStart && value <= field.rangeEnd;
    default:
      return false;
  }
}

function getDow(year, month, day) {
  return new Date(year, month - 1, day).getDay();
}

function matchesDom(fields, year, month, day) {
  const domField = fields[FIELDS.DOM];
  const dowField = fields[FIELDS.DOW];

  const domMatches = matchesValue(domField, day);
  const dowMatches = matchesValue(dowField, getDow(year, month, day));

  if (domField.mode === MODES.EVERY && dowField.mode === MODES.EVERY) {
    return true;
  }
  if (domField.mode === MODES.EVERY) {
    return dowMatches;
  }
  if (dowField.mode === MODES.EVERY) {
    return domMatches;
  }
  return domMatches || dowMatches;
}

function matchesTime(fields, date) {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (!matchesValue(fields[FIELDS.MINUTE], minute)) return false;
  if (!matchesValue(fields[FIELDS.HOUR], hour)) return false;
  if (!matchesValue(fields[FIELDS.MONTH], month)) return false;
  if (!matchesDom(fields, year, month, day)) return false;

  return true;
}

export function getNextRun(fields, fromDate) {
  const start = new Date(fromDate.getTime());
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  const maxIterations = 366 * 24 * 60;
  let current = new Date(start.getTime());

  for (let i = 0; i < maxIterations; i++) {
    if (matchesTime(fields, current)) {
      return current;
    }
    current.setMinutes(current.getMinutes() + 1);
  }

  return null;
}

export function getNextRuns(fields, fromDate, count = 10) {
  const results = [];
  let current = new Date(fromDate.getTime());

  for (let i = 0; i < count; i++) {
    const next = getNextRun(fields, current);
    if (!next) break;
    results.push(new Date(next.getTime()));
    current = new Date(next.getTime() + 60000);
  }

  return results;
}

export function getNextRunsFromExpression(fields, fromDate, count = 10) {
  return getNextRuns(fields, fromDate, count);
}
