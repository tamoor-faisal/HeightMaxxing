import React from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { useApp } from '../state/AppContext';

export default function AccountScreen() {
  const { isPro, setIsPro } = useApp();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.h1}>Account</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>JT</Text>
          </View>
          <View>
            <Text style={styles.name}>Jordan T.</Text>
            <View style={[styles.badge, isPro ? styles.badgePro : styles.badgeFree]}>
              <Text style={[styles.badgeTxt, { color: isPro ? colors.gold : colors.muted }]}>
                {isPro ? 'Pro member' : 'Free plan'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsBlock}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch value={true} trackColor={{ true: colors.green, false: colors.surface3 }} />
          </View>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.settingLabel}>Manage subscription</Text>
            <Text style={{ color: colors.muted }}>›</Text>
          </View>
        </View>

        <View style={styles.demoBlock}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Preview Pro (prototype only)</Text>
            <Switch
              value={isPro}
              onValueChange={setIsPro}
              trackColor={{ true: colors.green, false: colors.surface3 }}
            />
          </View>
          <Text style={styles.note}>
            This switch is only here so you can preview both the free and pro experience while
            building. In the shipped app, replace it with a real purchase flow (see
            src/services/purchases.ts) and remove this toggle entirely.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  h1: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: 16, marginTop: 6 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.blueDim, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarTxt: { fontFamily: fonts.display, color: colors.text },
  name: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
  badge: { alignSelf: 'flex-start', borderRadius: radii.pill, paddingHorizontal: 9, paddingVertical: 3, marginTop: 4 },
  badgeFree: { backgroundColor: colors.surface3 },
  badgePro: { backgroundColor: colors.goldDim },
  badgeTxt: { fontFamily: fonts.bodyBold, fontSize: 11 },
  settingsBlock: { marginTop: 18 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingLabel: { fontFamily: fonts.body, fontSize: 13.5, color: colors.text },
  demoBlock: { marginTop: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: 14 },
  note: { fontFamily: fonts.body, fontSize: 11, color: colors.muted2, marginTop: 8, lineHeight: 16 },
});
