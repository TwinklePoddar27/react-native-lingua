import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

export default function AITeacherScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 items-center justify-center px-8 max-w-[420px] mx-auto w-full gap-4">
        <Text className="text-[64px] mb-2">🤖</Text>
        <Text className="font-poppins-bold text-[24px] text-text-primary text-center leading-tight">
          AI Video Teacher
        </Text>
        <Text className="font-poppins-regular text-[15px] text-text-secondary text-center leading-relaxed">
          Interactive face-to-face video sessions with native AI speakers to practice pronunciation and build confidence are coming soon.
        </Text>
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
