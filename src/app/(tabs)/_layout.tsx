import { Tabs, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, TYPOGRAPHY } from "../../constants";
import { MaterialIcon } from "../../components/ui/MaterialIcon";

interface TabIconProps {
  icon: "home" | "menu_book" | "assignment" | "history_edu" | "person";
  focused: boolean;
}

function TabIcon({ icon, focused }: TabIconProps) {
  const iconColor = focused ? COLORS.primary : COLORS.onSurfaceVariant;
  return (
    <View style={styles.iconContainer}>
      <MaterialIcon name={icon} size={24} color={iconColor} filled={focused} />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const baseHeight = 60;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: COLORS.surfaceContainerLowest,
          borderTopWidth: 1,
          borderTopColor: COLORS.surfaceContainer,
          height: baseHeight + insets.bottom + 4,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: TYPOGRAPHY.fontSize.xs,
          fontWeight: "600",
          fontFamily: "PlusJakartaSans_600SemiBold",
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ focused }) => <TabIcon icon="home" focused={focused} /> }} />
      <Tabs.Screen name="practice" options={{ title: "Learn", tabBarIcon: ({ focused }) => <TabIcon icon="menu_book" focused={focused} /> }} />
      <Tabs.Screen name="tests" options={{ title: "Mock Tests", tabBarIcon: ({ focused }) => <TabIcon icon="assignment" focused={focused} /> }} />
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
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ focused }) => <TabIcon icon="person" focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
});
