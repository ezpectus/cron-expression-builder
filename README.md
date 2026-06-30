# Cron Expression Builder

A visual cron expression builder that lets you construct cron schedules through an intuitive UI — no more memorizing cryptic syntax. Generates cron expressions, shows the next 10 run times, and provides human-readable descriptions.

## Who Is This For?

- **DevOps engineers** — build cron schedules for Jenkins, GitHub Actions, Kubernetes CronJobs without syntax errors
- **Backend developers** — generate `crontab` entries for scheduled tasks, backups, and cleanup jobs
- **Sysadmins** — parse existing cron expressions to understand what they do
- **Beginners learning cron** — visual UI + human-readable description makes cron syntax click
- **Teams** — share cron expressions with non-technical teammates who need to understand schedules

## What Can You Learn From This Codebase?

- **React architecture** — MVC pattern with hooks (Controller), components (View), utils (Model)
- **Design patterns** — Factory, Strategy, Builder, Observer, Singleton in a real project
- **Security hardening** — CSP headers, XSS prevention, input sanitization, rate limiting, bot detection
- **Testing** — 230 unit tests with Vitest covering edge cases, invalid input, and security
- **React hooks** — `useCronBuilder`, `useNextRuns`, `useTheme`, `useHistory`, `useSubscription`, `useCopyToClipboard`
- **Freemium model** — subscription state management with localStorage persistence
- **Build tooling** — Vite, ESLint, Terser, cross-platform scripts, CI/CD with GitHub Actions
- **Deployment** — Netlify with security headers, Docker containerization

## Features

- **Visual Cron Builder** — 5 tabs for Minutes, Hours, Day of Month, Month, Day of Week
- **4 Modes per Field** — Every (`*`), Every N (step), Specific (list), Range (from-to)
- **Live Expression Preview** — Updates in real-time as you select
- **Human-Readable Description** — "At 09:00 on every day-of-week from Monday through Friday"
- **Next 10 Run Times** — Calculated from current time with relative time ("in 2 hours")
- **Copy to Clipboard** — One-click copy with toast feedback
- **Parse Existing Cron** — Paste a cron string → app parses to visual selection + description
- **Common Presets** — Every minute, Every hour, Midnight daily, Weekdays 9am, Weekend midnight, Every Monday, First day of month
- **Timezone Selector** — UTC, EST, PST, GMT, CET, IST, JST, AEST (Free: UTC/GMT only, Pro: all 8)
- **Dark/Light Theme** — Toggle with localStorage persistence
- **Cron Validation** — Invalid combinations show error messages
- **Export** — Copy as crontab line (Free), JSON and human description (Pro)
- **History** — Recent cron expressions saved to localStorage (Free: max 3, Pro: unlimited)
- **Freemium Model** — Free tier with core features, Pro tier ($5/mo) unlocks all features
- **User Dashboard** — Account status, usage stats, feature comparison, theme settings, data export, history management
- **Security Hardening** — CSP headers, input sanitization, rate limiting, bot protection, secure localStorage

## Pricing

### Free — $0/month
- Visual cron builder, live preview, human-readable description
- Next 10 run times, parse existing cron, 7 presets
- Dark/light theme, copy to clipboard, crontab export
- History (max 3), timezone selector (UTC/GMT only)
- User Dashboard with stats and settings

### Pro — $5/month
- Unlimited history
- All 8 timezones unlocked
- Webhook testing, Slack integration
- All export formats (crontab, JSON, human description)
- No upgrade banner, PRO badge in header
- Priority support (future)

Click **Pricing** in the header or the **Upgrade to Pro** banner to view the full comparison table and activate Pro (simulated payment).

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool and dev server
- **TailwindCSS 3** — Styling
- **date-fns** — Date calculation
- **Vitest** — Testing framework (230 tests)
- **ESLint** — Code linting
- **Terser** — Production minification (strips console.log)
- **Docker** — Containerized deployment support

## Security

This app implements production-grade security hardening for a frontend-only Vite app deployed to Netlify.

### Content Security Policy (CSP)
- Strict CSP headers in `netlify.toml`: `default-src 'self'`, `script-src 'self'` (no inline/eval), `style-src 'self' 'unsafe-inline'` (Tailwind requirement)
- `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`
- Additional headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, `X-XSS-Protection`

### Input Sanitization
- `src/utils/sanitizer.js` — strips HTML tags, script tags, `on*` attributes, `javascript:` URLs, control characters, null bytes
- All user inputs pass through `sanitizeCronInput()` before processing
- `escapeHtml()`, `sanitizeText()`, `sanitizeForDisplay()` for safe rendering
- No `dangerouslySetInnerHTML` usage (ESLint rule `react/no-danger: error`)

### Rate Limiting
- `src/utils/rateLimiter.js` — sliding window algorithm, in-memory
- Cron parsing: 10/sec, Copy: 20/sec, JSON parsing: 10/sec, Schema generation: 5/sec
- Throttles operations without blocking UI — shows "Too many requests" toast

### Bot Protection
- `src/utils/botProtection.js` — detects headless browsers (`navigator.webdriver`), missing plugins/languages
- Honeypot hidden input field — bots fill it, humans don't
- Timing check — interaction within 100ms of page load flagged as bot
- Mouse movement check — zero `mousemove` events in first 5 seconds flagged
- Suspicion score stored in `sessionStorage` (not persistent)
- Does not block — logs to console and disables features for that session

### localStorage Security
- All keys prefixed with `cron_builder_` to avoid collisions
- All data sanitized before storing (`sanitizeForStorage()`)
- All data validated on read (`validateStoredData()` with type checking)
- Max 2MB usage — oldest entries pruned when exceeded
- try-catch around all operations (private mode, quota exceeded)
- No sensitive data (API keys, passwords, tokens) stored in localStorage

### Environment Variable Protection
- No API keys in frontend code
- `.env` in `.gitignore` — never commit real secrets
- `.env.example` contains only non-sensitive placeholder values
- **Never commit .env files with real API keys**

### Dependency Security
- All dependency versions pinned in `package.json` (no `^` or `~`)
- `npm audit` check in CI workflow
- `engines` field requires Node >= 20.0.0

### Build Security
- Production source maps disabled (`sourcemap: false` in `vite.config.js`)
- `console.log` and `debugger` statements stripped in production (terser)
- No debug code in production build

### Netlify Security
- Force HTTPS redirect (HTTP 301 to HTTPS)
- Static assets: `Cache-Control: public, max-age=31536000, immutable`
- `index.html`: `Cache-Control: no-cache, no-store, must-revalidate`

## Quick Start

### Option 1: npm commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npx vitest run

# Run linter
npm run lint

# Security audit
npm run audit
```

### Option 2: Convenience scripts

#### Windows (.bat)
| Script | Description |
|--------|-------------|
| `install.bat` | Install all npm dependencies |
| `start.bat` | Install (if needed) + start dev server |
| `build.bat` | Production build to `dist/` |
| `test.bat` | Run all quality gates (tests + lint + build) |

#### Linux/macOS (.sh)
| Script | Description |
|--------|-------------|
| `./install.sh` | Install all npm dependencies |
| `./start.sh` | Install (if needed) + start dev server |
| `./build.sh` | Production build to `dist/` |
| `./test.sh` | Run all quality gates (tests + lint + build) |

All scripts check for Node.js v20+ and install dependencies automatically if `node_modules/` is missing.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Copy cron expression |
| `Ctrl+Shift+E` | Toggle export panel |
| `Ctrl+H` | Toggle history |
| `Ctrl+P` | Focus parse input |
| `Escape` | Close modals / blur active element |

## Project Structure

```
├── public/
│   └── favicon.svg
├── src/
│   ├── components/           # UI components (View layer)
│   │   ├── CronBuilder.jsx
│   │   ├── CronPreview.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── ExportPanel.jsx
│   │   ├── FieldSelector.jsx
│   │   ├── History.jsx
│   │   ├── HumanDescription.jsx
│   │   ├── NextRuns.jsx
│   │   ├── ParseInput.jsx        # Honeypot, rate limiter, sanitizer
│   │   ├── PaywallModal.jsx
│   │   ├── PremiumBadge.jsx
│   │   ├── Presets.jsx
│   │   ├── PricingPage.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── TimezoneSelector.jsx
│   │   ├── Toast.jsx
│   │   ├── UpgradeBanner.jsx
│   │   └── UserDashboard.jsx     # Account, settings, stats, data export
│   ├── hooks/                # State management (Controller layer)
│   │   ├── useCopyToClipboard.js
│   │   ├── useCronBuilder.js
│   │   ├── useHistory.js
│   │   ├── useNextRuns.js
│   │   ├── useSubscription.js
│   │   └── useTheme.js
│   ├── utils/               # Business logic (Model layer)
│   │   ├── botProtection.js     # Bot detection, honeypot, timing
│   │   ├── constants.js
│   │   ├── cronBuilder.js
│   │   ├── cronDescription.js
│   │   ├── cronNextRuns.js
│   │   ├── cronParser.js
│   │   ├── cronValidator.js
│   │   ├── fieldFactory.js
│   │   ├── presets.js
│   │   ├── rateLimiter.js       # Sliding window rate limiter
│   │   ├── sanitizer.js         # XSS prevention, HTML escaping
│   │   ├── subscription.js
│   │   └── timezoneUtils.js
│   ├── test/                # Unit tests (230 tests)
│   │   ├── botProtection.test.js
│   │   ├── cronBuilder.test.js
│   │   ├── cronDescription.test.js
│   │   ├── cronNextRuns.test.js
│   │   ├── cronParser.test.js
│   │   ├── cronValidator.test.js
│   │   ├── rateLimiter.test.js
│   │   ├── sanitizer.test.js
│   │   └── subscription.test.js
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .github/workflows/ci.yml # CI: audit + lint + test + build
├── .env.example             # Env var template (no real secrets)
├── .eslintrc.json           # ESLint config (react/no-danger: error)
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── index.html
├── LICENSE                  # MIT (open source)
├── netlify.toml             # CSP, security headers, HTTPS, cache
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js           # sourcemap: false, terser strip console
├── install.bat / install.sh # Dependency install scripts
├── start.bat / start.sh     # Dev server scripts
├── build.bat / build.sh     # Production build scripts
└── test.bat / test.sh       # Quality gate scripts
```

## Architecture Summary

The app follows an MVC architecture:
- **Model** (`utils/`) — Pure functions for cron parsing, building, validation, description, next-run calculation, sanitization, rate limiting, bot protection, subscription management
- **View** (`components/`) — React components rendering the UI
- **Controller** (`hooks/`) — Custom hooks managing state and orchestrating model functions

Design patterns applied: Factory, Strategy, Builder, Observer, Singleton. See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for details.

## Testing

```bash
# Run all tests
npx vitest run

# Run tests in watch mode
npx vitest

# Run linting
npm run lint
```

230 tests covering:
- `cronParser` — All modes, invalid input, edge cases, cache idempotency
- `cronBuilder` — All modes, round-trip parse→build, crontab/JSON export
- `cronDescription` — All field combinations, presets, capitalization
- `cronValidator` — Valid/invalid expressions, field validation, edge cases
- `cronNextRuns` — Next run calculation, step patterns, timezone conversion
- `subscription` — Free/Pro tiers, limits, localStorage persistence
- `sanitizer` — XSS payloads, HTML escaping, cron input sanitization, storage validation
- `rateLimiter` — Sliding window algorithm, per-operation limits, reset
- `botProtection` — Honeypot, webdriver detection, timing/mouse heuristics, score accumulation

## Deployment

### Netlify
The app is configured for Netlify deployment via `netlify.toml`:
```bash
npm run build
# Deploy dist/ folder
```

### Docker
```bash
docker-compose up --build
# Access at http://localhost:5173
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, code style, security guidelines, and PR process.

## Changelog

See [CHANGELOG.md](./docs/CHANGELOG.md) for version history.

## License

MIT License. Copyright (c) 2026. See [LICENSE](./LICENSE).

Free to use, modify, distribute, and sell. Open source.
