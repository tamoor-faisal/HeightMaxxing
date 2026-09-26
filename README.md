# heightmaxxing

Expo (React Native) app scaffold, ported from the interactive HTML prototype.
Same design tokens, same ring math, same paywall flow — just native
components instead of HTML/CSS.

## 1. Set up the project

You need Node.js installed. Then, from a fresh folder:

```bash
npx create-expo-app heightmaxxing --template blank-typescript
```

Delete the generated `App.tsx`, `app.json`, and `package.json`, and copy
everything from this folder in their place (keep `node_modules` and
`package-lock.json`/`yarn.lock` that `create-expo-app` generated).

## 2. Install dependencies

Use `expo install` (not plain `npm install`) for anything touching native
code — it picks versions that match your Expo SDK automatically:

```bash
npx expo install react-native-svg
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
npx expo install expo-splash-screen expo-font
npx expo install @expo-google-fonts/space-grotesk @expo-google-fonts/inter
```

## 3. Run it

```bash
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) to run it on your phone, or
press `i` / `a` for a simulator/emulator.

## What's in here

- `src/theme.ts` — colors, fonts, radii, ported 1:1 from the prototype's CSS variables
- `src/utils/height.ts` — unit conversion + the ring's baseline-scaled proportion math
- `src/state/AppContext.tsx` — unit, pro status, heights, log history, paywall visibility
- `src/components/HeightRing.tsx` — the 56-dot SVG ring
- `src/components/PaywallSheet.tsx` — the $200 one-time / $50-mo paywall modal
- `src/services/purchases.ts` — **stub only** — see the comments inside before shipping
- `src/screens/` — Home, Progress, Activities, Meal & Sports, Tip, Account
- `App.tsx` — navigation + the tab-press interception that gates Meal & Sports

## Sign-up & profile (added)

- `src/screens/SignUpScreen.tsx` — collects email/password + current height,
  age, sex selection, biological parent heights, and optional ethnicity
- `src/screens/SignUpJourneyScreen.tsx` — animated calculation, free result,
  optional Pro offer, and a plans preview after signup
- `src/utils/heightEstimate.ts` — calculates a rough mid-parental-height
  reference using the conventional parent-average formula (+/- 13 cm for the
  sex adjustment, divided by two). Pro adds an illustrative 8.5 cm to this
  reference; Free is halfway between the user's current height and that upper
  reference. The added amount is not a validated prediction interval. Neither
  estimate predicts achievable or maximum height. This is not a clinical
  growth assessment.
  See [AAFP, Evaluation of Short and Tall Stature in Children](https://www.aafp.org/pubs/afp/issues/2008/0901/p597.html).
- `src/services/auth.ts` — Supabase email/password authentication and profile
  loading/saving
- `supabase/schema.sql` — the `profiles` and `height_logs` tables, owner-only
  row-level security policies, and a signup trigger that saves profile details
  even when email confirmation is enabled
- To set up the database, open the Supabase project used in
  `src/services/supabaseClient.ts`, go to **SQL Editor**, paste/run
  `supabase/schema.sql` (run it again after app schema changes), then open
  **Table Editor** to view `profiles` and `height_logs`. Existing accounts
  without a profile can sign in and complete their profile in the app.
- Pro displays an illustrative upper family-height reference while Free
  displays the midpoint between current height and that reference. These are
  display estimates, not validated predictions of obtainable or maximum
  height. Pro also unlocks the Meal & Sports menu. Nutrition and activity can
  support health but cannot guarantee extra height. Checkout is not integrated;
  plan prices shown in the app are preview-only and cannot take payment.
- To remove a test account, use **Authentication → Users** in the Supabase
  dashboard. Passwords in `auth.users` are securely hashed, not reversible
  encrypted text; do not edit `auth.users` directly in SQL. Deleting an auth
  user cascades to their profile and height logs.
- The log now starts **empty**; the ring's "current" figure comes from the
  profile instead, and only grows into a log once the user taps
  "Log a new measurement" on the Progress screen
- `App.tsx` now shows an account menu with Sign Up and Sign In until a profile
  exists. Existing users can sign in and load their saved profile.

**Not yet handled, and worth doing before real users hit this:**
age-gating / parental consent for under-13 (US) or under-16 (EU/UK) users,
a real backend, and a privacy policy that specifically covers the
ethnicity field and health data more broadly.

## Before this can actually ship

1. **Real purchases.** Checkout is not integrated. Wire up RevenueCat
   (recommended — one API for both App Store and Play Billing) or
   `react-native-iap` before offering paid plans. Neither store will approve
   an app that claims to charge money but doesn't actually process a payment.
2. **Growth assessment.** The current family-height reference is a rough
   parental-height calculation, not an individualized growth forecast. A
   real clinical-quality assessment would need validated growth-chart data,
   reliable serial measurements, and appropriate medical oversight.
3. **Ring baseline.** `RING_BASELINE_CM` (5'0") is a placeholder — see the
   comment in `height.ts`.
4. **App icons, splash image, bundle identifiers** in `app.json` are all
   placeholders.
5. **Store review considerations**: pricing display requirements, and (if
   your audience skews toward minors) parental consent for payments and
   COPPA-related data handling. Worth reviewing Apple's and Google's
   guidelines directly before submitting.
