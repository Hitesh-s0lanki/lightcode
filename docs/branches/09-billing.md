# Branch 09 — Usage-Based Billing

**Branch:** `09-billing`  
**Previous branch:** `08-user-experience`  
**Goal:** Credits deducted per message, upgrade flow opens in browser, users with 0 credits are blocked.

---

## Files Added

### `packages/cli/src/lib/`

| File | What it does |
|---|---|
| `src/lib/upgrade.ts` | Browser-based upgrade flow. Exports `openCheckout()` (calls `POST /billing/checkout` to get a Polar URL, opens it with `Bun.open()`) and `openBillingPortal()` (calls `POST /billing/portal`, opens that URL). |

### `packages/server/src/lib/`

| File | What it does |
|---|---|
| `src/lib/credits.ts` | Token-to-credit converter. Uses a pricing table keyed by model ID (input cost per million tokens, output cost per million tokens). Converts token usage from the AI SDK's `usage` object to a credit amount. 1 credit = $0.01 USD. Minimum charge is 1 credit per request. Exports `calculateCredits(usage, modelId): number`. |
| `src/lib/polar.ts` | Polar SDK wrapper. Exports: `getCheckoutUrl(userId)` → Polar checkout session URL; `getBillingPortalUrl(userId)` → customer portal URL; `getCreditBalance(userId)` → current credit balance; `ingestUsage(userId, credits)` → records usage event (deducts credits). |

### `packages/server/src/middleware/`

| File | What it does |
|---|---|
| `src/middleware/require-credits-balance.ts` | Hono middleware. Calls `polar.getCreditBalance(userId)`. If balance ≤ 0: returns `402 Payment Required` with a message instructing the user to upgrade. If balance > 0: calls `next()`. |

### `packages/server/src/routes/`

| File | What it does |
|---|---|
| `src/routes/billing.ts` | Three endpoints: `POST /billing/checkout` → returns `{ url }` for Polar checkout; `POST /billing/portal` → returns `{ url }` for customer portal; `GET /billing/success` → renders a simple "Thank you" text page shown after successful checkout. All routes protected by `requireAuth`. |

---

## Files Modified

| File | Change |
|---|---|
| `packages/server/src/routes/chat.ts` | After streaming completes: calls `calculateCredits(response.usage, modelId)` then `polar.ingestUsage(userId, credits)` to deduct from balance. Both calls are awaited after the stream ends so they don't block the response. |
| `packages/server/src/index.ts` | Mounts `/billing` route. Adds `requireCreditsBalance` middleware to the `/chat` route (after `requireAuth`). Sets up `POST /webhooks/polar` handler for Polar webhooks (credits top-up on payment success). |
| `packages/database/prisma/schema.prisma` | Adds nothing new in the DB — credit balance is managed entirely by Polar, not in the local DB. |
| `packages/cli/src/hooks/use-chat.ts` | Handles `402` response from server: shows a toast with upgrade prompt and calls `openCheckout()`. |
| `packages/cli/src/components/command-menu/commands.tsx` | Adds "Upgrade Plan" command that calls `openCheckout()` and "Billing Portal" command that calls `openBillingPortal()`. |
| `.env.example` | Adds `POLAR_ACCESS_TOKEN`, `POLAR_ORGANIZATION_ID`, `POLAR_PRODUCT_ID`, `POLAR_WEBHOOK_SECRET`. |
| `packages/server/package.json` | Adds `@polar-sh/sdk` dependency. |

---

## Credit System Design

```
1 credit = $0.01 USD

Per-request credit cost = (inputTokens × inputCostPerMillion / 1,000,000
                         + outputTokens × outputCostPerMillion / 1,000,000)
                         × 100   (convert dollars to cents/credits)

Minimum: 1 credit per request
```

## Billing Flow

```
User sends message:
  requireCreditsBalance checks balance
    → 0 credits: 402 response
      → CLI shows toast: "Out of credits. Upgrade?"
      → user presses Enter → openCheckout()
        → POST /billing/checkout → Polar URL
        → Bun.open(url) → browser opens
        → user pays → Polar webhook fires
        → POST /webhooks/polar → credits added to Polar balance
    → has credits: proceeds to /chat handler
      → stream response
      → calculate credits from token usage
      → polar.ingestUsage(userId, credits) → deducted from Polar balance
```

## Polar Integration Notes

- Polar manages the credit balance — no local DB column needed.
- `ingestUsage` is Polar's metered billing API: you report how many units were consumed, Polar deducts from the prepaid balance.
- The webhook handler must verify the `POLAR_WEBHOOK_SECRET` signature before processing.
- `GET /billing/success` is the redirect URL after Polar checkout — it just shows a message telling the user to return to the terminal.

## Notes

- Credits are deducted **after** streaming completes, so a failed stream doesn't accidentally charge users.
- The `402` check happens **before** the request reaches the chat handler, so no AI tokens are consumed when balance is 0.
- `Bun.open()` opens a URL in the system's default browser — no browser package needed.
