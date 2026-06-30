# Business Model

## Product

Cron Expression Builder — a visual tool for constructing, parsing, and understanding cron schedules. Eliminates the need to memorize cryptic cron syntax.

## Problem

Cron syntax is universally disliked. `0 4 8-14 * 1-5` is incomprehensible to most developers and sysadmins. Errors in cron expressions lead to missed jobs, broken pipelines, and production incidents.

## Solution

A clean, intuitive UI where users select minutes, hours, days, months, and weekdays through visual controls. The app generates the cron expression, shows the next 10 run times, and provides a human-readable explanation.

## Pricing Tiers

### Free — $0/month
- Visual cron builder (all 5 fields, all 4 modes)
- Live expression preview
- Human-readable description
- Next 10 run times
- Copy to clipboard
- Parse existing cron
- 7 common presets
- Dark/light theme
- Expression history (**max 3 saved**)
- Timezone selector (**UTC and GMT only**)
- Export as crontab format only (**JSON and description export locked**)
- Upgrade banner at bottom of app

### Pro — $5/month
- Everything in Free, plus:
- **Unlimited history** — Save unlimited cron expressions
- **Timezone converter** — All 8 timezones unlocked (UTC, EST, PST, GMT, CET, IST, JST, AEST)
- **Webhook Testing** — Enter URL, send test cron trigger to your endpoint
- **Slack Integration** — Enter Slack webhook URL, send test message on schedule
- **All export formats** — Crontab, JSON, and human description export unlocked
- **No upgrade banner** — Clean, distraction-free experience
- **Premium badge** — PRO badge displayed in header
- **REST API** — Generate descriptions and next runs programmatically (future)
- **Team Workspaces** — Share saved cron expressions with team members (future)
- **Priority Support** — Email support with 24h response time (future)

### Detailed Feature Comparison

| Feature | Free | Pro ($5/mo) |
|---------|------|-------------|
| Visual cron builder (5 fields, 4 modes) | ✅ | ✅ |
| Live expression preview | ✅ | ✅ |
| Human-readable description | ✅ | ✅ |
| Next 10 run times | ✅ | ✅ |
| Parse existing cron | ✅ | ✅ |
| 7 common presets | ✅ | ✅ |
| Dark/light theme | ✅ | ✅ |
| Copy to clipboard | ✅ | ✅ |
| Crontab export | ✅ | ✅ |
| History | Max 3 items | Unlimited |
| Timezone selector | UTC, GMT only | All 8 zones |
| JSON export | ❌ Locked | ✅ |
| Human description export | ❌ Locked | ✅ |
| Webhook testing | ❌ Locked | ✅ |
| Slack integration | ❌ Locked | ✅ |
| Upgrade banner | Shown | Hidden |
| Premium badge | — | PRO in header |

### Implementation Details

- Subscription state stored in `localStorage` key `cron_builder_pro_status` (`free` / `premium`)
- `src/utils/subscription.js` — pure functions for subscription state management
- `src/hooks/useSubscription.js` — React hook wrapping subscription utils
- `src/components/PaywallModal.jsx` — modal shown when free user clicks locked feature
- `src/components/PricingPage.jsx` — full pricing comparison table accessible from header
- `src/components/UpgradeBanner.jsx` — dismissible bottom banner for free users
- `src/components/PremiumBadge.jsx` — emerald gradient pill badge for Pro users
- `src/components/UserDashboard.jsx` — account status, usage stats, feature comparison, theme settings, data export, history management, subscription reset
- Simulated payment — no real card processing (demo mode)

## Target Customers

| Segment | Size | Pain Point | Willingness to Pay |
|---------|------|------------|-------------------|
| Individual developers | ~2M | Quick cron syntax lookup | Low — Free tier sufficient |
| DevOps engineers | ~500K | Managing complex schedules across timezones | Medium — Pro for timezone + API |
| Small teams (5-20) | ~100K | Shared cron schedules, webhook testing | High — Pro + team features |
| Enterprise DevOps teams | ~10K | Compliance, audit trails, Slack integration | High — Pro + potential Enterprise |

## Revenue Projections

| Metric | Month 6 | Month 12 | Month 24 |
|--------|---------|----------|----------|
| Free users | 5,000 | 15,000 | 50,000 |
| Pro subscribers | 50 | 200 | 800 |
| MRR | $250 | $1,000 | $4,000 |
| Annual run rate | $3,000 | $12,000 | $48,000 |

## Cost Structure

| Item | Cost/month | Notes |
|------|-----------|-------|
| Netlify hosting (Free tier) | $0 | Static site, no backend for Free tier |
| Domain name | $1 | Annual ~$12 |
| API hosting (Pro tier) | $20-50 | Serverless functions for API/webhooks |
| Stripe payment processing | 2.9% + $0.30/transaction | Per Pro subscription |
| Email service (support) | $0-10 | Free tier sufficient initially |
| **Total monthly cost** | **$25-65** | Scales with Pro subscribers |

## Unit Economics

- **Pro ARPU**: $5/month
- **CAC target**: <$5 (organic search, dev communities, Product Hunt)
- **Gross margin**: ~95% (near-zero marginal cost per user)
- **Payback period**: <1 month (at $5 CAC)
- **LTV** (24-month retention): $120

## Growth Strategy

1. **SEO** — Rank for "cron expression builder", "cron syntax helper", "crontab generator"
2. **Developer communities** — Product Hunt, Hacker News, Reddit r/devops, r/programming
3. **Open source goodwill** — Free tier is fully functional, no artificial limits on core features
4. **API upsell** — Developers who integrate cron descriptions into their own tools upgrade to Pro
5. **Team adoption** — Individual users bring teams, driving Pro subscriptions

## Competitive Advantage

- **Open source (MIT)** — Full transparency, community contributions welcome, free to self-host
- **No signup required** for Free tier — instant value, zero friction
- **Parse + Build** — Most tools only build; we also parse existing cron strings
- **Next run preview** — Users see exactly when their job will fire
- **Design quality** — Clean, modern, developer-focused UI vs. dated alternatives
- **Timezone support** — Critical for distributed teams, often missing in competitors
- **Security hardened** — CSP, input sanitization, rate limiting, bot protection out of the box
