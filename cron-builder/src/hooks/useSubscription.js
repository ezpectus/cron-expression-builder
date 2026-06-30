import { useState, useEffect, useCallback } from 'react';
import {
  getSubscriptionStatus,
  upgradeToPremium,
  downgradeToFree,
  getLimits,
  SUBSCRIPTION_TIERS,
} from '../utils/subscription.js';

export function useSubscription() {
  const [status, setStatus] = useState(SUBSCRIPTION_TIERS.FREE);

  useEffect(() => {
    const current = getSubscriptionStatus();
    setStatus(current);
  }, []);

  const upgrade = useCallback(() => {
    const newStatus = upgradeToPremium();
    setStatus(newStatus);
  }, []);

  const downgrade = useCallback(() => {
    const newStatus = downgradeToFree();
    setStatus(newStatus);
  }, []);

  const premium = status === SUBSCRIPTION_TIERS.PREMIUM;
  const limits = getLimits();

  return {
    status,
    isPremium: premium,
    isFree: !premium,
    limits,
    upgrade,
    downgrade,
  };
}
