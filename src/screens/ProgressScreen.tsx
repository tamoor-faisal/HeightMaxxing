import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { colors, fonts, radii } from '../theme';
import { useApp } from '../state/AppContext';
import { formatHeight } from '../utils/height';

export default function ProgressScreen() {
  const { unit, heights, log, addLogEntry } = useApp();
  const hasLog = log.length > 0;

  const w = 320;
  const h = 110;
  const pad = 6;

  let points: { x: number; y: number }[] = [];
  let delta = 0;
  if (hasLog) {
    const min = Math.min(...log.map((d) => d.cm)) - 0.6;
    const max = Math.max(...log.map((d) => d.cm)) + 0.6;
    const range = Math.max(max - min, 0.1); // guard against a single flat entry
    points = log.map((d, i) => {
      const x = log.length === 1 ? w / 2 : pad + (i / (log.length - 1)) * (w - pad * 2);
      const y = h - ((d.cm - min) / range) * (h - pad * 2) - pad + 10;
      return { x, y };
    });
    delta = log[log.length - 1].cm - log[0].cm;
  }

  const latestDisplay = hasLog ? log[log.length - 1].cm : heights.actual;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.h1}>Height progress</Text>
        <Text style={styles.sub}>Your logged height over time</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <Text style={styles.chartVal}>{formatHeight(latestDisplay, unit)}</Text>
            {hasLog && (
              <Text style={styles.chartDelta}>
                {delta >= 0 ? '+' : ''}
                {delta.toFixed(1)} cm this period
              </Text>
            )}
          </View>

          {hasLog ? (
            <Svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
              <Polyline
                points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={colors.blue}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <Circle key={i} cx={p.x} cy={p.y} r={3.4} fill={colors.bg} stroke={colors.blue} strokeWidth={2} />
              ))}
            </Svg>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyTxt}>No measurements logged yet — your first entry starts the chart.</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Log history</Text>
        {hasLog ? (
          <View>
            {[...log].reverse().map((entry, i) => (
              <View key={i} style={styles.logRow}>
                <Text style={styles.logVal}>{formatHeight(entry.cm, unit)}</Text>
                <Text style={styles.logDate}>{entry.date}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyTxt}>Nothing here yet.</Text>
        )}

        <Pressable
          style={styles.addBtn}
          onPress={() => addLogEntry(+(latestDisplay + 0.3).toFixed(1), 'New entry')}
        >
          <Text style={styles.addBtnTxt}>+ Log a new measurement</Text>
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
  chartCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: 16, marginTop: 6 },
  chartTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  chartVal: { fontFamily: fonts.display, fontSize: 20, color: colors.text },
  chartDelta: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.green },
  emptyChart: { height: 110, alignItems: 'center', justifyContent: 'center' },
  emptyTxt: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, textAlign: 'center', paddingVertical: 8 },
  sectionTitle: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text, marginTop: 20, marginBottom: 4 },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  logVal: { fontFamily: fonts.body, fontSize: 13, color: colors.text },
  logDate: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  addBtn: { marginTop: 14, padding: 13, borderRadius: radii.md, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center' },
  addBtnTxt: { fontFamily: fonts.bodySemi, fontSize: 13.5, color: colors.text },
});
