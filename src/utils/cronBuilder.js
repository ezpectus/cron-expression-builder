import { FIELDS, FIELD_ORDER, MODES } from './constants.js';

function buildField(field) {
  switch (field.mode) {
    case MODES.EVERY:
      return '*';
    case MODES.STEP: {
      if (field.step <= 1) return '*';
      return `*/${field.step}`;
    }
    case MODES.SPECIFIC: {
      if (!field.specific || field.specific.length === 0) return '*';
      const sorted = [...field.specific].sort((a, b) => a - b);
      return sorted.join(',');
    }
    case MODES.RANGE: {
      return `${field.rangeStart}-${field.rangeEnd}`;
    }
    default:
      return '*';
  }
}

export function buildCronExpression(fields) {
  const parts = FIELD_ORDER.map((key) => buildField(fields[key]));
  return parts.join(' ');
}

export function buildFromFields(fields) {
  return buildCronExpression(fields);
}

export function buildCrontabLine(fields, command = '/usr/bin/echo "Cron job triggered"') {
  const expr = buildCronExpression(fields);
  return `${expr} ${command}`;
}

export function buildJsonExport(fields, expression, description) {
  return JSON.stringify({
    expression,
    description,
    fields: {
      minute: fields[FIELDS.MINUTE],
      hour: fields[FIELDS.HOUR],
      dayOfMonth: fields[FIELDS.DOM],
      month: fields[FIELDS.MONTH],
      dayOfWeek: fields[FIELDS.DOW],
    },
    generatedAt: new Date().toISOString(),
  }, null, 2);
}
