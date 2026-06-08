import React, { useEffect } from "react";
import { Link, useRouter } from "expo-router";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth, useUser } from "@clerk/expo";

import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { lessons } from "@/data/lessons";

export default function Index() {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { selectedLanguageId } = useLanguageStore();

  // Find the selected language details
  const currentLanguage = languages.find((lang) => lang.id === selectedLanguageId);
  
  // Find units and lessons for the current language
  const languageUnits = units.filter((u) => u.languageId === selectedLanguageId);
  const activeUnit = languageUnits.find((u) => u.order === 1) || languageUnits[0];
  const activeLessons = lessons.filter((l) => l.unitId === activeUnit?.id);

  // If signed in but no language selected, navigate to choose-language
  useEffect(() => {
    if (isSignedIn && !selectedLanguageId) {
      router.replace("/choose-language");
    }
  }, [isSignedIn, selectedLanguageId, router]);

  if (!isSignedIn) {
    return (
      <View className="screen items-center justify-center gap-5 px-8">
        <Image
          style={{ width: 112, height: 112 }}
          resizeMode="contain"
          source={images.mascotLogo}
        />
        <View className="items-center gap-2">
          <Text className="h1 text-center">muolingo</Text>
          <Text className="body-md text-center text-text-secondary">
            Agentic language learning starts here.
          </Text>
        </View>

        <Link href="/onboarding" asChild>
          <Pressable className="btn mt-3 w-full max-w-[280px]">
            <Text className="btn-text">Get Started</Text>
          </Pressable>
        </Link>
        <Link href="/signin" asChild>
          <Pressable className="btn btn-secondary mt-3 w-full max-w-[280px]">
            <Text className="btn-text">Sign In</Text>
          </Pressable>
        </Link>
        <Link href="/signup" asChild>
          <Pressable className="btn btn-secondary mt-3 w-full max-w-[280px]">
            <Text className="btn-text">Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  // If signed in but language not loaded yet, show loading spinner
  if (!currentLanguage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center">
          <Text className="font-poppins-medium text-text-secondary">Loading your course...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Determine user display name or email prefix
  const userDisplayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Learner";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 max-w-[420px] mx-auto w-full px-6 pt-4">
        
        {/* Top Header Row */}
        <View className="flex-row items-center justify-between mb-6">
          {/* Language Selector */}
          <TouchableOpacity
            onPress={() => router.push("/choose-language")}
            activeOpacity={0.8}
            className="flex-row items-center gap-2 border border-border px-3.5 py-2 rounded-full bg-white shadow-sm"
          >
            <View className="w-5 h-5 rounded-full overflow-hidden bg-surface justify-center items-center">
              <Image
                source={{ uri: currentLanguage.flagIcon }}
                style={{ width: 20, height: 20, borderRadius: 10 }}
                resizeMode="cover"
              />
            </View>
            <Text className="font-poppins-bold text-[14px] text-text-primary">
              {currentLanguage.name}
            </Text>
            <View style={styles.downArrow} />
          </TouchableOpacity>

          {/* Stats Badges */}
          <View className="flex-row items-center gap-3">
            {/* Streak Badge */}
            <View className="flex-row items-center gap-1">
              <Image source={images.streakFire} style={{ width: 22, height: 22 }} resizeMode="contain" />
              <Text className="font-poppins-bold text-[15px] text-streak">3</Text>
            </View>
            
            {/* XP Badge */}
            <View className="flex-row items-center gap-1.5 bg-[#FAF9FF] border border-[#EBE8FF] px-3 py-1 rounded-full">
              <Text className="text-[14px]">⚡</Text>
              <Text className="font-poppins-bold text-[14px] text-lingua-deep-purple">120 XP</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Course Content */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Welcome User Banner */}
          <View className="mb-4">
            <Text className="font-poppins-regular text-[14px] text-text-secondary">
              Welcome back,
            </Text>
            <Text className="font-poppins-bold text-[24px] text-text-primary leading-tight">
              {userDisplayName}!
            </Text>
          </View>

          {/* Active Unit Header Card */}
          {activeUnit && (
            <View className="bg-lingua-deep-purple p-5 rounded-[22px] shadow-sm mb-6 relative overflow-hidden">
              <View style={styles.cardDecoration} />
              
              <Text className="font-poppins-bold text-[12px] text-white/80 uppercase tracking-widest mb-1">
                Active Module
              </Text>
              <Text className="font-poppins-bold text-[22px] text-white leading-tight">
                {activeUnit.title}
              </Text>
              <Text className="font-poppins-regular text-[14px] text-white/90 mt-2 pr-6">
                {activeUnit.description}
              </Text>
            </View>
          )}

          {/* Lessons Header */}
          <Text className="font-poppins-bold text-[18px] text-text-primary mb-4">
            Your Lessons
          </Text>

          {/* Lessons List */}
          <View className="gap-4 mb-8">
            {activeLessons.map((lesson) => {
              // Select indicator emoji based on type
              let typeIcon = "📖";
              let typeColor = "bg-[#EEF7FF]";
              let iconColor = "text-[#4D8BFF]";
              
              if (lesson.type === "chat") {
                typeIcon = "💬";
                typeColor = "bg-[#F4F0FF]";
                iconColor = "text-[#5B3BF6]";
              } else if (lesson.type === "video") {
                typeIcon = "📹";
                typeColor = "bg-[#FFF3EE]";
                iconColor = "text-[#FF4D3D]";
              } else if (lesson.type === "audio") {
                typeIcon = "🎧";
                typeColor = "bg-[#EFFFFA]";
                iconColor = "text-[#21C16B]";
              }

              return (
                <TouchableOpacity
                  key={lesson.id}
                  activeOpacity={0.8}
                  style={styles.lessonCard}
                  className="flex-row items-center justify-between p-4 bg-white border border-border rounded-[20px]"
                >
                  <View className="flex-row items-center gap-4 flex-1 pr-2">
                    {/* Icon Container */}
                    <View className={`w-12 h-12 rounded-full ${typeColor} items-center justify-center`}>
                      <Text className="text-[20px]">{typeIcon}</Text>
                    </View>
                    
                    {/* Lesson Details */}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className={`text-[11px] font-poppins-bold uppercase ${iconColor}`}>
                          {lesson.type}
                        </Text>
                        {lesson.aiPrompt && (
                          <View className="bg-[#FAF0FF] border border-[#F0E5FF] px-1.5 py-0.5 rounded">
                            <Text className="text-[9px] text-[#5B3BF6] font-poppins-semibold">AI Teacher</Text>
                          </View>
                        )}
                      </View>
                      <Text className="font-poppins-bold text-[15px] text-text-primary mt-0.5">
                        {lesson.title}
                      </Text>
                      <Text className="font-poppins-regular text-[13px] text-text-secondary mt-0.5" numberOfLines={1}>
                        {lesson.description}
                      </Text>
                    </View>
                  </View>

                  {/* XP Badge */}
                  <View className="bg-surface px-3 py-1.5 rounded-xl border border-border">
                    <Text className="font-poppins-bold text-[12px] text-text-primary">
                      +{lesson.xp} XP
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {activeLessons.length === 0 && (
              <Text className="text-center font-poppins-medium text-text-secondary py-8">
                No lessons loaded for this unit yet.
              </Text>
            )}
          </View>

          {/* Change Language Action */}
          <TouchableOpacity
            onPress={() => router.push("/choose-language")}
            activeOpacity={0.8}
            className="flex-row items-center justify-center h-[56px] border border-border rounded-[18px] bg-white mb-4"
          >
            <Text className="font-poppins-bold text-[16px] text-lingua-deep-purple">
              Select Language
            </Text>
          </TouchableOpacity>

          {/* Quick Actions / Log Out */}
          <TouchableOpacity
            onPress={() => signOut()}
            activeOpacity={0.8}
            className="flex-row items-center justify-center h-[56px] border border-border rounded-[18px] bg-white mb-8"
          >
            <Text className="font-poppins-bold text-[16px] text-text-secondary">
              Sign Out
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  downArrow: {
    width: 6,
    height: 6,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "#0D132B",
    transform: [{ rotate: "45deg" }],
    marginTop: -3,
    marginLeft: 2,
  },
  cardDecoration: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  lessonCard: {
    ...Platform.select({
      ios: {
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: "0px 4px 10px rgba(13, 19, 43, 0.02)",
      },
    }),
  },
});
