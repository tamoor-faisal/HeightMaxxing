export type Gender = 'male' | 'female' | 'other';

export type UserProfile = {
  currentHeightCm: number;
  ageYears: number;
  gender: Gender;
  motherHeightCm?: number;
  fatherHeightCm?: number;
  ethnicity?: string;
};

export type FamilyHeightReference = {
  midpointCm: number;
  upperReferenceCm: number;
};

const SEX_HEIGHT_ADJUSTMENT_CM = 13;
// Visual estimate only; this is not a validated prediction interval.
const FAMILY_REFERENCE_SPREAD_CM = 8.5;

// This is a conventional mid-parental-height reference, not an individual
// adult-height forecast or a maximum-achievable-height prediction. The
// displayed spread is illustrative and is not a validated prediction interval.
export function estimateFamilyHeightReference(profile: UserProfile): FamilyHeightReference | null {
  const { motherHeightCm, fatherHeightCm } = profile;
  if (motherHeightCm == null || fatherHeightCm == null) return null;

  const adjustment =
    profile.gender === 'male'
      ? SEX_HEIGHT_ADJUSTMENT_CM
      : profile.gender === 'female'
        ? -SEX_HEIGHT_ADJUSTMENT_CM
        : 0;
  const midpointCm = (motherHeightCm + fatherHeightCm + adjustment) / 2;

  return {
    midpointCm: round1(midpointCm),
    upperReferenceCm: round1(midpointCm + FAMILY_REFERENCE_SPREAD_CM),
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
