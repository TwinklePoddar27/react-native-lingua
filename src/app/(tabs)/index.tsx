import { useAuth, useUser } from "@/lib/clerk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";

const getGreeting = (langId: string) => {
  switch (langId) {
    case "es":
      return "Hola";
    case "fr":
      return "Bonjour";
    case "ja":
      return "Konnichiwa";
    case "ko":
      return "Annyeong";
    case "de":
      return "Hallo";
    case "zh":
      return "Nǐ hǎo";
    default:
      return "Hello";
  }
};

export default function Index() {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { selectedLanguageId, setLanguageId } = useLanguageStore();

  const { completedLessonIds, completeLesson, uncompleteLesson } = useLanguageStore();

  // Toggle checklist checkbox state
  const toggleLesson = (id: string) => {
    if (completedLessonIds.includes(id)) {
      uncompleteLesson(id);
    } else {
      completeLesson(id);
    }
  };

  // Find the selected language details
  const currentLanguage = languages.find((lang) => lang.id === selectedLanguageId);

  // Find units and lessons for the current language
  const languageUnits = units.filter((u) => u.languageId === selectedLanguageId);
  const activeUnit = languageUnits.find((u) => u.order === 1) || languageUnits[0];
  const activeLessons = lessons.filter((l) => l.unitId === activeUnit?.id);

  const handleClearStorage = async () => {
    try {
      setLanguageId(null);
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
  };

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

  // Build the list of plan items dynamically, padding up to 3 items
  const planItems = [...activeLessons];
  const initialLength = planItems.length;
  if (initialLength < 3) {
    const fallbacks = [
      {
        id: "mock-lesson-2",
        title: "AI Conversation",
        description: "Talk about your day",
        type: "audio",
      },
      {
        id: "mock-lesson-3",
        title: "New words",
        description: "10 words",
        type: "chat",
      },
    ];
    for (let i = initialLength; i < 3; i++) {
      planItems.push(fallbacks[i - initialLength] as any);
    }
  }

  // Determine AI video call teacher profile image dynamically if it exists
  const aiTeacherAvatar = activeLessons.find((l) => l.aiPrompt)?.aiPrompt?.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 max-w-[420px] mx-auto w-full px-6 pt-4">

        {/* Top Header Row */}
        <View className="flex-row items-center justify-between mb-6">
          {/* Left side: Flag + Greeting */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.push("/choose-language")}
              activeOpacity={0.8}
              className="w-10 h-10 rounded-full overflow-hidden border border-border bg-neutral-surface justify-center items-center"
            >
              <Image
                source={{ uri: currentLanguage.flagIcon }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Text className="font-poppins-bold text-[20px] text-text-primary">
              {getGreeting(currentLanguage.id)}, {userDisplayName}! 👋
            </Text>
          </View>

          {/* Right side: Streak + Notification bell */}
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1.5">
              <Image source={images.streakFire} style={{ width: 22, height: 22 }} resizeMode="contain" />
              <Text className="font-poppins-bold text-[16px] text-[#FF8A00]">12</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <SymbolView
                name={{ ios: "bell", android: "notifications", web: "notifications" }}
                size={24}
                tintColor="#0D132B"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Course Content */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

          {/* Daily Goal Card */}
          <View className="bg-[#FFF9F2] p-5 rounded-[24px] mb-6 flex-row items-center justify-between border border-[#FFF0E0]">
            <View className="flex-1 pr-4">
              <Text className="font-poppins-medium text-[14px] text-text-secondary">
                Daily goal
              </Text>
              <View className="flex-row items-baseline mt-1.5 mb-3">
                <Text className="font-poppins-bold text-[32px] text-[#0D132B] leading-none">
                  15
                </Text>
                <Text className="font-poppins-semibold text-[15px] text-[#6B7280] ml-1.5">
                  / 20 XP
                </Text>
              </View>
              {/* Progress Bar */}
              <View className="w-full h-2.5 bg-[#FFEBE0] rounded-full overflow-hidden">
                <View className="h-full bg-[#FF8A00] rounded-full" style={{ width: "75%" }} />
              </View>
            </View>
            <Image
              source={images.treasure}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </View>

          {/* Continue learning Card */}
          <View className="bg-[#5B3BF6] p-6 rounded-[24px] mb-6 relative overflow-hidden flex-row items-center justify-between" style={{ minHeight: 160 }}>
            <View className="flex-1 z-10 pr-24">
              <Text className="font-poppins-medium text-[14px] text-white/80">
                Continue learning
              </Text>
              <Text className="font-poppins-bold text-[26px] text-white mt-0.5 leading-tight">
                {currentLanguage.name}
              </Text>
              <Text className="font-poppins-medium text-[14px] text-white/95 mt-1" numberOfLines={1}>
                {activeUnit ? activeUnit.title : "Basics & Greetings"}
              </Text>
              <TouchableOpacity
                activeOpacity={0.86}
                onPress={() => router.push("/learn")}
                className="mt-4 bg-white px-5 py-2 rounded-[14px] self-start"
              >
                <Text className="font-poppins-bold text-[14px] text-[#5B3BF6]">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>

            {/* Palace Image */}
            <Image
              source={images.palace}
              style={{ width: 130, height: 130, position: "absolute", right: -4, bottom: 0 }}
              resizeMode="contain"
            />
          </View>

          {/* Today's plan Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-poppins-bold text-[20px] text-[#0D132B]">
                {"Today's plan"}
              </Text>
              <TouchableOpacity activeOpacity={0.8}>
                <Text className="font-poppins-bold text-[15px] text-[#5B3BF6]">
                  View all
                </Text>
              </TouchableOpacity>
            </View>

            {/* Plan List */}
            <View className="gap-5">
              {planItems.map((item) => {
                const isCompleted = completedLessonIds.includes(item.id);

                let emoji = "📖";
                let bgColor = "bg-[#FAF0FF]";
                if (item.type === "audio") {
                  emoji = "🎧";
                  bgColor = "bg-[#EEF7FF]";
                } else if (item.type === "chat") {
                  emoji = "💬";
                  bgColor = "bg-[#FFF3EE]";
                } else if (item.type === "video") {
                  emoji = "📹";
                  bgColor = "bg-[#EFFFFA]";
                }

                return (
                  <View key={item.id} className="flex-row items-center justify-between">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => router.push(`/lesson/${item.id}` as any)}
                      className="flex-row items-center gap-4 flex-1 pr-4"
                    >
                      <View className={`w-12 h-12 rounded-[16px] ${bgColor} items-center justify-center`}>
                        <Text className="text-[22px]">{emoji}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-poppins-bold text-[16px] text-[#0D132B]" numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text className="font-poppins-medium text-[14px] text-[#6B7280] mt-0.5" numberOfLines={1}>
                          {item.description}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Interactive checkbox */}
                    <TouchableOpacity
                      onPress={() => toggleLesson(item.id)}
                      className={`w-6 h-6 rounded-full items-center justify-center ${
                        isCompleted ? "bg-[#5B3BF6]" : "border-2 border-neutral-300 bg-white"
                      }`}
                    >
                      {isCompleted && (
                        <Text className="text-[12px] text-white font-poppins-bold">✓</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Next up Banner */}
          <View className="bg-[#F4FBF7] p-5 rounded-[24px] mb-8 flex-row items-center justify-between border border-[#E8F5EE]">
            <View className="flex-1 pr-4">
              <Text className="font-poppins-semibold text-[13px] text-[#21C16B] uppercase tracking-wider">
                Next up
              </Text>
              <Text className="font-poppins-bold text-[18px] text-[#0D132B] mt-0.5">
                AI Video Call
              </Text>
              <Text className="font-poppins-medium text-[14px] text-[#6B7280] mt-0.5">
                Practice speaking
              </Text>
            </View>

            {/* Avatar + Cam icon */}
            <View className="relative">
              <Image
                source={{ uri: aiTeacherAvatar }}
                style={{ width: 64, height: 64, borderRadius: 32 }}
                resizeMode="cover"
              />
              <View className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#21C16B] border-2 border-[#F4FBF7] items-center justify-center">
                <SymbolView
                  name={{ ios: "video.fill", android: "videocam", web: "videocam" }}
                  size={14}
                  tintColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Spacer */}
          <View className="h-12" />

          {/* Developer / Testing Actions - Styled subtly at the very bottom */}
          <View className="border-t border-neutral-100 pt-6 gap-3 mb-8">
            <TouchableOpacity
              onPress={() => router.push("/choose-language")}
              activeOpacity={0.8}
              className="flex-row items-center justify-center h-[52px] border border-border rounded-[16px] bg-white"
            >
              <Text className="font-poppins-bold text-[15px] text-[#5B3BF6]">
                Select Language
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClearStorage}
              activeOpacity={0.8}
              className="flex-row items-center justify-center h-[52px] border border-[#FEE2E2] rounded-[16px] bg-[#FEF2F2]"
            >
              <Text className="font-poppins-bold text-[15px] text-[#EF4444]">
                Clear App Data (Test)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => signOut()}
              activeOpacity={0.8}
              className="flex-row items-center justify-center h-[52px] border border-border rounded-[16px] bg-white"
            >
              <Text className="font-poppins-bold text-[15px] text-text-secondary">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
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
});
