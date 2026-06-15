import * as ClerkReal from "@clerk/expo";
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Determine if we should use mock auth.
// We use mock auth if the Clerk Publishable Key is missing, has placeholder values, or starts with test.
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
export const IS_MOCK_AUTH = !publishableKey || publishableKey.includes("your_clerk") || publishableKey.startsWith("pk_test_dGVzd");

// Re-export tokenCache from the real package
export { tokenCache } from "@clerk/expo/token-cache";

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
    emailCode: {
      sendCode: async ({ emailAddress }: { emailAddress: string }) => {
        console.log("Mock signing in with emailAddress:", emailAddress);
        return { error: null };
      },
      verifyCode: async ({ code }: { code: string }) => {
        console.log("Mock verifying code:", code);
        setIsSignedIn(true);
        setUserId("mock_user_123");
        return { error: null };
      },
    },
    status: "complete",
    finalize: async ({ navigate }: { navigate: () => void }) => {
      navigate();
    },
    create: async (args: any) => {
      console.log("Mock signing in with OAuth/social:", args);
      setIsSignedIn(true);
      setUserId("mock_user_123");
      return { status: "complete" };
    },
    firstFactorVerification: {
      status: "complete",
      externalVerificationRedirectURL: "http://localhost:8081/oauth-native-callback",
    },
    createdSessionId: "mock_session_123",
    reload: async (args: any) => {
      console.log("Mock reload sign-in:", args);
    },
  };

  return {
    isLoaded: true,
    signIn: signInObject,
    setActive: async (args: any) => {
      console.log("Mock setActive sign-in session:", args);
      setIsSignedIn(true);
      setUserId("mock_user_123");
    },
    fetchStatus: "idle",
    firstFactorVerification: {
      status: "complete",
      externalVerificationRedirectURL: "http://localhost:8081/oauth-native-callback",
    },
    reload: async (args: any) => {
      console.log("Mock reload sign-in:", args);
    },
  };
}

// Mock useSignUp
export function useSignUp(): any {
  if (!IS_MOCK_AUTH) {
    return ClerkReal.useSignUp();
  }

  const { setIsSignedIn, setUserId } = useContext(MockAuthContext);

  const signUpObject = {
    emailCode: {
      sendCode: async ({ emailAddress }: { emailAddress: string }) => {
        console.log("Mock signing up with emailAddress:", emailAddress);
        return { error: null };
      },
      verifyCode: async ({ code }: { code: string }) => {
        console.log("Mock verifying signup code:", code);
        setIsSignedIn(true);
        setUserId("mock_user_123");
        return { error: null };
      },
    },
    verifications: {
      sendEmailCode: async () => {
        console.log("Mock sending email code");
        return { error: null };
      },
      verifyEmailCode: async ({ code }: { code: string }) => {
        console.log("Mock verifying email code:", code);
        setIsSignedIn(true);
        setUserId("mock_user_123");
        return { error: null };
      },
    },
    password: async (args: any) => {
      console.log("Mock sign up with password:", args);
      return { error: null };
    },
    status: "complete",
    finalize: async ({ navigate }: { navigate: () => void }) => {
      navigate();
    },
    create: async (args: any) => {
      console.log("Mock signing up with transfer/OAuth:", args);
      setIsSignedIn(true);
      setUserId("mock_user_123");
      return { status: "complete" };
    },
    createdSessionId: "mock_session_123",
  };

  return {
    isLoaded: true,
    signUp: signUpObject,
    setActive: async (args: any) => {
      console.log("Mock setActive signup session:", args);
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
    console.log("Mocking startOAuthFlow for strategy:", strategy);
    setIsSignedIn(true);
    setUserId("mock_user_123");
    return {
      createdSessionId: "mock_session_123",
      setActive: async (args: any) => {
        console.log("Mock setActive session:", args);
        setIsSignedIn(true);
        setUserId("mock_user_123");
      },
    };
  };

  return {
    startOAuthFlow,
  };
}
