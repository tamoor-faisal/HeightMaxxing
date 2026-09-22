import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import  { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { AppProvide, useApp } from './src/context/AppContext';
import { colors } from './src/theme';
import PaywallSheet from './src/components/PaywallSheet';

import HomeScreen from './src/screens/HomeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import MealSportsScreen from './src/screens/MealSportsScreen';
import TipScreen from './src/screens/TipScreen';
import AccountScreen from './src/screens/AccountScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function TabIcon({ label }: { label: string }) {
    // Swap these fro a real icon set (e.g @expo/vector-icons) when you move
    // past the prototype stage -- kept as plain text to avoid pulling
    // in an icon font just for this scaffold.
    return <Text style={{ fontSize: 11 }}>{label}</Text>;
}
}