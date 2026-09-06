// BentoSelectCard — large selectable card used in onboarding class/goal selection.
// Per Stitch: bg-surface, 2px outline-variant border, icon + title + subtitle,
// circular check on right, primary overlay highlight when selected.

import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon, MaterialIconName } from "./MaterialIcon";

interface BentoSelectCardProps {
    icon: MaterialIconName;
    iconColor?: string;
    title: string;
    subtitle?: string;
    selected?: boolean;
    onPress?: () => void;
    style?: any;
}

export const BentoSelectCard: React.FC<BentoSelectCardProps> = ({
    icon,
    iconColor = COLORS.primary,
    title,
    subtitle,
    selected = false,
    onPress,
    style,
}) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                selected && styles.containerSelected,
                pressed && styles.pressed,
                style,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
        >
            <View style={styles.content}>
                <View style={styles.left}>
                    <View style={styles.titleRow}>
                        <MaterialIcon name={icon} size={20} color={iconColor} />
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <View
                    style={[
                        styles.check,
                        selected
                            ? { borderColor: COLORS.primary, backgroundColor: COLORS.primary }
                            : { borderColor: COLORS.outlineVariant, backgroundColor: "transparent" },
                    ]}
                >
                    {selected && <MaterialIcon name="check" size={14} color="#fff" weight={700} />}
                </View>
            </View>
            {/* Selection overlay (Stitch: primary border + 5% primary fill) */}
            {selected && <View style={styles.overlay} pointerEvents="none" />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING[6],
        overflow: "hidden",
        position: "relative",
    } as ViewStyle,
    containerSelected: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    pressed: {
        transform: [{ scale: 0.99 }],
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: {
        flex: 1,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
    },
    title: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.onSurface,
        fontWeight: "700",
    },
    subtitle: {
        fontFamily: "PlusJakartaSans_400Regular",
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurfaceVariant,
        marginTop: SPACING[1],
    },
    check: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(70, 72, 212, 0.05)",
    },
});

export default BentoSelectCard;
