import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { useApp } from '../state/AppContext';

export default function SignInScreen({ onBack }: { onBack: () => void }) {
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      const message = e instanceof Error ? e.message.toLowerCase() : '';
      setError(
        message.includes('email not confirmed')
          ? 'Please confirm your email address using the link Supabase sent you, then sign in again.'
          : message.includes('mother_height_cm') || message.includes('father_height_cm')
            ? 'The Supabase database needs the latest profile fields. Run the updated supabase/schema.sql script, then try again.'
            : 'We could not sign you in. Check your email and password and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue where you left off.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={colors.muted2}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Your password"
          placeholderTextColor={colors.muted2}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable
          style={[styles.submitButton, submitting && styles.disabled]}
          onPress={onSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>{submitting ? 'Signing in…' : 'Sign in'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingTop: 52 },
  backButton: { marginBottom: 28 },
  backText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.muted },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text, marginBottom: 8 },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginBottom: 28 },
  label: { fontFamily: fonts.bodySemi, fontSize: 12.5, color: colors.text, marginBottom: 6, marginTop: 14 },
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
  error: { fontFamily: fonts.body, fontSize: 12.5, color: colors.danger, marginTop: 16 },
  submitButton: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  disabled: { opacity: 0.5 },
  submitText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.bg },
});
