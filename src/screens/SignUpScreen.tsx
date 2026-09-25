import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { useApp } from '../state/AppContext';
import { Gender } from '../utils/heightEstimate';

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'other', label: 'Other / prefer not to say' },
];

// TODO before shipping: real age-gate + parental consent flow.
// If ageYears entered is below the COPPA (13, US) / GDPR-K (16, EU/UK)
// threshold for your target markets, you cannot proceed with a normal
// signup — you need a parental-consent flow before collecting any profile
// data, and both app stores will check for this if the app could
// plausibly appeal to minors. This screen currently does NOT enforce
// that; it's flagged here so it doesn't get missed.
const MIN_AGE_WITHOUT_PARENTAL_CONSENT = 13;

export default function SignUpScreen({ onBack }: { onBack: () => void }) {
  const { completeSignUp } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [ethnicity, setEthnicity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim() && password.trim() && heightCm && age && gender && !submitting;

  const onSubmit = async () => {
    setError(null);
    const ageNum = parseInt(age, 10);
    const heightNum = parseFloat(heightCm);

    if (Number.isNaN(ageNum) || Number.isNaN(heightNum) || !gender) {
      setError('Please fill in height, age, and gender.');
      return;
    }
    if (ageNum < MIN_AGE_WITHOUT_PARENTAL_CONSENT) {
      // See TODO above — this just blocks for now rather than actually
      // routing to a parental-consent flow, which doesn't exist yet.
      setError(
        `Sign-up for under-${MIN_AGE_WITHOUT_PARENTAL_CONSENT}s needs a parental consent flow that isn't built yet.`
      );
      return;
    }

    setSubmitting(true);
    try {
      await completeSignUp(email.trim(), password, {
        currentHeightCm: heightNum,
        ageYears: ageNum,
        gender,
        ethnicity: ethnicity.trim() ? ethnicity.trim() : undefined,
      });
    } catch (e) {
      setError(getSignUpErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          We use this to estimate your height potential. Everything except ethnicity is required.
        </Text>

        <Field label="Email">
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.muted2}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </Field>

        <Field label="Password">
          <TextInput
            style={styles.input}
            placeholder="At least 8 characters"
            placeholderTextColor={colors.muted2}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Field>

        <Field label="Current height (cm)">
          <TextInput
            style={styles.input}
            placeholder="e.g. 172.7"
            placeholderTextColor={colors.muted2}
            keyboardType="decimal-pad"
            value={heightCm}
            onChangeText={setHeightCm}
          />
        </Field>

        <Field label="Age">
          <TextInput
            style={styles.input}
            placeholder="e.g. 16"
            placeholderTextColor={colors.muted2}
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
          />
        </Field>

        <Field label="Gender">
          <View style={styles.chipRow}>
            {GENDERS.map((g) => (
              <Pressable
                key={g.id}
                style={[styles.chip, gender === g.id && styles.chipOn]}
                onPress={() => setGender(g.id)}
              >
                <Text style={[styles.chipTxt, gender === g.id && styles.chipTxtOn]}>{g.label}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="Ethnicity (optional)">
          <TextInput
            style={styles.input}
            placeholder="Prefer not to say"
            placeholderTextColor={colors.muted2}
            value={ethnicity}
            onChangeText={setEthnicity}
          />
          <Text style={styles.helpTxt}>
            Only used to refine your estimate if you choose to share it. See our privacy policy for
            how this is stored and used.
          </Text>
        </Field>

        {error && <Text style={styles.errorTxt}>{error}</Text>}

        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={onSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitTxt}>{submitting ? 'Creating account…' : 'Create account'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function getSignUpErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  const normalized = message.toLowerCase();

  if (normalized.includes('user already registered')) {
    return 'An account with this email already exists. Please use Sign in instead.';
  }
  if (normalized.includes('password')) {
    return 'Your password must be at least 6 characters long.';
  }
  if (normalized.includes('profile could not be saved')) {
    return 'Your account was created, but its profile could not be saved. Check the profiles table permissions in Supabase.';
  }
  if (normalized.includes('invalid api key') || normalized.includes('network')) {
    return 'The app cannot connect to its account service. Check the Supabase URL and publishable key.';
  }

  return message || 'We could not create your account. Check your details and try again.';
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingTop: 40, paddingBottom: 60 },
  backButton: { marginBottom: 22 },
  backText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.muted },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text, marginBottom: 6 },
  subtitle: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginBottom: 24, lineHeight: 18 },
  field: { marginBottom: 16 },
  label: { fontFamily: fonts.bodySemi, fontSize: 12.5, color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  helpTxt: { fontFamily: fonts.body, fontSize: 11, color: colors.muted2, marginTop: 6, lineHeight: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOn: { backgroundColor: colors.surface3, borderColor: colors.gold },
  chipTxt: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
  chipTxtOn: { color: colors.text },
  errorTxt: { fontFamily: fonts.body, fontSize: 12.5, color: colors.danger, marginBottom: 12 },
  submitBtn: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitTxt: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.bg },
});
