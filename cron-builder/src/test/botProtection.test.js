import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initBotProtection,
  checkWebdriver,
  checkPlugins,
  checkLanguages,
  checkHoneypot,
  recordInteraction,
  getBotScore,
  isLikelyBot,
  isFeaturesDisabled,
  resetBotProtection,
  getHoneypotFieldName,
  runAllChecks,
} from '../utils/botProtection.js';

describe('botProtection', () => {
  beforeEach(() => {
    resetBotProtection();
    vi.stubGlobal('window', {
      addEventListener: () => {},
      removeEventListener: () => {},
    });
  });

  afterEach(() => {
    resetBotProtection();
    vi.restoreAllMocks();
  });

  describe('getHoneypotFieldName', () => {
    it('returns the honeypot field name', () => {
      const name = getHoneypotFieldName();
      expect(name).toBe('cron_builder_website_url');
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });
  });

  describe('checkHoneypot', () => {
    it('returns false for empty value (human)', () => {
      expect(checkHoneypot('')).toBe(false);
      expect(checkHoneypot('   ')).toBe(false);
    });

    it('returns true and adds score for filled value (bot)', () => {
      const result = checkHoneypot('http://spam.com');
      expect(result).toBe(true);
      expect(getBotScore()).toBeGreaterThanOrEqual(3);
    });

    it('marks as likely bot when honeypot filled', () => {
      checkHoneypot('filled');
      expect(isLikelyBot()).toBe(true);
    });

    it('disables features when honeypot filled', () => {
      checkHoneypot('filled');
      expect(isFeaturesDisabled()).toBe(true);
    });
  });

  describe('checkWebdriver', () => {
    it('returns false and adds no score when webdriver is false', () => {
      vi.stubGlobal('navigator', { webdriver: false, plugins: ['plugin1'], languages: ['en'] });
      expect(checkWebdriver()).toBe(false);
      expect(getBotScore()).toBe(0);
    });

    it('returns true and adds score when webdriver is true', () => {
      vi.stubGlobal('navigator', { webdriver: true, plugins: ['plugin1'], languages: ['en'] });
      expect(checkWebdriver()).toBe(true);
      expect(getBotScore()).toBeGreaterThanOrEqual(2);
    });
  });

  describe('checkPlugins', () => {
    it('adds score when no plugins', () => {
      vi.stubGlobal('navigator', { webdriver: false, plugins: { length: 0 }, languages: ['en'] });
      checkPlugins();
      expect(getBotScore()).toBeGreaterThanOrEqual(1);
    });

    it('adds no score when plugins exist', () => {
      vi.stubGlobal('navigator', { webdriver: false, plugins: ['plugin1', 'plugin2'], languages: ['en'] });
      checkPlugins();
      expect(getBotScore()).toBe(0);
    });
  });

  describe('checkLanguages', () => {
    it('adds score when no languages', () => {
      vi.stubGlobal('navigator', { webdriver: false, plugins: ['p'], languages: [] });
      checkLanguages();
      expect(getBotScore()).toBeGreaterThanOrEqual(1);
    });

    it('adds no score when languages exist', () => {
      vi.stubGlobal('navigator', { webdriver: false, plugins: ['p'], languages: ['en', 'fr'] });
      checkLanguages();
      expect(getBotScore()).toBe(0);
    });
  });

  describe('recordInteraction', () => {
    it('does not flag interaction after sufficient delay', () => {
      initBotProtection();
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(recordInteraction()).toBe(false);
          expect(getBotScore()).toBe(0);
          resolve();
        }, 150);
      });
    });

    it('flags interaction that happens too quickly', () => {
      initBotProtection();
      const result = recordInteraction();
      expect(result).toBe(true);
      expect(getBotScore()).toBeGreaterThanOrEqual(2);
    });

    it('only flags first interaction', () => {
      initBotProtection();
      recordInteraction();
      const scoreAfterFirst = getBotScore();
      recordInteraction();
      expect(getBotScore()).toBe(scoreAfterFirst);
    });
  });

  describe('getBotScore', () => {
    it('starts at 0', () => {
      expect(getBotScore()).toBe(0);
    });

    it('accumulates scores', () => {
      checkHoneypot('filled');
      const score1 = getBotScore();
      vi.stubGlobal('navigator', { webdriver: true, plugins: { length: 0 }, languages: [] });
      checkWebdriver();
      expect(getBotScore()).toBeGreaterThan(score1);
    });
  });

  describe('isLikelyBot', () => {
    it('returns false when score is below 3', () => {
      expect(isLikelyBot()).toBe(false);
    });

    it('returns true when score reaches 3', () => {
      checkHoneypot('filled');
      expect(isLikelyBot()).toBe(true);
    });
  });

  describe('isFeaturesDisabled', () => {
    it('returns false when score is below 3', () => {
      expect(isFeaturesDisabled()).toBe(false);
    });

    it('returns true when score reaches 3', () => {
      checkHoneypot('filled');
      expect(isFeaturesDisabled()).toBe(true);
    });
  });

  describe('resetBotProtection', () => {
    it('resets score to 0', () => {
      checkHoneypot('filled');
      expect(getBotScore()).toBeGreaterThanOrEqual(3);
      resetBotProtection();
      expect(getBotScore()).toBe(0);
    });

    it('resets featuresDisabled to false', () => {
      checkHoneypot('filled');
      expect(isFeaturesDisabled()).toBe(true);
      resetBotProtection();
      expect(isFeaturesDisabled()).toBe(false);
    });
  });

  describe('runAllChecks', () => {
    it('runs all checks and returns score', () => {
      vi.stubGlobal('navigator', { webdriver: false, plugins: ['p'], languages: ['en'] });
      const score = runAllChecks();
      expect(typeof score).toBe('number');
      expect(score).toBe(0);
    });
  });

  describe('initBotProtection', () => {
    it('returns a cleanup function', () => {
      const cleanup = initBotProtection();
      expect(typeof cleanup).toBe('function');
      cleanup();
    });
  });
});
