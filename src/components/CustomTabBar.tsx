import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SymbolView } from "expo-symbols";

type TabButtonProps = {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  tabWidth: number;
};

const getIconName = (name: string, active: boolean): any => {
  switch (name) {
    case "index":
      return { ios: active ? "house.fill" : "house", android: "home", web: "home" };
    case "learn":
      return { ios: active ? "book.fill" : "book", android: "menu_book", web: "menu_book" };
    case "ai-teacher":
      return { ios: active ? "robot.fill" : "robot", android: "smart_toy", web: "smart_toy" };
    case "chat":
      return { ios: active ? "bubble.left.fill" : "bubble.left", android: "chat_bubble", web: "chat_bubble" };
    case "profile":
      return { ios: active ? "person.fill" : "person", android: "person", web: "person" };
    default:
      return { ios: "questionmark", android: "help", web: "help" };
  }
};

const getLabel = (name: string) => {
  switch (name) {
    case "index":
      return "Home";
    case "learn":
      return "Learn";
    case "ai-teacher":
      return "AI Teacher";
    case "chat":
      return "Chat";
    case "profile":
      return "Profile";
    default:
      return name;
  }
};

function TabButton({ route, isFocused, onPress, tabWidth }: TabButtonProps) {
  const activeProgress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withSpring(isFocused ? 1 : 0, {
      damping: 18,
      stiffness: 150,
      mass: 0.8,
    });
  }, [isFocused, activeProgress]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const translateY = activeProgress.value * 10;
    return {
      transform: [{ translateY }],
    };
  });

  const animatedInactiveIconStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - activeProgress.value,
    };
  });

  const animatedActiveIconStyle = useAnimatedStyle(() => {
    return {
      opacity: activeProgress.value,
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - activeProgress.value,
      transform: [{ translateY: activeProgress.value * 5 }],
    };
  });

  const iconNameInactive = getIconName(route.name, false);
  const iconNameActive = getIconName(route.name, true);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.tabButton, { width: tabWidth }]}
    >
      <View style={styles.tabItemContainer}>
        {/* Icon Container */}
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          {/* Inactive Icon */}
          <Animated.View style={animatedInactiveIconStyle}>
            <SymbolView name={iconNameInactive} size={24} tintColor="#9CA3AF" />
          </Animated.View>
          {/* Active Icon (overlayed) */}
          <Animated.View style={[animatedActiveIconStyle, StyleSheet.absoluteFill, styles.activeIconOverlay]}>
            <SymbolView name={iconNameActive} size={24} tintColor="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        {/* Label Container */}
        <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
          <Text style={styles.inactiveLabel}>{getLabel(route.name)}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

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
            <TabButton
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              tabWidth={tabWidth}
            />
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
    paddingBottom: 24, // Padding for safe areas on mobile devices
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
  tabItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconContainer: {
    width: 24,
    height: 24,
    position: "relative",
  },
  activeIconOverlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    marginTop: 4,
    alignItems: "center",
  },
  inactiveLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    color: "#9CA3AF",
    textAlign: "center",
  },
});
