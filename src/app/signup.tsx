import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 max-w-[420px] mx-auto w-full"
      >
        {/* Back Button */}
        <TouchableOpacity className="mb-6">
          <Text className="text-[24px] text-text-primary">{"<"}</Text>
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-6">
          <Text className="font-poppins-bold text-[32px] leading-[38px] text-text-primary">
            Create your account
          </Text>
          <Text className="mt-2 text-[16px] text-text-secondary">
            Start your language journey today ✨
          </Text>
        </View>

        {/* Mascot Illustration */}
        <View className="mb-8 items-center h-[160px]">
          <Image
            source={images.mascotWelcome}
            style={{ width: 160, height: 160 }}
            resizeMode="contain"
          />
        </View>

        {/* Email Field */}
        <View className="mb-5">
          <Text className="label mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="h-12 rounded-lg border border-border px-4 bg-white text-[14px]"
            placeholder="you@provider.com"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Password Field */}
        <View className="mb-5">
          <Text className="label mb-2">Password</Text>
          <View className="flex-row items-center h-12 rounded-lg border border-border px-4 bg-white">
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="flex-1 text-[14px]"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-3">
              <Text className="text-[20px]">{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="h-12 items-center justify-center rounded-lg bg-lingua-deep-purple mb-6"
          onPress={() => setShowModal(true)}
        >
          <Text className="font-poppins-bold text-[16px] text-white">Sign Up</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center gap-2 mb-5">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-text-secondary text-[13px]">or continue with</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Social Auth Buttons */}
        <View className="gap-3 mb-8">
          <TouchableOpacity className="h-12 flex-row items-center justify-start px-4 rounded-lg bg-white border border-border">
            <Text className="text-[20px] mr-3">G</Text>
            <Text className="text-text-primary font-poppins-medium text-[14px]">Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity className="h-12 flex-row items-center justify-start px-4 rounded-lg bg-white border border-border">
            <Text className="text-[20px] mr-3 text-blue-600">f</Text>
            <Text className="text-text-primary font-poppins-medium text-[14px]">Continue with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity className="h-12 flex-row items-center justify-start px-4 rounded-lg bg-white border border-border">
            <Text className="text-[20px] mr-3">🍎</Text>
            <Text className="text-text-primary font-poppins-medium text-[14px]">Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center gap-1 pt-4">
          <Text className="text-text-secondary text-[14px]">Already have an account?</Text>
          <Link href="/signin" asChild>
            <TouchableOpacity>
              <Text className="text-lingua-deep-purple font-poppins-semibold text-[14px]">Log in</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </ScrollView>
      <VerificationModal visible={showModal} onRequestClose={() => setShowModal(false)} email={email} />
    </SafeAreaView>
  );
}
