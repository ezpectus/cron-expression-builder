import { describe, it, expect, beforeEach } from 'vitest';
import {
  tryAcquire,
  isRateLimited,
  resetLimiter,
  getWindowSize,
  tryCronParse,
  tryCopy,
  tryJsonParse,
  trySchemaGeneration,
  RATE_LIMITS,
  RATE_LIMIT_CONFIG,
} from '../utils/rateLimiter.js';

describe('rateLimiter', () => {
  beforeEach(() => {
    resetLimiter();
  });

  describe('tryAcquire', () => {
    it('allows requests within limit', () => {
      expect(tryAcquire('test', 5)).toBe(true);
      expect(tryAcquire('test', 5)).toBe(true);
      expect(tryAcquire('test', 5)).toBe(true);
    });

    it('blocks requests over limit', () => {
      for (let i = 0; i < 3; i++) {
        tryAcquire('test', 3);
      }
      expect(tryAcquire('test', 3)).toBe(false);
    });

    it('uses separate windows per key', () => {
      for (let i = 0; i < 5; i++) {
        tryAcquire('keyA', 5);
      }
      expect(tryAcquire('keyA', 5)).toBe(false);
      expect(tryAcquire('keyB', 5)).toBe(true);
    });

    it('allows requests again after 1 second window', async () => {
      for (let i = 0; i < 3; i++) {
        tryAcquire('test', 3);
      }
      expect(tryAcquire('test', 3)).toBe(false);

      await new Promise((resolve) => setTimeout(resolve, 1100));
      expect(tryAcquire('test', 3)).toBe(true);
    });
  });

  describe('isRateLimited', () => {
    it('returns false when not limited', () => {
      expect(isRateLimited('test')).toBe(false);
    });

    it('returns true when blocked', () => {
      for (let i = 0; i < 4; i++) {
        tryAcquire('test', 3);
      }
      expect(isRateLimited('test')).toBe(true);
    });
  });

  describe('getWindowSize', () => {
    it('returns current window size', () => {
      tryAcquire('test', 10);
      tryAcquire('test', 10);
      expect(getWindowSize('test')).toBe(2);
    });

    it('returns 0 for unused key', () => {
      expect(getWindowSize('unused')).toBe(0);
    });
  });

  describe('resetLimiter', () => {
    it('resets specific key', () => {
      for (let i = 0; i < 5; i++) {
        tryAcquire('test', 5);
      }
      resetLimiter('test');
      expect(getWindowSize('test')).toBe(0);
    });

    it('resets all keys when no key specified', () => {
      tryAcquire('a', 10);
      tryAcquire('b', 10);
      resetLimiter();
      expect(getWindowSize('a')).toBe(0);
      expect(getWindowSize('b')).toBe(0);
    });
  });

  describe('tryCronParse', () => {
    it('allows up to 10 per second', () => {
      for (let i = 0; i < 10; i++) {
        expect(tryCronParse()).toBe(true);
      }
      expect(tryCronParse()).toBe(false);
    });
  });

  describe('tryCopy', () => {
    it('allows up to 20 per second', () => {
      for (let i = 0; i < 20; i++) {
        expect(tryCopy()).toBe(true);
      }
      expect(tryCopy()).toBe(false);
    });
  });

  describe('tryJsonParse', () => {
    it('allows up to 10 per second', () => {
      for (let i = 0; i < 10; i++) {
        expect(tryJsonParse()).toBe(true);
      }
      expect(tryJsonParse()).toBe(false);
    });
  });

  describe('trySchemaGeneration', () => {
    it('allows up to 5 per second', () => {
      for (let i = 0; i < 5; i++) {
        expect(trySchemaGeneration()).toBe(true);
      }
      expect(trySchemaGeneration()).toBe(false);
    });
  });

  describe('RATE_LIMIT_CONFIG', () => {
    it('has correct limits for all operations', () => {
      expect(RATE_LIMIT_CONFIG[RATE_LIMITS.CRON_PARSING]).toBe(10);
      expect(RATE_LIMIT_CONFIG[RATE_LIMITS.COPY_OPERATIONS]).toBe(20);
      expect(RATE_LIMIT_CONFIG[RATE_LIMITS.JSON_PARSING]).toBe(10);
      expect(RATE_LIMIT_CONFIG[RATE_LIMITS.SCHEMA_GENERATION]).toBe(5);
    });
  });

  describe('sliding window algorithm', () => {
    it('old requests expire from window', async () => {
      tryAcquire('sliding', 3);
      tryAcquire('sliding', 3);

      await new Promise((resolve) => setTimeout(resolve, 600));
      tryAcquire('sliding', 3);

      await new Promise((resolve) => setTimeout(resolve, 600));
      expect(tryAcquire('sliding', 3)).toBe(true);
    });
  });
});
