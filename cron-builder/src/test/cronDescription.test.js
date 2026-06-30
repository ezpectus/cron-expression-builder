import { describe, it, expect } from 'vitest';
import { generateDescription } from '../utils/cronDescription.js';
import { createAllFields } from '../utils/fieldFactory.js';
import { MODES } from '../utils/constants.js';
import { PRESETS } from '../utils/presets.js';

describe('cronDescription', () => {
  describe('every mode', () => {
    it('describes * * * * * as every minute', () => {
      const fields = createAllFields();
      const desc = generateDescription(fields);
      expect(desc.toLowerCase()).toContain('every minute');
    });
  });

  describe('step mode', () => {
    it('describes */5 * * * * as every 5 minutes', () => {
      const fields = createAllFields({ minute: { mode: MODES.STEP, step: 5 } });
      const desc = generateDescription(fields);
      expect(desc.toLowerCase()).toContain('every 5 minutes');
    });

    it('describes * */2 * * * as every 2 hours', () => {
      const fields = createAllFields({ hour: { mode: MODES.STEP, step: 2 } });
      const desc = generateDescription(fields);
      expect(desc.toLowerCase()).toContain('every 2 hours');
    });
  });

  describe('specific mode', () => {
    it('describes 0 9 * * * with time', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [9] },
      });
      const desc = generateDescription(fields);
      expect(desc).toContain('09:00');
    });

    it('describes 30 14 * * * with time', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [30] },
        hour: { mode: MODES.SPECIFIC, specific: [14] },
      });
      const desc = generateDescription(fields);
      expect(desc).toContain('14:30');
    });

    it('describes specific DOW with day names', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [0] },
        dow: { mode: MODES.SPECIFIC, specific: [1] },
      });
      const desc = generateDescription(fields);
      expect(desc).toContain('Monday');
    });

    it('describes specific month with month names', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [0] },
        dom: { mode: MODES.SPECIFIC, specific: [1] },
        month: { mode: MODES.SPECIFIC, specific: [1] },
      });
      const desc = generateDescription(fields);
      expect(desc).toContain('January');
    });

    it('describes multiple specific minutes', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0, 15, 30, 45] },
      });
      const desc = generateDescription(fields);
      expect(desc.toLowerCase()).toContain('minutes');
    });
  });

  describe('range mode', () => {
    it('describes 0 9 * * 1-5 with weekday range', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [9] },
        dow: { mode: MODES.RANGE, rangeStart: 1, rangeEnd: 5 },
      });
      const desc = generateDescription(fields);
      expect(desc).toContain('Monday');
      expect(desc).toContain('Friday');
    });

    it('describes month range', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [0] },
        month: { mode: MODES.RANGE, rangeStart: 6, rangeEnd: 8 },
      });
      const desc = generateDescription(fields);
      expect(desc).toContain('June');
      expect(desc).toContain('August');
    });

    it('describes DOM range', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [0] },
        dom: { mode: MODES.RANGE, rangeStart: 1, rangeEnd: 15 },
      });
      const desc = generateDescription(fields);
      expect(desc.toLowerCase()).toContain('days-of-month');
      expect(desc).toContain('1');
      expect(desc).toContain('15');
    });
  });

  describe('presets descriptions', () => {
    PRESETS.forEach((preset) => {
      it(`describes preset "${preset.label}"`, () => {
        const desc = generateDescription(preset.fields);
        expect(desc.length).toBeGreaterThan(0);
        expect(desc.charAt(0)).toBe(desc.charAt(0).toUpperCase());
      });
    });
  });

  describe('capitalization', () => {
    it('always starts with uppercase', () => {
      const fields = createAllFields({ minute: { mode: MODES.STEP, step: 5 } });
      const desc = generateDescription(fields);
      expect(desc.charAt(0)).toBe(desc.charAt(0).toUpperCase());
    });
  });
});
