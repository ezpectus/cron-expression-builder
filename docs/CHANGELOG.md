# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-06-30

### Added
- Content Security Policy (CSP) headers in `netlify.toml` — strict `default-src 'self'`, `script-src 'self'`, `frame-ancestors 'none'`
- Security headers: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, `X-XSS-Protection`
- `src/utils/sanitizer.js` — `escapeHtml()`, `sanitizeText()`, `sanitizeForDisplay()`, `sanitizeCronInput()`, `sanitizeForStorage()`, `validateStoredData()`
- `src/utils/rateLimiter.js` — sliding window rate limiter (cron: 10/s, copy: 20/s, JSON: 10/s, schema: 5/s)
- `src/utils/botProtection.js` — webdriver detection, honeypot field, timing check, mouse movement check, sessionStorage suspicion score
- Honeypot hidden input in `ParseInput.jsx` — bots fill it, humans don't
- HTTPS force redirect in `netlify.toml`
- Cache-control headers for static assets (immutable, 1 year) and `index.html` (no-cache)
- `npm audit` job in CI workflow
- ESLint rule `react/no-danger: error` — prevents XSS via `dangerouslySetInnerHTML`
- Security tests: `sanitizer.test.js` (40+ tests), `rateLimiter.test.js` (15+ tests), `botProtection.test.js` (20+ tests)
- Security section in README.md
- Security guidelines in CONTRIBUTING.md
- Security architecture subsection in ARCHITECTURE.md

### Changed
- License changed from proprietary to MIT (open source)
- `package.json` — added `license: MIT`, `keywords`, `repository`, `homepage`, `bugs` fields for open source
- `lint` script updated to `node run-eslint.mjs` for cross-platform compatibility
- All user inputs sanitized through `sanitizeCronInput()` before processing
- Copy operations rate-limited and sanitized through `sanitizeText()`
- All localStorage keys prefixed with `cron_builder_` (history, theme, pro_status)
- All localStorage data sanitized before storing and validated on read
- localStorage 2MB quota enforcement with oldest-entry pruning
- `vite.config.js` — `sourcemap: false`, terser strips `console.log` and `debugger` in production
- `package.json` — all dependency versions pinned (no `^` or `~`), `engines.node: ">=20.0.0"`, `audit` script
- `.env.example` — security warning about never committing real API keys
- `ParseInput.jsx` — rate limiting on cron parse, honeypot field, input sanitization

### Fixed
- `cronNextRuns.js` — removed 6 unused functions (`findNextMatching`, `findNextMinute`, `findNextHour`, `findNextDom`, `findNextMonth`, `findNextDow`, `daysInMonth`)
- `cronValidator.js` — removed dead code at end of `validateExpression` (DOM/DOW check that did nothing)
- `useCronBuilder.js` — removed unused `history` state and `useEffect` (history managed by `useHistory` hook)
- `useNextRuns.js` — removed unused `useMemo` import
- `useSubscription.js` — removed unused `checkIsPremium` import
- `cronParser.js` — removed unused `createAllFields` import
- `cronBuilder.test.js`, `cronDescription.test.js`, `cronNextRuns.test.js` — removed unused `FIELDS` imports
- `App.jsx` / `CronBuilder.jsx` — removed unused `onFieldUpdate` prop
- ESLint: 0 errors, 0 warnings (was 6 warnings)

### Security
- No `dangerouslySetInnerHTML` usage anywhere in codebase
- No inline scripts, no eval in CSP
- No external API calls from frontend (`connect-src 'self'`)
- No sensitive data in localStorage
- No source maps in production build
- No console.log in production build

### Added (Scripts & Docs)
- `build.bat` / `build.sh` — production build convenience scripts with Node.js check
- `test.bat` / `test.sh` — quality gate scripts (tests + lint + build in one command)
- Updated `start.bat` / `start.sh` — Node.js v20+ check, auto-install, version display
- Updated `install.bat` / `install.sh` — Node.js check, post-install instructions
- `src/components/UserDashboard.jsx` — account status, usage stats, feature comparison, theme settings, data export, history management, subscription reset
- Updated `LICENSE` — switched from proprietary to MIT (open source)
- Updated `README.md` — script tables, 230 test count, User Dashboard feature, updated project structure

## [1.1.0] - 2026-06-30

### Added
- Freemium monetization model with Free and Pro ($5/mo) tiers
- `src/utils/subscription.js` — subscription state management (localStorage `cron_builder_pro_status`)
- `src/hooks/useSubscription.js` — React hook for subscription state
- `src/components/PremiumBadge.jsx` — emerald gradient pill "PRO" badge for premium users
- `src/components/UpgradeBanner.jsx` — dismissible bottom banner for free users
- `src/components/PaywallModal.jsx` — modal shown when free user clicks locked feature
- `src/components/PricingPage.jsx` — full pricing comparison table (Free vs Pro)
- 40+ subscription tests covering free limits, premium unlock, localStorage persistence
- Pricing page accessible from header button

### Changed
- History limited to 3 items for free users, unlimited for Pro (locked 4th slot shows upgrade prompt)
- TimezoneSelector disables non-UTC/GMT zones for free users, shows PremiumBadge
- ExportPanel locks JSON and human description export for free users with PRO badge
- Header shows PremiumBadge when Pro is active
- Footer version updated to v1.1.0
- Escape key now closes paywall and pricing modals

### Free Tier Limits
- Max 3 cron expressions in history
- Timezone selector: UTC and GMT only
- No webhook testing, Slack integration
- Export: crontab format only (JSON and description locked)
- Upgrade banner shown at bottom

### Pro Tier Features
- Unlimited history
- All 8 timezones unlocked
- Webhook testing, Slack integration
- All export formats (crontab, JSON, human description)
- No upgrade banner, PRO badge in header

## [1.0.0] - 2024-06-30

### Added
- Visual cron expression builder with 5 tabs (Minutes, Hours, Day of Month, Month, Day of Week)
- Four modes per field: Every, Every N (step), Specific (list), Range (from-to)
- Live cron expression preview with monospace display
- Human-readable description generation
- Next 10 run times calculation with relative time display
- Copy to clipboard with toast feedback
- Parse existing cron expressions into visual selections
- 7 common presets: Every minute, Every hour, Midnight daily, Weekdays 9am, Weekend midnight, Every Monday, First day of month
- Timezone selector with 8 zones: UTC, EST, PST, GMT, CET, IST, JST, AEST
- Dark/light theme toggle with localStorage persistence
- Cron validation with error messages for invalid combinations
- Export as crontab line, JSON, or human description
- Expression history with localStorage persistence (max 20 entries)
- Keyboard shortcuts: Ctrl+C, Ctrl+Shift+E, Ctrl+H, Ctrl+P, Escape
- Error boundary for graceful error handling
- 70+ unit tests across parser, builder, description, validator, and next-runs modules
- GitHub Actions CI: audit + lint + test + build
- Netlify deployment configuration with CSP and security headers
- Docker support with docker-compose
- Cross-platform install/start/build/test scripts (Windows .bat + Unix .sh)

### Design Patterns
- Factory pattern for cron field creation (`fieldFactory.js`)
- Strategy pattern for field modes (Every/Step/Specific/Range)
- Builder pattern for cron expression construction (`cronBuilder.js`)
- Observer pattern for field change propagation (`useCronBuilder.js`)
- Singleton pattern for theme management (`useTheme.js`)
- MVC architecture: Components (View) → Hooks (Controller) → Utils (Model)

### DDIA Patterns
- Immutable Data for field selections
- Event Sourcing for expression history
- CQRS separation of read (next runs, description) and write (field selection)
- Cache for parsed cron results
- Idempotency for parse operations
