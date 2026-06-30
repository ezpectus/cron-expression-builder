import { TIMEZONES } from './constants.js';

export function getTimezoneById(id) {
  return TIMEZONES.find((tz) => tz.id === id) || TIMEZONES[0];
}

export function convertToTimezone(date, timezoneId) {
  const tz = getTimezoneById(timezoneId);
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utcMs + tz.offset * 3600000);
}

export function formatInTimezone(date, timezoneId) {
  const tzDate = convertToTimezone(date, timezoneId);
  const year = tzDate.getFullYear();
  const month = String(tzDate.getMonth() + 1).padStart(2, '0');
  const day = String(tzDate.getDate()).padStart(2, '0');
  const hours = String(tzDate.getHours()).padStart(2, '0');
  const minutes = String(tzDate.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function getOffsetLabel(timezoneId) {
  const tz = getTimezoneById(timezoneId);
  if (tz.offset === 0) return 'UTC+0';
  const sign = tz.offset > 0 ? '+' : '-';
  const absOffset = Math.abs(tz.offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function getAllTimezones() {
  return TIMEZONES;
}
