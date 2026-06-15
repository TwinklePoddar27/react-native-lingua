import * as ClerkReal from "@clerk/expo";
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Determine if we should use mock auth.
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

// We use mock auth if the key is missing or is the placeholder.
export const IS_MOCK_AUTH = !publishableKey || publishableKey === "your_clerk_publishable_key";

if (__DEV__) {
  console.log("[Auth] Clerk Publishable Key present:", !!publishableKey);
  console.log("[Auth] Mode:", IS_MOCK_AUTH ? "MOCK" : "PRODUCTION (CLERK)");
}

// Secure token cache for Clerk
export const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Mock context for mock auth state
const MockAuthContext = createContext<{
  isSignedIn: boolean;
  setIsSignedIn: (val: boolean) => void;
  userId: string | null;
  setUserId: (val: string | null) => void;
}>({
  isSignedIn: false,
  setIsSignedIn: () => {},
  userId: null,
  setUserId: () => {},
});

// Mock Clerk Provider
export function ClerkProvider({ children, publishableKey, tokenCache }: any) {
  if (!IS_MOCK_AUTH) {
    return React.createElement(ClerkReal.ClerkProvider, { publishableKey, tokenCache, children });
  }

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate auth state from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("mock_is_signed_in").then((val) => {
      if (val === "true") {
        setIsSignedIn(true);
        setUserId("mock_user_123");
      }
      setLoading(false);
    });
  }, []);

  const handleSetIsSignedIn = (val: boolean) => {
    setIsSignedIn(val);
    AsyncStorage.setItem("mock_is_signed_in", val ? "true" : "false");
  };

  if (loading) {
    return null; // wait for hydration
  }

  return React.createElement(
    MockAuthContext.Provider,
    { value: { isSignedIn, setIsSignedIn: handleSetIsSignedIn, userId, setUserId } },
    children
  );
}

// Mock Clerk Loaded
export function ClerkLoaded({ children }: any) {
  if (!IS_MOCK_AUTH) {
    return React.createElement(ClerkReal.ClerkLoaded, null, children);
  }
  return children;
}

// Mock useAuth
export function useAuth() {
  if (!IS_MOCK_AUTH) {
    return ClerkReal.useAuth();
  }

  const { isSignedIn, setIsSignedIn, userId, setUserId } = useContext(MockAuthContext);

  const signOut = async () => {
    setIsSignedIn(false);
    setUserId(null);
  };

  return {
    isLoaded: true,
    isSignedIn,
    userId,
    signOut,
  };
}

// Mock useUser
export function useUser() {
  if (!IS_MOCK_AUTH) {
    return ClerkReal.useUser();
  }

  const { isSignedIn, userId } = useContext(MockAuthContext);

  return {
    isLoaded: true,
    isSignedIn,
    user: isSignedIn
      ? {
          id: userId || "mock_user_123",
          firstName: "Demo",
          lastName: "Learner",
          fullName: "Demo Learner",
          imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80",
          primaryEmailAddress: { emailAddress: "demo@example.com" },
          emailAddresses: [{ emailAddress: "demo@example.com" }],
        }
      : null,
  };
}

// Mock useSignIn
export function useSignIn(): any {
  if (!IS_MOCK_AUTH) {
    return ClerkReal.useSignIn();
  }

  const { setIsSignedIn, setUserId } = useContext(MockAuthContext);

  const signInObject = {
    status: "needs_identifier",
    create: async ({ identifier }: any) => {
      console.log("[Mock] Created sign-in for:", identifier);
      return { status: "needs_first_factor" };
    },
    prepareFirstFactor: async ({ strategy }: any) => {
      console.log("[Mock] Prepared first factor:", strategy);
      return { status: "needs_attempt" };
    },
    attemptFirstFactor: async ({ strategy, code }: any) => {
      console.log("[Mock] Attempted verification with code:", code);
      return { status: "complete", createdSessionId: "mock_session_123" };
    },
    finalize: async ({ navigate }: any) => {
      navigate();
    },
  };

  return {
    isLoaded: true,
    signIn: signInObject,
    setActive: async (args: any) => {
      console.log("[Mock] setActive sign-in session:", args);
      setIsSignedIn(true);
      setUserId("mock_user_123");
    },
    fetchStatus: "idle",
  };
}

// Mock useSignUp
export function useSignUp(): any {
  if (!IS_MOCK_AUTH) {
    return ClerkReal.useSignUp();
  }

  const { setIsSignedIn, setUserId } = useContext(MockAuthContext);

  const signUpObject = {
    status: "needs_identifier",
    create: async ({ emailAddress, password }: any) => {
      console.log("[Mock] Created sign-up for:", emailAddress);
      return { status: "needs_verification" };
    },
    prepareEmailAddressVerification: async ({ strategy }: any) => {
      console.log("[Mock] Prepared email verification:", strategy);
      return { status: "needs_attempt" };
    },
    attemptEmailAddressVerification: async ({ code }: any) => {
      console.log("[Mock] Attempted verification with code:", code);
      return { status: "complete", createdSessionId: "mock_session_123" };
    },
    finalize: async ({ navigate }: any) => {
      navigate();
    },
  };

  return {
    isLoaded: true,
    signUp: signUpObject,
    setActive: async (args: any) => {
      console.log("[Mock] setActive signup session:", args);
      setIsSignedIn(true);
      setUserId("mock_user_123");
    },
    fetchStatus: "idle",
  };
}

// Mock useOAuth
export function useOAuth({ strategy }: { strategy: any }) {
  if (!IS_MOCK_AUTH) {
    return ClerkReal.useOAuth({ strategy });
  }

  const { setIsSignedIn, setUserId } = useContext(MockAuthContext);

  const startOAuthFlow = async () => {
    console.log("[Mock] Starting OAuth flow for:", strategy);
    setIsSignedIn(true);
    setUserId("mock_user_123");
    return {
      createdSessionId: "mock_session_123",
      setActive: async (args: any) => {
        console.log("[Mock] setActive session:", args);
        setIsSignedIn(true);
        setUserId("mock_user_123");
      },
    };
  };

  return {
    startOAuthFlow,
  };
}
