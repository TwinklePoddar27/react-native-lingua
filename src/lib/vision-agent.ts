import { Platform } from "react-native";
import { Lesson } from "@/types/learning";
import { getBackendBaseUrl } from "./config";

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
    const baseUrl = getBackendBaseUrl();
    const endpoint = baseUrl.includes('vercel.app') ? '/api/agent-session' : '/api/agent/session';

    const response = await fetch(`${baseUrl}${endpoint}`, {
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
 * Tells our API to interrupt the Vision Agent.
 */
export const interruptAgent = async (callId: string, sessionId: string) => {
  try {
    const baseUrl = getBackendBaseUrl();
    const endpoint = baseUrl.includes('vercel.app') ? '/api/agent-interrupt' : '/api/agent/interrupt';

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callId,
        sessionId,
      }),
    });

    if (!response.ok) {
      console.warn("Failed to interrupt agent session");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error interrupting agent session:", error);
    return false;
  }
};

/**
 * Tells our API to stop a Vision Agent session.
 */
export const stopAgentSession = async (callId: string, sessionId: string) => {
  try {
    const baseUrl = getBackendBaseUrl();
    const endpoint = baseUrl.includes('vercel.app') ? '/api/agent-session' : '/api/agent/session';

    // We use query params for DELETE proxying
    const response = await fetch(`${baseUrl}${endpoint}?callId=${callId}&sessionId=${sessionId}`, {
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
