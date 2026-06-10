import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onRequestClose?: () => void;
  email?: string;
  onVerify?: (code: string) => void;
  error?: string;
};

export default function VerificationModal({
  visible,
  onRequestClose,
  email,
  onVerify,
  error,
}: Props) {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<(TextInput | null)[]>([]);
  const [focusedIdx, setFocusedIdx] = useState(-1);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setCode(["", "", "", "", "", ""]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => refs.current[0]?.focus(), 300);
    }
  }, [visible]);

  useEffect(() => {
    if (code.every((c) => c.length === 1)) {
      setTimeout(() => {
        if (onVerify) {
          onVerify(code.join(""));
        } else {
          router.push("/");
          onRequestClose?.();
        }
      }, 250);
    }
  }, [code, router, onVerify, onRequestClose]);

  function handleChange(text: string, idx: number) {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    if (digit && refs.current[idx + 1]) {
      refs.current[idx + 1]?.focus();
    }
  }

  function handleKeyPress({ nativeEvent }: any, idx: number) {
    if (nativeEvent?.key === "Backspace" && idx > 0 && refs.current[idx - 1]) {
      refs.current[idx - 1]?.focus();
    }
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onRequestClose}>
      <Pressable style={styles.backdrop} onPress={onRequestClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 60}
          style={styles.keyboardView}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <Text className="font-poppins-semibold text-[18px] text-text-primary mb-2">
                Enter verification code
              </Text>
              <Text className="text-[14px] text-text-secondary mb-4">
                We sent a 6-digit code to {email ?? "your email"}. Enter it below.
              </Text>

              <View className="flex-row justify-center gap-2 mb-4">
                {code.map((c, i) => (
                  <TextInput
                    key={i}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    value={c}
                    onChangeText={(t) => handleChange(t, i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    onFocus={() => setFocusedIdx(i)}
                    onBlur={() => setFocusedIdx(-1)}
                    keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                    textContentType={i === 0 ? (Platform.OS === "ios" ? "oneTimeCode" : undefined) : undefined}
                    maxLength={1}
                    editable={true}
                    selectTextOnFocus={true}
                    style={[
                      styles.input,
                      {
                        borderColor: error ? "#ef4444" : (focusedIdx === i ? "#6c4ef5" : "#E5E7EB"),
                      },
                    ]}
                    returnKeyType="done"
                    autoFocus={i === 0}
                    placeholderTextColor="#ccc"
                  />
                ))}
              </View>
              
              {error ? (
                <Text className="text-red-500 text-[13px] text-center mb-4">
                  {error}
                </Text>
              ) : null}

              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={onRequestClose}
                  className="px-4 py-2 rounded-[10px] bg-surface"
                >
                  <Text className="text-text-primary">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "flex-end", 
    backgroundColor: "rgba(0,0,0,0.4)" 
  },
  keyboardView: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "flex-end" 
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  modalContainer: {
    width: "92%",
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      },
    }),
  },
  input: {
    flex: 1,
    maxWidth: 44,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "#f6f7fb",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#0d132b",
  },
});

