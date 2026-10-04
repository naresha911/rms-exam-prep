// PaperCard — previous-year paper catalogue card with status, metrics, and action row.

import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import { BORDER_RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
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

function createStyles(colors: ColorPalette) {
    return {
        card: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: 16,
            padding: SPACING[5],
            borderWidth: 1,
            borderColor: colors.backgroundTertiary,
            gap: 14,
            ...SHADOWS.sm,
        },
        accentSuccess: {
            borderLeftWidth: 4,
            borderLeftColor: colors.success,
        },
        accentWarning: {
            borderLeftWidth: 4,
            borderLeftColor: colors.warning,
        },
        topRow: {
            gap: SPACING[2],
        },
        latestChip: {
            gap: 4,
            backgroundColor: colors.primaryFixed,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: BORDER_RADIUS.full,
        },
        latestText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 11,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.primary,
        },
        title: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.textPrimary,
            lineHeight: 22,
        },
        subtitle: {
            marginTop: 2,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
        },
        metricsRow: {
            gap: SPACING[4],
            paddingTop: SPACING[1],
            borderTopWidth: 1,
            borderTopColor: colors.backgroundTertiary,
        },
        metricItem: {
            gap: 4,
        },
        metricEnd: {
            marginLeft: "auto" as const,
        },
        scoreText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        scoreOk: {
            color: colors.successText,
        },
        scoreWarn: {
            color: colors.amberText,
        },
        durationText: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            color: colors.onSurfaceVariant,
        },
        actionsRow: {
            gap: SPACING[2],
            paddingTop: 4,
        },
        actionBtn: {
            alignItems: "center" as const,
            justifyContent: "center" as const,
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
            borderColor: colors.primaryLight,
        },
        actionMuted: {
            backgroundColor: colors.surfaceContainerHigh,
        },
        actionSoft: {
            backgroundColor: colors.primaryFixed,
        },
        actionText: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        actionTextPrimary: {
            color: colors.primary,
        },
    };
}

function SecondaryActionButton({ action }: { action: PaperCardAction }) {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const variant = action.variant ?? "outline";
    const isOutline = variant === "outline";
    const isSoft = variant === "soft";

    return (
        <Pressable
            onPress={action.onPress}
            style={({ pressed }) => [
                layout.row,
                styles.actionBtn,
                styles.actionFlex,
                isOutline && styles.actionOutline,
                variant === "muted" && styles.actionMuted,
                isSoft && styles.actionSoft,
                pressed && layout.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={action.label}
        >
            {action.icon ? (
                <MaterialIcon name={action.icon} size={15} color={colors.primary} />
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
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const showMetrics = !!(metrics?.scoreLabel || metrics?.durationLabel);
    const primaryIsSolid = (primaryAction.variant ?? "primary") === "primary";
    const scoreIconColor = accent === "warning" ? colors.amberText : colors.successText;

    return (
        <View
            style={[
                styles.card,
                accent === "success" && styles.accentSuccess,
                accent === "warning" && styles.accentWarning,
                style,
            ]}
        >
            <View style={[layout.rowBetween, styles.topRow]}>
                <StatusBadge status={status} label={statusLabel} />
                {isLatest ? (
                    <View style={[layout.row, styles.latestChip]}>
                        <MaterialIcon name="auto_awesome" size={13} color={colors.primary} />
                        <Text style={styles.latestText}>{latestLabel}</Text>
                    </View>
                ) : null}
            </View>

            <View>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>

            {showMetrics ? (
                <View style={[layout.row, styles.metricsRow]}>
                    {metrics?.scoreLabel ? (
                        <View style={[layout.row, styles.metricItem]}>
                            <MaterialIcon name="military_tech" size={15} color={scoreIconColor} />
                            <Text style={[styles.scoreText, accent === "warning" ? styles.scoreWarn : styles.scoreOk]}>
                                {metrics.scoreLabel}
                            </Text>
                        </View>
                    ) : null}
                    {metrics?.durationLabel ? (
                        <View style={[layout.row, styles.metricItem, styles.metricEnd]}>
                            <MaterialIcon name="schedule" size={15} color={colors.onSurfaceVariant} />
                            <Text style={styles.durationText}>{metrics.durationLabel}</Text>
                        </View>
                    ) : null}
                </View>
            ) : null}

            <View style={[layout.row, styles.actionsRow]}>
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
                                    <MaterialIcon name={primaryAction.icon} size={15} color={colors.onPrimary} />
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

export default PaperCard;
