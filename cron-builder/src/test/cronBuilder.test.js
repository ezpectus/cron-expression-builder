import { describe, it, expect } from 'vitest';
import { buildCronExpression, buildCrontabLine, buildJsonExport } from '../utils/cronBuilder.js';
import { createAllFields } from '../utils/fieldFactory.js';
import { parseCronExpression } from '../utils/cronParser.js';
import { MODES } from '../utils/constants.js';

describe('cronBuilder', () => {
  describe('buildCronExpression - every mode', () => {
    it('builds * * * * * from default fields', () => {
      const fields = createAllFields();
      expect(buildCronExpression(fields)).toBe('* * * * *');
    });
  });

  describe('buildCronExpression - step mode', () => {
    it('builds */5 * * * * from step 5 on minute', () => {
      const fields = createAllFields({ minute: { mode: MODES.STEP, step: 5 } });
      expect(buildCronExpression(fields)).toBe('*/5 * * * *');
    });

    it('builds * */2 * * * from step 2 on hour', () => {
      const fields = createAllFields({ hour: { mode: MODES.STEP, step: 2 } });
      expect(buildCronExpression(fields)).toBe('* */2 * * *');
    });

    it('builds * * * * * when step is 1 (normalizes to *)', () => {
      const fields = createAllFields({ minute: { mode: MODES.STEP, step: 1 } });
      expect(buildCronExpression(fields)).toBe('* * * * *');
    });
  });

  describe('buildCronExpression - specific mode', () => {
    it('builds 0,15,30,45 * * * * from specific minutes', () => {
      const fields = createAllFields({ minute: { mode: MODES.SPECIFIC, specific: [15, 0, 45, 30] } });
      expect(buildCronExpression(fields)).toBe('0,15,30,45 * * * *');
    });

    it('builds 0 9 * * * from specific minute and hour', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [9] },
      });
      expect(buildCronExpression(fields)).toBe('0 9 * * *');
    });

    it('builds empty specific as *', () => {
      const fields = createAllFields({ minute: { mode: MODES.SPECIFIC, specific: [] } });
      expect(buildCronExpression(fields)).toBe('* * * * *');
    });
  });

  describe('buildCronExpression - range mode', () => {
    it('builds 0 0 * * 1-5 from range on DOW', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [0] },
        dow: { mode: MODES.RANGE, rangeStart: 1, rangeEnd: 5 },
      });
      expect(buildCronExpression(fields)).toBe('0 0 * * 1-5');
    });

    it('builds * 0-12 * * * from range on hour', () => {
      const fields = createAllFields({ hour: { mode: MODES.RANGE, rangeStart: 0, rangeEnd: 12 } });
      expect(buildCronExpression(fields)).toBe('* 0-12 * * *');
    });
  });

  describe('round-trip: parse → build', () => {
    const expressions = [
      '* * * * *',
      '*/5 * * * *',
      '0 * * * *',
      '0 9 * * 1-5',
      '0,15,30,45 * * * *',
      '0 0 1 * *',
      '0 0 * * 0',
      '*/15 9-17 * * 1-5',
    ];

    expressions.forEach((expr) => {
      it(`round-trips "${expr}"`, () => {
        const parsed = parseCronExpression(expr);
        expect(parsed.success).toBe(true);
        const rebuilt = buildCronExpression(parsed.fields);
        expect(rebuilt).toBe(expr);
      });
    });
  });

  describe('buildCrontabLine', () => {
    it('builds crontab line with default command', () => {
      const fields = createAllFields({ minute: { mode: MODES.SPECIFIC, specific: [0] } });
      const line = buildCrontabLine(fields);
      expect(line).toContain('0 * * * *');
      expect(line).toContain('/usr/bin/echo');
    });

    it('builds crontab line with custom command', () => {
      const fields = createAllFields();
      const line = buildCrontabLine(fields, 'node /app/script.js');
      expect(line).toBe('* * * * * node /app/script.js');
    });
  });

  describe('buildJsonExport', () => {
    it('exports valid JSON with expression and fields', () => {
      const fields = createAllFields({ minute: { mode: MODES.STEP, step: 5 } });
      const json = buildJsonExport(fields, '*/5 * * * *', 'Every 5 minutes');
      const parsed = JSON.parse(json);
      expect(parsed.expression).toBe('*/5 * * * *');
      expect(parsed.description).toBe('Every 5 minutes');
      expect(parsed.fields.minute.mode).toBe(MODES.STEP);
      expect(parsed.generatedAt).toBeTruthy();
    });
  });
});
