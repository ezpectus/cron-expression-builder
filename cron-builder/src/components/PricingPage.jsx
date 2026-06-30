import PremiumBadge from './PremiumBadge.jsx';

const FREE_FEATURES = [
  { name: 'Visual cron builder (5 fields, 4 modes)', included: true },
  { name: 'Live expression preview', included: true },
  { name: 'Human-readable description', included: true },
  { name: 'Next 10 run times', included: true },
  { name: 'Parse existing cron', included: true },
  { name: '7 common presets', included: true },
  { name: 'Dark/light theme', included: true },
  { name: 'Copy to clipboard', included: true },
  { name: 'Crontab export', included: true },
  { name: 'History (max 3)', included: true },
  { name: 'Timezone selector (UTC/GMT only)', included: true },
  { name: 'Unlimited history', included: false },
  { name: 'Timezone converter (8 zones)', included: false },
  { name: 'Webhook testing', included: false },
  { name: 'Slack integration', included: false },
  { name: 'JSON export', included: false },
  { name: 'Human description export', included: false },
  { name: 'No upgrade banner', included: false },
];

export default function PricingPage({ isPremium, onUpgrade, onDowngrade, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">Pricing Plans</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className={`rounded-xl border-2 p-5 ${!isPremium ? 'border-emerald-500' : 'border-slate-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-100">Free</h3>
                {!isPremium && (
                  <span className="text-xs text-emerald-400 font-medium">Current Plan</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-slate-100">$0</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">Everything you need to build and understand cron expressions.</p>
              {isPremium && (
                <button
                  onClick={onDowngrade}
                  className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg font-medium transition-colors"
                >
                  Switch to Free
                </button>
              )}
              {!isPremium && (
                <div className="w-full px-4 py-2 bg-slate-700 text-slate-400 text-sm rounded-lg text-center font-medium">
                  Your Current Plan
                </div>
              )}
            </div>

            <div className={`rounded-xl border-2 p-5 ${isPremium ? 'border-emerald-500' : 'border-emerald-500/50'} bg-slate-900/50`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-100">Pro</h3>
                  <PremiumBadge size="sm" />
                </div>
                {isPremium && (
                  <span className="text-xs text-emerald-400 font-medium">Active</span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-emerald-400">$5</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">Unlock all features for power users and teams.</p>
              {!isPremium && (
                <button
                  onClick={onUpgrade}
                  className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-sm rounded-lg font-bold transition-colors"
                >
                  Upgrade to Pro
                </button>
              )}
              {isPremium && (
                <div className="w-full px-4 py-2 bg-emerald-500/10 text-emerald-400 text-sm rounded-lg text-center font-medium">
                  Pro Active
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900">
                  <th className="text-left px-4 py-2 text-slate-400 text-sm font-medium">Feature</th>
                  <th className="text-center px-4 py-2 text-slate-400 text-sm font-medium w-20">Free</th>
                  <th className="text-center px-4 py-2 text-slate-400 text-sm font-medium w-20">Pro</th>
                </tr>
              </thead>
              <tbody>
                {FREE_FEATURES.map((feature, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-800/50' : ''}>
                    <td className="px-4 py-2 text-slate-300 text-sm">{feature.name}</td>
                    <td className="text-center px-4 py-2">
                      {feature.included ? (
                        <svg className="w-5 h-5 text-emerald-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                    <td className="text-center px-4 py-2">
                      <svg className="w-5 h-5 text-emerald-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-slate-600 text-xs text-center mt-4">Simulated payments — no card required for this demo</p>
        </div>
      </div>
    </div>
  );
}
