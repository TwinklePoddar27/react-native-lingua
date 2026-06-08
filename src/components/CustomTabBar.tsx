import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width, 420);
  const tabWidth = containerWidth / 5;
  const circleDiameter = 48;

  const translateX = useSharedValue(0);

  useEffect(() => {
    const targetX = state.index * tabWidth + (tabWidth - circleDiameter) / 2;
    translateX.value = withSpring(targetX, {
      damping: 18,
      stiffness: 150,
      mass: 0.8,
    });
  }, [state.index, tabWidth, translateX]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const getEmoji = (name: string) => {
    switch (name) {
      case "index":
        return "🏠";
      case "learn":
        return "📚";
      case "ai-teacher":
        return "🤖";
      case "chat":
        return "💬";
      case "profile":
        return "👤";
      default:
        return "❓";
    }
  };

  const getLabel = (name: string) => {
    switch (name) {
      case "index":
        return "Home";
      case "learn":
        return "Learn";
      case "ai-teacher":
        return "Teacher";
      case "chat":
        return "Chat";
      case "profile":
        return "Profile";
      default:
        return name;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, { width: containerWidth }]}>
        {/* Animated sliding background circle */}
        <Animated.View
          style={[
            styles.activeCircle,
            {
              width: circleDiameter,
              height: circleDiameter,
              borderRadius: circleDiameter / 2,
            },
            animatedCircleStyle,
          ]}
        />

        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={[styles.tabButton, { width: tabWidth }]}
            >
              {isFocused ? (
                <View style={styles.activeIconContainer}>
                  <Text style={styles.activeEmoji}>{getEmoji(route.name)}</Text>
                </View>
              ) : (
                <View style={styles.inactiveContainer}>
                  <Text style={styles.inactiveEmoji}>{getEmoji(route.name)}</Text>
                  <Text style={styles.inactiveLabel}>{getLabel(route.name)}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderTopWidth: 1.5,
    borderTopColor: "#F3F4F6",
    paddingBottom: 16, // Extra spacing for native bottom bar area
  },
  container: {
    flexDirection: "row",
    height: 72,
    position: "relative",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  activeCircle: {
    position: "absolute",
    backgroundColor: "#5B3BF6", // bg-lingua-deep-purple
    top: 12, // (72 - 48) / 2 = 12
    shadowColor: "#5B3BF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButton: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  activeEmoji: {
    fontSize: 24,
  },
  inactiveContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveEmoji: {
    fontSize: 22,
    opacity: 0.6,
  },
  inactiveLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    color: "#6B7280",
    marginTop: 3,
  },
});
