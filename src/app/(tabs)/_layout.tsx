import { useMemo } from "react";
import { Tabs, useRouter, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TYPOGRAPHY } from "../../constants";
import { useColors, useThemedStyles, type ColorPalette } from "../../theme";
import { MaterialIcon } from "../../components/ui/MaterialIcon";

interface TabIconProps {
  icon: "home" | "menu_book" | "assignment" | "history_edu" | "person";
  focused: boolean;
}

function TabIcon({ icon, focused }: TabIconProps) {
  const colors = useColors();
  const iconColor = focused ? colors.primary : colors.onSurfaceVariant;
  return (
    <View style={iconStyles.iconContainer}>
      <MaterialIcon name={icon} size={24} color={iconColor} filled={focused} />
    </View>
  );
}

function createTabStyles(_colors: ColorPalette) {
  return {
    label: {
      fontSize: TYPOGRAPHY.fontSize.xs,
      fontWeight: "600" as const,
      fontFamily: "PlusJakartaSans_600SemiBold",
      marginTop: 0,
    },
  };
}

const iconStyles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colors = useColors();
  const styles = useThemedStyles(createTabStyles);
  const tabBarStyle = useMemo(
    () =>
      StyleSheet.create({
        bar: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopWidth: 1,
          borderTopColor: colors.surfaceContainer,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
        },
      }).bar,
    [colors, insets.bottom]
  );
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ focused }) => <TabIcon icon="home" focused={focused} /> }} />
      <Tabs.Screen name="practice" options={{ title: "Learn", tabBarIcon: ({ focused }) => <TabIcon icon="menu_book" focused={focused} /> }} />
      <Tabs.Screen
        name="tests"
        options={{ title: "Mock Tests", tabBarIcon: ({ focused }) => <TabIcon icon="assignment" focused={focused} /> }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push("/test" as Href);
          },
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{ title: "Papers", tabBarIcon: ({ focused }) => <TabIcon icon="history_edu" focused={focused} /> }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push("/papers");
          },
        }}
      />
      {/* Named `me` to avoid clashing with the `/profile/*` stack (edit, settings, …). */}
      <Tabs.Screen name="me" options={{ title: "Profile", tabBarIcon: ({ focused }) => <TabIcon icon="person" focused={focused} /> }} />
    </Tabs>
  );
}
