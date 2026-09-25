export type Gender = 'male' | 'female' | 'other';

export type UserProfile = {
  currentHeightCm: number;
  ageYears: number;
  gender: Gender;
  ethnicity?: string; // optional — see privacy note below
};

/**
 * ⚠️ PLACEHOLDER FORMULA — do not ship this as-is.
 * ---------------------------------------------------------------------
 * This is illustrative only, so the app has *something* to compute and
 * display while you build the rest of the flow. Before this goes near
 * real users charging real money, replace it with an estimation method
 * grounded in published, peer-reviewed growth-reference data, e.g.:
 *   - CDC or WHO growth charts (percentile-based projection)
 *   - Khamis-Roche method (needs parental height, more accurate for kids)
 *   - Mid-parental height method
 * These are public-domain / published methods with known error margins.
 * Whatever you use, show the margin of error to the user — presenting a
 * single confident number for something inherently probabilistic is
 * misleading, more so once you're charging for the "pro" version of it.
 *
 * ON ETHNICITY: some population-level growth studies do show measurable
 * differences in growth curves, but using ethnicity as an input is only
 * defensible if it's backed by a specific, cited study for that
 * adjustment — not an assumption you encode yourself. Given how sensitive
 * this field is, treat it as high-risk to get wrong: keep it optional
 * (already the plan), be explicit in your privacy policy about exactly
 * how it affects the output, and be prepared to justify the adjustment
 * factor if asked. When in doubt, leave it out of the calculation
 * entirely and just keep it optional for future research use with
 * separate consent.
 *
 * ON ADULTS: growth plates are typically fused by the early-to-mid 20s.
 * For a profile at or past that age, "potential" height should not
 * meaningfully exceed current height — inflating it anyway is exactly
 * the kind of unfounded claim that gets apps like this (and the broader
 * "heightmaxxing" space) accused of peddling pseudoscience. This function
 * caps the estimate accordingly.
 */

const GROWTH_PLATE_CLOSURE_AGE: Record<Gender, number> = {
  female: 16,
  male: 18,
  other: 17, // no single reference population — treat as a rough midpoint
};

function remainingGrowthFactor(ageYears: number, gender: Gender): number {
  const closureAge = GROWTH_PLATE_CLOSURE_AGE[gender];
  if (ageYears >= closureAge) return 0;
  // Linearly taper remaining growth potential to 0 at closure age.
  // Wildly oversimplified — real growth is not linear. Replace with a
  // real growth-curve lookup before shipping.
  const yearsRemaining = closureAge - ageYears;
  const maxYearsRemaining = closureAge - 10; // assume growth curves start mattering ~age 10
  return Math.max(0, Math.min(1, yearsRemaining / maxYearsRemaining));
}

export function estimateHeights(profile: UserProfile): { free: number; pro: number } {
  const factor = remainingGrowthFactor(profile.ageYears, profile.gender);

  // Placeholder magnitude: up to ~12cm of remaining growth at maximum
  // remaining-growth factor, tapering to 0 as the factor approaches 0.
  const maxRemainingCm = 12;
  const freeAddCm = factor * maxRemainingCm * 0.7; // free tier: conservative
  const proAddCm = factor * maxRemainingCm; // pro tier: full placeholder range

  const free = profile.currentHeightCm + freeAddCm;
  const pro = profile.currentHeightCm + proAddCm;

  return { free: round1(free), pro: round1(pro) };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
