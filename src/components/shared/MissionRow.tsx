// MissionRow — single task row used in "Today's Plan" on the home dashboard.
// Per Stitch: icon tile (primary/secondary/tertiary container bg) + title + subtitle + status circle.
// Matches stitch_screens/home_dashboard/code.html lines 250–292.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";
import { MaterialIcon, MaterialIconName } from "../ui/MaterialIcon";

export type MissionStatus = "not_started" | "completed" | "in_progress";

interface MissionRowProps {
    icon: MaterialIconName;
    title: string;
    subtitle: string;
    status?: MissionStatus;
    iconBg?: string;
    iconColor?: string;
    onPress?: () => void;
    style?: any;
}

export const MissionRow: React.FC<MissionRowProps> = ({
    icon,
    title,
    subtitle,
    status = "not_started",
    iconBg = COLORS.primaryContainer,
    iconColor = COLORS.onPrimaryContainer,
    onPress,
    style,
}) => {
    const Wrapper: any = onPress ? Pressable : View;
    const wrapperProps = onPress ? { onPress } : {};

    return (
        <Wrapper
            {...wrapperProps}
            style={({ pressed }: any) => [
                styles.container,
                pressed && { backgroundColor: COLORS.surfaceMuted },
                style,
            ]}
        >
            <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                <MaterialIcon name={icon} size={22} color={iconColor} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
            <View style={styles.statusWrap}>
                {status === "completed" ? (
                    <View style={[styles.statusCircle, { backgroundColor: COLORS["success-green"] }]}>
                        <MaterialIcon name="check" size={14} color="#fff" weight={700} />
                    </View>
                ) : (
                    <View
                        style={[
                            styles.statusCircle,
                            {
                                borderWidth: 2,
                                borderColor:
                                    status === "in_progress" ? COLORS.primary : COLORS.outlineVariant,
                                backgroundColor: status === "in_progress" ? COLORS.primary : "transparent",
                            },
                        ]}
                    />
                )}
            </View>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: SPACING[3],
        borderRadius: SPACING[4],
        gap: SPACING[4],
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
    },
    title: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurface,
        fontWeight: "600",
    },
    subtitle: {
        fontFamily: "PlusJakartaSans_400Regular",
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        marginTop: 2,
    },
    statusWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    statusCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default MissionRow;
