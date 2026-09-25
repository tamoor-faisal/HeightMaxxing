import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';

const ACTIVITIES = [
  { title: 'Morning stretch flow', meta: '7 min · spine & hips', color: colors.blue, bg: colors.blueDim },
  { title: 'Posture reset', meta: '5 min · desk break', color: colors.green, bg: colors.greenDim },
  { title: 'Spinal decompression', meta: '10 min · evening', color: colors.gold, bg: colors.goldDim },
  { title: 'Sleep wind-down', meta: '12 min · before bed', color: colors.muted, bg: colors.surface3 },
];

export default function ActivitiesScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.h1}>Activities</Text>
        <Text style={styles.sub}>Posture, mobility & sleep routines</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {ACTIVITIES.map((a) => (
          <View key={a.title} style={styles.card}>
            <View style={[styles.icon, { backgroundColor: a.bg }]} />
            <View>
              <Text style={styles.cardTitle}>{a.title}</Text>
              <Text style={styles.cardMeta}>{a.meta}</Text>
            </View>
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
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 14, marginTop: 12 },
  icon: { width: 42, height: 42, borderRadius: 12, marginRight: 12 },
  cardTitle: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text, marginBottom: 2 },
  cardMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});
