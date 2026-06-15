import { Platform } from "react-native";
import Constants from "expo-constants";
import { Lesson } from "@/types/learning";

const getBaseUrl = () => {
  if (Platform.OS === "web") return typeof window !== 'undefined' ? window.location.origin : "";

  let debuggerHost = Constants.expoConfig?.hostUri;

  // SANITIZE: Force port to 8081 if it's stuck on 8083 or any other port
  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    return `http://${host}:8081`;
  }

  // Fallback for Android emulator
  return Platform.OS === "android" ? "http://10.0.2.2:8081" : "http://localhost:8081";
};

/**
 * Tells our API to start a Vision Agent session.
 * The API will update the call metadata and then proxy to the Python agent.
 */
export const startAgentSession = async (
  callId: string,
  languageId: string,
  lesson: Lesson,
  callType: string = "default"
) => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/agent/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callId,
        callType,
        languageId,
        lesson,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || "Failed to start agent session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error starting agent session:", error);
    throw error;
  }
};

/**
 * Tells our API to stop a Vision Agent session.
 */
export const stopAgentSession = async (callId: string, sessionId: string) => {
  try {
    const baseUrl = getBaseUrl();
    // We use query params for DELETE proxying
    const response = await fetch(`${baseUrl}/api/agent/session?callId=${callId}&sessionId=${sessionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to stop agent session");
    }

    return true;
  } catch (error) {
    console.error("Error stopping agent session:", error);
    return false;
  }
};
