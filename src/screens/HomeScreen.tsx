import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, radii } from '../theme';
import { useApp } from '../state/AppContext';
import { formatHeight } from '../utils/height';
import HeightRing from '../components/HeightRing';
import HeightEstimateInfo from '../components/HeightEstimateInfo';

const TIP_PREVIEW =
  "A short posture reset every couple of hours can ease the compression that builds up in your spine from sitting.";

export default function HomeScreen() {
  const { unit, toggleUnit, heights } = useApp();
  const navigation = useNavigation<any>();

  const onTapHeight = () => {
    navigation.navigate('Progress');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topbar}>
        <View style={styles.unitToggle}>
          <Pressable onPress={unit === 'cm' ? toggleUnit : undefined}>
            <Text style={[styles.unitOption, unit === 'ft' && styles.unitOptionOn]}>ft</Text>
          </Pressable>
          <Pressable onPress={unit === 'ft' ? toggleUnit : undefined}>
            <Text style={[styles.unitOption, unit === 'cm' && styles.unitOptionOn]}>cm</Text>
          </Pressable>
        </View>
        <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('Account')}>
          <Text style={{ color: colors.muted }}>👤</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.ringWrap}>
          <HeightRing
            actualCm={heights.actual}
            freeCm={heights.freeEstimate ?? heights.actual}
            proCm={heights.proEstimate ?? heights.actual}
          />
          <View style={styles.ringCenter} pointerEvents="box-none">
            <Pressable onPress={onTapHeight} style={styles.figure}>
              <Text style={[styles.hNum, { fontSize: 20, color: colors.gold }]}>
                {heights.proEstimate != null ? formatHeight(heights.proEstimate, unit) : '—'}
              </Text>
              <Text style={[styles.hLabel, styles.proLabel]}>Pro estimate</Text>
            </Pressable>
            <Pressable onPress={onTapHeight} style={styles.figure}>
              <Text style={[styles.hNum, { fontSize: 20, color: colors.green }]}>
                {heights.freeEstimate != null ? formatHeight(heights.freeEstimate, unit) : '—'}
              </Text>
              <Text style={[styles.hLabel, styles.freeLabel]}>Free estimate</Text>
            </Pressable>
            <Pressable onPress={onTapHeight} style={styles.figure}>
              <Text style={[styles.hNum, { fontSize: 15, color: colors.blue }]}>
                {formatHeight(heights.actual, unit)}
              </Text>
              <Text style={styles.hLabel}>Current height</Text>
            </Pressable>
          </View>
        </View>

        <HeightEstimateInfo />

        <View style={styles.legend}>
          <LegendItem color={colors.blue} label="Current" />
          <LegendItem color={colors.gold} label="Pro estimate" />
          <LegendItem color={colors.green} label="Free estimate" />
        </View>

        <Pressable style={styles.tipCard} onPress={() => navigation.navigate('Tip')}>
          <View style={styles.tipIcon}>
            <Text>✨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Today's tip</Text>
            <Text style={styles.tipBody} numberOfLines={2}>
              {TIP_PREVIEW}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendTxt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  unitToggle: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, padding: 3, gap: 2 },
  unitOption: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12.5, fontFamily: fonts.bodySemi, color: colors.muted, borderRadius: radii.pill, overflow: 'hidden' },
  unitOptionOn: { backgroundColor: colors.surface3, color: colors.text },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', paddingTop: 10 },
  ringWrap: { width: 266, height: 266, marginTop: 6, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  figure: { alignItems: 'center', marginVertical: 1 },
  hNum: { fontFamily: fonts.display },
  hLabel: { fontFamily: fonts.body, fontSize: 10.5, color: colors.muted2, marginTop: 1 },
  freeLabel: { color: colors.green },
  proLabel: { color: colors.gold },
  legend: { flexDirection: 'row', gap: 16, marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendTxt: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted },
  tipCard: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: 14, marginHorizontal: 20, marginTop: 18, alignSelf: 'stretch' },
  tipIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.surface3, alignItems: 'center', justifyContent: 'center' },
  tipTitle: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.text, marginBottom: 2 },
  tipBody: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});
