// BottomNav — 5-destination bottom tab bar matching Stitch home_dashboard.
// Active state: filled circular pill with primary-container bg + on-primary-container icon.
// Inactive: text-only with on-surface-variant color.

import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon, MaterialIconName } from "./MaterialIcon";

interface NavItem {
    name: string;
    label: string;
    icon: MaterialIconName;
    activeIcon?: MaterialIconName;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    { name: "index", label: "Home", icon: "home", href: "/(tabs)" },
    { name: "practice", label: "Practice", icon: "menu_book", href: "/(tabs)/practice" },
    { name: "tests", label: "Mock Tests", icon: "assignment", href: "/(tabs)/tests" },
    { name: "ai", label: "AI Tutor", icon: "smart_toy", href: "/(tabs)/ai" },
    { name: "profile", label: "Profile", icon: "person", href: "/(tabs)/me" },
];

interface BottomNavProps {
    style?: any;
}

export const BottomNav: React.FC<BottomNavProps> = ({ style }) => {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (item: NavItem) => {
        if (item.name === "index") return pathname === "/(tabs)" || pathname === "/(tabs)/";
        return pathname.startsWith(item.href);
    };

    return (
        <View style={[styles.container, style]}>
            {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                return (
                    <Pressable
                        key={item.name}
                        onPress={() => router.push(item.href as any)}
                        style={styles.tab}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                    >
                        <View
                            style={[
                                styles.tabContent,
                                active && styles.tabContentActive,
                            ]}
                        >
                            <MaterialIcon
                                name={active ? (item.activeIcon ?? item.icon) : item.icon}
                                size={24}
                                color={active ? COLORS.onPrimaryContainer : COLORS.onSurfaceVariant}
                            />
                            <Text
                                style={[
                                    styles.label,
                                    active ? styles.labelActive : styles.labelInactive,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
        paddingBottom: Platform.OS === "ios" ? 20 : 8,
        paddingTop: 8,
        height: 70,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    tabContent: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: BORDER_RADIUS.xl,
        minWidth: 52,
        minHeight: 48,
    },
    tabContentActive: {
        backgroundColor: COLORS.primaryContainer,
        // The Stitch design shows a filled pill — we achieve this with the bg
    },
    label: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: "600",
        marginTop: 2,
    },
    labelActive: {
        color: COLORS.onPrimaryContainer,
    },
    labelInactive: {
        color: COLORS.onSurfaceVariant,
    },
});

export default BottomNav;
