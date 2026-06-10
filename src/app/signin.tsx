import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useSignIn } from "@/lib/clerk";
import { useAppOAuth as useOAuth } from "@/hooks/useAppOAuth";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const isSessionExistsError = (err: any) => {
  if (!err) return false;
  if (err.errors && Array.isArray(err.errors)) {
    return err.errors.some((e: any) => e.code === "session_exists");
  }
  if (err.code === "session_exists") return true;
  return false;
};

export default function SignIn() {
  useWarmUpBrowser();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: "oauth_apple" });

  const handleOAuth = useCallback(async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    try {
      const startOAuthFlow = 
        strategy === "oauth_google" ? startGoogleOAuthFlow :
        strategy === "oauth_facebook" ? startFacebookOAuthFlow :
        startAppleOAuthFlow;

      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Handle next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startGoogleOAuthFlow, startFacebookOAuthFlow, startAppleOAuthFlow]);

  const onSignInPress = async () => {
    if (!signIn) return;
    try {
      setVerificationError("");
      const { error } = await signIn.emailCode.sendCode({
        emailAddress: email,
      });

      if (!error) {
        setShowModal(true);
      } else {
        console.error(JSON.stringify(error, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async (code: string) => {
    if (!signIn) return;
    try {
      setVerificationError("");
      const { error } = await signIn.emailCode.verifyCode({
        code,
      });
      
      if (!error && signIn.status === "complete") {
        await signIn.finalize({
          navigate: () => {
            setShowModal(false);
            router.replace("/");
          }
        });
      } else if (error) {
        console.error(JSON.stringify(error, null, 2));
        if (isSessionExistsError(error)) {
          setShowModal(false);
          router.replace("/");
          return;
        }
        setVerificationError((error as any).errors?.[0]?.longMessage || error.message || "Invalid code");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      if (isSessionExistsError(err)) {
        setShowModal(false);
        router.replace("/");
        return;
      }
      setVerificationError(err.errors?.[0]?.longMessage || err.message || "An error occurred");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 max-w-[420px] mx-auto w-full"
      >
        {/* Back Button */}
        <TouchableOpacity className="mb-6" onPress={() => router.back()}>
          <Text className="text-[24px] text-text-primary">{"<"}</Text>
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-6">
          <Text className="font-poppins-bold text-[32px] leading-[38px] text-text-primary">
            Welcome back
          </Text>
          <Text className="mt-2 text-[16px] text-text-secondary">
            Continue your language learning journey
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

        {/* Sign In Button */}
        <TouchableOpacity
          className="h-12 items-center justify-center rounded-lg bg-lingua-deep-purple mb-6"
          onPress={onSignInPress}
          disabled={fetchStatus === "fetching" || !signIn}
        >
          <Text className="font-poppins-bold text-[16px] text-white">Sign In</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center gap-2 mb-5">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-text-secondary text-[13px]">or continue with</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Social Auth Buttons */}
        <View className="gap-3 mb-8">
          <TouchableOpacity 
            className="h-12 flex-row items-center justify-start px-4 rounded-lg bg-white border border-border"
            onPress={() => handleOAuth("oauth_google")}
          >
            <Image
              source={images.logoGoogle}
              style={{ width: 20, height: 20, marginRight: 12 }}
              resizeMode="contain"
            />
            <Text className="text-text-primary font-poppins-medium text-[14px]">Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="h-12 flex-row items-center justify-start px-4 rounded-lg bg-white border border-border"
            onPress={() => handleOAuth("oauth_facebook")}
          >
            <Image
              source={images.logoFacebook}
              style={{ width: 20, height: 20, marginRight: 12 }}
              resizeMode="contain"
            />
            <Text className="text-text-primary font-poppins-medium text-[14px]">Continue with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="h-12 flex-row items-center justify-start px-4 rounded-lg bg-white border border-border"
            onPress={() => handleOAuth("oauth_apple")}
          >
            <Image
              source={images.logoApple}
              style={{ width: 20, height: 20, marginRight: 12 }}
              resizeMode="contain"
            />
            <Text className="text-text-primary font-poppins-medium text-[14px]">Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center gap-1 pt-4">
          <Text className="text-text-secondary text-[14px]">{"Don't have an account?"}</Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text className="text-lingua-deep-purple font-poppins-semibold text-[14px]">Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </ScrollView>
      <VerificationModal 
        visible={showModal} 
        onRequestClose={() => {
          setShowModal(false);
          setVerificationError("");
        }} 
        email={email}
        onVerify={onVerifyPress}
        error={verificationError}
      />
    </SafeAreaView>
  );
}
