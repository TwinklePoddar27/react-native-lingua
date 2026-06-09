import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useLanguageStore } from "@/store/languageStore";
import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const posthog = usePostHog();
  
  const { selectedLanguageId, completeLesson } = useLanguageStore();

  // Find current lesson
  const lesson = lessons.find((l) => l.id === id);
  const currentLanguage = languages.find((lang) => lang.id === selectedLanguageId);

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Time tracking
  const startTimeRef = useRef<number | null>(null);
  const isCompletedRef = useRef(false);
  const currentActivityIndexRef = useRef(0);

  // Keep ref up to date for cleanup function
  useEffect(() => {
    currentActivityIndexRef.current = currentActivityIndex;
  }, [currentActivityIndex]);

  // Track lesson started
  useEffect(() => {
    if (!lesson) return;

    if (posthog) {
      posthog.capture("lesson_started", {
        lesson_id: lesson.id,
        language: currentLanguage?.name || "Unknown",
        lesson_number: lesson.order,
      });
    }

    // Capture start time
    startTimeRef.current = Date.now();
    isCompletedRef.current = false;

    // Cleanup / Abandon tracking
    return () => {
      if (!isCompletedRef.current) {
        const startTime = startTimeRef.current || Date.now();
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (posthog) {
          posthog.capture("lesson_abandoned", {
            lesson_id: lesson.id,
            time_into_lesson_seconds: timeSpent,
            last_question_index: currentActivityIndexRef.current,
          });
        }
      }
    };
  }, [id, lesson, posthog, currentLanguage]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="font-poppins-bold text-[18px] text-text-primary">Lesson not found</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-lingua-deep-purple px-6 py-2 rounded-xl">
            <Text className="font-poppins-bold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const activities = lesson.activities || [];
  const currentActivity = activities[currentActivityIndex];
  const progressPercent = activities.length > 0 
    ? Math.round(((currentActivityIndex) / activities.length) * 100) 
    : 100;

  const handleOptionSelect = (option: string) => {
    if (hasChecked) return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!currentActivity) return;
    
    // For free-text / speaking activities, we can assume correct for simplicity, or check match
    let correct = false;
    if (currentActivity.type === 'multiple_choice' || currentActivity.type === 'fill_blank') {
      correct = selectedOption === currentActivity.correctAnswer;
    } else {
      correct = true; // Default true for speaking/translation activities in mock screen
    }

    setIsCorrect(correct);
    setHasChecked(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasChecked(false);
    
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex((prev) => prev + 1);
    } else {
      // Completed the lesson!
      isCompletedRef.current = true;
      completeLesson(lesson.id);
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    router.replace("/");
  };

  if (isFinished) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 px-6 justify-between max-w-[420px] mx-auto w-full py-8 items-center">
          <View />
          
          <View className="items-center gap-4">
            <Text className="text-[72px]">🎉</Text>
            <Text className="font-poppins-bold text-[32px] text-text-primary text-center leading-tight">
              Lesson Complete!
            </Text>
            <Text className="font-poppins-medium text-[16px] text-text-secondary text-center max-w-[280px]">
              You finished {lesson.title} and earned rewards!
            </Text>

            {/* XP Badge */}
            <View className="flex-row items-center gap-3 bg-[#FFF9F2] border border-[#FFF0E0] px-6 py-4 rounded-2xl mt-4">
              <Text className="text-[24px]">🔥</Text>
              <View>
                <Text className="font-poppins-bold text-[18px] text-[#FF8A00] leading-none">+{lesson.xp} XP</Text>
                <Text className="font-poppins-semibold text-[13px] text-text-secondary mt-0.5">Lesson Reward</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleFinish}
            className="w-full h-[56px] items-center justify-center rounded-[18px] bg-[#21C16B]"
          >
            <Text className="font-poppins-bold text-[18px] text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 px-6 max-w-[420px] mx-auto w-full pt-4 pb-8 justify-between">
        
        {/* Top Header & Progress */}
        <View className="flex-row items-center gap-4 mb-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="font-poppins-bold text-[20px] text-text-secondary">✕</Text>
          </TouchableOpacity>
          <View className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
            <View 
              className="h-full bg-[#21C16B] rounded-full" 
              style={{ width: `${progressPercent}%` }} 
            />
          </View>
          <Text className="font-poppins-bold text-[14px] text-text-secondary">
            {currentActivityIndex + 1}/{activities.length}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {currentActivity ? (
            <View className="mt-4">
              {/* Question Type / Header */}
              <Text className="font-poppins-semibold text-[14px] text-lingua-deep-purple uppercase tracking-wider mb-2">
                {currentActivity.type.replace('_', ' ')}
              </Text>

              {/* Prompt */}
              <Text className="font-poppins-bold text-[22px] text-text-primary mb-6 leading-snug">
                {currentActivity.prompt}
              </Text>

              {/* Question Text / Scenario (if any) */}
              {currentActivity.questionText && (
                <View className="bg-neutral-50 border border-neutral-100 p-5 rounded-2xl mb-6 items-center">
                  <Text className="font-poppins-bold text-[20px] text-text-primary">
                    {currentActivity.questionText}
                  </Text>
                </View>
              )}

              {/* Options */}
              {currentActivity.options && (
                <View className="gap-3">
                  {currentActivity.options.map((opt) => {
                    const isSelected = selectedOption === opt;
                    let borderStyle = styles.optionCard;
                    if (isSelected) {
                      borderStyle = styles.optionCardSelected;
                    }
                    if (hasChecked) {
                      if (opt === currentActivity.correctAnswer) {
                        borderStyle = styles.optionCardCorrect;
                      } else if (isSelected && !isCorrect) {
                        borderStyle = styles.optionCardIncorrect;
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={opt}
                        activeOpacity={0.85}
                        onPress={() => handleOptionSelect(opt)}
                        disabled={hasChecked}
                        style={borderStyle}
                        className="p-4 rounded-2xl min-h-[56px] justify-center"
                      >
                        <Text 
                          style={
                            isSelected 
                              ? { color: '#5B3BF6', fontFamily: 'Poppins-SemiBold' } 
                              : { color: '#0D132B', fontFamily: 'Poppins-Regular' }
                          }
                          className="text-[16px] text-center"
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Speaking / Input Activity Placeholder if no options */}
              {!currentActivity.options && (
                <View className="items-center justify-center p-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <Text className="text-[48px] mb-4">🎙️</Text>
                  <Text className="font-poppins-medium text-[15px] text-text-secondary text-center">
                    Speak or type the correct answer to continue.
                  </Text>
                </View>
              )}

              {/* Tip box */}
              {currentActivity.tip && !hasChecked && (
                <View className="mt-6 bg-[#EEF7FF] p-4 rounded-xl border border-[#D0E8FF]">
                  <Text className="font-poppins-medium text-[13px] text-[#0066CC]">
                    💡 Tip: {currentActivity.tip}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="mt-8 items-center justify-center">
              <Text className="font-poppins-bold text-[18px] text-text-secondary">No activities left.</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Status & Actions bar */}
        <View className="pt-4 border-t border-neutral-100">
          {hasChecked ? (
            <View className="mb-4">
              {isCorrect ? (
                <View className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-4">
                  <Text className="font-poppins-bold text-[16px] text-emerald-700">Awesome Job! 🎉</Text>
                  <Text className="font-poppins-medium text-[14px] text-emerald-600 mt-1">Your answer is correct.</Text>
                </View>
              ) : (
                <View className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-4">
                  <Text className="font-poppins-bold text-[16px] text-rose-700">Incorrect 😅</Text>
                  <Text className="font-poppins-medium text-[14px] text-rose-600 mt-1">
                    Correct answer: {currentActivity?.correctAnswer}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                activeOpacity={0.86}
                onPress={handleNext}
                className="w-full h-[56px] items-center justify-center rounded-[18px] bg-lingua-deep-purple"
              >
                <Text className="font-poppins-bold text-[18px] text-white">Continue</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.86}
              disabled={activities.length > 0 && currentActivity?.options && !selectedOption}
              onPress={handleCheck}
              className={`w-full h-[56px] items-center justify-center rounded-[18px] ${
                activities.length > 0 && currentActivity?.options && !selectedOption
                  ? "bg-neutral-200"
                  : "bg-lingua-deep-purple"
              }`}
            >
              <Text className="font-poppins-bold text-[18px] text-white">
                {activities.length > 0 && currentActivity?.options ? "Check Answer" : "Continue"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  optionCardSelected: {
    backgroundColor: "#FAF9FF",
    borderColor: "#5B3BF6",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  optionCardCorrect: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  optionCardIncorrect: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
});
