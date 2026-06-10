import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 items-center justify-center px-8 max-w-[420px] mx-auto w-full gap-4">
        <Text className="text-[64px] mb-2">💬</Text>
        <Text className="font-poppins-bold text-[24px] text-text-primary text-center leading-tight">
          AI Chat Tutor
        </Text>
        <Text className="font-poppins-regular text-[15px] text-text-secondary text-center leading-relaxed">
          Dynamic chat-based exercises with contextual scenarios (e.g. cafe, hotel check-in) and real-time guidance are coming soon.
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
