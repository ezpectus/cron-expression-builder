const STORAGE_KEY = 'cron_builder_pro_status';

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
};

export const FREE_LIMITS = {
  maxHistory: 3,
  timezoneLocked: true,
  webhookTestingLocked: true,
  slackIntegrationLocked: true,
  jsonExportLocked: true,
  humanDescriptionExportLocked: true,
};

export const PREMIUM_FEATURES = {
  maxHistory: Infinity,
  timezoneLocked: false,
  webhookTestingLocked: false,
  slackIntegrationLocked: false,
  jsonExportLocked: false,
  humanDescriptionExportLocked: false,
};

export function getSubscriptionStatus() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === SUBSCRIPTION_TIERS.PREMIUM) {
      return SUBSCRIPTION_TIERS.PREMIUM;
    }
  } catch {
    // localStorage might be unavailable
  }
  return SUBSCRIPTION_TIERS.FREE;
}

export function setSubscriptionStatus(status) {
  try {
    localStorage.setItem(STORAGE_KEY, status);
  } catch {
    // localStorage might be unavailable
  }
}

export function isPremium() {
  return getSubscriptionStatus() === SUBSCRIPTION_TIERS.PREMIUM;
}

export function isFree() {
  return getSubscriptionStatus() === SUBSCRIPTION_TIERS.FREE;
}

export function upgradeToPremium() {
  setSubscriptionStatus(SUBSCRIPTION_TIERS.PREMIUM);
  return getSubscriptionStatus();
}

export function downgradeToFree() {
  setSubscriptionStatus(SUBSCRIPTION_TIERS.FREE);
  return getSubscriptionStatus();
}

export function getLimits() {
  return isPremium() ? PREMIUM_FEATURES : FREE_LIMITS;
}

export function getHistoryLimit() {
  const limits = getLimits();
  return limits.maxHistory;
}

export function canUseTimezone(timezoneId) {
  const limits = getLimits();
  if (!limits.timezoneLocked) return true;
  return timezoneId === 'UTC' || timezoneId === 'GMT';
}

export function canExportJson() {
  return !getLimits().jsonExportLocked;
}

export function canExportHumanDescription() {
  return !getLimits().humanDescriptionExportLocked;
}

export function canUseWebhookTesting() {
  return !getLimits().webhookTestingLocked;
}

export function canUseSlackIntegration() {
  return !getLimits().slackIntegrationLocked;
}

export function clearSubscriptionStatus() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage might be unavailable
  }
}
