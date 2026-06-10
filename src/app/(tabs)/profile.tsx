import React from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@/lib/clerk";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const userDisplayName = user?.fullName || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Learner";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const userAvatar = user?.imageUrl;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 max-w-[420px] mx-auto w-full px-6 pt-8 justify-between">
        <View className="items-center mt-4 gap-4">
          {userAvatar ? (
            <Image
              source={{ uri: userAvatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text className="text-[32px]">👤</Text>
            </View>
          )}

          <View className="items-center gap-1">
            <Text className="font-poppins-bold text-[24px] text-text-primary text-center leading-tight">
              {userDisplayName}
            </Text>
            {userEmail ? (
              <Text className="font-poppins-regular text-[14px] text-text-secondary text-center">
                {userEmail}
              </Text>
            ) : null}
          </View>

          {/* Dummy stats section */}
          <View className="flex-row w-full gap-4 mt-6">
            <View className="flex-1 bg-surface p-4 rounded-2xl border border-border items-center justify-center">
              <Text className="text-[24px] mb-1">⚡</Text>
              <Text className="font-poppins-bold text-[16px] text-text-primary">120 XP</Text>
              <Text className="font-poppins-medium text-[11px] text-text-secondary uppercase mt-0.5">Total Score</Text>
            </View>
            <View className="flex-1 bg-surface p-4 rounded-2xl border border-border items-center justify-center">
              <Text className="text-[24px] mb-1">🔥</Text>
              <Text className="font-poppins-bold text-[16px] text-text-primary">3 Days</Text>
              <Text className="font-poppins-medium text-[11px] text-text-secondary uppercase mt-0.5">Streak</Text>
            </View>
          </View>
        </View>

        {/* Sign out button at the bottom */}
        <TouchableOpacity
          onPress={() => signOut()}
          activeOpacity={0.8}
          className="flex-row items-center justify-center h-[56px] border border-border rounded-[18px] bg-white mb-8"
        >
          <Text className="font-poppins-bold text-[16px] text-text-secondary">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#5B3BF6",
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF2F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
});
