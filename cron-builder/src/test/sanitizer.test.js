import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  sanitizeText,
  sanitizeForDisplay,
  sanitizeCronInput,
  sanitizeForStorage,
  validateStoredData,
} from '../utils/sanitizer.js';

describe('sanitizer', () => {
  describe('escapeHtml', () => {
    it('escapes & to &amp;', () => {
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('escapes < to &lt;', () => {
      expect(escapeHtml('a < b')).toBe('a &lt; b');
    });

    it('escapes > to &gt;', () => {
      expect(escapeHtml('a > b')).toBe('a &gt; b');
    });

    it('escapes " to &quot;', () => {
      expect(escapeHtml('say "hi"')).toBe('say &quot;hi&quot;');
    });

    it("escapes ' to &#x27;", () => {
      expect(escapeHtml("it's")).toBe('it&#x27;s');
    });

    it('escapes all characters in one string', () => {
      expect(escapeHtml('<script>alert("x")</script>')).toBe(
        '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
      );
    });

    it('returns empty string for null', () => {
      expect(escapeHtml(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(escapeHtml(undefined)).toBe('');
    });

    it('converts non-string to string', () => {
      expect(escapeHtml(123)).toBe('123');
    });
  });

  describe('sanitizeText', () => {
    it('removes HTML tags', () => {
      expect(sanitizeText('<b>hello</b>')).toBe('hello');
    });

    it('removes script tags and content', () => {
      expect(sanitizeText('<script>alert(1)</script>hello')).toBe('hello');
    });

    it('removes nested script tags', () => {
      expect(sanitizeText('<script><script>alert(1)</script></script>safe')).toBe('safe');
    });

    it('removes on* attributes', () => {
      expect(sanitizeText('onclick=alert(1)')).toBe('');
    });

    it('removes javascript: URLs', () => {
      expect(sanitizeText('javascript:alert(1)')).toBe('alert(1)');
    });

    it('removes null bytes', () => {
      expect(sanitizeText('hello\x00world')).toBe('helloworld');
    });

    it('removes control characters except newline and tab', () => {
      expect(sanitizeText('a\x01b\x02c\nd\te')).toBe('abc\nd\te');
    });

    it('handles XSS payload: <img src=x onerror=alert(1)>', () => {
      const result = sanitizeText('<img src=x onerror=alert(1)>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('onerror');
    });

    it('handles XSS payload: <svg onload=alert(1)>', () => {
      const result = sanitizeText('<svg onload=alert(1)>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('onload');
    });

    it('handles XSS payload: <iframe src=javascript:alert(1)>', () => {
      const result = sanitizeText('<iframe src=javascript:alert(1)>');
      expect(result).not.toContain('<');
      expect(result).not.toContain('javascript:');
    });

    it('returns empty string for null', () => {
      expect(sanitizeText(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(sanitizeText(undefined)).toBe('');
    });

    it('preserves safe text content', () => {
      expect(sanitizeText('hello world')).toBe('hello world');
    });
  });

  describe('sanitizeForDisplay', () => {
    it('sanitizes and escapes HTML', () => {
      const result = sanitizeForDisplay('<script>alert(1)</script>hello');
      expect(result).not.toContain('<script>');
      expect(result).toContain('hello');
    });

    it('escapes special characters after sanitizing', () => {
      const result = sanitizeForDisplay('a & b "c"');
      expect(result).toContain('&amp;');
      expect(result).toContain('&quot;');
    });

    it('returns empty string for null', () => {
      expect(sanitizeForDisplay(null)).toBe('');
    });
  });

  describe('sanitizeCronInput', () => {
    it('preserves valid cron characters', () => {
      expect(sanitizeCronInput('*/5 * * 1-5 1-12')).toBe('*/5 * * 1-5 1-12');
    });

    it('preserves commas', () => {
      expect(sanitizeCronInput('0,15,30,45 * * * *')).toBe('0,15,30,45 * * * *');
    });

    it('removes HTML tags from cron input', () => {
      expect(sanitizeCronInput('<script>foo</script>*/5 * * * *')).toBe('*/5 * * * *');
    });

    it('removes letters from cron input', () => {
      expect(sanitizeCronInput('abc*/5def * * * *')).toBe('*/5 * * * *');
    });

    it('removes null bytes', () => {
      expect(sanitizeCronInput('*/5\x00 * * * *')).toBe('*/5 * * * *');
    });

    it('returns empty string for null', () => {
      expect(sanitizeCronInput(null)).toBe('');
    });
  });

  describe('sanitizeForStorage', () => {
    it('removes HTML tags but preserves text', () => {
      expect(sanitizeForStorage('<b>hello</b>')).toBe('hello');
    });

    it('removes script tags', () => {
      expect(sanitizeForStorage('<script>alert(1)</script>safe')).toBe('safe');
    });

    it('removes null bytes', () => {
      expect(sanitizeForStorage('hello\x00world')).toBe('helloworld');
    });

    it('returns empty string for null', () => {
      expect(sanitizeForStorage(null)).toBe('');
    });
  });

  describe('validateStoredData', () => {
    it('validates string type', () => {
      expect(validateStoredData('hello', 'string')).toBe(true);
      expect(validateStoredData(123, 'string')).toBe(false);
    });

    it('validates array type', () => {
      expect(validateStoredData(['a', 'b'], 'array')).toBe(true);
      expect(validateStoredData('not array', 'array')).toBe(false);
      expect(validateStoredData([1, 2], 'array')).toBe(false);
    });

    it('validates object type', () => {
      expect(validateStoredData({ a: 1 }, 'object')).toBe(true);
      expect(validateStoredData('not object', 'object')).toBe(false);
      expect(validateStoredData([], 'object')).toBe(false);
    });

    it('validates boolean type', () => {
      expect(validateStoredData(true, 'boolean')).toBe(true);
      expect(validateStoredData(false, 'boolean')).toBe(true);
      expect(validateStoredData('true', 'boolean')).toBe(false);
    });

    it('rejects null and undefined', () => {
      expect(validateStoredData(null, 'string')).toBe(false);
      expect(validateStoredData(undefined, 'string')).toBe(false);
    });
  });
});
