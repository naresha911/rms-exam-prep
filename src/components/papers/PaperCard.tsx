// PaperCard — previous-year paper catalogue card with status, metrics, and action row.

import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon, MaterialIconName } from "../ui/MaterialIcon";
import { Button } from "../ui/Button";
import { StatusBadge } from "../shared/StatusBadge";
import type { PaperListStatus } from "../../types";

export type PaperCardAction = {
    label: string;
    onPress: () => void;
    icon?: MaterialIconName;
    variant?: "primary" | "outline" | "muted" | "soft";
};

interface PaperCardProps {
    title: string;
    subtitle?: string;
    status: PaperListStatus;
    statusLabel?: string;
    isLatest?: boolean;
    latestLabel?: string;
    metrics?: {
        scoreLabel?: string;
        durationLabel?: string;
    };
    accent?: "none" | "success" | "warning";
    primaryAction: PaperCardAction;
    secondaryAction?: PaperCardAction;
    style?: ViewStyle;
}

function SecondaryActionButton({ action }: { action: PaperCardAction }) {
    const variant = action.variant ?? "outline";
    const isOutline = variant === "outline";
    const isSoft = variant === "soft";

    return (
        <Pressable
            onPress={action.onPress}
            style={({ pressed }) => [
                styles.actionBtn,
                styles.actionFlex,
                isOutline && styles.actionOutline,
                variant === "muted" && styles.actionMuted,
                isSoft && styles.actionSoft,
                pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={action.label}
        >
            {action.icon ? (
                <MaterialIcon name={action.icon} size={15} color={COLORS.primary} />
            ) : null}
            <Text style={[styles.actionText, styles.actionTextPrimary]}>{action.label}</Text>
        </Pressable>
    );
}

export const PaperCard: React.FC<PaperCardProps> = ({
    title,
    subtitle,
    status,
    statusLabel,
    isLatest,
    latestLabel = "Latest Exam",
    metrics,
    accent = "none",
    primaryAction,
    secondaryAction,
    style,
}) => {
    const showMetrics = !!(metrics?.scoreLabel || metrics?.durationLabel);
    const primaryIsSolid = (primaryAction.variant ?? "primary") === "primary";

    return (
        <View
            style={[
                styles.card,
                accent === "success" && styles.accentSuccess,
                accent === "warning" && styles.accentWarning,
                style,
            ]}
        >
            <View style={styles.topRow}>
                <StatusBadge status={status} label={statusLabel} />
                {isLatest ? (
                    <View style={styles.latestChip}>
                        <MaterialIcon name="auto_awesome" size={13} color={COLORS.primary} />
                        <Text style={styles.latestText}>{latestLabel}</Text>
                    </View>
                ) : null}
            </View>

            <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            {showMetrics ? (
                <View style={styles.metricsRow}>
                    {metrics?.scoreLabel ? (
                        <View style={styles.metricItem}>
                            <MaterialIcon
                                name="military_tech"
                                size={15}
                                color={accent === "warning" ? "#B45309" : "#047857"}
                            />
                            <Text
                                style={[
                                    styles.scoreText,
                                    accent === "warning" ? styles.scoreWarn : styles.scoreOk,
                                ]}
                            >
                                {metrics.scoreLabel}
                            </Text>
                        </View>
                    ) : null}
                    {metrics?.durationLabel ? (
                        <View style={[styles.metricItem, styles.metricEnd]}>
                            <MaterialIcon name="schedule" size={15} color={COLORS.onSurfaceVariant} />
                            <Text style={styles.durationText}>{metrics.durationLabel}</Text>
                        </View>
                    ) : null}
                </View>
            ) : null}

            <View style={styles.actionsRow}>
                {secondaryAction ? <SecondaryActionButton action={secondaryAction} /> : null}
                {primaryIsSolid ? (
                    <View style={styles.actionFlex}>
                        <Button
                            title={primaryAction.label}
                            onPress={primaryAction.onPress}
                            size="sm"
                            fullWidth
                            iconRight={primaryAction.icon ? undefined : "arrow_forward"}
                            icon={
                                primaryAction.icon ? (
                                    <MaterialIcon name={primaryAction.icon} size={15} color={COLORS.onPrimary} />
                                ) : undefined
                            }
                        />
                    </View>
                ) : (
                    <SecondaryActionButton action={primaryAction} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: 16,
        padding: SPACING[5],
        borderWidth: 1,
        borderColor: "#F1F5F9",
        gap: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    accentSuccess: {
        borderLeftWidth: 4,
        borderLeftColor: "#10B981",
    },
    accentWarning: {
        borderLeftWidth: 4,
        borderLeftColor: "#FBBF24",
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SPACING[2],
    },
    latestChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(70, 72, 212, 0.10)",
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
    },
    latestText: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.primary,
    },
    title: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: "700",
        color: "#0F172A",
        lineHeight: 22,
    },
    subtitle: {
        marginTop: 2,
        fontFamily: "PlusJakartaSans_400Regular",
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
    },
    metricsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[4],
        paddingTop: SPACING[1],
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
    },
    metricItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metricEnd: {
        marginLeft: "auto",
    },
    scoreText: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: "700",
    },
    scoreOk: {
        color: "#047857",
    },
    scoreWarn: {
        color: "#B45309",
    },
    durationText: {
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: "500",
        color: COLORS.onSurfaceVariant,
    },
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
        paddingTop: 4,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        minHeight: 40,
    },
    actionFlex: {
        flex: 1,
    },
    actionOutline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "rgba(70, 72, 212, 0.20)",
    },
    actionMuted: {
        backgroundColor: COLORS.surfaceContainerHigh,
    },
    actionSoft: {
        backgroundColor: "rgba(70, 72, 212, 0.10)",
    },
    actionText: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: "600",
    },
    actionTextPrimary: {
        color: COLORS.primary,
    },
});

export default PaperCard;
