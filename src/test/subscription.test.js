import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSubscriptionStatus,
  setSubscriptionStatus,
  isPremium,
  isFree,
  upgradeToPremium,
  downgradeToFree,
  getLimits,
  getHistoryLimit,
  canUseTimezone,
  canExportJson,
  canExportHumanDescription,
  canUseWebhookTesting,
  canUseSlackIntegration,
  clearSubscriptionStatus,
  SUBSCRIPTION_TIERS,
  FREE_LIMITS,
  PREMIUM_FEATURES,
} from '../utils/subscription.js';

const STORAGE_KEY = 'cron_builder_pro_status';

function mockLocalStorage() {
  const store = {};
  vi.stubGlobal('localStorage', {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] ?? null,
  });
  return store;
}

describe('subscription', () => {
  beforeEach(() => {
    mockLocalStorage();
    clearSubscriptionStatus();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSubscriptionStatus', () => {
    it('returns free by default', () => {
      expect(getSubscriptionStatus()).toBe(SUBSCRIPTION_TIERS.FREE);
    });

    it('returns premium after upgrade', () => {
      upgradeToPremium();
      expect(getSubscriptionStatus()).toBe(SUBSCRIPTION_TIERS.PREMIUM);
    });

    it('returns free after downgrade', () => {
      upgradeToPremium();
      downgradeToFree();
      expect(getSubscriptionStatus()).toBe(SUBSCRIPTION_TIERS.FREE);
    });
  });

  describe('setSubscriptionStatus', () => {
    it('sets status to premium', () => {
      setSubscriptionStatus(SUBSCRIPTION_TIERS.PREMIUM);
      expect(getSubscriptionStatus()).toBe(SUBSCRIPTION_TIERS.PREMIUM);
    });

    it('sets status to free', () => {
      setSubscriptionStatus(SUBSCRIPTION_TIERS.PREMIUM);
      setSubscriptionStatus(SUBSCRIPTION_TIERS.FREE);
      expect(getSubscriptionStatus()).toBe(SUBSCRIPTION_TIERS.FREE);
    });
  });

  describe('isPremium / isFree', () => {
    it('isFree is true by default', () => {
      expect(isFree()).toBe(true);
      expect(isPremium()).toBe(false);
    });

    it('isPremium is true after upgrade', () => {
      upgradeToPremium();
      expect(isPremium()).toBe(true);
      expect(isFree()).toBe(false);
    });

    it('isFree is true after downgrade from premium', () => {
      upgradeToPremium();
      downgradeToFree();
      expect(isFree()).toBe(true);
      expect(isPremium()).toBe(false);
    });
  });

  describe('upgradeToPremium', () => {
    it('returns premium status', () => {
      const result = upgradeToPremium();
      expect(result).toBe(SUBSCRIPTION_TIERS.PREMIUM);
    });

    it('persists to localStorage', () => {
      upgradeToPremium();
      expect(localStorage.getItem(STORAGE_KEY)).toBe(SUBSCRIPTION_TIERS.PREMIUM);
    });
  });

  describe('downgradeToFree', () => {
    it('returns free status', () => {
      upgradeToPremium();
      const result = downgradeToFree();
      expect(result).toBe(SUBSCRIPTION_TIERS.FREE);
    });

    it('persists to localStorage', () => {
      upgradeToPremium();
      downgradeToFree();
      expect(localStorage.getItem(STORAGE_KEY)).toBe(SUBSCRIPTION_TIERS.FREE);
    });
  });

  describe('getLimits', () => {
    it('returns FREE_LIMITS for free users', () => {
      const limits = getLimits();
      expect(limits).toEqual(FREE_LIMITS);
      expect(limits.maxHistory).toBe(3);
      expect(limits.timezoneLocked).toBe(true);
      expect(limits.webhookTestingLocked).toBe(true);
      expect(limits.slackIntegrationLocked).toBe(true);
      expect(limits.jsonExportLocked).toBe(true);
      expect(limits.humanDescriptionExportLocked).toBe(true);
    });

    it('returns PREMIUM_FEATURES for premium users', () => {
      upgradeToPremium();
      const limits = getLimits();
      expect(limits).toEqual(PREMIUM_FEATURES);
      expect(limits.maxHistory).toBe(Infinity);
      expect(limits.timezoneLocked).toBe(false);
      expect(limits.webhookTestingLocked).toBe(false);
      expect(limits.slackIntegrationLocked).toBe(false);
      expect(limits.jsonExportLocked).toBe(false);
      expect(limits.humanDescriptionExportLocked).toBe(false);
    });
  });

  describe('getHistoryLimit', () => {
    it('returns 3 for free users', () => {
      expect(getHistoryLimit()).toBe(3);
    });

    it('returns Infinity for premium users', () => {
      upgradeToPremium();
      expect(getHistoryLimit()).toBe(Infinity);
    });
  });

  describe('canUseTimezone', () => {
    it('allows UTC for free users', () => {
      expect(canUseTimezone('UTC')).toBe(true);
    });

    it('allows GMT for free users', () => {
      expect(canUseTimezone('GMT')).toBe(true);
    });

    it('blocks EST for free users', () => {
      expect(canUseTimezone('EST')).toBe(false);
    });

    it('blocks JST for free users', () => {
      expect(canUseTimezone('JST')).toBe(false);
    });

    it('allows all timezones for premium users', () => {
      upgradeToPremium();
      expect(canUseTimezone('UTC')).toBe(true);
      expect(canUseTimezone('GMT')).toBe(true);
      expect(canUseTimezone('EST')).toBe(true);
      expect(canUseTimezone('PST')).toBe(true);
      expect(canUseTimezone('CET')).toBe(true);
      expect(canUseTimezone('IST')).toBe(true);
      expect(canUseTimezone('JST')).toBe(true);
      expect(canUseTimezone('AEST')).toBe(true);
    });
  });

  describe('canExportJson', () => {
    it('returns false for free users', () => {
      expect(canExportJson()).toBe(false);
    });

    it('returns true for premium users', () => {
      upgradeToPremium();
      expect(canExportJson()).toBe(true);
    });
  });

  describe('canExportHumanDescription', () => {
    it('returns false for free users', () => {
      expect(canExportHumanDescription()).toBe(false);
    });

    it('returns true for premium users', () => {
      upgradeToPremium();
      expect(canExportHumanDescription()).toBe(true);
    });
  });

  describe('canUseWebhookTesting', () => {
    it('returns false for free users', () => {
      expect(canUseWebhookTesting()).toBe(false);
    });

    it('returns true for premium users', () => {
      upgradeToPremium();
      expect(canUseWebhookTesting()).toBe(true);
    });
  });

  describe('canUseSlackIntegration', () => {
    it('returns false for free users', () => {
      expect(canUseSlackIntegration()).toBe(false);
    });

    it('returns true for premium users', () => {
      upgradeToPremium();
      expect(canUseSlackIntegration()).toBe(true);
    });
  });

  describe('localStorage persistence', () => {
    it('survives clearing and re-reading', () => {
      upgradeToPremium();
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBe('premium');
      expect(getSubscriptionStatus()).toBe('premium');
    });

    it('clearSubscriptionStatus removes the key', () => {
      upgradeToPremium();
      clearSubscriptionStatus();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(getSubscriptionStatus()).toBe('free');
    });
  });

  describe('FREE_LIMITS constants', () => {
    it('has maxHistory of 3', () => {
      expect(FREE_LIMITS.maxHistory).toBe(3);
    });

    it('has all premium features locked', () => {
      expect(FREE_LIMITS.timezoneLocked).toBe(true);
      expect(FREE_LIMITS.webhookTestingLocked).toBe(true);
      expect(FREE_LIMITS.slackIntegrationLocked).toBe(true);
      expect(FREE_LIMITS.jsonExportLocked).toBe(true);
      expect(FREE_LIMITS.humanDescriptionExportLocked).toBe(true);
    });
  });

  describe('PREMIUM_FEATURES constants', () => {
    it('has unlimited history', () => {
      expect(PREMIUM_FEATURES.maxHistory).toBe(Infinity);
    });

    it('has all features unlocked', () => {
      expect(PREMIUM_FEATURES.timezoneLocked).toBe(false);
      expect(PREMIUM_FEATURES.webhookTestingLocked).toBe(false);
      expect(PREMIUM_FEATURES.slackIntegrationLocked).toBe(false);
      expect(PREMIUM_FEATURES.jsonExportLocked).toBe(false);
      expect(PREMIUM_FEATURES.humanDescriptionExportLocked).toBe(false);
    });
  });

  describe('SUBSCRIPTION_TIERS', () => {
    it('has FREE and PREMIUM values', () => {
      expect(SUBSCRIPTION_TIERS.FREE).toBe('free');
      expect(SUBSCRIPTION_TIERS.PREMIUM).toBe('premium');
    });
  });
});
