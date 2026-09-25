import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { AppProvider, useApp } from './src/state/AppContext';
import { colors } from './src/theme';
import PaywallSheet from './src/components/PaywallSheet';

import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import MealSportsScreen from './src/screens/MealSportsScreen';
import TipScreen from './src/screens/TipScreen';
import AccountScreen from './src/screens/AccountScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function TabIcon({ label }: { label: string }) {
  // Swap these for a real icon set (e.g. @expo/vector-icons) when you move
  // past the prototype stage -- kept as plain text here to avoid pulling
  // in an icon font just for this scaffold.
  return <Text style={{ fontSize: 11 }}>{label}</Text>;
}

function Navigator() {
  const { isPro, isOnboarded, requestProGate } = useApp();

  if (!isOnboarded) {
    // No account/profile yet — show sign-up instead of the tab navigator.
    // Still wrapped in NavigationContainer so styling/theme stays
    // consistent if you later add more pre-auth screens (login, forgot
    // password, etc.) via a stack navigator here.
    return (
      <NavigationContainer>
        <SignUpScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.gold,
          background: colors.bg,
          card: colors.bg,
          text: colors.text,
          border: colors.border,
          notification: colors.gold,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.muted2,
          tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.border },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <TabIcon label="🏠" /> }} />
        <Tab.Screen
          name="Activities"
          component={ActivitiesScreen}
          options={{ tabBarIcon: () => <TabIcon label="🏃" /> }}
        />
        <Tab.Screen
          name="Meal"
          component={MealSportsScreen}
          options={{ tabBarIcon: () => <TabIcon label="🍽" /> }}
          listeners={{
            tabPress: (e) => {
              // Intercept the tab press itself -- same pattern as the
              // prototype's tapMealSports(). If the user isn't pro, this
              // opens the paywall instead of navigating to the screen.
              if (!isPro) {
                e.preventDefault();
                requestProGate('mealsports');
              }
            },
          }}
        />
        <Tab.Screen name="Tip" component={TipScreen} options={{ tabBarIcon: () => <TabIcon label="✨" /> }} />
        <Tab.Screen name="Account" component={AccountScreen} options={{ tabBarIcon: () => <TabIcon label="👤" /> }} />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{ tabBarButton: () => null }} // reachable via navigation.navigate, not shown as a tab
        />
      </Tab.Navigator>
      <PaywallSheet />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <AppProvider>
        <Navigator />
      </AppProvider>
    </View>
  );
}
