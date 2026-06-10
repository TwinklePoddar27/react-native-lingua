import React from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { useLanguageStore } from "@/store/languageStore";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";

export default function AITeacherScreen() {
  const router = useRouter();
  const { selectedLanguageId, completedLessonIds } = useLanguageStore();

  const activeLanguageId = selectedLanguageId || "es";
  const languageUnits = units.filter((u) => u.languageId === activeLanguageId);
  const activeUnit = languageUnits.find((u) => u.order === 1) || languageUnits[0];
  const activeLessons = lessons.filter((l) => l.unitId === activeUnit?.id);
  
  // Find current active lesson (first uncompleted or default to first)
  const activeLesson = activeLessons.find(l => !completedLessonIds.includes(l.id)) || activeLessons[0] || lessons[0];

  const handleStartLesson = () => {
    if (activeLesson) {
      router.push(`/lesson/${activeLesson.id}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 items-center justify-center px-8 max-w-[420px] mx-auto w-full gap-4">
        <Text className="text-[64px] mb-2">🤖</Text>
        <Text className="font-poppins-bold text-[24px] text-text-primary text-center leading-tight">
          AI Teacher Lessons
        </Text>
        <Text className="font-poppins-regular text-[15px] text-text-secondary text-center leading-relaxed max-w-[320px]">
          Practice speaking, vocabulary, and pronunciation with your personal AI language teacher in real-time audio sessions.
        </Text>

        <TouchableOpacity
          activeOpacity={0.86}
          onPress={handleStartLesson}
          className="mt-6 bg-[#5B3BF6] w-full py-4 rounded-[18px] items-center justify-center shadow-md shadow-[#5B3BF6]/20"
        >
          <Text className="font-poppins-bold text-[16px] text-white">
            Start Audio Lesson
          </Text>
        </TouchableOpacity>
        
        {activeLesson && (
          <Text className="font-poppins-medium text-[12px] text-text-secondary">
            Current Lesson: {activeLesson.title}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
