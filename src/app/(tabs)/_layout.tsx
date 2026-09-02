import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        home: "🏠",
        practice: "📖",
        tests: "📝",
        ai: "🤖",
        profile: "👤",
    };

    return (
        <View style={styles.tabIconContainer}>
            <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
                {icons[name] || "📌"}
            </Text>
            {focused && (
                <View style={styles.activeIndicator} />
            )}
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textTertiary,
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.cardBorder,
                    height: 70,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="practice"
                options={{
                    title: "Practice",
                    tabBarIcon: ({ focused }) => <TabIcon name="practice" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="tests"
                options={{
                    title: "Tests",
                    tabBarIcon: ({ focused }) => <TabIcon name="tests" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="ai"
                options={{
                    title: "AI Tutor",
                    tabBarIcon: ({ focused }) => <TabIcon name="ai" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabIconContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    tabIcon: {
        fontSize: 22,
        opacity: 0.6,
    },
    tabIconFocused: {
        opacity: 1,
    },
    activeIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
        marginTop: 4,
    },
});
