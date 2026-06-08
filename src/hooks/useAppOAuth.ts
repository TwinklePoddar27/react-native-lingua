import { useOAuth } from "@clerk/expo";
import { useSignIn, useSignUp } from "@clerk/expo/legacy";
import { useCallback } from "react";
import { Platform } from "react-native";

export const useAppOAuth = (options: { strategy: "oauth_google" | "oauth_facebook" | "oauth_apple" }) => {
  const { strategy } = options;
  const { startOAuthFlow: startNativeOAuthFlow } = useOAuth({ strategy });
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp } = useSignUp();

  const startOAuthFlow = useCallback(async () => {
    if (Platform.OS !== "web") {
      return startNativeOAuthFlow();
    }

    // Web popup flow to bypass popup blockers
    const popupWidth = 600;
    const popupHeight = 600;
    const left = window.screen.width / 2 - popupWidth / 2;
    const top = window.screen.height / 2 - popupHeight / 2;

    const popup = window.open(
      "about:blank",
      "clerk-oauth",
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      throw new Error("Popup window was blocked by the browser or failed to open.");
    }

    try {
      if (!signIn || !signUp || !setSignInActive) {
        popup.close();
        throw new Error("Clerk is not loaded");
      }

      const oauthRedirectUrl = window.location.origin + "/oauth-native-callback";

      await signIn.create({ strategy, redirectUrl: oauthRedirectUrl });
      const { externalVerificationRedirectURL } = signIn.firstFactorVerification;

      if (!externalVerificationRedirectURL) {
        popup.close();
        throw new Error("Failed to get external verification redirect URL");
      }

      popup.location.href = externalVerificationRedirectURL.toString();

      return new Promise<any>((resolve, reject) => {
        const pollTimer = setInterval(async () => {
          try {
            if (popup.closed) {
              clearInterval(pollTimer);
              reject(new Error("Flow cancelled by user"));
              return;
            }

            if (popup.location.href.startsWith(oauthRedirectUrl) || popup.location.href.includes("rotating_token_nonce")) {
              const popupUrl = popup.location.href;
              clearInterval(pollTimer);
              popup.close();

              const urlObj = new URL(popupUrl);
              const rotatingTokenNonce = urlObj.searchParams.get("rotating_token_nonce") || "";

              await signIn.reload({ rotatingTokenNonce });
              const { status, firstFactorVerification } = signIn;

              let createdSessionId = "";
              if (status === "complete") {
                createdSessionId = signIn.createdSessionId || "";
              } else if (firstFactorVerification.status === "transferable") {
                await signUp.create({ transfer: true });
                createdSessionId = signUp.createdSessionId || "";
              }

              resolve({
                createdSessionId,
                signIn,
                signUp,
                setActive: setSignInActive,
              });
            }
          } catch {
            // Ignore cross-origin errors during polling
          }
        }, 500);
      });
    } catch (err) {
      if (popup) popup.close();
      throw err;
    }
  }, [strategy, startNativeOAuthFlow, signIn, signUp, setSignInActive]);

  return { startOAuthFlow };
};
