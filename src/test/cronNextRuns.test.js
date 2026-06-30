import { describe, it, expect } from 'vitest';
import { getNextRun, getNextRuns } from '../utils/cronNextRuns.js';
import { createAllFields } from '../utils/fieldFactory.js';
import { MODES } from '../utils/constants.js';
import { formatInTimezone, convertToTimezone, getOffsetLabel } from '../utils/timezoneUtils.js';

describe('cronNextRuns', () => {
  describe('getNextRun', () => {
    it('returns a Date object', () => {
      const fields = createAllFields();
      const now = new Date(2024, 0, 1, 12, 0, 0);
      const next = getNextRun(fields, now);
      expect(next).toBeInstanceOf(Date);
    });

    it('returns next minute for * * * * *', () => {
      const fields = createAllFields();
      const now = new Date(2024, 0, 1, 12, 0, 0);
      const next = getNextRun(fields, now);
      expect(next.getMinutes()).toBe(1);
      expect(next.getHours()).toBe(12);
    });

    it('returns correct time for 0 9 * * *', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [9] },
      });
      const now = new Date(2024, 0, 1, 10, 30, 0);
      const next = getNextRun(fields, now);
      expect(next.getHours()).toBe(9);
      expect(next.getMinutes()).toBe(0);
      expect(next.getDate()).toBe(2);
    });

    it('returns correct day for 0 0 1 * *', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [0] },
        dom: { mode: MODES.SPECIFIC, specific: [1] },
      });
      const now = new Date(2024, 0, 15, 12, 0, 0);
      const next = getNextRun(fields, now);
      expect(next.getDate()).toBe(1);
      expect(next.getMonth()).toBe(1);
    });

    it('returns correct weekday for 0 0 * * 1', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [0] },
        dow: { mode: MODES.SPECIFIC, specific: [1] },
      });
      const now = new Date(2024, 0, 3, 12, 0, 0);
      const next = getNextRun(fields, now);
      expect(next.getDay()).toBe(1);
    });
  });

  describe('getNextRuns', () => {
    it('returns 10 runs by default', () => {
      const fields = createAllFields();
      const now = new Date(2024, 0, 1, 12, 0, 0);
      const runs = getNextRuns(fields, now, 10);
      expect(runs).toHaveLength(10);
    });

    it('returns runs in ascending order', () => {
      const fields = createAllFields({
        minute: { mode: MODES.STEP, step: 5 },
      });
      const now = new Date(2024, 0, 1, 12, 0, 0);
      const runs = getNextRuns(fields, now, 5);
      for (let i = 1; i < runs.length; i++) {
        expect(runs[i].getTime()).toBeGreaterThan(runs[i - 1].getTime());
      }
    });

    it('returns runs matching step pattern', () => {
      const fields = createAllFields({
        minute: { mode: MODES.STEP, step: 15 },
      });
      const now = new Date(2024, 0, 1, 12, 0, 0);
      const runs = getNextRuns(fields, now, 4);
      runs.forEach((run) => {
        expect(run.getMinutes() % 15).toBe(0);
      });
    });

    it('returns empty array for impossible schedule', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [9] },
        dom: { mode: MODES.SPECIFIC, specific: [31] },
        month: { mode: MODES.SPECIFIC, specific: [2] },
      });
      const now = new Date(2024, 0, 1, 12, 0, 0);
      const runs = getNextRuns(fields, now, 10);
      expect(runs.length).toBe(0);
    });

    it('handles weekday range correctly', () => {
      const fields = createAllFields({
        minute: { mode: MODES.SPECIFIC, specific: [0] },
        hour: { mode: MODES.SPECIFIC, specific: [9] },
        dow: { mode: MODES.RANGE, rangeStart: 1, rangeEnd: 5 },
      });
      const now = new Date(2024, 0, 6, 10, 0, 0);
      const runs = getNextRuns(fields, now, 5);
      runs.forEach((run) => {
        const day = run.getDay();
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('timezoneUtils', () => {
    it('formatInTimezone returns formatted string', () => {
      const date = new Date(2024, 0, 1, 12, 0, 0);
      const formatted = formatInTimezone(date, 'UTC');
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    it('convertToTimezone returns Date object', () => {
      const date = new Date(2024, 0, 1, 12, 0, 0);
      const converted = convertToTimezone(date, 'EST');
      expect(converted).toBeInstanceOf(Date);
    });

    it('getOffsetLabel returns correct label for UTC', () => {
      expect(getOffsetLabel('UTC')).toBe('UTC+0');
    });

    it('getOffsetLabel returns correct label for JST', () => {
      expect(getOffsetLabel('JST')).toBe('UTC+09:00');
    });

    it('getOffsetLabel returns correct label for IST', () => {
      expect(getOffsetLabel('IST')).toBe('UTC+05:30');
    });

    it('EST is 5 hours behind UTC', () => {
      const date = new Date(Date.UTC(2024, 0, 1, 12, 0, 0));
      const utcFormatted = formatInTimezone(date, 'UTC');
      const estFormatted = formatInTimezone(date, 'EST');
      const utcHour = parseInt(utcFormatted.split(' ')[1].split(':')[0], 10);
      const estHour = parseInt(estFormatted.split(' ')[1].split(':')[0], 10);
      const diff = (utcHour - estHour + 24) % 24;
      expect(diff).toBe(5);
    });
  });
});
