import { describe, it, expect } from 'vitest';
import { validateExpression, validateFields, isValid } from '../utils/cronValidator.js';
import { createAllFields } from '../utils/fieldFactory.js';
import { FIELDS, MODES } from '../utils/constants.js';

describe('cronValidator', () => {
  describe('validateExpression - valid expressions', () => {
    const validExpressions = [
      '* * * * *',
      '*/5 * * * *',
      '0 * * * *',
      '0 9 * * *',
      '0 0 * * 0',
      '0 0 1 * *',
      '0,15,30,45 * * * *',
      '0 9 * * 1-5',
      '0 0 1 1 *',
      '*/15 9-17 * * 1-5',
      '0 0 1-15 * *',
      '30 14 1 * 1',
    ];

    validExpressions.forEach((expr) => {
      it(`validates "${expr}" as valid`, () => {
        const result = validateExpression(expr);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
      });
    });
  });

  describe('validateExpression - invalid expressions', () => {
    it('rejects empty string', () => {
      expect(validateExpression('').valid).toBe(false);
    });

    it('rejects null', () => {
      expect(validateExpression(null).valid).toBe(false);
    });

    it('rejects too few fields', () => {
      const result = validateExpression('* * *');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('5 fields');
    });

    it('rejects too many fields', () => {
      const result = validateExpression('* * * * * *');
      expect(result.valid).toBe(false);
    });

    it('rejects minute out of range (60)', () => {
      const result = validateExpression('60 * * * *');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Minutes');
    });

    it('rejects hour out of range (24)', () => {
      const result = validateExpression('* 24 * * *');
      expect(result.valid).toBe(false);
    });

    it('rejects DOM out of range (32)', () => {
      const result = validateExpression('* * 32 * *');
      expect(result.valid).toBe(false);
    });

    it('rejects month out of range (13)', () => {
      const result = validateExpression('* * * 13 *');
      expect(result.valid).toBe(false);
    });

    it('rejects DOW out of range (7)', () => {
      const result = validateExpression('* * * * 7');
      expect(result.valid).toBe(false);
    });

    it('rejects invalid range (start > end)', () => {
      const result = validateExpression('* 10-5 * * *');
      expect(result.valid).toBe(false);
    });

    it('allows both DOM and DOW restricted (cron OR logic)', () => {
      const result = validateExpression('0 0 1 * 1');
      expect(result.valid).toBe(true);
    });

    it('rejects non-numeric input', () => {
      const result = validateExpression('abc * * * *');
      expect(result.valid).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid expression', () => {
      expect(isValid('* * * * *')).toBe(true);
    });

    it('returns false for invalid expression', () => {
      expect(isValid('60 * * * *')).toBe(false);
    });
  });

  describe('validateFields', () => {
    it('validates default fields as valid', () => {
      const fields = createAllFields();
      const result = validateFields(fields);
      expect(result.valid).toBe(true);
    });

    it('rejects missing mode', () => {
      const fields = createAllFields();
      fields[FIELDS.MINUTE] = { step: 1, specific: [0], rangeStart: 0, rangeEnd: 59 };
      const result = validateFields(fields);
      expect(result.valid).toBe(false);
    });

    it('rejects step out of range', () => {
      const fields = createAllFields({ minute: { mode: MODES.STEP, step: 0 } });
      const result = validateFields(fields);
      expect(result.valid).toBe(false);
    });

    it('rejects empty specific list', () => {
      const fields = createAllFields({ minute: { mode: MODES.SPECIFIC, specific: [] } });
      const result = validateFields(fields);
      expect(result.valid).toBe(false);
    });

    it('rejects specific value out of range', () => {
      const fields = createAllFields({ minute: { mode: MODES.SPECIFIC, specific: [60] } });
      const result = validateFields(fields);
      expect(result.valid).toBe(false);
    });

    it('rejects range start > end', () => {
      const fields = createAllFields({ hour: { mode: MODES.RANGE, rangeStart: 10, rangeEnd: 5 } });
      const result = validateFields(fields);
      expect(result.valid).toBe(false);
    });

    it('allows both DOM and DOW restricted (cron OR logic)', () => {
      const fields = createAllFields({
        dom: { mode: MODES.SPECIFIC, specific: [1] },
        dow: { mode: MODES.SPECIFIC, specific: [1] },
      });
      const result = validateFields(fields);
      expect(result.valid).toBe(true);
    });

    it('allows DOM restricted with DOW every', () => {
      const fields = createAllFields({
        dom: { mode: MODES.SPECIFIC, specific: [1] },
      });
      const result = validateFields(fields);
      expect(result.valid).toBe(true);
    });

    it('allows DOW restricted with DOM every', () => {
      const fields = createAllFields({
        dow: { mode: MODES.SPECIFIC, specific: [1] },
      });
      const result = validateFields(fields);
      expect(result.valid).toBe(true);
    });
  });
});
