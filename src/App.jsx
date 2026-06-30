import { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import CronBuilder from './components/CronBuilder.jsx';
import CronPreview from './components/CronPreview.jsx';
import HumanDescription from './components/HumanDescription.jsx';
import NextRuns from './components/NextRuns.jsx';
import Presets from './components/Presets.jsx';
import TimezoneSelector from './components/TimezoneSelector.jsx';
import ParseInput from './components/ParseInput.jsx';
import ExportPanel from './components/ExportPanel.jsx';
import History from './components/History.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Toast from './components/Toast.jsx';
import PremiumBadge from './components/PremiumBadge.jsx';
import UpgradeBanner from './components/UpgradeBanner.jsx';
import PaywallModal from './components/PaywallModal.jsx';
import PricingPage from './components/PricingPage.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import { useCronBuilder } from './hooks/useCronBuilder.js';
import { useNextRuns } from './hooks/useNextRuns.js';
import { useCopyToClipboard } from './hooks/useCopyToClipboard.js';
import { useHistory } from './hooks/useHistory.js';
import { useSubscription } from './hooks/useSubscription.js';
import { initBotProtection } from './utils/botProtection.js';

function AppContent() {
  const {
    fields,
    expression,
    description,
    validation,
    setFieldMode,
    setFieldStep,
    setFieldSpecific,
    setFieldRange,
    toggleSpecificValue,
    parseExpression,
    setFromPreset,
  } = useCronBuilder();

  const [timezone, setTimezone] = useState('UTC');
  const { toast, copy, showToast } = useCopyToClipboard();
  const { history, saveToHistory, clearHistory, removeFromHistory } = useHistory();
  const { isPremium, upgrade, downgrade } = useSubscription();

  const [showPaywall, setShowPaywall] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const nextRuns = useNextRuns(fields, timezone, 10);

  useEffect(() => {
    const cleanupBotProtection = initBotProtection();
    return cleanupBotProtection;
  }, []);

  const handleRateLimited = useCallback(() => {
    showToast('Too many requests, please slow down', 'error');
  }, [showToast]);

  useEffect(() => {
    if (validation.valid && expression) {
      saveToHistory(expression);
    }
  }, [expression, validation.valid, saveToHistory]);

  const handleParse = useCallback((expr) => {
    const result = parseExpression(expr);
    if (result.success) {
      showToast('Cron expression parsed successfully');
    } else {
      showToast(result.error, 'error');
    }
    return result;
  }, [parseExpression, showToast]);

  const handlePresetSelect = useCallback((preset) => {
    setFromPreset(preset.fields);
    showToast(`Preset applied: ${preset.label}`);
  }, [setFromPreset, showToast]);

  const handleHistorySelect = useCallback((expr) => {
    const result = parseExpression(expr);
    if (result.success) {
      showToast('Loaded from history');
    }
  }, [parseExpression, showToast]);

  const handleLockedClick = useCallback((feature) => {
    setShowPaywall(feature);
  }, []);

  const handleUpgrade = useCallback(() => {
    upgrade();
    setShowPaywall(null);
    setShowPricing(false);
    showToast('Pro activated! All features unlocked');
  }, [upgrade, showToast]);

  const handleDowngrade = useCallback(() => {
    downgrade();
    setShowPricing(false);
    showToast('Switched to Free plan');
  }, [downgrade, showToast]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && !e.shiftKey && e.key === 'c' && window.getSelection().toString() === '') {
        e.preventDefault();
        copy(expression, 'Cron expression copied');
      }
      if (e.key === 'Escape') {
        setShowPaywall(null);
        setShowPricing(false);
        setShowDashboard(false);
        document.activeElement?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, copy]);

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
                <line x1="12" y1="12" x2="12" y2="7" strokeWidth={2} strokeLinecap="round" />
                <line x1="12" y1="12" x2="16" y2="14" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">Cron Expression Builder</h1>
                {isPremium && <PremiumBadge size="sm" />}
              </div>
              <p className="text-xs text-slate-500">Build, parse, and understand cron schedules</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowDashboard(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm rounded-lg font-medium transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setShowPricing(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm rounded-lg font-medium transition-colors"
            >
              Pricing
            </button>
            <TimezoneSelector
              timezone={timezone}
              onChange={setTimezone}
              isPremium={isPremium}
              onLockedClick={handleLockedClick}
            />
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <CronPreview expression={expression} validation={validation} onCopy={copy} />
            <Presets onSelect={handlePresetSelect} />
            <CronBuilder
              fields={fields}
              onModeChange={setFieldMode}
              onStepChange={setFieldStep}
              onSpecificChange={setFieldSpecific}
              onRangeChange={setFieldRange}
              onToggleSpecific={toggleSpecificValue}
            />
            <ParseInput onParse={handleParse} onRateLimited={handleRateLimited} />
          </div>

          <div className="space-y-4">
            <HumanDescription description={description} />
            <NextRuns runs={nextRuns} />
            <div className="flex gap-2 flex-wrap">
              <ExportPanel
                fields={fields}
                expression={expression}
                description={description}
                onCopy={copy}
                isPremium={isPremium}
                onLockedClick={handleLockedClick}
              />
              <History
                history={history}
                onSelect={handleHistorySelect}
                onClear={clearHistory}
                onRemove={removeFromHistory}
                isPremium={isPremium}
                onLockedClick={handleLockedClick}
              />
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-slate-600 text-xs pb-16">
          <p>Cron Expression Builder v1.2.0 — Built with React, Vite & TailwindCSS</p>
        </footer>
      </div>

      {!isPremium && (
        <UpgradeBanner
          onUpgrade={() => setShowPaywall('general')}
          onShowPricing={() => setShowPricing(true)}
        />
      )}

      {showPaywall && (
        <PaywallModal
          feature={showPaywall}
          onClose={() => setShowPaywall(null)}
          onUpgrade={handleUpgrade}
        />
      )}

      {showPricing && (
        <PricingPage
          isPremium={isPremium}
          onUpgrade={handleUpgrade}
          onDowngrade={handleDowngrade}
          onClose={() => setShowPricing(false)}
        />
      )}

      {showDashboard && (
        <UserDashboard
          onClose={() => setShowDashboard(false)}
          onShowPricing={() => setShowPricing(true)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
