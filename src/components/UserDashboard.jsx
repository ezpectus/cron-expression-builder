import { useState, useMemo } from 'react';
import { useSubscription } from '../hooks/useSubscription.js';
import { useTheme } from '../hooks/useTheme.js';
import { useHistory } from '../hooks/useHistory.js';
import { FREE_LIMITS } from '../utils/subscription.js';

export default function UserDashboard({ onClose, onShowPricing }) {
  const { isPremium, status, limits, downgrade } = useSubscription();
  const { theme, setThemeMode } = useTheme();
  const { history, clearHistory } = useHistory();

  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = useMemo(() => {
    const storageKeys = [];
    let totalSize = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cron_builder_')) {
          const value = localStorage.getItem(key);
          totalSize += key.length + (value ? value.length : 0);
          storageKeys.push(key);
        }
      }
    } catch {
      // localStorage might be unavailable
    }
    return {
      totalExpressions: history.length,
      storageKeys: storageKeys.length,
      storageSizeKB: (totalSize / 1024).toFixed(2),
      storageSizeMaxKB: (2 * 1024).toFixed(0),
    };
  }, [history.length]);

  const featureList = [
    { name: 'Timezone Selection', free: 'UTC/GMT only', pro: 'All timezones', locked: limits.timezoneLocked },
    { name: 'JSON Export', free: 'Locked', pro: 'Available', locked: limits.jsonExportLocked },
    { name: 'Human Description Export', free: 'Locked', pro: 'Available', locked: limits.humanDescriptionExportLocked },
    { name: 'Webhook Testing', free: 'Locked', pro: 'Available', locked: limits.webhookTestingLocked },
    { name: 'Slack Integration', free: 'Locked', pro: 'Available', locked: limits.slackIntegrationLocked },
    { name: 'History Limit', free: `${FREE_LIMITS.maxHistory} entries`, pro: 'Unlimited', locked: limits.maxHistory !== Infinity },
  ];

  const handleClearHistory = () => {
    clearHistory();
    setConfirmClear(false);
  };

  const handleResetSubscription = () => {
    downgrade();
    setConfirmReset(false);
  };

  const handleExportData = () => {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cron_builder_')) {
          data[key] = localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cron-builder-data.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // localStorage might be unavailable
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">User Dashboard</h2>
              <p className="text-xs text-slate-500">Manage your account, settings, and data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            aria-label="Close dashboard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Status */}
          <section>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Account Status</h3>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isPremium ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span className="text-slate-100 font-medium">
                    {isPremium ? 'Pro Plan' : 'Free Plan'}
                  </span>
                </div>
                {isPremium ? (
                  <button
                    onClick={handleResetSubscription}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg font-medium transition-colors"
                  >
                    Cancel Pro
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onShowPricing();
                    }}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Plan</span>
                  <p className="text-slate-200 font-medium capitalize">{status}</p>
                </div>
                <div>
                  <span className="text-slate-500">History Limit</span>
                  <p className="text-slate-200 font-medium">
                    {limits.maxHistory === Infinity ? 'Unlimited' : `${limits.maxHistory} entries`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Statistics</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.totalExpressions}</p>
                <p className="text-xs text-slate-500 mt-1">Expressions Saved</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.storageKeys}</p>
                <p className="text-xs text-slate-500 mt-1">Storage Keys</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.storageSizeKB}</p>
                <p className="text-xs text-slate-500 mt-1">KB Used / {stats.storageSizeMaxKB}KB</p>
              </div>
            </div>
          </section>

          {/* Feature Comparison */}
          <section>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Feature Comparison</h3>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-2 text-slate-400 font-medium">Feature</th>
                    <th className="text-center px-4 py-2 text-slate-400 font-medium">Free</th>
                    <th className="text-center px-4 py-2 text-emerald-400 font-medium">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {featureList.map((feature) => (
                    <tr key={feature.name} className="border-b border-slate-800 last:border-0">
                      <td className="px-4 py-2 text-slate-200">{feature.name}</td>
                      <td className="px-4 py-2 text-center text-slate-500">{feature.free}</td>
                      <td className="px-4 py-2 text-center text-emerald-300">{feature.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Settings */}
          <section>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Settings</h3>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 space-y-4">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-200 text-sm font-medium">Theme</p>
                  <p className="text-xs text-slate-500">Switch between dark and light mode</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                {/* Export Data */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Export Data</p>
                    <p className="text-xs text-slate-500">Download all your data as JSON</p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg font-medium transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                {/* Clear History */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Clear History</p>
                    <p className="text-xs text-slate-500">Remove all saved cron expressions</p>
                  </div>
                  {confirmClear ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearHistory}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmClear(false)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmClear(true)}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg font-medium transition-colors border border-red-600/30"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                {/* Reset Subscription */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Reset Subscription</p>
                    <p className="text-xs text-slate-500">Switch back to Free plan</p>
                  </div>
                  {confirmReset ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleResetSubscription}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmReset(true)}
                      disabled={!isPremium}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg font-medium transition-colors border border-red-600/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-3 rounded-b-2xl">
          <p className="text-center text-xs text-slate-500">
            Cron Expression Builder v1.2.0 — Data stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
