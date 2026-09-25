export type Unit = 'ft' | 'cm';

export function cmToFeetIn(cm: number): string {
  let totalIn = cm / 2.54;
  let ft = Math.floor(totalIn / 12);
  let inch = Math.round(totalIn - ft * 12);
  if (inch === 12) {
    ft += 1;
    inch = 0;
  }
  return `${ft}'${inch}"`;
}

export function formatHeight(cm: number, unit: Unit): string {
  return unit === 'ft' ? cmToFeetIn(cm) : `${cm.toFixed(1)} cm`;
}

/**
 * Ring baseline: fractions are measured from this height up to the pro
 * estimate, not from zero. Measuring from zero makes real differences
 * (e.g. 5'8" vs 6'4") disappear because they're small relative to total
 * body height. Starting the scale at a realistic low-end height makes the
 * actual gap between actual/free/pro fill most of the ring.
 *
 * NOTE: 152.4cm (5'0") is a placeholder baseline good enough for typical
 * adult numbers. Before shipping, tie this to something real -- e.g. a
 * percentile-based lower bound, or the person's own height at a fixed past
 * age -- so the ring doesn't clip to 0 or look skewed for edge-case users.
 */
export const RING_BASELINE_CM = 152.4;

export function heightFraction(cm: number, proCm: number, baselineCm: number = RING_BASELINE_CM): number {
  const span = proCm - baselineCm;
  if (span <= 0) return 0;
  return Math.max(0, Math.min(1, (cm - baselineCm) / span));
}
