# Architecture

## System Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        App.jsx (Root)                             │
│                     ErrorBoundary wraps                           │
│                    initBotProtection() on mount                   │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌───────────────────┐  ┌────────────────┐ │
│  │   Components      │  │     Hooks         │  │     Utils       │ │
│  │    (View)         │──│  (Controller)     │──│    (Model)      │ │
│  │                   │  │                   │  │                 │ │
│  │ CronBuilder       │  │ useCronBuilder    │  │ cronParser      │ │
│  │ FieldSelector     │  │ useNextRuns       │  │ cronBuilder     │ │
│  │ CronPreview       │  │ useTheme          │  │ cronDescription │ │
│  │ HumanDescription  │  │ useHistory        │  │ cronValidator   │ │
│  │ NextRuns          │  │ useCopyToClipboard│  │ cronNextRuns    │ │
│  │ Presets           │  │ useSubscription   │  │ timezoneUtils   │ │
│  │ TimezoneSelector  │  │                   │  │ presets         │ │
│  │ ParseInput        │  │                   │  │ constants       │ │
│  │  (honeypot)       │  │                   │  │ fieldFactory    │ │
│  │ ExportPanel       │  │                   │  │ sanitizer       │ │
│  │ History           │  │                   │  │ rateLimiter     │ │
│  │ ThemeToggle       │  │                   │  │ botProtection   │ │
│  │ Toast             │  │                   │  │ subscription    │ │
│  │ PremiumBadge      │  │                   │  │                 │ │
│  │ UpgradeBanner     │  │                   │  │                 │ │
│  │ PaywallModal      │  │                   │  │                 │ │
│  │ PricingPage       │  │                   │  │                 │ │
│  │ UserDashboard     │  │                   │  │                 │ │
│  └──────────────────┘  └───────────────────┘  └────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│               localStorage (persistence)                           │
│  • Theme (cron_builder_theme)                                      │
│  • History (cron_builder_history)                                  │
│  • Subscription (cron_builder_pro_status)                          │
│  All keys prefixed with cron_builder_ · sanitized · validated      │
├──────────────────────────────────────────────────────────────────┤
│              sessionStorage (session-only)                         │
│  • Bot suspicion score (not persistent)                           │
└──────────────────────────────────────────────────────────────────┘
```

## Design Patterns

| Pattern | Where Applied | Why |
|---------|--------------|-----|
| **Factory** | `fieldFactory.js` — `createMinuteField()`, `createHourField()`, etc. | Centralizes field creation with consistent defaults. Each factory produces an immutable field object with correct config for its type. |
| **Strategy** | `FieldSelector.jsx` — mode buttons switch between Every/Step/Specific/Range | Each mode is a strategy for how a cron field value is determined. The UI renders different inputs per strategy. `cronBuilder.js` `buildField()` dispatches on mode. |
| **Builder** | `cronBuilder.js` — `buildCronExpression(fields)` | Constructs the final cron string step-by-step from 5 field objects. Separates construction from representation. |
| **Observer** | `useCronBuilder.js` — `useEffect` watches `fields` and triggers expression/description/validation recalculation | Field changes automatically propagate to expression, description, validation, and next-runs without manual wiring. |
| **Singleton** | `useTheme.js` — `getThemeManager()` returns single instance | Ensures one theme manager across the app. Theme state is shared, consistent, and persisted. |
| **Singleton** | `useSubscription.js` — subscription state via `localStorage` | Single source of truth for free/premium status. All components read from the same persisted state. |
| **Strategy** | `subscription.js` — `getLimits()` returns FREE_LIMITS or PREMIUM_FEATURES | Feature access strategy switches based on subscription tier. Components check limits via pure functions. |
| **MVC** | Components (View) → Hooks (Controller) → Utils (Model) | Clean separation: utils are pure functions (model), hooks manage state (controller), components render UI (view). |

## DDIA Patterns (Kleppmann)

| Pattern | Where Applied | Why |
|---------|--------------|-----|
| **Immutable Data** | Field objects in `useCronBuilder` — all updates create new objects via spread | Prevents mutation bugs. `setFields(prev => ({ ...prev, [key]: { ...prev[key], ...updates } }))` ensures React detects changes. |
| **Event Sourcing** | `useHistory.js` — appends expressions to localStorage history | History is an append-only log of cron expressions the user built. Current state can be reconstructed by replaying. |
| **CQRS** | Read operations (next runs, description, validation) are separate from write operations (field selection) | `useNextRuns` and `generateDescription` are pure read models. `updateField`/`setFieldMode` are write operations. Separation enables independent optimization. |
| **Cache** | `cronParser.js` — `parseCache` Map caches parse results by expression string | Avoids re-parsing the same expression. Cache hit returns stored result. `clearParseCache()` available for invalidation. |
| **Idempotency** | `parseCronExpression(expr)` always returns identical result for same input | Parsing `*/5 * * * *` always produces the same field selection. Verified by test: `expect(r1).toBe(r2)` (same object reference from cache). |

## Data Flow

```
User interacts with UI (FieldSelector)
         │
         ▼
Hook: useCronBuilder.setFieldMode(key, mode)
         │
         ▼
State update: fields = { ...prev, [key]: { ...prev[key], mode } }
         │
         ▼ (useMemo recompute)
    ┌────┴────┬────────────┬──────────────┐
    ▼         ▼            ▼              ▼
buildCron   generate    validate     useNextRuns
Expression  Description  Fields       (getNextRuns)
    │         │            │              │
    ▼         ▼            ▼              ▼
expression  description  validation   nextRuns[]
    │         │            │              │
    └────┬────┴────────────┴──────────────┘
         ▼
    Components re-render with new props
         │
         ▼
    useEffect: saveToHistory(expression) if valid
```

## Component Hierarchy

```
App
├── ErrorBoundary
│   └── AppContent
│       ├── header
│       │   ├── Dashboard button → UserDashboard
│       │   ├── Pricing button → PricingPage
│       │   ├── TimezoneSelector
│       │   └── ThemeToggle
│       ├── CronPreview
│       ├── Presets
│       ├── CronBuilder
│       │   └── FieldSelector (×5, one per tab)
│       ├── ParseInput (honeypot, rate limiter, sanitizer)
│       ├── HumanDescription
│       ├── NextRuns
│       ├── ExportPanel
│       ├── History
│       ├── UpgradeBanner (free users only)
│       ├── PaywallModal (conditional)
│       ├── PricingPage (conditional)
│       ├── UserDashboard (conditional)
│       └── Toast
```

## State Management

All state is managed via React hooks — no external state library needed:

- **`useCronBuilder`** — Central state: fields, expression, description, validation. Provides update functions for each field property.
- **`useNextRuns`** — Derived state: calculates next 10 run times from fields + timezone. Auto-refreshes every 60 seconds.
- **`useTheme`** — Global theme state via Singleton ThemeManager. Persists to localStorage `cron_builder_theme`.
- **`useHistory`** — Expression history persisted to localStorage `cron_builder_history`. Max 20 entries. All data sanitized via `sanitizeForStorage()` and validated via `validateStoredData()`. Storage quota checked via `checkStorageQuota()`.
- **`useCopyToClipboard`** — Clipboard state with toast feedback. Rate-limited via `tryCopy()` and sanitized via `sanitizeText()`.
- **`useSubscription`** — Subscription state (free/premium) persisted to localStorage `cron_builder_pro_status`. Provides `isPremium`, `upgrade`, `downgrade`, `limits`.

## Security Architecture

### Layered Defense

```
┌─────────────────────────────────────────────────────┐
│                   Netlify Edge                       │
│  CSP · HSTS · X-Frame-Options · HTTPS Redirect      │
├─────────────────────────────────────────────────────┤
│                 Build Pipeline                       │
│  No source maps · No console.log · Terser minify    │
├─────────────────────────────────────────────────────┤
│                Application Layer                     │
│  Input Sanitizer · Rate Limiter · Bot Protection    │
├─────────────────────────────────────────────────────┤
│                 Storage Layer                        │
│  Key prefix · Sanitize on write · Validate on read  │
│  2MB quota · try-catch all operations               │
└─────────────────────────────────────────────────────┘
```

### Security Components

| Component | File | Responsibility |
|-----------|------|----------------|
| **Sanitizer** | `src/utils/sanitizer.js` | Strips HTML tags, script tags, on* attributes, javascript: URLs, control chars, null bytes. Provides `escapeHtml()`, `sanitizeText()`, `sanitizeForDisplay()`, `sanitizeCronInput()`, `sanitizeForStorage()`, `validateStoredData()`. |
| **Rate Limiter** | `src/utils/rateLimiter.js` | Sliding window algorithm, in-memory. Cron: 10/s, Copy: 20/s, JSON: 10/s, Schema: 5/s. Throttles without blocking UI. Also manages localStorage quota (2MB max, prune oldest). |
| **Bot Protection** | `src/utils/botProtection.js` | Detects headless browsers (navigator.webdriver), missing plugins/languages. Honeypot field, timing check (<100ms interaction), mouse movement check (0 events in 5s). Score in sessionStorage. Does not block — logs and disables features. |
| **CSP Headers** | `netlify.toml` | `default-src 'self'`, `script-src 'self'` (no inline/eval), `style-src 'self' 'unsafe-inline'` (Tailwind), `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`. Plus X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS. |

### Security Data Flow

```
User input (cron expression)
         │
         ▼
    Honeypot check ─── filled? ──→ silently ignore (bot)
         │ not filled
         ▼
    Rate limiter ─── over limit? ──→ toast "Too many requests"
         │ within limit
         ▼
    sanitizeCronInput() ─── strips HTML, scripts, non-cron chars
         │
         ▼
    parseCronExpression() ─── process sanitized input
         │
         ▼
    saveToHistory() ─── sanitizeForStorage() → localStorage
```

### ESLint Security Rules

- `react/no-danger: error` — Prevents `dangerouslySetInnerHTML` usage
- `no-undef: error` — Catches undefined variables
- `no-unused-vars: warn` — Catches dead code

## License

MIT License — open source. Free to use, modify, distribute, and sell. See [LICENSE](../cron-builder/LICENSE).
