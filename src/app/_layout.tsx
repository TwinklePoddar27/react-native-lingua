import "../../global.css";

import { useEffect, useRef, useState } from "react";
import * as Font from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { View, ActivityIndicator, Text } from "react-native";
import { ClerkProvider, ClerkLoaded, useAuth, tokenCache, IS_MOCK_AUTH } from "@/lib/clerk";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { designTokens } from "@/theme";
import { useLanguageStore } from "@/store/languageStore";
import { languages } from "@/data/languages";
import { posthog } from "@/lib/posthog";

void SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

if (!publishableKey && !IS_MOCK_AUTH) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function InitialLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { selectedLanguageId, _hasHydrated } = useLanguageStore();
  const phClient = usePostHog();
  const lastIdentifiedRef = useRef<{ userId: string; languageId: string | null } | null>(null);

  useEffect(() => {
    if (!isLoaded || !_hasHydrated || !phClient) return;

    if (isSignedIn && userId) {
      if (
        lastIdentifiedRef.current?.userId !== userId ||
        lastIdentifiedRef.current?.languageId !== selectedLanguageId
      ) {
        const runIdentify = async () => {
          try {
            const isSignUp = await AsyncStorage.getItem("just_signed_up");
            const preferredLanguage = selectedLanguageId
              ? languages.find((l) => l.id === selectedLanguageId)?.name || null
              : null;

            if (isSignUp === "true") {
              phClient.identify(userId, {
                $set: { preferred_language: preferredLanguage },
                $set_once: { signup_date: new Date().toISOString() }
              });
              await AsyncStorage.removeItem("just_signed_up");
            } else {
              phClient.identify(userId, {
                $set: { preferred_language: preferredLanguage }
              });
            }
            lastIdentifiedRef.current = { userId, languageId: selectedLanguageId };
          } catch (err) {
            console.error("Error identifying user in PostHog:", err);
          }
        };

        void runIdentify();
      }
    } else {
      lastIdentifiedRef.current = null;
    }
  }, [isSignedIn, userId, isLoaded, _hasHydrated, selectedLanguageId, phClient]);

  useEffect(() => {
    if (!isLoaded || !_hasHydrated) return;

    const inAuthGroup = segments[0] === "signin" || segments[0] === "signup" || segments[0] === "onboarding";
    const onChooseLanguage = segments[0] === "choose-language";

    if (isSignedIn) {
      if (!selectedLanguageId) {
        if (!onChooseLanguage) {
          router.replace("/choose-language");
        }
      } else {
        if (inAuthGroup) {
          router.replace("/");
        }
      }
    } else {
      if (!inAuthGroup && !onChooseLanguage) {
        router.replace("/onboarding");
      }
    }
  }, [isSignedIn, isLoaded, _hasHydrated, selectedLanguageId, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = Font.useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(
      designTokens.colors.neutral.background
    );
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      console.log("Fonts loaded successfully");
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <ActivityIndicator size="large" color="#5B3BF6" />
        <Text style={{ fontFamily: 'System', color: '#6B7280' }}>Loading resources...</Text>
      </View>
    );
  }

  return (
    <PostHogProvider client={posthog}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <InitialLayout />
          <StatusBar style="dark" />
        </ClerkLoaded>
      </ClerkProvider>
    </PostHogProvider>
  );
}
