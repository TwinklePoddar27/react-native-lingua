import { Platform } from "react-native";
import { getBackendBaseUrl } from "./config";

// Types are imported as "type" so they don't trigger runtime logic
import type { StreamVideoClient as ClientType, User } from "@stream-io/video-react-native-sdk";

let client: ClientType | null = null;

/**
 * Initializes and returns a Stream Video Client.
 * Fetches the token from the Expo API route.
 */
export const getStreamClient = async (
  userId: string,
  name: string,
  image: string
): Promise<ClientType> => {
  // Guard against web/server execution for native SDK
  if (Platform.OS === "web") {
    throw new Error("Stream Video SDK is not supported on web in this implementation.");
  }

  // Dynamically require the SDK only on native platforms
  const { StreamVideoClient } = require("@stream-io/video-react-native-sdk");

  // If client already exists for this user, return it
  if (client && (client as any).activeUser?.id === userId) {
    return client;
  }

  // If client exists but for a different user, disconnect first
  if (client) {
    await client.disconnectUser();
  }

  // Fetch token and API key from our API route
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}/api/stream/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, name, image }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch Stream token");
  }

  const { token, apiKey } = await response.json();

  const user: User = {
    id: userId,
    name,
    image,
  };

  client = new StreamVideoClient({
    apiKey,
    user,
    token,
  });

  return client!;
};

/**
 * Helper to get or create a call for a specific lesson
 */
export const getOrCreateCall = async (
  client: ClientType,
  callId: string,
  type: string = "default"
) => {
  const call = client.call(type, callId);
  await call.getOrCreate();
  return call;
};
