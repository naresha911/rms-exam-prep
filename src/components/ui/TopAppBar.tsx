// TopAppBar — sticky header used in home dashboard, parent dashboard, papers list.
// Per Stitch: avatar (round, primary container bg, primary border) + "AISSEE Cadet" brand
// (Cadet in primary) + optional subtitle + trailing streak pill + notification icon.

import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon } from "./MaterialIcon";

interface TopAppBarProps {
    title?: string; // override brand text
    highlight?: string; // part of the brand to render in primary (default "Cadet")
    subtitle?: string;
    avatarUri?: string | null;
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
    subtitle,
    avatarUri,
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
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                    ) : (
                        <MaterialIcon name="person" size={20} color={COLORS.onPrimaryContainer} filled />
                    )}
                </View>
                <View style={styles.brandTextWrap}>
                    <Text style={styles.brand} numberOfLines={1}>
                        {title}{" "}
                        <Text style={styles.brandHighlight}>{highlight}</Text>
                    </Text>
                    {subtitle ? (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
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
        gap: 10,
        flexShrink: 1,
        minWidth: 0,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryContainer,
        borderWidth: 1,
        borderColor: "rgba(70, 72, 212, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
    },
    avatarImage: {
        width: "100%",
        height: "100%",
    },
    brandTextWrap: {
        flexShrink: 1,
        minWidth: 0,
    },
    brand: {
        fontFamily: "PlusJakartaSans_800ExtraBold",
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.primary,
        fontWeight: "800",
        letterSpacing: -0.2,
    },
    brandHighlight: {
        color: COLORS.primary,
        fontFamily: "PlusJakartaSans_800ExtraBold",
        fontWeight: "800",
    },
    subtitle: {
        marginTop: 1,
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        fontWeight: "500",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
        flexShrink: 0,
    },
    streakPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: COLORS.surfaceContainerHigh,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    streakValue: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.tertiary,
        fontWeight: "700",
    },
    iconButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
    },
});

export default TopAppBar;
