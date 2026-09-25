import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';

const ITEMS = [
  { title: 'Breakfast', body: 'Protein + calcium focused plate to support your routine' },
  { title: 'Recommended sport', body: 'Swimming — full-body, low joint impact' },
  { title: 'Evening snack', body: 'Light, low-sugar, 2 hrs before sleep' },
];

// This screen only renders for pro users. The gating decision itself lives
// in the tab navigator (see App.tsx), which intercepts the tab press and
// opens the paywall instead of navigating here when isPro is false.
export default function MealSportsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.h1}>Meal & sports</Text>
        <Text style={styles.sub}>Nutrition and activity picks tuned to your plan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {ITEMS.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}
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
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 14, marginTop: 12 },
  cardTitle: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text, marginBottom: 4 },
  cardBody: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});
