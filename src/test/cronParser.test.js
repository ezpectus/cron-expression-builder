import { describe, it, expect, beforeEach } from 'vitest';
import { parseCronExpression, parseToFields, clearParseCache } from '../utils/cronParser.js';
import { FIELDS, MODES } from '../utils/constants.js';

describe('cronParser', () => {
  beforeEach(() => {
    clearParseCache();
  });

  describe('parseCronExpression - every mode', () => {
    it('parses * * * * * as all every', () => {
      const result = parseCronExpression('* * * * *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.MINUTE].mode).toBe(MODES.EVERY);
      expect(result.fields[FIELDS.HOUR].mode).toBe(MODES.EVERY);
      expect(result.fields[FIELDS.DOM].mode).toBe(MODES.EVERY);
      expect(result.fields[FIELDS.MONTH].mode).toBe(MODES.EVERY);
      expect(result.fields[FIELDS.DOW].mode).toBe(MODES.EVERY);
    });

    it('parses partial every: 0 * * * *', () => {
      const result = parseCronExpression('0 * * * *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.MINUTE].mode).toBe(MODES.SPECIFIC);
      expect(result.fields[FIELDS.MINUTE].specific).toEqual([0]);
      expect(result.fields[FIELDS.HOUR].mode).toBe(MODES.EVERY);
    });
  });

  describe('parseCronExpression - step mode', () => {
    it('parses */5 * * * * as step 5 on minutes', () => {
      const result = parseCronExpression('*/5 * * * *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.MINUTE].mode).toBe(MODES.STEP);
      expect(result.fields[FIELDS.MINUTE].step).toBe(5);
    });

    it('parses * */2 * * * as step 2 on hours', () => {
      const result = parseCronExpression('* */2 * * *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.HOUR].mode).toBe(MODES.STEP);
      expect(result.fields[FIELDS.HOUR].step).toBe(2);
    });

    it('parses * * */3 * * as step 3 on DOM', () => {
      const result = parseCronExpression('* * */3 * *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.DOM].mode).toBe(MODES.STEP);
      expect(result.fields[FIELDS.DOM].step).toBe(3);
    });
  });

  describe('parseCronExpression - specific mode', () => {
    it('parses single value 30 * * * *', () => {
      const result = parseCronExpression('30 * * * *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.MINUTE].mode).toBe(MODES.SPECIFIC);
      expect(result.fields[FIELDS.MINUTE].specific).toEqual([30]);
    });

    it('parses comma-separated 0,15,30,45 * * * *', () => {
      const result = parseCronExpression('0,15,30,45 * * * *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.MINUTE].mode).toBe(MODES.SPECIFIC);
      expect(result.fields[FIELDS.MINUTE].specific).toEqual([0, 15, 30, 45]);
    });

    it('parses specific on DOW: * * * * 1,3,5', () => {
      const result = parseCronExpression('* * * * 1,3,5');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.DOW].mode).toBe(MODES.SPECIFIC);
      expect(result.fields[FIELDS.DOW].specific).toEqual([1, 3, 5]);
    });
  });

  describe('parseCronExpression - range mode', () => {
    it('parses 0 9 * * 1-5 as range on DOW', () => {
      const result = parseCronExpression('0 9 * * 1-5');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.DOW].mode).toBe(MODES.RANGE);
      expect(result.fields[FIELDS.DOW].rangeStart).toBe(1);
      expect(result.fields[FIELDS.DOW].rangeEnd).toBe(5);
    });

    it('parses range on hours: 0 0-12 * * *', () => {
      const result = parseCronExpression('0 0-12 * * *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.HOUR].mode).toBe(MODES.RANGE);
      expect(result.fields[FIELDS.HOUR].rangeStart).toBe(0);
      expect(result.fields[FIELDS.HOUR].rangeEnd).toBe(12);
    });

    it('parses range on months: * * * 3-6 *', () => {
      const result = parseCronExpression('* * * 3-6 *');
      expect(result.success).toBe(true);
      expect(result.fields[FIELDS.MONTH].mode).toBe(MODES.RANGE);
      expect(result.fields[FIELDS.MONTH].rangeStart).toBe(3);
      expect(result.fields[FIELDS.MONTH].rangeEnd).toBe(6);
    });
  });

  describe('parseCronExpression - invalid input', () => {
    it('rejects empty string', () => {
      const result = parseCronExpression('');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('rejects null', () => {
      const result = parseCronExpression(null);
      expect(result.success).toBe(false);
    });

    it('rejects too few fields', () => {
      const result = parseCronExpression('* * *');
      expect(result.success).toBe(false);
      expect(result.error).toContain('5 fields');
    });

    it('rejects too many fields', () => {
      const result = parseCronExpression('* * * * * *');
      expect(result.success).toBe(false);
      expect(result.error).toContain('5 fields');
    });

    it('rejects out-of-range minute (60)', () => {
      const result = parseCronExpression('60 * * * *');
      expect(result.success).toBe(false);
    });

    it('rejects out-of-range hour (24)', () => {
      const result = parseCronExpression('* 24 * * *');
      expect(result.success).toBe(false);
    });

    it('rejects out-of-range month (13)', () => {
      const result = parseCronExpression('* * * 13 *');
      expect(result.success).toBe(false);
    });

    it('rejects out-of-range DOW (7)', () => {
      const result = parseCronExpression('* * * * 7');
      expect(result.success).toBe(false);
    });

    it('rejects invalid range start > end', () => {
      const result = parseCronExpression('* 10-5 * * *');
      expect(result.success).toBe(false);
    });

    it('rejects non-numeric input', () => {
      const result = parseCronExpression('abc * * * *');
      expect(result.success).toBe(false);
    });
  });

  describe('parseToFields', () => {
    it('returns fields object for valid expression', () => {
      const fields = parseToFields('*/5 * * * *');
      expect(fields).toBeTruthy();
      expect(fields[FIELDS.MINUTE].mode).toBe(MODES.STEP);
    });

    it('returns null for invalid expression', () => {
      const fields = parseToFields('invalid');
      expect(fields).toBeNull();
    });
  });

  describe('parse cache (idempotency)', () => {
    it('returns same result for same expression (cached)', () => {
      const r1 = parseCronExpression('*/5 * * * *');
      const r2 = parseCronExpression('*/5 * * * *');
      expect(r1).toBe(r2);
    });
  });
});
