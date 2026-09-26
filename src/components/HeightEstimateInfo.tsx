import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';

export default function HeightEstimateInfo() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="More information about height estimates"
        onPress={() => setVisible(true)}
        style={styles.infoButton}
        hitSlop={8}
      >
        <Text style={styles.infoIcon}>i</Text>
        <Text style={styles.infoLabel}>About these estimates</Text>
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>About these height estimates</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close information"
                onPress={() => setVisible(false)}
                hitSlop={12}
              >
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.scroll}>
              <Text style={styles.body}>
                These numbers use a conventional mid-parental-height calculation: the reported
                biological parents’ heights are averaged, with a 13 cm adjustment for the selected
                male or female reference, then divided by two. “Other / prefer not to say” uses the
                unadjusted parental average.
              </Text>
              <Text style={styles.body}>
                This is a rough family-height reference—not a personalized prediction, a clinical
                assessment, or the maximum height you can achieve. It does not use your current
                height, age, weight, growth history, puberty timing, health conditions, or
                environment to predict future growth. Reported parent heights may also be
                inaccurate.
              </Text>
              <Text style={styles.body}>
                For display, the app adds an illustrative 8.5 cm above the parent-based midpoint to
                form an upper reference. That extra amount is not a validated prediction interval
                or a medically established maximum. Free is halfway between your current height and
                this upper reference; Pro displays the upper reference.
              </Text>
              <Text style={styles.body}>
                Paying for Pro does not change your biology. Nutrition and exercise can support
                health, but cannot guarantee extra height. There is no fixed “20%” nutrition or
                sports bonus that can be reliably applied to an individual. Growth depends on
                genetics and many other factors. A clinician would assess growth using accurate,
                repeated measurements and appropriate growth charts.
              </Text>
              <Text style={styles.source}>
                Background: American Academy of Family Physicians, “Evaluation of Short and Tall
                Stature in Children” (2008). This app’s display is informational and is not medical
                advice.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  infoButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 7, padding: 8 },
  infoIcon: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.muted,
    color: colors.muted,
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  infoLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.muted },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: 'rgba(5,6,10,0.72)',
  },
  dialog: {
    maxHeight: '82%',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    padding: 20,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  title: { flex: 1, fontFamily: fonts.display, fontSize: 20, color: colors.text, marginBottom: 12 },
  close: { fontFamily: fonts.body, fontSize: 17, color: colors.muted, padding: 2 },
  scroll: { flexGrow: 0 },
  body: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, lineHeight: 20, marginBottom: 14 },
  source: { fontFamily: fonts.body, fontSize: 11, color: colors.muted2, lineHeight: 17 },
});
