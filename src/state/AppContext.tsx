import React, { createContext, useContext, useMemo, useState } from 'react';
import { Unit } from '../utils/height';
import { UserProfile, estimateHeights } from '../utils/heightEstimate';
import { AuthUser, signUp as signUpService } from '../services/auth';
import { insertHeightLog } from '../services/db';

export type LogEntry = { date: string; cm: number };
export type PaywallSource = 'pro-height' | 'mealsports' | null;

type Heights = { actual: number; free: number; pro: number };

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

  heights: Heights;
  log: LogEntry[];
  addLogEntry: (cm: number, date: string) => void;

  paywallVisible: boolean;
  paywallSource: PaywallSource;
  openPaywall: (source: PaywallSource) => void;
  closePaywall: () => void;
  choosePlan: (plan: 'onetime' | 'monthly') => void;

  requestProGate: (source: PaywallSource) => boolean;
};

const AppContext = createContext<AppState | null>(null);

const EMPTY_HEIGHTS: Heights = { actual: 0, free: 0, pro: 0 };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<Unit>('ft');
  const [isPro, setIsPro] = useState(false);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [heights, setHeights] = useState<Heights>(EMPTY_HEIGHTS);

  // Starts empty — the ring's "current" figure comes from the profile the
  // user enters at sign-up; the log is a separate history they build up
  // over time by tapping "Log a new measurement".
  const [log, setLog] = useState<LogEntry[]>([]);

  const [paywallVisible, setPaywallVisible] = useState(false);
  const [paywallSource, setPaywallSource] = useState<PaywallSource>(null);

  const toggleUnit = () => setUnit((u) => (u === 'ft' ? 'cm' : 'ft'));

  const completeSignUp = async (email: string, password: string, newProfile: UserProfile) => {
    const result = await signUpService(email, password, newProfile);
    setUser(result.user);
    setProfile(result.profile);
    const estimates = estimateHeights(result.profile);
    setHeights({ actual: result.profile.currentHeightCm, ...estimates });
    // Intentionally NOT auto-adding a log entry here — log starts empty
    // and only grows when the user explicitly logs a measurement.
  };

   const addLogEntry = (cm: number, date: string) => {
    setLog((prev) => [...prev, { date, cm }]);
    setHeights((prev) => ({ ...prev, actual: cm }));

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

  const choosePlan = (_plan: 'onetime' | 'monthly') => {
    // TODO: wire this up to a real purchase flow before shipping.
    // See src/services/purchases.ts for integration notes.
    setIsPro(true);
    closePaywall();
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
      isOnboarded: !!profile,
      completeSignUp,
      heights,
      log,
      addLogEntry,
      paywallVisible,
      paywallSource,
      openPaywall,
      closePaywall,
      choosePlan,
      requestProGate,
    }),
    [unit, isPro, user, profile, heights, log, paywallVisible, paywallSource]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
