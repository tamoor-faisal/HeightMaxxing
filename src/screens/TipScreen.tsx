import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';

const TIPS = [
  "A short posture reset every couple of hours can ease the compression that builds up in your spine from sitting.",
  "Consistent sleep timing matters more than total hours alone for how rested and recovered you feel.",
  "Standing tall isn't just about looks — an aligned spine gives your lungs more room to work with.",
  "Overhead stretches after a long day can help release tension that pulls your shoulders forward.",
  "Hydration affects the discs between your vertebrae, which is part of why height can look slightly different morning vs. night.",
];

// NOTE: these are static placeholder tips. If you want this to actually be
// AI-generated per user, you'd call the Anthropic API (or another LLM
// provider) from a backend you control, cache a tip per day, and serve it
// here -- doing it client-side would expose your API key.
export default function TipScreen() {
  const [index, setIndex] = useState(0);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.h1}>Daily tip</Text>
        <Text style={styles.sub}>A new one every day</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.date}>Today</Text>
          <Text style={styles.body}>{TIPS[index]}</Text>
        </View>
        <Pressable style={styles.btn} onPress={() => setIndex((i) => (i + 1) % TIPS.length)}>
          <Text style={styles.btnTxt}>Show another tip</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  h1: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  sub: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 4 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: 16, marginTop: 6 },
  date: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.muted, marginBottom: 6 },
  body: { fontFamily: fonts.body, fontSize: 15, color: colors.text, lineHeight: 22 },
  btn: { marginTop: 14, padding: 13, borderRadius: radii.md, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center' },
  btnTxt: { fontFamily: fonts.bodySemi, fontSize: 13.5, color: colors.text },
});
