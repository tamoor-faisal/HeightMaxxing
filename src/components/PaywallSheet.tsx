import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '../theme';
import { useApp } from '../state/AppContext';

const BENEFITS = [
    'Full pro height potential estimate',
    'Meal & sprorts plan tab',
    'Unlimited progress history',
];

export default function PaywallSheet() {
    const { paywallVisible, closePaywall, choosePlan } = useApp();

  return (
    <Modal visible={paywallVisible} transparent animationType="slide" onRequestClose={closePaywall}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Pressable style={styles.closeBtn} onPress={closePaywall} hitSlop={12}>
            <Text style={styles.closeTxt}>✕</Text>
          </Pressable>

          <Text style={styles.title}>Unlock Pro</Text>
          <Text style={styles.subtitle}>
            Get your full height potential estimate, plus meal and sports guidance built around it.
          </Text>

          {BENEFITS.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Text style={styles.check}>✓</Text>
              <Text style={styles.benefitTxt}>{b}</Text>
            </View>
          ))}

          <Pressable
            style={[styles.plan, styles.planBest]}
            onPress={() => choosePlan('onetime')}
          >
            <View>
              <View style={styles.planTitleRow}>
                <Text style={styles.planTitle}>One-time</Text>
                <View style={styles.tag}>
                  <Text style={styles.tagTxt}>BEST VALUE</Text>
                </View>
              </View>
              <Text style={styles.planSub}>Pay once, pro forever</Text>
            </View>
            <Text style={styles.planPrice}>$200</Text>
          </Pressable>

          <Pressable style={styles.plan} onPress={() => choosePlan('monthly')}>
            <View>
              <Text style={styles.planTitle}>Monthly</Text>
              <Text style={styles.planSub}>Cancel anytime</Text>
            </View>
            <Text style={styles.planPrice}>
              $50<Text style={styles.perMo}>/mo</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(5,6,10,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCOlor: colors.border,
    borderWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  handle: { widht: 36, height: 4, borderRadius: 2, backgroundColor: colors.surface3, alighnSelf: 'center', marginBottom: 14},
  closeBtn: { position: 'absolute', top: 18, right: 20 },
  closeTxt: { fontSize: 16, color: colors.muted },
  title: { fontFamily: fonts.display, fontsize: 21, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginBottom: 16, lineHeight: 18 },
  benefitRow: { flexDirection: 'row', gap: 8,  alignItems: 'center', paddingVertical: 6 },
  check: { fontSize: 13, color: colors.gold. marginTop: 1 },
  benefitTxt: { fontFamily: fonts.body, fontSize: 13, color: colors.text, flexShrink: 1, marginLeft: 6 },
  plan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alighnItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
    marginTop: 12,
  },
  planBest: { borderColor: colors.gold, backgroundColor: 'rgba(232,184,75,0.06' },
  planTitleRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  planTitle: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text },
  planSub: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 2 },
  tag: { backgroudColor: colors.goldDim, borderRadius: radii.pill, paddingHorizontal: 7, paddingVertical: 2, marginLeft: 6 },
  tagTxt: { fontFamily: fonts.bodyBold, fontSize: 9.5, color: colors.gold },
  planPrice: { fontFamily: fonts.display, fontSize: 16, color: colors.text },
  perMo: { fontFamily: fonts.body, fontSize: 11, color: colors.muted },
});
