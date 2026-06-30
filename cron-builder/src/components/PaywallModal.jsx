export default function PaywallModal({ feature, onClose, onUpgrade }) {
  const featureLabels = {
    timezone: 'Timezone Converter',
    webhook: 'Webhook Testing',
    slack: 'Slack Integration',
    json: 'JSON Export',
    history: 'Unlimited History',
    description: 'Human Description Export',
  };

  const featureName = featureLabels[feature] || 'This Feature';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-100">Premium Feature</h2>
          </div>
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

        <div className="bg-slate-900 rounded-xl p-4">
          <p className="text-slate-300 text-sm">
            <span className="font-semibold text-emerald-400">{featureName}</span> is available with Cron Builder Pro.
            Upgrade to unlock all premium features.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited cron history
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Timezone converter (8 zones)
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Webhook testing
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Slack integration
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            All export formats (JSON, crontab, description)
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <div>
            <span className="text-2xl font-bold text-slate-100">$5</span>
            <span className="text-slate-400 text-sm">/month</span>
          </div>
          <button
            onClick={onUpgrade}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-colors"
          >
            Activate Pro
          </button>
        </div>
        <p className="text-slate-600 text-xs text-center">Simulated payment — no card required for this demo</p>
      </div>
    </div>
  );
}
