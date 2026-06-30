# Contributing

Thank you for your interest in contributing to Cron Expression Builder! This is an open source project under the MIT license — contributions are welcome.

This document covers setup, code style, patterns, testing, and the PR process.

## Development Setup

### Prerequisites
- Node.js v20 or higher
- npm (comes with Node.js)

### Using npm
```bash
# Clone the repository
git clone <repo-url>
cd cron-builder

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npx vitest run

# Run linter
npx eslint src/ --ext .js,.jsx

# Build for production
npx vite build

# Security audit
npm run audit
```

### Using convenience scripts

**Windows:**
```bash
install.bat    # Install dependencies
start.bat      # Install (if needed) + start dev server
build.bat      # Production build
test.bat       # All quality gates (tests + lint + build)
```

**Linux/macOS:**
```bash
./install.sh   # Install dependencies
./start.sh     # Install (if needed) + start dev server
./build.sh     # Production build
./test.sh      # All quality gates (tests + lint + build)
```

## Code Style

- **ESLint** — All code must pass `npx eslint src/ --ext .js,.jsx` with zero warnings
- **No semicolons** — Follow existing style (no semicolons at end of statements)
- **Single quotes** — Use single quotes for strings
- **2-space indentation** — No tabs
- **Trailing commas** — Use trailing commas in multi-line arrays/objects
- **Arrow functions** — Prefer arrow functions for components and callbacks
- **Named exports** — Use named exports for utilities, default export for components

## Patterns to Follow

### Design Patterns

- **Factory** — Use `fieldFactory.js` functions to create field objects. Never construct field objects inline.
- **Strategy** — Field modes (Every/Step/Specific/Range) are strategies. Add new modes by extending `MODES` and adding a case in `buildField()` and `FieldSelector.jsx`.
- **Builder** — `buildCronExpression()` constructs the expression from field objects. Keep it pure.
- **Observer** — Use `useEffect` and `useMemo` in hooks to propagate state changes. Never manually call update functions in sequence.
- **Singleton** — Theme manager is a singleton. Do not create additional instances.

### DDIA Patterns

- **Immutable Data** — Always create new objects when updating state: `{ ...prev, [key]: { ...prev[key], ...updates } }`. Never mutate.
- **Event Sourcing** — History is append-only. Do not modify or reorder history entries.
- **CQRS** — Keep read operations (description, next runs, validation) separate from write operations (field updates).
- **Cache** — Parser results are cached by expression string. Do not bypass the cache.
- **Idempotency** — Parsing the same expression must always produce the same result.

### MVC

- **Utils (Model)** — Pure functions, no side effects, no React imports
- **Hooks (Controller)** — State management, orchestrate utils, no JSX
- **Components (View)** — Render UI, call hooks, no business logic

## Testing

- All new features must include tests
- 230+ tests maintained across the suite
- Test files go in `src/test/` with `.test.js` extension
- Use `describe`/`it`/`expect` from Vitest
- Test edge cases: empty input, out-of-range values, invalid combinations
- Mock `localStorage` and `window` in test environment (Node.js doesn't have them by default)
- Run tests before submitting: `npx vitest run`

### Test Coverage Areas

- `cronParser.test.js` — All modes, invalid input, edge cases, cache
- `cronBuilder.test.js` — All modes, round-trip, crontab/JSON export
- `cronDescription.test.js` — All field combinations, presets, capitalization
- `cronValidator.test.js` — Valid/invalid expressions, field validation
- `cronNextRuns.test.js` — Next run calculation, step patterns, timezone
- `subscription.test.js` — Free/Pro tiers, limits, localStorage persistence
- `sanitizer.test.js` — XSS payloads, HTML escaping, cron input sanitization, storage validation
- `rateLimiter.test.js` — Sliding window algorithm, per-operation limits, reset
- `botProtection.test.js` — Honeypot, webdriver detection, timing/mouse heuristics

## PR Process

1. **Fork** the repository
2. **Create a branch** — `git checkout -b feature/your-feature-name`
3. **Write code** following the patterns above
4. **Write tests** for your changes
5. **Run quality gates**:
   ```bash
   npx vitest run
   npx eslint src/ --ext .js,.jsx
   npx vite build
   ```
6. **Commit** with a clear message: `feat: add timezone preview` or `fix: correct DOW range parsing`
7. **Push** and open a Pull Request
8. **Describe** what changed and why in the PR description
9. **Link** any relevant issues

## Quality Gates (must all pass)

```bash
npx vitest run          # All tests pass
npx eslint src/ --ext .js,.jsx   # No lint errors
npx vite build          # Build succeeds
```

No TODOs, no placeholders, no partial implementations in merged code.

## Security Guidelines

All contributors must follow these security practices:

### Input Handling
- **Always sanitize user input** — Use `sanitizeCronInput()` for cron expressions, `sanitizeText()` for general text, `sanitizeForStorage()` before writing to localStorage
- **Never use `dangerouslySetInnerHTML`** — ESLint rule `react/no-danger: error` enforces this. Use React's default text rendering or `sanitizeForDisplay()` if HTML escaping is needed
- **Validate all localStorage reads** — Use `validateStoredData(data, expectedType)` to verify type and structure before using stored data

### localStorage
- **Prefix all keys** with `cron_builder_` to avoid collisions with other apps
- **Never store sensitive data** (API keys, passwords, tokens) in localStorage
- **Wrap all operations in try-catch** — localStorage may be unavailable (private mode, quota exceeded)
- **Sanitize before storing** — Use `sanitizeForStorage()` on all data before `localStorage.setItem()`

### Rate Limiting
- **Use rate limiters for expensive operations** — Import from `src/utils/rateLimiter.js`
- **Available limiters**: `tryCronParse()` (10/s), `tryCopy()` (20/s), `tryJsonParse()` (10/s), `trySchemaGeneration()` (5/s)
- **Handle rate-limited state gracefully** — Show toast "Too many requests, please slow down", do not block UI

### Dependencies
- **Pin all versions** — No `^` or `~` in `package.json`. Use exact versions.
- **Run `npm audit`** before submitting PRs — Fix any moderate or higher vulnerabilities
- **No unused dependencies** — Remove packages that are no longer imported

### Build
- **No `console.log` in production** — Terser strips them, but avoid adding debug logging to production code paths
- **No source maps in production** — `sourcemap: false` in `vite.config.js`
- **No debug code** — Remove debugger statements, feature flags, and test-only code paths before merging

### Environment Variables
- **Never commit `.env` files with real secrets** — Only `.env.example` with placeholder values
- **No API keys in frontend code** — Frontend code is publicly visible; any keys would be exposed
- **Document new env vars** in `.env.example` with non-sensitive placeholder values

### Bot Protection
- **Do not block suspected bots** — Log to console and disable features only. Blocking creates UX issues for false positives.
- **Honeypot fields** — Use `getHoneypotFieldName()` from `src/utils/botProtection.js` for hidden honeypot inputs. Check with `checkHoneypot(value)`.
