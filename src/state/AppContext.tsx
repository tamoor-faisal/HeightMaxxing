import React, { createContext, useContext, useMemo, useState } from 'react';
import { Unit } from '../utils/height';
import {
  FamilyHeightReference,
  UserProfile,
  estimateFamilyHeightReference,
} from '../utils/heightEstimate';
import {
  AuthUser,
  getProfile,
  saveProfile as saveProfileService,
  signIn as signInService,
  signUp as signUpService,
} from '../services/auth';
import { getHeightLogs, insertHeightLog } from '../services/db';

export type LogEntry = { date: string; cm: number };
export type PaywallSource = 'mealsports' | null;

type Heights = {
  actual: number;
  freeEstimate: number | null;
  proEstimate: number | null;
  familyTarget: FamilyHeightReference | null;
};
export type SignupStage = 'calculating' | 'free-result' | 'pro-offer' | 'plans';

type AppState = {
  unit: Unit;
  setUnit: (u: Unit) => void;
  toggleUnit: () => void;

  isPro: boolean;
  setIsPro: (v: boolean) => void;

  // Auth / profile
  user: AuthUser | null;
  profile: UserProfile | null;
  isOnboarded: boolean;
  completeSignUp: (email: string, password: string, profile: UserProfile) => Promise<void>;
  completeProfile: (profile: UserProfile) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signupStage: SignupStage | null;
  setSignupStage: (stage: SignupStage | null) => void;

  heights: Heights;
  log: LogEntry[];
  addLogEntry: (cm: number, date: string) => void;

  paywallVisible: boolean;
  paywallSource: PaywallSource;
  openPaywall: (source: PaywallSource) => void;
  closePaywall: () => void;
  requestProGate: (source: PaywallSource) => boolean;
};

const AppContext = createContext<AppState | null>(null);

const EMPTY_HEIGHTS: Heights = { actual: 0, freeEstimate: null, proEstimate: null, familyTarget: null };

function formatLogDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<Unit>('ft');
  const [isPro, setIsPro] = useState(false);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [heights, setHeights] = useState<Heights>(EMPTY_HEIGHTS);
  const [signupStage, setSignupStage] = useState<SignupStage | null>(null);

  // Starts empty — the ring's "current" figure comes from the profile the
  // user enters at sign-up; the log is a separate history they build up
  // over time by tapping "Log a new measurement". On sign-in, both get
  // populated from Supabase instead (see signIn below).
  const [log, setLog] = useState<LogEntry[]>([]);

  const [paywallVisible, setPaywallVisible] = useState(false);
  const [paywallSource, setPaywallSource] = useState<PaywallSource>(null);

  const toggleUnit = () => setUnit((u) => (u === 'ft' ? 'cm' : 'ft'));

  const makeHeights = (actual: number, familyTarget: FamilyHeightReference | null): Heights => {
    if (!familyTarget) {
      return { actual, freeEstimate: null, proEstimate: null, familyTarget };
    }

    const proEstimate = Math.max(actual, familyTarget.upperReferenceCm);
    const freeEstimate = (actual + proEstimate) / 2;
    return { actual, freeEstimate, proEstimate, familyTarget };
  };

  const completeSignUp = async (email: string, password: string, newProfile: UserProfile) => {
    const result = await signUpService(email, password, newProfile);
    setUser(result.user);
    setProfile(result.profile);
    setHeights(makeHeights(result.profile.currentHeightCm, estimateFamilyHeightReference(result.profile)));
    setSignupStage('calculating');
    // Intentionally NOT auto-adding a log entry here — log starts empty
    // and only grows when the user explicitly logs a measurement.
  };

  const completeProfile = async (newProfile: UserProfile) => {
    if (!user) throw new Error('Sign in before completing your profile.');
    await saveProfileService(user.id, newProfile);
    setProfile(newProfile);
    const actual = heights.actual || newProfile.currentHeightCm;
    setHeights(makeHeights(actual, estimateFamilyHeightReference(newProfile)));
  };

  const signIn = async (email: string, password: string) => {
    const signedInUser = await signInService(email, password);
    const signedInProfile = await getProfile(signedInUser.id);
    setUser(signedInUser);

    if (!signedInProfile) {
      setProfile(null);
      setHeights(EMPTY_HEIGHTS);
      setLog([]);
      return;
    }

    setProfile(signedInProfile);

    // Pull existing log history back from the database so a returning
    // user sees their real history, not an empty chart.
    const dbLogs = await getHeightLogs(signedInUser.id);
    const formattedLogs: LogEntry[] = dbLogs.map((entry) => ({
      cm: entry.cm,
      date: formatLogDate(entry.loggedAt),
    }));
    setLog(formattedLogs);

    const actual =
      formattedLogs.length > 0 ? formattedLogs[formattedLogs.length - 1].cm : signedInProfile.currentHeightCm;
    setHeights(makeHeights(actual, estimateFamilyHeightReference(signedInProfile)));
  };

  const addLogEntry = (cm: number, date: string) => {
    setLog((prev) => [...prev, { date, cm }]);
    setHeights((prev) => {
      const proEstimate = prev.familyTarget
        ? Math.max(cm, prev.familyTarget.upperReferenceCm)
        : null;
      return {
        ...prev,
        actual: cm,
        freeEstimate: proEstimate == null ? null : (cm + proEstimate) / 2,
        proEstimate,
      };
    });

    // Write-through to the database. Updates the UI immediately (above)
    // rather than waiting on the network — if this fails, the entry still
    // shows locally for this session, but won't have persisted. Good
    // enough for now; a production version would want retry/error UI.
    if (user) {
      insertHeightLog(user.id, cm).catch((err) => {
        console.warn('[AppContext] Failed to save height log to database:', err);
      });
    }
  };

  const openPaywall = (source: PaywallSource) => {
    setPaywallSource(source);
    setPaywallVisible(true);
  };
  const closePaywall = () => {
    setPaywallVisible(false);
    setPaywallSource(null);
  };

  const requestProGate = (source: PaywallSource) => {
    if (isPro) return true;
    openPaywall(source);
    return false;
  };

  const value = useMemo(
    () => ({
      unit,
      setUnit,
      toggleUnit,
      isPro,
      setIsPro,
      user,
      profile,
      isOnboarded: Boolean(
        profile && profile.motherHeightCm != null && profile.fatherHeightCm != null
      ),
      completeSignUp,
      completeProfile,
      signIn,
      signupStage,
      setSignupStage,
      heights,
      log,
      addLogEntry,
      paywallVisible,
      paywallSource,
      openPaywall,
      closePaywall,
      requestProGate,
    }),
    [
      unit,
      isPro,
      user,
      profile,
      heights,
      log,
      paywallVisible,
      paywallSource,
      completeProfile,
      signupStage,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}