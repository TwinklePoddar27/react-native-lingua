import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 px-6 justify-between max-w-[420px] mx-auto w-full pb-8">
        
        {/* Logo Section - Strict Inline Sizing applied to Image */}
        <View className="items-center mt-6">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.mascotLogo}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
            <Text className="font-poppins-bold text-[24px] text-text-primary">
              muolingo
            </Text>
          </View>
        </View>

        {/* Hero Text Section */}
        <View className="mt-8 w-full">
          <Text className="font-poppins-bold text-[36px] leading-[42px] text-text-primary text-left">
            Your AI language
          </Text>
          <Text className="font-poppins-bold text-[36px] leading-[42px] text-lingua-deep-purple text-left">
            teacher.
          </Text>
          <Text className="mt-4 text-[16px] leading-[24px] text-text-secondary text-left pr-4">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot & Bubbles Section */}
        <View className="relative mt-8 items-center justify-center" style={{ height: 320 }}>
          
          {/* Hello Bubble */}
          <View className="absolute left-0 top-0 rounded-2xl bg-[#EEF7FF] px-4 py-3 shadow-sm z-10" style={{ transform: [{ rotate: '-5deg' }]}}>
            <Text className="font-poppins-medium text-[15px] text-text-primary">
              Hello!
            </Text>
          </View>

          {/* Hola Bubble */}
          <View className="absolute right-4 -top-6 rounded-2xl bg-[#F4F0FF] px-4 py-3 shadow-sm z-10" style={{ transform: [{ rotate: '6deg' }]}}>
            <Text className="font-poppins-medium text-[15px] text-lingua-deep-purple">
              ¡Hola!
            </Text>
          </View>

          {/* Ni Hao Bubble */}
          <View className="absolute right-0 top-24 rounded-2xl bg-[#FFF3EE] px-4 py-3 shadow-sm z-10" style={{ transform: [{ rotate: '12deg' }]}}>
            <Text className="font-poppins-medium text-[15px] text-[#FF4D3D]">
              你好!
            </Text>
          </View>

          {/* Mascot Image - Strict Inline Sizing applied here as well */}
          <Image
            source={images.mascotWelcome}
            style={{ width: 280, height: 280 }}
            resizeMode="contain"
          />
        </View>

        {/* Get Started Button */}
        <View className="mt-8 w-full">
          <Link href="/signup" asChild>
            <TouchableOpacity
              activeOpacity={0.86}
              className="w-full flex h-[60px] flex-row items-center justify-center rounded-[18px] bg-lingua-deep-purple relative"
            >
              <Text className="font-poppins-bold text-[18px] text-white">
                Get Started
              </Text>
              <Text className="absolute right-6 text-[24px] text-white font-medium">›</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  }
});