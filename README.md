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

## Before this can actually ship

1. **Real purchases.** `choosePlan()` in `AppContext.tsx` just flips a
   boolean right now. Wire up RevenueCat (recommended — one API for both
   App Store and Play Billing) or `react-native-iap` directly. Neither
   store will approve an app that claims to charge money but doesn't
   actually process a payment.
2. **The height-estimation formula.** `heights.free` and `heights.pro` are
   hardcoded sample numbers. You'll want a real backend (or at least a
   real algorithm) computing these, plus a validated basis for what the
   "pro" estimate is claiming — that's the thing you're charging $200 for.
3. **Ring baseline.** `RING_BASELINE_CM` (5'0") is a placeholder — see the
   comment in `height.ts`.
4. **App icons, splash image, bundle identifiers** in `app.json` are all
   placeholders.
5. **Store review considerations**: pricing display requirements, and (if
   your audience skews toward minors) parental consent for payments and
   COPPA-related data handling. Worth reviewing Apple's and Google's
   guidelines directly before submitting.
