// TopAppBar — sticky header used in home dashboard, parent dashboard, mock test result.
// Per Stitch: avatar (round, primary container bg, primary border) + "AISSEE Cadet" brand
// (Cadet in primary) + trailing streak pill + notification icon.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon, MaterialIconName } from "./MaterialIcon";

interface TopAppBarProps {
    title?: string;          // override brand text
    highlight?: string;      // part of the brand to render in primary (default "Cadet")
    streak?: number;
    onPressProfile?: () => void;
    onPressNotification?: () => void;
    onPressLogo?: () => void;
    backgroundColor?: string;
    showNotification?: boolean;
    rightSlot?: React.ReactNode;
    style?: any;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
    title = "AISSEE",
    highlight = "Cadet",
    streak,
    onPressProfile,
    onPressNotification,
    onPressLogo,
    backgroundColor = COLORS.surface,
    showNotification = true,
    rightSlot,
    style,
}) => {
    return (
        <View style={[styles.container, { backgroundColor }, style]}>
            <Pressable
                onPress={onPressLogo ?? onPressProfile}
                style={styles.brandWrap}
                accessibilityRole="button"
                accessibilityLabel="Profile"
            >
                <View style={styles.avatar}>
                    <MaterialIcon name="person" size={20} color={COLORS.onPrimaryContainer} filled />
                </View>
                <Text style={styles.brand}>
                    {title}{" "}
                    <Text style={styles.brandHighlight}>{highlight}</Text>
                </Text>
            </Pressable>

            <View style={styles.actions}>
                {streak !== undefined && (
                    <View style={styles.streakPill}>
                        <Text style={styles.streakValue}>{streak}</Text>
                        <MaterialIcon name="local_fire_department" size={16} color={COLORS["warning-amber"]} filled />
                    </View>
                )}
                {showNotification && (
                    <Pressable
                        onPress={onPressNotification}
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && { backgroundColor: COLORS.surfaceVariant },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel="Notifications"
                    >
                        <MaterialIcon name="notifications" size={22} color={COLORS.onSurfaceVariant} />
                    </Pressable>
                )}
                {rightSlot}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SPACING[4],
        height: 64,
        width: "100%",
    },
    brandWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[3],
        flexShrink: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryContainer,
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    brand: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        fontWeight: "700",
    },
    brandHighlight: {
        color: COLORS.primary,
        fontFamily: "PlusJakartaSans_700Bold",
        fontWeight: "700",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[3],
    },
    streakPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(245, 158, 11, 0.10)",
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[2],
        borderRadius: BORDER_RADIUS.full,
    },
    streakValue: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS["warning-amber"],
        fontWeight: "700",
    },
    iconButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
});

export default TopAppBar;
