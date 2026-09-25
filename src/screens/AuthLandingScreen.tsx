import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';

type Props = {
  onSignUp: () => void;
  onSignIn: () => void;
};

export default function AuthLandingScreen({ onSignUp, onSignIn }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.logo}>HEIGHTMAXXING</Text>
        <Text style={styles.title}>Reach your potential.</Text>
        <Text style={styles.subtitle}>
          Create an account to get your personalized height estimate and track your progress.
        </Text>

        <Pressable style={styles.primaryButton} onPress={onSignUp}>
          <Text style={styles.primaryText}>Sign up</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onSignIn}>
          <Text style={styles.secondaryText}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center' },
  content: { padding: 24 },
  logo: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.gold,
    marginBottom: 18,
  },
  title: { fontFamily: fonts.display, fontSize: 32, color: colors.text, marginBottom: 10 },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.bg },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.text },
});
