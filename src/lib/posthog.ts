import PostHog from "posthog-react-native";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (!apiKey) {
  console.warn("PostHog API key is missing. Analytics will not be sent.");
}

export const posthog = new PostHog(apiKey || "", {
  host: host || "https://us.i.posthog.com",
});
