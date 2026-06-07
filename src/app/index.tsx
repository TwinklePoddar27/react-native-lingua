import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";

export default function Index() {
  return (
    <View className="screen items-center justify-center gap-5 px-8">
      <Image
        className="h-28 w-28"
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
          <Text className="btn-text">Open onboarding</Text>
        </Pressable>
      </Link>
    </View>
  );
}
