import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Centeralized configuration for the app.
 * In a real production app, you would deploy your /api routes to a server (Vercel, Render, etc.)
 * and set EXPO_PUBLIC_BACKEND_URL to that URL.
 */
export const getBackendBaseUrl = () => {
  // If a public backend URL is provided in .env, use it (highest priority)
  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    return process.env.EXPO_PUBLIC_BACKEND_URL.replace(/\/$/, "");
  }

  // Web fallback
  if (Platform.OS === "web") {
    return typeof window !== 'undefined' ? window.location.origin : "";
  }

  // Development/Local environment logic
  let debuggerHost = Constants.expoConfig?.hostUri;

  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    return `http://${host}:8081`;
  }

  // Default fallbacks for local dev
  return Platform.OS === "android" ? "http://10.0.2.2:8081" : "http://localhost:8081";
};
