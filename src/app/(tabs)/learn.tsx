import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useLanguageStore } from "@/store/languageStore";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { images } from "@/constants/images";

export default function LearnScreen() {
  const router = useRouter();
  const { selectedLanguageId, completedLessonIds } = useLanguageStore();
  const [selectedTab, setSelectedTab] = useState<"lessons" | "practice">("lessons");

  // Fallback to Spanish if no language is selected
  const activeLanguageId = selectedLanguageId || "es";

  // Find units and lessons for the current language
  const languageUnits = units.filter((u) => u.languageId === activeLanguageId);
  const activeUnit = languageUnits.find((u) => u.order === 1) || languageUnits[0];
  const activeLessons = lessons.filter((l) => l.unitId === activeUnit?.id);

  // Compute completed lessons in this unit
  const completedLessonsInUnit = activeLessons.filter((l) =>
    completedLessonIds.includes(l.id)
  );
  const completedCount = completedLessonsInUnit.length;

  // Find the index of the first uncompleted lesson
  const firstUncompletedIndex = activeLessons.findIndex(
    (l) => !completedLessonIds.includes(l.id)
  );

  // Determine status for each lesson:
  // - Completed: if in completedLessonIds
  // - In Progress: first uncompleted lesson
  // - Locked: all subsequent uncompleted lessons
  const lessonsWithStatus = activeLessons.map((lesson, index) => {
    const isCompleted = completedLessonIds.includes(lesson.id);
    let status: "completed" | "in_progress" | "locked" = "locked";

    if (isCompleted) {
      status = "completed";
    } else if (index === firstUncompletedIndex) {
      status = "in_progress";
    } else {
      status = "locked";
    }

    return {
      ...lesson,
      status,
    };
  });

  // Map lesson title to illustration/photo asset
  const getLessonImage = (title: string) => {
    const normalized = title.toLowerCase();
    if (
      normalized.includes("cafe") ||
      normalized.includes("café") ||
      normalized.includes("coffee") ||
      normalized.includes("tea")
    ) {
      return images.lessonCafeTable;
    }
    if (
      normalized.includes("greeting") ||
      normalized.includes("meet") ||
      normalized.includes("introduction")
    ) {
      return { uri: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150" };
    }
    if (
      normalized.includes("daily") ||
      normalized.includes("life") ||
      normalized.includes("routine")
    ) {
      return { uri: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=150" };
    }
    if (
      normalized.includes("direction") ||
      normalized.includes("travel") ||
      normalized.includes("route")
    ) {
      return { uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=150" };
    }
    if (
      normalized.includes("shop") ||
      normalized.includes("boutique") ||
      normalized.includes("buy") ||
      normalized.includes("cost")
    ) {
      return { uri: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150" };
    }
    if (
      normalized.includes("family") ||
      normalized.includes("friend") ||
      normalized.includes("brother") ||
      normalized.includes("parent")
    ) {
      return { uri: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=150" };
    }
    return { uri: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150" };
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 max-w-[420px] mx-auto w-full bg-white">
        {/* Fixed Sticky Header */}
        <View className="flex-row items-center justify-between px-6 pt-5 pb-3 bg-white">
          <View className="flex-row items-center gap-4 flex-1">
            <TouchableOpacity onPress={handleBack} className="p-1 justify-center items-center">
              <SymbolView
                name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
                size={22}
                tintColor="#0D132B"
              />
            </TouchableOpacity>

            <View className="gap-0.5">
              <Text className="font-poppins-bold text-[20px] text-text-primary" numberOfLines={1}>
                {activeUnit ? activeUnit.title : "Basics & Greetings"}
              </Text>
              <Text className="font-poppins-medium text-[13px] text-[#8E94A8]">
                Unit {activeUnit?.order || 1} • {completedCount} / {activeLessons.length} lessons
              </Text>
            </View>
          </View>

          {/* Custom Ribbon Bookmark Flag */}
          <View className="w-[22px] h-[26px] justify-center items-center">
            <View className="w-5 h-[23px] bg-white border-2 border-[#5B3BF6] rounded-t-sm relative items-center justify-start overflow-hidden">
              {/* Gold bookmark detail inside */}
              <View className="w-2.5 h-[14px] bg-[#FF8A00] rounded-b-xs" />
              {/* Bottom triangle cut out */}
              <View
                className="absolute -bottom-2 w-3 h-3 bg-white border-t border-r border-[#5B3BF6]"
                style={{ transform: [{ rotate: "45deg" }] }}
              />
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-[#F9FAFC]">
          {/* Banner Illustration */}
          <View className="relative w-full h-[210px] overflow-hidden bg-[#E2F0FF]">
            <Image
              source={images.mascotCafe}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          {/* Overlapping Tab Selector */}
          <View style={styles.tabContainer} className="flex-row bg-[#EAE8F7] p-1 rounded-[20px] mx-6 shadow-sm">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedTab("lessons")}
              className={`flex-1 py-3 items-center rounded-[16px] relative ${
                selectedTab === "lessons" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`font-poppins-bold text-[14px] ${
                  selectedTab === "lessons" ? "text-[#5B3BF6]" : "text-[#8E94A8]"
                }`}
              >
                Lessons
              </Text>
              {selectedTab === "lessons" && (
                <View className="absolute bottom-1 w-12 h-1 bg-[#5B3BF6] rounded-full" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedTab("practice")}
              className={`flex-1 py-3 items-center rounded-[16px] relative ${
                selectedTab === "practice" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`font-poppins-bold text-[14px] ${
                  selectedTab === "practice" ? "text-[#5B3BF6]" : "text-[#8E94A8]"
                }`}
              >
                Practice
              </Text>
              {selectedTab === "practice" && (
                <View className="absolute bottom-1 w-12 h-1 bg-[#5B3BF6] rounded-full" />
              )}
            </TouchableOpacity>
          </View>

          {selectedTab === "lessons" ? (
            /* Lessons List */
            <View className="px-6 pt-5 pb-10 gap-4">
              {lessonsWithStatus.map((lesson, idx) => {
                const isCompleted = lesson.status === "completed";
                const isInProgress = lesson.status === "in_progress";
                const isLocked = lesson.status === "locked";

                // Define borders and styling depending on status
                let cardClass = "bg-white p-5 rounded-[22px] flex-row items-center justify-between border";
                let labelClass = "font-poppins-bold text-[12px] uppercase tracking-wider";

                if (isInProgress) {
                  cardClass += " border-[#5B3BF6]";
                  labelClass += " text-[#5B3BF6]";
                } else {
                  cardClass += " border-neutral-100";
                  labelClass += " text-[#8E94A8]";
                }

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/lesson/${lesson.id}` as any)}
                    style={styles.cardShadow}
                    className={cardClass}
                  >
                    {/* Left content block */}
                    <View className="flex-1 pr-4 gap-1">
                      <Text className={labelClass}>Lesson {idx + 1}</Text>
                      <Text className="font-poppins-bold text-[17px] text-[#0D132B] leading-tight">
                        {lesson.title}
                      </Text>

                      {isInProgress && (
                        <Text className="font-poppins-semibold text-[13px] text-[#5B3BF6] mt-0.5">
                          In progress
                        </Text>
                      )}

                      {isLocked && (
                        <Text className="font-poppins-medium text-[13px] text-[#8E94A8] mt-0.5">
                          0 / 6 lessons
                        </Text>
                      )}
                    </View>

                    {/* Right icon block */}
                    <View className="items-center justify-center">
                      {isCompleted && (
                        <View className="w-[30px] h-[30px] rounded-full bg-[#21C16B] items-center justify-center">
                          <SymbolView
                            name={{ ios: "checkmark", android: "check", web: "check" }}
                            size={14}
                            tintColor="#FFFFFF"
                          />
                        </View>
                      )}

                      {isInProgress && (
                        <Image
                          source={getLessonImage(lesson.title)}
                          style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: "#FAFAFA" }}
                          resizeMode="contain"
                        />
                      )}

                      {isLocked && (
                        <SymbolView
                          name={{ ios: "lock", android: "lock", web: "lock" }}
                          size={20}
                          tintColor="#8E94A8"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            /* Practice Tab Empty State / Practice Session Placeholder */
            <View className="px-8 py-16 items-center justify-center gap-4">
              <Text className="text-[54px]">💪</Text>
              <Text className="font-poppins-bold text-[20px] text-text-primary text-center">
                Practice Session
              </Text>
              <Text className="font-poppins-medium text-[14px] text-text-secondary text-center leading-relaxed max-w-[280px]">
                Strengthen weak words, review grammar rules, and earn extra XP to keep your streak hot!
              </Text>
              <TouchableOpacity
                activeOpacity={0.86}
                className="mt-4 bg-[#5B3BF6] px-8 py-3 rounded-[16px] shadow-sm"
                onPress={() => {
                  // Navigate to the first lesson of the unit for practice
                  if (activeLessons.length > 0) {
                    router.push(`/lesson/${activeLessons[0].id}` as any);
                  }
                }}
              >
                <Text className="font-poppins-bold text-[15px] text-white">Start Practice</Text>
              </TouchableOpacity>
            </View>
          )}
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
  tabContainer: {
    marginTop: -28,
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        // Use standard CSS boxShadow for Web compatibility to avoid deprecation warnings
        boxShadow: "0px 3px 10px rgba(13, 19, 43, 0.05)",
      } as any,
    }),
  },
});
