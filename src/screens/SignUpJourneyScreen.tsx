import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { useApp } from '../state/AppContext';
import { estimateFamilyHeightReference } from '../utils/heightEstimate';
import { formatHeight } from '../utils/height';
import HeightEstimateInfo from '../components/HeightEstimateInfo';

const CALCULATION_STEPS = [
  'Combining the biological parent heights',
  'Applying the selected sex adjustment',
  'Preparing the illustrative upper reference',
];

export default function SignUpJourneyScreen() {
  const { profile, unit, signupStage, setSignupStage } = useApp();
  const [calculationStep, setCalculationStep] = useState(0);
  const [displayHeight, setDisplayHeight] = useState(0);
  const target = profile ? estimateFamilyHeightReference(profile) : null;
  const upperReferenceCm = target?.upperReferenceCm;

  useEffect(() => {
    if (signupStage !== 'calculating' || !profile || upperReferenceCm == null) return;

    const durationMs = 3200;
    const intervalMs = 50;
    let elapsedMs = 0;
    const timer = setInterval(() => {
      elapsedMs += intervalMs;
      const progress = Math.min(elapsedMs / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayHeight(upperReferenceCm * eased);
      setCalculationStep(Math.min(CALCULATION_STEPS.length - 1, Math.floor(progress * CALCULATION_STEPS.length)));

      if (progress >= 1) {
        clearInterval(timer);
        setSignupStage('free-result');
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [profile, setSignupStage, signupStage, upperReferenceCm]);

  if (!profile || !target) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Family reference unavailable</Text>
        <Text style={styles.body}>
          We need both biological parent heights to calculate this rough reference range.
        </Text>
        <ActionButton label="Continue to the app" onPress={() => setSignupStage(null)} />
      </View>
    );
  }

  if (signupStage === 'calculating') {
    return (
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>HEIGHTMAXXING</Text>
        <Text style={styles.title}>Preparing your family-height reference</Text>
        <Text style={styles.disclaimer}>
          This is a family-based reference, not a prediction of how much you will grow.
        </Text>
        <View style={styles.numberCard}>
          <Text style={styles.number}>{displayHeight.toFixed(1)} cm</Text>
          <Text style={styles.numberCaption}>Upper family reference (not your predicted height)</Text>
          <Text style={styles.currentHeight}>
            Your current height: {formatHeight(profile.currentHeightCm, unit)}
          </Text>
        </View>
        <View style={styles.steps}>
          {CALCULATION_STEPS.map((step, index) => (
            <Text key={step} style={[styles.step, index <= calculationStep && styles.stepActive]}>
              {index <= calculationStep ? '✓' : '○'}  {step}
            </Text>
          ))}
        </View>
      </View>
    );
  }

  if (signupStage === 'free-result') {
    return (
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>YOUR FREE RESULT</Text>
        <Text style={styles.title}>Your height estimates</Text>
        <View style={styles.estimateCard}>
          <Text style={styles.proEstimate}>
            Pro estimate: {formatHeight(Math.max(profile.currentHeightCm, target.upperReferenceCm), unit)}
          </Text>
          <Text style={styles.freeEstimate}>
            Free estimate: {formatHeight(
              (profile.currentHeightCm + Math.max(profile.currentHeightCm, target.upperReferenceCm)) / 2,
              unit
            )}
          </Text>
        </View>
        <Text style={styles.body}>
          Free shows the midpoint between your current height and the upper family reference. Pro
          shows that upper reference. These are rough planning estimates, not guaranteed outcomes.
        </Text>
        <HeightEstimateInfo />
        <Text style={styles.disclaimer}>
          Actual growth varies with many factors. Food and exercise can support health, but do not
          guarantee additional height. Pro does not cause extra height.
        </Text>
        <ActionButton label="See what Pro includes" onPress={() => setSignupStage('pro-offer')} />
        <TextButton label="Continue with free" onPress={() => setSignupStage(null)} />
      </View>
    );
  }

  if (signupStage === 'pro-offer') {
    return (
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>OPTIONAL UPGRADE</Text>
        <Text style={styles.title}>Build healthy routines with Pro</Text>
        <Text style={styles.body}>
          Pro unlocks the Meal & Sports section with nutrition and activity ideas. The higher number
          is a display of the upper family reference, not extra height caused by Pro.
        </Text>
        <View style={styles.benefitCard}>
          <Text style={styles.benefit}>✓  Meal and activity guidance</Text>
          <Text style={styles.benefit}>✓  Access to the Meal & Sports menu</Text>
          <Text style={styles.benefit}>✓  Upper family reference shown as the Pro estimate</Text>
        </View>
        <ActionButton label="View plans" onPress={() => setSignupStage('plans')} />
        <TextButton label="Skip and continue to the app" onPress={() => setSignupStage(null)} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>PRO PLANS</Text>
      <Text style={styles.title}>Meal & Sports guidance</Text>
      <Text style={styles.body}>
        These are planned prices only. Checkout is not connected in this app preview, so no payment
        can currently be taken.
      </Text>
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>One-time</Text>
        <Text style={styles.planPrice}>$200</Text>
        <Text style={styles.planCaption}>Payment setup coming soon</Text>
      </View>
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>Monthly</Text>
        <Text style={styles.planPrice}>$50 / month</Text>
        <Text style={styles.planCaption}>Payment setup coming soon</Text>
      </View>
      <ActionButton label="Continue to the app" onPress={() => setSignupStage(null)} />
      <TextButton label="Back" onPress={() => setSignupStage('pro-offer')} />
    </View>
  );
}

function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.textButton} onPress={onPress}>
      <Text style={styles.textLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: colors.bg,
  },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.5, color: colors.gold, marginBottom: 12 },
  title: { fontFamily: fonts.display, fontSize: 27, color: colors.text, marginBottom: 12 },
  body: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, lineHeight: 21, marginBottom: 14 },
  disclaimer: { fontFamily: fonts.body, fontSize: 12, color: colors.muted2, lineHeight: 18, marginBottom: 20 },
  numberCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: 24,
    marginVertical: 18,
  },
  number: { fontFamily: fonts.display, fontSize: 38, color: colors.gold },
  numberCaption: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 6 },
  currentHeight: { fontFamily: fonts.body, fontSize: 11, color: colors.muted2, marginTop: 12 },
  steps: { gap: 14, marginTop: 8 },
  step: { fontFamily: fonts.body, fontSize: 13, color: colors.muted2 },
  stepActive: { color: colors.text },
  estimateCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
    gap: 12,
    marginVertical: 12,
  },
  freeEstimate: { fontFamily: fonts.displaySemi, fontSize: 17, color: colors.green },
  proEstimate: { fontFamily: fonts.displaySemi, fontSize: 17, color: colors.gold },
  benefitCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
    gap: 12,
    marginVertical: 12,
  },
  benefit: { fontFamily: fonts.body, fontSize: 13, color: colors.text, lineHeight: 19 },
  planCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    padding: 16,
    marginVertical: 6,
  },
  planTitle: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text },
  planPrice: { fontFamily: fonts.display, fontSize: 20, color: colors.gold, marginTop: 5 },
  planCaption: { fontFamily: fonts.body, fontSize: 11, color: colors.muted2, marginTop: 4 },
  actionButton: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 14,
  },
  actionLabel: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.bg },
  textButton: { alignItems: 'center', padding: 14, marginTop: 4 },
  textLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.muted },
});
