import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useAuth } from "@clerk/expo";

import { images } from "@/constants/images";

export default function Index() {
  const { signOut, isSignedIn } = useAuth();
  
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
      
      {!isSignedIn ? (
        <>
          <Link href="/onboarding" asChild>
            <Pressable className="btn mt-3 w-full max-w-[280px]">
              <Text className="btn-text">Open onboarding</Text>
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
        </>
      ) : (
        <Pressable className="btn mt-3 w-full max-w-[280px]" onPress={() => signOut()}>
          <Text className="btn-text">Sign Out</Text>
        </Pressable>
      )}
    </View>
  );
}
