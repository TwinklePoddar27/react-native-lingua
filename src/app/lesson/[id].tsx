/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { usePostHog } from "posthog-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useLanguageStore } from "@/store/languageStore";
import { lessons } from "@/data/lessons";
import { images } from "@/constants/images";
import { useUser } from "@/lib/clerk";
import { getStreamClient } from "@/lib/stream";
import { startAgentSession, stopAgentSession } from "@/lib/vision-agent";

// Native-only imports handled via conditional require to prevent SSR/Web crashes
let StreamVideo: any = ({ children }: any) => <>{children}</>;
let StreamCall: any = ({ children }: any) => <>{children}</>;
let useCall: any = () => null;
let useCallStateHooks: any = () => ({
  useCallStatus: () => "joined",
  useMicrophoneState: () => ({ isMuted: false }),
  useParticipants: () => [],
});

if (Platform.OS !== "web") {
  try {
    const VideoSDK = require("@stream-io/video-react-native-sdk");
    StreamVideo = VideoSDK.StreamVideo;
    StreamCall = VideoSDK.StreamCall;
    useCall = VideoSDK.useCall;
    useCallStateHooks = VideoSDK.useCallStateHooks;
  } catch (e) {
    console.warn("Stream Video SDK not available in this environment");
  }
}

// Helper to provide extended details (phrases, teacher, translations) for lessons
interface CallPhrase {
  id: string;
  text: string;
  translation: string;
  pronunciation: string;
  context: string;
}

interface TeacherContext {
  name: string;
  avatarUrl: string;
  scenario: string;
  initialMessage: string;
  phrases: CallPhrase[];
}

const getExtendedLessonData = (lessonId: string, languageId: string): TeacherContext => {
  const lesson = lessons.find((l) => l.id === lessonId);
  const langId = languageId || "es";

  const defaultTeachers: Record<string, { name: string; avatarUrl: string; scenario: string; initialMessage: string }> = {
    es: {
      name: "Sofía",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
      scenario: "Practice ordering food & greetings at a local café.",
      initialMessage: "¡Hola! Bienvenidos. ¿Qué te pongo hoy?",
    },
    fr: {
      name: "Chloé",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
      scenario: "Order croissants and coffee in standard French.",
      initialMessage: "Bonjour ! Bienvenue. Qu'est-ce que je vous sers ?",
    },
    ja: {
      name: "Kenji",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      scenario: "Learn to order green tea in Kyoto style.",
      initialMessage: "いらっしゃいませ！ご注文はお決まりですか？",
    },
    ko: {
      name: "Minjun",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      scenario: "Order an iced americano at a Seoul café.",
      initialMessage: "어서 오세요! 어떤 걸로 주문하시겠어요?",
    },
    de: {
      name: "Emma",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      scenario: "Order pretzels and local beverages in Munich.",
      initialMessage: "Hallo! Willkommen. Was möchtest du bestellen?",
    },
    default: {
      name: "Alex",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      scenario: "Practice everyday conversation scenarios.",
      initialMessage: "Hello! Welcome. How can I help you today?",
    },
  };

  const activeTeacher = defaultTeachers[langId] || defaultTeachers.default;

  const teacherName = lesson?.aiPrompt?.teacherName || activeTeacher.name;
  const avatarUrl = lesson?.aiPrompt?.avatarUrl || activeTeacher.avatarUrl;
  const initialMessage = lesson?.aiPrompt?.initialMessage || activeTeacher.initialMessage;
  const scenario = lesson?.aiPrompt?.scenarioDescription || activeTeacher.scenario;

  const defaultPhrases: Record<string, CallPhrase[]> = {
    es: [
      { id: "es-1", text: "¡Hola! Buenas tardes.", translation: "Hello! Good afternoon.", pronunciation: "OH-lah BWEH-nas TAR-dehs", context: "Polite greeting in the afternoon" },
      { id: "es-2", text: "Quiero un café con leche, por favor.", translation: "I want a coffee with milk, please.", pronunciation: "KYEH-ro oon kah-FEH kon LEH-cheh por fah-VOR", context: "Ordering coffee at a shop" },
      { id: "es-3", text: "La cuenta, por favor.", translation: "The bill, please.", pronunciation: "lah KWEHN-tah por fah-VOR", context: "Asking for the check politely" },
      { id: "es-4", text: "Muchas gracias, ¡adiós!", translation: "Thank you very much, goodbye!", pronunciation: "MOO-chahs GRAH-syahs ah-DYOHS", context: "Leaving the shop" },
    ],
    fr: [
      { id: "fr-1", text: "Bonjour, s'il vous plaît.", translation: "Hello, please.", pronunciation: "bohn-ZHOOR seel voo pleh", context: "Standard polite greeting" },
      { id: "fr-2", text: "Un café et un croissant, s'il vous plaît.", translation: "A coffee and a croissant, please.", pronunciation: "uhn kah-FEH ay uhn krwa-SAHN seel voo pleh", context: "Ordering standard bakery items" },
      { id: "fr-3", text: "L'addition, s'il vous plaît.", translation: "The bill, please.", pronunciation: "lah-dee-SYOHN seel voo pleh", context: "Asking for the check" },
    ],
    ja: [
      { id: "ja-1", text: "こんにちは、お茶をお願いします。", translation: "Hello, green tea please.", pronunciation: "Konnichiwa, o-cha o onegai shimasu.", context: "Greeting and ordering tea" },
      { id: "ja-2", text: "これはいくらですか？", translation: "How much is this?", pronunciation: "Kore wa ikura desu ka?", context: "Asking about item price" },
      { id: "ja-3", text: "ありがとうございます。", translation: "Thank you very much.", pronunciation: "Arigatou gozaimasu.", context: "Polite gratitude" },
    ],
    ko: [
      { id: "ko-1", text: "안녕하세요! 커피 주세요.", translation: "Hello! Coffee, please.", pronunciation: "Annyeonghaseyo! Keopi juseyo.", context: "Greeting and ordering" },
      { id: "ko-2", text: "아이스 아메리카노 하나 주세요.", translation: "One iced americano, please.", pronunciation: "Aiseu amerikanoh hana juseyo.", context: "Ordering typical Korean coffee drink" },
      { id: "ko-3", text: "감사합니다. 안녕히 계세요.", translation: "Thank you. Goodbye.", pronunciation: "Gamsahabnida. Annyeonghi gyeseyo.", context: "Polite leaving message" },
    ],
    de: [
      { id: "de-1", text: "Hallo! Guten Tag.", translation: "Hello! Good day.", pronunciation: "Hallo! Goot-en Tahg.", context: "Standard german greeting" },
      { id: "de-2", text: "Ein Mineralwasser, bitte.", translation: "A mineral water, please.", pronunciation: "Ayn mee-neh-RAHL-vah-ser bit-teh", context: "Ordering water" },
      { id: "de-3", text: "Vielen Dank, auf Wiedersehen!", translation: "Thank you very much, goodbye!", pronunciation: "Feel-en Dank owf vee-der-zayn!", context: "Polite parting" },
    ],
    default: [
      { id: "def-1", text: "Hello! How are you doing today?", translation: "Hello! How are you doing today?", pronunciation: "Hello! How are you doing today?", context: "General greeting" },
      { id: "def-2", text: "I want to practice my language skills.", translation: "I want to practice my language skills.", pronunciation: "I want to practice my language skills.", context: "Expressing learning desire" },
      { id: "def-3", text: "Thank you for the lesson!", translation: "Thank you for the lesson!", pronunciation: "Thank you for the lesson!", context: "Ending gratitude" },
    ],
  };

  if (lesson?.phrases && lesson.phrases.length > 0) {
    return {
      name: teacherName,
      avatarUrl,
      scenario,
      initialMessage,
      phrases: lesson.phrases.map((p) => ({
        id: p.id,
        text: p.text,
        translation: p.translation,
        pronunciation: p.pronunciation || p.text,
        context: p.context || "Lesson phrase",
      })),
    };
  }

  if (lesson?.vocabList && lesson.vocabList.length > 0) {
    const vocabPhrases = lesson.vocabList.map((v) => ({
      id: v.id,
      text: v.word,
      translation: v.translation,
      pronunciation: v.pronunciation || v.word,
      context: v.exampleSentence || `Vocabulary: ${v.word}`,
    }));
    return {
      name: teacherName,
      avatarUrl,
      scenario,
      initialMessage,
      phrases: vocabPhrases,
    };
  }

  return {
    name: teacherName,
    avatarUrl,
    scenario,
    initialMessage,
    phrases: defaultPhrases[langId] || defaultPhrases.default,
  };
};

export default function AudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const [streamClient, setStreamClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<"idle" | "connecting" | "connected" | "failed">("idle");
  const agentSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Disable Stream on Web
    if (Platform.OS === "web") return;
    if (!user || !id) return;

    let isMounted = true;
    let currentCall: any = null;

    const init = async () => {
      try {
        const client = await getStreamClient(
          user.id,
          user.firstName || user.id,
          user.imageUrl || ""
        );
        if (!isMounted) return;
        setStreamClient(client);

        const callId = `lesson-${id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
        const newCall = client.call("default", callId);
        await newCall.join({ create: true });

        if (!isMounted) return;
        setCall(newCall);
        currentCall = newCall;

        // Start the Vision Agent session
        try {
          setAgentStatus("connecting");
          const languageId = useLanguageStore.getState().selectedLanguageId || "es";
          const lessonData = lessons.find(l => l.id === id);
          if (lessonData) {
            const result = await startAgentSession(callId, languageId, lessonData);
            agentSessionIdRef.current = result.session_id;
            setAgentStatus("connected");
            console.log(`Vision Agent session started: ${result.session_id} for call: ${callId}`);
          }
        } catch (agentError) {
          console.error("Failed to start Vision Agent session:", agentError);
          setAgentStatus("failed");
        }
      } catch (e: any) {
        console.error("Stream initialization error:", e);
        if (isMounted) setError(e.message);
      }
    };

    init();

    return () => {
      isMounted = false;

      // Cleanup agent session
      if (currentCall && agentSessionIdRef.current) {
        stopAgentSession(currentCall.id, agentSessionIdRef.current).catch(err => {
            console.error("Error stopping agent on unmount:", err);
        });
      }

      if (currentCall && currentCall.state.status !== "left") {
        currentCall.leave();
      }
    };
  }, [user, id]);

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center p-6 bg-white">
          <SymbolView name={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }} size={48} tintColor="#EF4444" />
          <Text className="font-poppins-bold text-[18px] text-[#0D132B] mt-4">Connection Error</Text>
          <Text className="font-poppins-medium text-[14px] text-[#6B7280] text-center mt-2 px-6">
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-[#5B3BF6] px-8 py-3 rounded-xl"
          >
            <Text className="font-poppins-bold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // On web, we bypass the stream client requirement to avoid crashes
  if (Platform.OS === "web") {
    return <AudioLessonContent id={id} agentStatus="connected" onEndCall={async () => {}} />;
  }

  if (!streamClient || !call) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center p-6 bg-white gap-4">
          <ActivityIndicator size="large" color="#5B3BF6" />
          <Text className="font-poppins-bold text-[18px] text-[#0D132B]">Connecting to AI Teacher...</Text>
          <Text className="font-poppins-medium text-[13px] text-[#6B7280]">Setting up your secure audio session</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <StreamVideo client={streamClient}>
      <StreamCall call={call}>
        <AudioLessonContent id={id} agentStatus={agentStatus} onEndCall={async () => {
            if (agentSessionIdRef.current && call) {
                await stopAgentSession(call.id, agentSessionIdRef.current).catch(console.error);
                agentSessionIdRef.current = null;
            }
        }} />
      </StreamCall>
    </StreamVideo>
  );
}

function AudioLessonContent({ id, agentStatus, onEndCall }: { id: string; agentStatus: string; onEndCall: () => Promise<void> }) {
  const router = useRouter();
  const { selectedLanguageId, completeLesson } = useLanguageStore();
  const posthog = usePostHog();
  const call = useCall();

  const hooks = useCallStateHooks();
  const callStatus = (call && hooks?.useCallStatus) ? hooks.useCallStatus() : "joined";
  const participants = (call && hooks?.useParticipants) ? hooks.useParticipants() : [];

  // Detect if the AI teacher is speaking
  const teacherParticipant = participants.find((p: any) => p.userId === "teacher");
  const isTeacherSpeaking = teacherParticipant?.isSpeaking || false;

  // Detect if the local user is speaking
  const localParticipant = participants.find((p: any) => p.isLocalParticipant);
  const isLocalSpeaking = localParticipant?.isSpeaking || false;

  // Use a local state fallback for mic toggling to ensure UI responsiveness
  const [localMuted, setLocalMuted] = useState(false);
  const remoteMicState = hooks?.useMicrophoneState ? hooks.useMicrophoneState() : null;
  const micState = (call && remoteMicState) ? remoteMicState : { isMuted: localMuted };

  // Automatically unmute mic on join
  useEffect(() => {
    if (call && call.microphone && micState.isMuted) {
      call.microphone.enable();
    }
  }, [call, micState.isMuted]);

  const isCompletedRef = useRef<boolean>(false);

  const activeLanguageId = selectedLanguageId || "es";
  const lesson = lessons.find((l) => l.id === id);

  // Extended hardcoded learning data mapped dynamically
  const teacherContext = getExtendedLessonData(id || "", activeLanguageId);

  // Connection status & states
  const [status, setStatus] = useState<"connecting" | "online" | "ended">("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const toggleCamera = useCallback(async () => {
    console.log("Toggling camera...");
    try {
      if (call?.camera) {
        await call.camera.toggle();
        console.log("Stream camera toggled successfully");
      }
      setIsCameraOn((prev) => !prev);
    } catch (err) {
      console.error("Error toggling camera:", err);
      setIsCameraOn((prev) => !prev);
    }
  }, [call]);
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Map Stream call status to local status
  useEffect(() => {
    if (callStatus === "joined") setStatus("online");
    else if (callStatus === "joining") setStatus("connecting");
  }, [callStatus]);

  // Speech bubble & phrases
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const currentPhrase = teacherContext.phrases[currentPhraseIndex] || teacherContext.phrases[0];

  const currentPhraseIndexRef = useRef(currentPhraseIndex);
  useEffect(() => {
    currentPhraseIndexRef.current = currentPhraseIndex;
  }, [currentPhraseIndex]);

  // Feedback levels
  const [speakingLevel, setSpeakingLevel] = useState<"Excellent" | "Great" | "Good" | "—">("Excellent");
  const [pronunciationLevel, setPronunciationLevel] = useState<"Excellent" | "Great" | "Good" | "—">("Great");
  const [grammarLevel, setGrammarLevel] = useState<"Excellent" | "Great" | "Good" | "—">("Good");
  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);
  const [simulationTextOverride, setSimulationTextOverride] = useState<string | null>(null);
  const [isSimulatedAudioPlaying, setIsSimulatedAudioPlaying] = useState(false);

  // Real-time speaking state from Stream or local simulation
  const isAudioPlaying = isTeacherSpeaking || isSimulatedAudioPlaying;
  const isListening = !isAudioPlaying && !micState.isMuted;

  // Completion Reward Overlay State
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  // Shared values for micro-animations
  const statusScale = useSharedValue(1);
  const wave1 = useSharedValue(1);
  const wave2 = useSharedValue(1);
  const wave3 = useSharedValue(1);
  const micRipple = useSharedValue(1);

  // Stable callbacks
  const triggerAudioPlay = useCallback(() => {
    if (isAudioPlaying) return;
    setIsSimulatedAudioPlaying(true);
    setTimeout(() => {
      setIsSimulatedAudioPlaying(false);
    }, 2200);
  }, [isAudioPlaying]);

  const toggleMic = useCallback(async () => {
    console.log("Toggling microphone...");
    try {
      if (call?.microphone) {
        await call.microphone.toggle();
        console.log("Stream microphone toggled successfully");
      } else {
        console.log("No active call/microphone, using local fallback toggle");
        setLocalMuted((prev) => !prev);
      }
    } catch (err) {
      console.error("Error toggling microphone:", err);
      // Fallback to local state if SDK fails
      setLocalMuted((prev) => !prev);
    }
  }, [call]);

  const handleSimulateSpeech = useCallback(() => {
    // We disable the manual simulation trigger as we want real interactivity
    return;
  }, []);

  // Audio Play Icon Animation Style
  const animatedStatusDotStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: statusScale.value }],
    };
  });

  const animatedWave1 = useAnimatedStyle(() => ({ transform: [{ scale: wave1.value }], opacity: isAudioPlaying ? 0.35 : 0 }));
  const animatedWave2 = useAnimatedStyle(() => ({ transform: [{ scale: wave2.value }], opacity: isAudioPlaying ? 0.25 : 0 }));
  const animatedWave3 = useAnimatedStyle(() => ({ transform: [{ scale: wave3.value }], opacity: isAudioPlaying ? 0.15 : 0 }));

  const animatedMicRipple = useAnimatedStyle(() => {
    return {
      transform: [{ scale: micRipple.value }],
      opacity: isLocalSpeaking ? 1 - (micRipple.value - 1) / 0.8 : 0,
    };
  });

  // End Call functionality
  const handleEndCall = useCallback(async () => {
    if (onEndCall) {
        await onEndCall();
    }
    if (call) {
      await call.leave();
    }
    setStatus("ended");
    setShowCompletionOverlay(true);
    isCompletedRef.current = true;
  }, [call, onEndCall]);

  const handleFinishLesson = useCallback(() => {
    if (lesson) {
      completeLesson(lesson.id);
    }
    isCompletedRef.current = true;
    setShowCompletionOverlay(false);
    router.replace("/(tabs)/learn");
  }, [lesson, completeLesson, router]);

  const playAudioSimulation = useCallback(() => {
    triggerAudioPlay();
  }, [triggerAudioPlay]);

  const handleTabNavigation = useCallback((tabRoute: string) => {
    router.replace(tabRoute as any);
  }, [router]);

  // Connecting transition
  useEffect(() => {
    statusScale.value = withRepeat(withTiming(1.3, { duration: 800 }), -1, true);
  }, [status, statusScale]);

  // Call duration counter
  useEffect(() => {
    if (status !== "online") return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Audio playing wave simulation
  useEffect(() => {
    if (isAudioPlaying) {
      wave1.value = withRepeat(withTiming(1.6, { duration: 400 }), -1, true);
      wave2.value = withRepeat(withTiming(1.4, { duration: 500 }), -1, true);
      wave3.value = withRepeat(withTiming(1.5, { duration: 450 }), -1, true);
    } else {
      wave1.value = withTiming(1);
      wave2.value = withTiming(1);
      wave3.value = withTiming(1);
    }
  }, [isAudioPlaying, wave1, wave2, wave3]);

  // Microphone pulsing ripple simulation
  useEffect(() => {
    if (isLocalSpeaking) {
      micRipple.value = withRepeat(withTiming(1.8, { duration: 1000 }), -1, false);
    } else {
      micRipple.value = withTiming(1);
    }
  }, [isLocalSpeaking, micRipple]);

  // Automatic speaking trigger removed as we now use the actual Vision Agent

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center p-6 bg-white">
          <Text className="font-poppins-bold text-[18px] text-[#0D132B]">Lesson not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-[#5B3BF6] px-6 py-3 rounded-xl"
          >
            <Text className="font-poppins-bold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* ================= HEADER SECTION ================= */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-3 bg-white border-b border-neutral-100/30">
          {/* Back chevron + Title */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1 justify-center items-center">
              <SymbolView
                name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
                size={22}
                tintColor="#0D132B"
              />
            </TouchableOpacity>

            <View className="gap-0.5">
              <Text className="font-poppins-bold text-[18px] text-[#0D132B]">
                AI Teacher
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Animated.View
                  style={[
                    styles.statusDot,
                    {
                        backgroundColor: agentStatus === "connected" ? "#21C16B" :
                                       agentStatus === "connecting" ? "#FF8A00" :
                                       agentStatus === "failed" ? "#EF4444" : "#9CA3AF"
                    },
                    animatedStatusDotStyle,
                  ]}
                />
                <Text className="font-poppins-medium text-[13px] text-[#6B7280]">
                  {agentStatus === "connecting" ? "Agent Connecting..." :
                   agentStatus === "connected" ? "Agent Online" :
                   agentStatus === "failed" ? "Agent Failed" : "Agent Idle"}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Header Buttons */}
          <View className="flex-row items-center gap-3">
            {/* Camera preview quick indicator */}
            <TouchableOpacity
              onPress={toggleCamera}
              activeOpacity={0.8}
              className="w-10 h-10 rounded-full border border-neutral-100 bg-white items-center justify-center"
            >
              <SymbolView
                name={{
                  ios: isCameraOn ? "video.fill" : "video.slash.fill",
                  android: isCameraOn ? "videocam" : "videocam_off",
                  web: isCameraOn ? "videocam" : "videocam_off",
                }}
                size={16}
                tintColor="#0D132B"
              />
            </TouchableOpacity>

            {/* Streak count indicator */}
            <View className="w-10 h-10 rounded-full border border-neutral-100 bg-white items-center justify-center">
              <Text className="font-poppins-bold text-[14px] text-[#FF8A00]">12</Text>
            </View>

            {/* Teacher profile circle button */}
            <View className="w-10 h-10 rounded-full border border-neutral-100 bg-white items-center justify-center">
              <SymbolView
                name={{ ios: "person.crop.circle.fill", android: "account_circle", web: "account_circle" }}
                size={18}
                tintColor="#0D132B"
              />
            </View>
          </View>
        </View>

        {/* ================= MAIN FLEX CONTENT AREA ================= */}
        <View className="flex-1 px-6 pt-3 pb-4 justify-between bg-[#F9FAFC]">
          
          {/* ================= VIDEO/PREVIEW CARD ================= */}
          <View className="flex-1 relative overflow-hidden rounded-[28px] bg-[#EAE8F7] shadow-sm">
            {/* Warm Blurred Background Cozy Room */}
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80" }}
              style={StyleSheet.absoluteFill}
              blurRadius={Platform.OS === "web" ? 15 : 12}
            />
            {/* Warm overlay */}
            <View style={StyleSheet.absoluteFill} className="bg-[#FAF8F5]/50" />

            {/* Cozy mascot fox waving in the center - Waist up, styled cleanly to never crop */}
            <View className="flex-1 justify-end items-center relative overflow-hidden">
              <Image
                source={images.mascotWelcome}
                style={{
                  width: 220,
                  height: 220,
                  marginTop: "auto",
                  marginBottom: 10,
                }}
                resizeMode="contain"
              />
            </View>

            {/* Student Picture-in-Picture Floating View */}
            <View className="absolute top-4 right-4 w-[76px] h-[104px] rounded-[16px] overflow-hidden border-2 border-white bg-neutral-800 shadow-sm shadow-black/10">
              {isCameraOn ? (
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80" }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center bg-neutral-800">
                  <SymbolView name={{ ios: "video.slash.fill", android: "videocam_off", web: "videocam_off" }} size={18} tintColor="#D4D4D4" />
                </View>
              )}
            </View>

            {/* Speaking voice ripple visualizer next to mascot */}
            {(isAudioPlaying || isLocalSpeaking) && (
              <View className="absolute top-4 left-4 flex-row items-center gap-1 bg-white/80 px-2.5 py-1.5 rounded-full border border-white/90">
                <Animated.View style={[styles.visualizerBar, { height: 12 }, animatedWave1]} />
                <Animated.View style={[styles.visualizerBar, { height: 18 }, animatedWave2]} />
                <Animated.View style={[styles.visualizerBar, { height: 10 }, animatedWave3]} />
                <Text className="ml-1 font-poppins-bold text-[10px] text-[#5B3BF6]">
                  {isAudioPlaying ? teacherContext.name : "YOU"}
                </Text>
              </View>
            )}

            {/* ================= TEACHER SPEECH BUBBLE ================= */}
            <View className="absolute bottom-6 left-4 right-4 bg-white rounded-[20px] p-4.5 shadow-md border border-neutral-100 flex-row items-center justify-between">
              <View className="flex-1 pr-3 gap-0.5">
                <Text className="font-poppins-bold text-[17px] text-[#0D132B] leading-tight">
                  {isAudioPlaying ? (simulationTextOverride ? simulationTextOverride : currentPhrase.text) :
                   isLocalSpeaking ? "Listening to you..." :
                   isListening ? "Waiting for your input..." :
                   "Muted"}
                </Text>
                
                {showSubtitles && !simulationTextOverride && (
                  <View className="mt-1 border-t border-neutral-50 pt-1">
                    <Text className="font-poppins-medium text-[12.5px] text-[#5B3BF6] leading-tight">
                      {currentPhrase.pronunciation}
                    </Text>
                    <Text className="font-poppins-regular text-[12.5px] text-[#6B7280] leading-tight mt-0.5">
                      {currentPhrase.translation}
                    </Text>
                  </View>
                )}
              </View>

              {/* Sound playback button */}
              {!simulationTextOverride && (
                <TouchableOpacity
                  onPress={playAudioSimulation}
                  activeOpacity={0.8}
                  className="w-10 h-10 rounded-full bg-[#FAF9FF] border border-[#ECE9FC] items-center justify-center"
                >
                  <SymbolView
                    name={{
                      ios: isAudioPlaying ? "speaker.wave.3.fill" : "speaker.wave.2",
                      android: isAudioPlaying ? "volume_up" : "volume_down",
                      web: isAudioPlaying ? "volume_up" : "volume_down",
                    }}
                    size={16}
                    tintColor="#5B3BF6"
                  />
                </TouchableOpacity>
              )}

              {/* Speech bubble tail pointer */}
              <View
                style={styles.bubbleTail}
                className="absolute -bottom-2 right-12 w-4 h-4 bg-white"
              />
            </View>
          </View>

          {/* ================= AUDIO CALL ACTION CONTROLS ================= */}
          <View className="flex-row justify-around items-center px-4 my-4">
            {/* Camera Action */}
            <View className="items-center gap-1.5">
              <TouchableOpacity
                onPress={toggleCamera}
                activeOpacity={0.8}
                className={`w-[54px] h-[54px] rounded-full items-center justify-center shadow-xs border ${
                  isCameraOn ? "bg-white border-neutral-100" : "bg-neutral-100 border-transparent"
                }`}
              >
                <SymbolView
                  name={{
                    ios: isCameraOn ? "video.fill" : "video.slash.fill",
                    android: isCameraOn ? "videocam" : "videocam_off",
                    web: isCameraOn ? "videocam" : "videocam_off",
                  }}
                  size={20}
                  tintColor={isCameraOn ? "#0D132B" : "#8E94A8"}
                />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-[11px] text-[#8E94A8]">Camera</Text>
            </View>

            {/* Mic Action - Interactive with Stream Integration */}
            <View className="items-center gap-1.5">
              <View className="relative items-center justify-center">
                {isLocalSpeaking && (
                  <Animated.View
                    style={[
                      styles.micRippleOverlayControls,
                      animatedMicRipple,
                    ]}
                  />
                )}
                <TouchableOpacity
                  onPress={toggleMic}
                  activeOpacity={0.8}
                  className={`w-[54px] h-[54px] rounded-full items-center justify-center shadow-xs border ${
                    isLocalSpeaking
                      ? "bg-[#5B3BF6] border-transparent"
                      : !micState.isMuted
                      ? "bg-white border-neutral-100"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <SymbolView
                    name={{
                      ios: !micState.isMuted ? "mic.fill" : "mic.slash.fill",
                      android: !micState.isMuted ? "mic" : "mic_off",
                      web: !micState.isMuted ? "mic" : "mic_off",
                    }}
                    size={20}
                    tintColor={isLocalSpeaking ? "#FFFFFF" : !micState.isMuted ? "#0D132B" : "#EF4444"}
                  />
                </TouchableOpacity>
              </View>
              <Text className="font-poppins-semibold text-[11px] text-[#8E94A8]">Mic</Text>
            </View>

            {/* Subtitles Action */}
            <View className="items-center gap-1.5">
              <TouchableOpacity
                onPress={() => setShowSubtitles(!showSubtitles)}
                activeOpacity={0.8}
                className={`w-[54px] h-[54px] rounded-full items-center justify-center shadow-xs border ${
                  showSubtitles ? "bg-white border-neutral-100" : "bg-neutral-100 border-transparent"
                }`}
              >
                <SymbolView
                  name={{ ios: "character.duallanguage" as any, android: "translate", web: "translate" }}
                  size={20}
                  tintColor={showSubtitles ? "#0D132B" : "#8E94A8"}
                />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-[11px] text-[#8E94A8]">Subtitles</Text>
            </View>

            {/* End Call Action */}
            <View className="items-center gap-1.5">
              <TouchableOpacity
                onPress={handleEndCall}
                activeOpacity={0.85}
                className="w-[54px] h-[54px] rounded-full bg-[#EF4444] items-center justify-center shadow-md shadow-red-500/20"
              >
                <SymbolView
                  name={{ ios: "phone.down.fill", android: "call_end", web: "call_end" }}
                  size={20}
                  tintColor="#FFFFFF"
                />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-[11px] text-[#8E94A8]">End Call</Text>
            </View>
          </View>

          {/* ================= REAL-TIME RATINGS FEEDBACK ================= */}
          <View className="bg-white border border-neutral-100 rounded-[22px] p-4.5 flex-row justify-between shadow-xs mb-2">
            <View className="flex-1 items-center gap-1 border-r border-neutral-100">
              <Text className="font-poppins-semibold text-[12px] text-[#6B7280]">Speaking</Text>
              <Text
                style={{
                  color: speakingLevel === "Excellent" ? "#21C16B" : speakingLevel === "Great" ? "#4D8BFF" : speakingLevel === "Good" ? "#9070FF" : "#8E94A8"
                }}
                className="font-poppins-bold text-[15px]"
              >
                {speakingLevel}
              </Text>
            </View>

            <View className="flex-1 items-center gap-1 border-r border-neutral-100">
              <Text className="font-poppins-semibold text-[12px] text-[#6B7280]">Pronunciation</Text>
              <Text
                style={{
                  color: pronunciationLevel === "Excellent" ? "#21C16B" : pronunciationLevel === "Great" ? "#4D8BFF" : pronunciationLevel === "Good" ? "#9070FF" : "#8E94A8"
                }}
                className="font-poppins-bold text-[15px]"
              >
                {pronunciationLevel}
              </Text>
            </View>

            <View className="flex-1 items-center gap-1">
              <Text className="font-poppins-semibold text-[12px] text-[#6B7280]">Grammar</Text>
              <Text
                style={{
                  color: grammarLevel === "Excellent" ? "#21C16B" : grammarLevel === "Great" ? "#4D8BFF" : grammarLevel === "Good" ? "#9070FF" : "#8E94A8"
                }}
                className="font-poppins-bold text-[15px]"
              >
                {grammarLevel}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= LOOKALIKE TAB BAR ================= */}
        <View style={styles.tabBar} className="border-t border-[#F3F4F6] bg-white flex-row justify-around items-center">
          <TouchableOpacity onPress={() => handleTabNavigation("/(tabs)")} className="items-center gap-1 py-1.5 flex-1">
            <SymbolView name={{ ios: "house", android: "home", web: "home" }} size={20} tintColor="#9CA3AF" />
            <Text className="font-poppins-medium text-[10px] text-[#9CA3AF]">Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabNavigation("/(tabs)/learn")} className="items-center gap-1 py-1.5 flex-1 relative">
            <SymbolView name={{ ios: "book.fill", android: "menu_book", web: "menu_book" }} size={20} tintColor="#5B3BF6" />
            <Text className="font-poppins-bold text-[10px] text-[#5B3BF6]">Learn</Text>
            <View className="absolute bottom-1 w-6 h-0.5 bg-[#5B3BF6] rounded-full" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabNavigation("/(tabs)/ai-teacher")} className="items-center gap-1 py-1.5 flex-1">
            <SymbolView name={{ ios: "cpu", android: "smart_toy", web: "smart_toy" }} size={20} tintColor="#9CA3AF" />
            <Text className="font-poppins-medium text-[10px] text-[#9CA3AF]">Teacher</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabNavigation("/(tabs)/chat")} className="items-center gap-1 py-1.5 flex-1">
            <SymbolView name={{ ios: "bubble.left", android: "chat_bubble", web: "chat_bubble" }} size={20} tintColor="#9CA3AF" />
            <Text className="font-poppins-medium text-[10px] text-[#9CA3AF]">Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabNavigation("/(tabs)/profile")} className="items-center gap-1 py-1.5 flex-1">
            <SymbolView name={{ ios: "person", android: "person", web: "person" }} size={20} tintColor="#9CA3AF" />
            <Text className="font-poppins-medium text-[10px] text-[#9CA3AF]">Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ================= GORGEOUS COMPLETION OVERLAY MODAL ================= */}
        {showCompletionOverlay && (
          <View style={StyleSheet.absoluteFill} className="bg-black/60 items-center justify-center p-6 z-50">
            <View className="bg-white rounded-[28px] p-6 w-full max-w-[340px] items-center gap-4.5 shadow-xl border border-neutral-100">
              <Text className="text-[64px]">🎉</Text>
              
              <View className="items-center gap-1">
                <Text className="font-poppins-bold text-[24px] text-[#0D132B] text-center leading-tight">
                  Lesson Complete!
                </Text>
                <Text className="font-poppins-medium text-[13.5px] text-[#6B7280] text-center">
                  You successfully finished the AI Teacher audio session for:
                </Text>
                <Text className="font-poppins-bold text-[14.5px] text-[#5B3BF6] text-center mt-0.5">
                  {lesson.title}
                </Text>
              </View>

              {/* Call Summary Badge */}
              <View className="w-full bg-[#F6F7FB] rounded-2xl p-4 gap-2.5">
                <View className="flex-row justify-between items-center">
                  <Text className="font-poppins-semibold text-[13px] text-[#6B7280]">Call Duration</Text>
                  <Text className="font-poppins-bold text-[14px] text-[#0D132B]">{formatTime(callDuration)}</Text>
                </View>
                <View className="flex-row justify-between items-center border-t border-neutral-200/50 pt-2.5">
                  <Text className="font-poppins-semibold text-[13px] text-[#6B7280]">XP Earned</Text>
                  <Text className="font-poppins-bold text-[14px] text-[#FF8A00]">+{lesson.xp} XP 🔥</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleFinishLesson}
                activeOpacity={0.86}
                className="w-full h-13 bg-[#21C16B] rounded-[16px] items-center justify-center shadow-sm"
              >
                <Text className="font-poppins-bold text-[15px] text-white">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  bubbleTail: {
    transform: [{ rotate: "45deg" }],
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "#F3F4F6", // border-neutral-100
  },
  visualizerBar: {
    width: 3.5,
    borderRadius: 2,
    backgroundColor: "#5B3BF6", // bg-lingua-deep-purple
  },
  micRippleOverlayControls: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(91, 59, 246, 0.2)",
  },
  tabBar: {
    height: 66,
  },
});
