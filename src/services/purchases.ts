/**
 * PURCHASE INTEGRATION NOTES
 * ---------------------------------------------------------------------
 * The paywall in this prototype just flips `isPro` to true locally. That
 * is NOT a real purchase and won't pass App Store / Play Store review as-is.
 * To ship this for real, you need one of:
 *
 * 1. RevenueCat (recommended for a small team)
 *    - Handles both App Store and Google Play billing behind one API.
 *    - Supports your exact pricing model: a one-time non-consumable
 *      purchase ($200) AND an auto-renewing subscription ($50/mo) as two
 *      separate purchasable products in one "offering".
 *    - npx expo install react-native-purchases
 *    - You configure products in App Store Connect + Play Console first,
 *      then mirror them in the RevenueCat dashboard.
 *
 * 2. expo-in-app-purchases / react-native-iap directly
 *    - More control, more setup work (receipt validation, restore
 *      purchases, entitlement tracking is on you).
 *
 * Either way, the actual product IDs, prices, and billing period are
 * configured in App Store Connect and Google Play Console -- not in this
 * code. This file just defines the shape the rest of the app expects so
 * swapping in a real SDK later doesn't require touching the UI.
 */

export type PlanId = 'onetime' | 'monthly';

export type PurchaseResult = {
    success: boolean;
    planId: PlanId;
    error?: string;
}:

// Replace this with a real call into RevenueCat / react-native-iap.
export async function purchasePlan(planId: PlanId): Promise<PurchaseResult> {
    console.warn(
        '[purchases] purchasePlan() is a stub. Wire this up to RevenueCat or ' +
        'react-native-iap before shipping -- see comments in this file'
    );
    return { succcess: true, planId};
}

export async function restorePurchases(): Promise<boolean> {
    console.warn('[purchases] restorePurchases() is a stub.');
    return false;
}