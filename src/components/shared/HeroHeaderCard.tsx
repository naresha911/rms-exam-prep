// HeroHeaderCard — reusable mission hero for feature catalogues.
// Badge + title/description + illustration slot + optional duration badge + stats strip.

import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon, MaterialIconName } from "../ui/MaterialIcon";

export type HeroStat = {
    label: string;
    value: string;
    hint?: string;
    tone?: "default" | "success";
};

interface HeroHeaderCardProps {
    badgeIcon?: MaterialIconName;
    badgeLabel: string;
    title: string;
    description: string;
    illustration?: React.ReactNode;
    durationLabel?: string;
    stats: HeroStat[];
    style?: ViewStyle;
}

export const HeroHeaderCard: React.FC<HeroHeaderCardProps> = ({
    badgeIcon = "history_edu",
    badgeLabel,
    title,
    description,
    illustration,
    durationLabel,
    stats,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.topRow}>
                <View style={styles.copyCol}>
                    <View style={styles.badge}>
                        <MaterialIcon name={badgeIcon} size={13} color="#FCD34D" />
                        <Text style={styles.badgeText}>{badgeLabel}</Text>
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

                {illustration ? (
                    <View style={styles.illustrationWrap}>
                        {illustration}
                        {durationLabel ? (
                            <View style={styles.durationBadge}>
                                <Text style={styles.durationText}>⏱ {durationLabel}</Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}
            </View>

            {stats.length > 0 ? (
                <View style={styles.statsStrip}>
                    <View style={styles.statsGrid}>
                        {stats.map((stat) => (
                            <View key={stat.label} style={styles.statCell}>
                                <Text
                                    style={[
                                        styles.statLabel,
                                        stat.tone === "success" && styles.statLabelSuccess,
                                    ]}
                                >
                                    {stat.label}
                                </Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                {stat.hint ? <Text style={styles.statHint}>{stat.hint}</Text> : null}
                            </View>
                        ))}
                    </View>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS["2xl"],
        overflow: "hidden",
        padding: SPACING[5],
        backgroundColor: COLORS.primary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SPACING[3],
    },
    copyCol: {
        flex: 1,
        maxWidth: 210,
        gap: 6,
    },
    badge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
    },
    badgeText: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: 11,
        fontWeight: "700",
        color: "#FCD34D",
    },
    title: {
        fontFamily: "PlusJakartaSans_800ExtraBold",
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: "800",
        color: COLORS.onPrimary,
        letterSpacing: -0.3,
        lineHeight: 26,
    },
    description: {
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: "500",
        color: "rgba(224, 231, 255, 0.9)",
        lineHeight: 18,
    },
    illustrationWrap: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.20)",
        padding: 4,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
    },
    durationBadge: {
        position: "absolute",
        bottom: -6,
        right: -6,
        backgroundColor: "#FBBF24",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
    },
    durationText: {
        fontFamily: "PlusJakartaSans_800ExtraBold",
        fontSize: 10,
        fontWeight: "800",
        color: "#0F172A",
    },
    statsStrip: {
        marginTop: SPACING[4],
        paddingTop: SPACING[3],
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.10)",
    },
    statsGrid: {
        flexDirection: "row",
        gap: SPACING[2],
        backgroundColor: "rgba(255,255,255,0.10)",
        borderRadius: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
    },
    statCell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
    },
    statLabel: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        color: "rgba(199, 210, 254, 0.8)",
    },
    statLabelSuccess: {
        color: "#34D399",
    },
    statValue: {
        marginTop: 2,
        fontFamily: "PlusJakartaSans_800ExtraBold",
        fontSize: 13,
        fontWeight: "800",
        color: COLORS.onPrimary,
    },
    statHint: {
        marginTop: 1,
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: 10,
        fontWeight: "500",
        color: "rgba(199, 210, 254, 0.7)",
    },
});

export default HeroHeaderCard;
