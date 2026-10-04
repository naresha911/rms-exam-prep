import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';

interface ProgressBarProps {
    progress: number; // 0 to 1
    height?: number;
    color?: string;
    backgroundColor?: string;
    showLabel?: boolean;
    label?: string;
    style?: ViewStyle;
}

function createStyles(colors: ColorPalette) {
    return {
        labelRow: {
            marginBottom: SPACING[1],
        },
        label: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: '600' as const,
            color: colors.textPrimary,
        },
        percent: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
        },
        fill: {
            height: '100%' as const,
            borderRadius: BORDER_RADIUS.full,
        },
    };
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 8,
    color,
    backgroundColor,
    showLabel = false,
    label,
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const barColor = color ?? colors.primary;
    const trackColor = backgroundColor ?? colors.backgroundTertiary;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const percentage = Math.round(clampedProgress * 100);

    const metrics = useMemo(
        () =>
            StyleSheet.create({
                track: {
                    height,
                    backgroundColor: trackColor,
                    borderRadius: BORDER_RADIUS.full,
                    overflow: 'hidden',
                },
                fill: {
                    width: `${percentage}%` as `${number}%`,
                    backgroundColor: barColor,
                },
            }),
        [height, trackColor, percentage, barColor],
    );

    return (
        <View style={style}>
            {showLabel ? (
                <View style={[layout.rowBetween, styles.labelRow]}>
                    <Text style={styles.label}>{label || `${percentage}%`}</Text>
                    {label ? <Text style={styles.percent}>{percentage}%</Text> : null}
                </View>
            ) : null}
            <View style={metrics.track}>
                <View style={[styles.fill, metrics.fill]} />
            </View>
        </View>
    );
};

export default ProgressBar;
