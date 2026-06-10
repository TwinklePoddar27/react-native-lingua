import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useLanguageStore } from "@/store/languageStore";
import { languages } from "@/data/languages";
import { images } from "@/constants/images";
import { usePostHog } from "posthog-react-native";

export default function ChooseLanguageScreen() {
  const router = useRouter();
  const posthog = usePostHog();
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedLanguageId, setLanguageId } = useLanguageStore();
  const [selectedId, setSelectedId] = useState<string | null>(selectedLanguageId);

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedId) {
      const selectedLanguage = languages.find((lang) => lang.id === selectedId);
      if (posthog && selectedLanguage) {
        posthog.capture("language_selected", {
          language_code: selectedLanguage.id,
          language_name: selectedLanguage.name,
        });
      }
      setLanguageId(selectedId);
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 max-w-[420px] mx-auto w-full px-6 pt-4 justify-between">
        
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-start justify-center"
          >
            <View style={styles.backArrow} />
          </TouchableOpacity>
          <Text className="font-poppins-bold text-[20px] text-text-primary text-center flex-1 pr-10">
            Choose a language
          </Text>
        </View>

        {/* Search Bar */}
        <View className="h-[52px] flex-row items-center px-4 border border-border rounded-[26px] bg-white mb-6">
          {/* Custom Drawn Magnifying Glass Search Icon */}
          <View className="flex-row items-center">
            <View className="w-[16px] h-[16px] rounded-full border-2 border-text-secondary" />
            <View style={styles.searchHandle} />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-[15px] font-poppins text-text-primary h-full ml-3 p-0"
            placeholder="Search languages"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Scrollable Language List */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-2">
          {/* Section Header */}
          <Text className="font-poppins-bold text-[18px] text-text-primary mb-4">
            Popular
          </Text>

          {/* Languages List */}
          <View className="gap-3 mb-4">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedId === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedId(lang.id)}
                  style={[
                    styles.languageCard,
                    isSelected && styles.languageCardSelected,
                  ]}
                  className="flex-row items-center justify-between p-4"
                >
                  <View className="flex-row items-center gap-4">
                    {/* Flag Container */}
                    <View style={styles.flagContainer}>
                      <Image
                        source={{ uri: lang.flagIcon }}
                        style={styles.flagImage}
                        resizeMode="cover"
                      />
                    </View>
                    
                    {/* Text Details */}
                    <View>
                      <Text className="font-poppins-bold text-[16px] text-text-primary">
                        {lang.name}
                      </Text>
                      <Text className="font-poppins-regular text-[13px] text-text-secondary mt-0.5">
                        {lang.learnersCount}
                      </Text>
                    </View>
                  </View>

                  {/* Right Side Icon */}
                  {isSelected ? (
                    <View style={styles.checkmarkOuter}>
                      <View style={styles.checkmarkInner} />
                    </View>
                  ) : (
                    <View style={styles.chevronRight} />
                  )}
                </TouchableOpacity>
              );
            })}

            {filteredLanguages.length === 0 && (
              <Text className="text-center font-poppins-medium text-text-secondary py-8">
                No languages found matching &quot;{searchQuery}&quot;
              </Text>
            )}

          </View>
        </ScrollView>

        {/* Continue Button */}
        <View className="mb-4">
          <TouchableOpacity
            activeOpacity={0.86}
            disabled={!selectedId}
            onPress={handleConfirm}
            className={`w-full h-[56px] items-center justify-center rounded-[18px] bg-lingua-deep-purple ${
              !selectedId ? "opacity-50" : ""
            }`}
          >
            <Text className="font-poppins-bold text-[18px] text-white">Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Earth Illustration */}
        <View style={styles.earthContainer}>
          <Image
            source={images.earth}
            style={styles.earthIllustration}
            resizeMode="cover"
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#0D132B",
    transform: [{ rotate: "45deg" }],
    marginLeft: 4,
  },
  searchHandle: {
    width: 6,
    height: 2,
    backgroundColor: "#6B7280",
    transform: [{ rotate: "45deg" }],
    marginLeft: -2,
    marginTop: 10,
  },
  languageCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1.5,
    borderRadius: 20,
    minHeight: 80,
  },
  languageCardSelected: {
    borderColor: "#6C4EF5",
    borderWidth: 2,
    backgroundColor: "#FAF9FF",
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  flagImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  globeContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2F6",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronRight: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "#9CA3AF",
    transform: [{ rotate: "45deg" }],
    marginRight: 6,
  },
  checkmarkOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#6C4EF5",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkInner: {
    width: 6,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
    marginTop: -2,
  },
  earthContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: -24, // Negates padding of screen wrapper
    height: 120,
  },
  earthIllustration: {
    width: "100%",
    height: 120,
  },
});
