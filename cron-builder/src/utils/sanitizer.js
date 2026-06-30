/* eslint-disable no-control-regex */

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const HTML_ESCAPE_REGEX = /[&<>"']/g;

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char]);
}

const HTML_TAG_REGEX = /<[^>]*>/g;
const SCRIPT_TAG_REGEX = /<script[^>]*>[\s\S]*?<\/script>/gi;
const ON_ATTRIBUTE_REGEX = /(?:^|\s)on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi;
const JAVASCRIPT_URL_REGEX = /javascript:/gi;
const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const NULL_BYTE_REGEX = /\x00/g;

export function sanitizeText(input) {
  if (input === null || input === undefined) return '';
  let str = String(input);

  str = str.replace(NULL_BYTE_REGEX, '');
  str = str.replace(CONTROL_CHAR_REGEX, '');
  str = str.replace(SCRIPT_TAG_REGEX, '');
  str = str.replace(HTML_TAG_REGEX, '');
  str = str.replace(ON_ATTRIBUTE_REGEX, '');
  str = str.replace(JAVASCRIPT_URL_REGEX, '');

  return str.trim();
}

export function sanitizeForDisplay(input) {
  const cleaned = sanitizeText(input);
  return escapeHtml(cleaned);
}

export function sanitizeCronInput(input) {
  if (input === null || input === undefined) return '';
  let str = String(input);

  str = str.replace(NULL_BYTE_REGEX, '');
  str = str.replace(CONTROL_CHAR_REGEX, '');
  str = str.replace(HTML_TAG_REGEX, '');
  str = str.replace(SCRIPT_TAG_REGEX, '');
  str = str.replace(ON_ATTRIBUTE_REGEX, '');
  str = str.replace(JAVASCRIPT_URL_REGEX, '');

  const allowed = str.replace(/[^0-9*/,\-\s]/g, '');
  return allowed.trim();
}

export function sanitizeForStorage(input) {
  if (input === null || input === undefined) return '';
  let str = String(input);

  str = str.replace(NULL_BYTE_REGEX, '');
  str = str.replace(CONTROL_CHAR_REGEX, '');
  str = str.replace(SCRIPT_TAG_REGEX, '');
  str = str.replace(HTML_TAG_REGEX, '');

  return str;
}

export function validateStoredData(data, expectedType) {
  if (data === null || data === undefined) return false;

  switch (expectedType) {
    case 'string':
      return typeof data === 'string';
    case 'array':
      return Array.isArray(data) && data.every((item) => typeof item === 'string');
    case 'object':
      return typeof data === 'object' && data !== null && !Array.isArray(data);
    case 'boolean':
      return typeof data === 'boolean';
    default:
      return false;
  }
}
