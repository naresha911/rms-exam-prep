// CircularProgress — SVG donut chart matching mock test result & parent dashboard.
// Indigo→purple gradient ring, large % label in center, optional trend indicator.

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';

interface CircularProgressProps {
    percentage: number;   // 0–100
    size?: number;        // total SVG size, default 120
    strokeWidth?: number; // ring thickness, default 10
    label?: string;       // optional sub-label below %
    trend?: number;       // optional ±% change for parent dashboard
    style?: any;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            position: 'relative' as const,
        },
        svg: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
        },
        percentage: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize['2xl'],
            lineHeight: TYPOGRAPHY.fontSize['2xl'] * 1.2,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            color: colors.primary,
        },
        percentSign: {
            fontSize: TYPOGRAPHY.fontSize.lg,
        },
        label: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            marginTop: 2,
        },
        trend: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            marginTop: 2,
        },
        trendUp: {
            color: colors['success-green'],
        },
        trendDown: {
            color: colors.error,
        },
    };
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    size = 120,
    strokeWidth = 10,
    label,
    trend,
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const clamped = Math.min(Math.max(percentage, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const filled = (clamped / 100) * circumference;
    const frame = useMemo(
        () => StyleSheet.create({ box: { width: size, height: size } }),
        [size],
    );

    return (
        <View style={[layout.center, styles.container, frame.box, style]}>
            <Svg width={size} height={size} style={styles.svg}>
                <Defs>
                    <LinearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={colors.gradientStart} />
                        <Stop offset="100%" stopColor={colors.gradientEnd} />
                    </LinearGradient>
                </Defs>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors.surfaceContainer}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#donutGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${filled} ${circumference}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>

            <View style={layout.center}>
                <Text style={styles.percentage}>
                    {Math.round(clamped)}
                    <Text style={styles.percentSign}>%</Text>
                </Text>
                {label ? <Text style={styles.label}>{label}</Text> : null}
                {trend !== undefined ? (
                    <Text style={[styles.trend, trend >= 0 ? styles.trendUp : styles.trendDown]}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </Text>
                ) : null}
            </View>
        </View>
    );
};

export default CircularProgress;
