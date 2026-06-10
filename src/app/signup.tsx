import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useSignUp } from "@/lib/clerk";
import { useAppOAuth as useOAuth } from "@/hooks/useAppOAuth";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const isSessionExistsError = (err: any) => {
  if (!err) return false;
  if (err.errors && Array.isArray(err.errors)) {
    return err.errors.some((e: any) => e.code === "session_exists");
  }
  if (err.code === "session_exists") return true;
  return false;
};

export default function SignUp() {
  useWarmUpBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const { signUp, fetchStatus } = useSignUp();
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
        await AsyncStorage.setItem("just_signed_up", "true");
        setActive!({ session: createdSessionId });
      } else {
        // Handle next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startGoogleOAuthFlow, startFacebookOAuthFlow, startAppleOAuthFlow]);

  const onSignUpPress = async () => {
    if (!signUp) return;
    try {
      setVerificationError("");
      const { error: createError } = await signUp.password({
        emailAddress: email,
        password,
      });

      if (!createError) {
        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (!sendError) {
          setShowModal(true);
        } else {
          console.error(JSON.stringify(sendError, null, 2));
        }
      } else {
        console.error(JSON.stringify(createError, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async (code: string) => {
    if (!signUp) return;
    try {
      setVerificationError("");
      const { error } = await signUp.verifications.verifyEmailCode({
        code,
      });
      
      if (!error && signUp.status === "complete") {
        await AsyncStorage.setItem("just_signed_up", "true");
        await signUp.finalize({
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
        <TouchableOpacity className="mb-6 w-10 h-10 items-start justify-center" onPress={() => router.back()}>
          <View style={{ width: 12, height: 12, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#0D132B', transform: [{ rotate: '45deg' }], marginLeft: 4 }} />
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
        <View className="mb-8 items-center h-[130px]">
          <Image
            source={images.mascotAuth}
            style={{ width: 220, height: 130 }}
            resizeMode="contain"
          />
        </View>

        {/* Email Field */}
        <View className="h-[64px] justify-center px-4 border border-border rounded-[16px] bg-white mb-4">
          <Text className="text-[12px] text-text-secondary font-poppins-medium mb-0.5">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="text-[15px] font-poppins text-text-primary p-0 m-0 h-6 leading-tight"
            placeholder="alex@gmail.com"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Password Field */}
        <View className="h-[64px] justify-center px-4 border border-border rounded-[16px] bg-white mb-6">
          <Text className="text-[12px] text-text-secondary font-poppins-medium mb-0.5">Password</Text>
          <View className="flex-row items-center justify-between">
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="flex-1 text-[15px] font-poppins text-text-primary p-0 m-0 h-6 leading-tight"
              placeholder="•••••••••"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-3">
              {showPassword ? (
                <View style={{ width: 22, height: 14, borderWidth: 1.5, borderColor: '#6B7280', borderRadius: 7, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#6B7280' }} />
                </View>
              ) : (
                <View style={{ width: 22, height: 14, borderWidth: 1.5, borderColor: '#6B7280', borderRadius: 7, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#6B7280' }} />
                  <View style={{ position: 'absolute', width: 22, height: 1.5, backgroundColor: '#6B7280', transform: [{ rotate: '45deg' }] }} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="h-[56px] items-center justify-center rounded-[16px] bg-lingua-deep-purple mb-6"
          onPress={onSignUpPress}
          disabled={fetchStatus === "fetching" || !signUp}
        >
          <Text className="font-poppins-bold text-[16px] text-white">Sign Up</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center gap-4 mb-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-text-secondary font-poppins text-[13px]">or continue with</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Social Auth Buttons */}
        <View className="gap-3.5 mb-8">
          <TouchableOpacity 
            className="h-[56px] flex-row items-center justify-center rounded-[16px] bg-white border border-border relative"
            onPress={() => handleOAuth("oauth_google")}
          >
            <Image
              source={images.logoGoogle}
              style={{ width: 24, height: 24, position: 'absolute', left: 24 }}
              resizeMode="contain"
            />
            <Text className="text-text-primary font-poppins-semibold text-[15px]">Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="h-[56px] flex-row items-center justify-center rounded-[16px] bg-white border border-border relative"
            onPress={() => handleOAuth("oauth_facebook")}
          >
            <Image
              source={images.logoFacebook}
              style={{ width: 48, height: 48, position: 'absolute', left: 12 }}
              resizeMode="contain"
            />
            <Text className="text-text-primary font-poppins-semibold text-[15px]">Continue with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="h-[56px] flex-row items-center justify-center rounded-[16px] bg-white border border-border relative"
            onPress={() => handleOAuth("oauth_apple")}
          >
            <Image
              source={images.logoApple}
              style={{ width: 48, height: 48, position: 'absolute', left: 12 }}
              resizeMode="contain"
            />
            <Text className="text-text-primary font-poppins-semibold text-[15px]">Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center gap-1.5 pt-6">
          <Text className="text-text-secondary font-poppins text-[14px]">Already have an account?</Text>
          <Link href="/signin" asChild>
            <TouchableOpacity>
              <Text className="text-lingua-deep-purple font-poppins-semibold text-[14px]">Log in</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {/* Clerk CAPTCHA Element */}
        <View nativeID="clerk-captcha" />

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
