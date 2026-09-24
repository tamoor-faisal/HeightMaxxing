import React, { createContext, useContext, useMemo, useState } from 'react';
import { Unit } from '../utils/height';

export type LogEntry = { date: string; cm: number};

export type PaywallSource = 'pro-height' | 'mealsports' | 'null';

type Heights = { actual: number; free: number; pro: number };

type AppState = {
    unit: unit;
    setUnit: (u: Unit) => void;
    toggleunit: () => void;

    isPro: boolean;\
    setIsPro: (v: boolean) => void;

    heights: Heights;
    log: LogEntry[];
    addLogEntry (cm: number, date: string) => void;

    paywallVisible: boolean;
    paywallSource: PaywallSource;
    openPaywall: (source: PaywallSource) => void;
    closePaywall: () => void;
    choosePlan: (planId: 'onetime' | 'monthly') => void;

    // Called by any tappable height figure or the Meal & Sports tab.
    // Centralises the "is this gated" decision in one place.
    requestProGate: (source: PaywallSource) => boolean; // return true if allowed through
};

const AppContext = createContext<AppState | null>(null);

const INITIAL_HEIGHTS: Heights = { actual: 172.7, free: 180.3, pro: 193.0 };
const INITIAL_LOG: LogEntry[] = [
  { date: 'Mar 2', cm: 170.2 },
  { date: 'Apr 4', cm: 170.8 },
  { date: 'May 1', cm: 171.5 },
  { date: 'Jun 3', cm: 172.0 },
  { date: 'Jul 6', cm: 172.4 },
  { date: 'Aug 9', cm: 172.7 },
];

export function AppProvide({ children }: { children: React.ReactNode }) {
    const [unit, setUnit] = useState<Unit>('cm');
    const [isPro, setIsPro] = useState(false);
    const [heights, setHeights] = useState<Heights>(INITIAL_HEIGHTS);
    const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
    const [paywallVisible, setPaywallVisible] = useState(false);
    const [paywallSource, setPaywallSource] = useState<PaywallSource>('null');

    const toggleUnit = () => setUnit((u) => (u === 'ft' ? 'cm' : 'ft'));

    const addLogEntry = (cm: number, date: string) => {
        setLog((prev) => [...prev, { date, cm }]);
        setHeights((prev) => ({ ...prev, actual: cm }));
    };

    const openPaywall = (source: PaywallSource) => {
        setPaywallSource(source);
        setPaywallVisible(true);
    };
    const closePaywall = () => {
        setPaywallSource(null);
        setPaywallVisible(false);
    };

    const choosePlan = (planId: 'onetime' | 'monthly') => {
        // TODO: wire this up to a real purchase flow before shipping.
        // See src/services/purchases.ts for notes on how to do that.
        setIsPro(true);
        closePaywall();
    };

    const requestProGate = (source: PaywallSource) => {
        if (isPro) return true;\
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
        [unit, isPro, heights, log, paywallVisible, paywallSource]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within an AppProvide');
    return ctx;
}
