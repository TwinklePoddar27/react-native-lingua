import PostHog from "posthog-react-native";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (!apiKey) {
  console.warn("PostHog API key is missing. Analytics will not be sent.");
}

// Complete mock client to prevent any background network fetches or flush operations
class MockPostHog {
  capture() {}
  identify() {}
  screen() {}
  flush() { return Promise.resolve(); }
  flushAsync() { return Promise.resolve(); }
  reset() {}
  getFeatureFlag() { return null; }
  getFeatureFlagPayload() { return null; }
  isFeatureEnabled() { return false; }
  onFeatureFlags() { return () => {}; }
  reloadFeatureFlags() { return Promise.resolve(); }
  optIn() {}
  optOut() {}
  hasOptedIn() { return true; }
  hasOptedOut() { return false; }
  _flush() { return Promise.resolve(); }
  debug() {}
}

export const posthog = apiKey
  ? new PostHog(apiKey, {
      host: host || "https://us.i.posthog.com",
    })
  : (new MockPostHog() as any);

