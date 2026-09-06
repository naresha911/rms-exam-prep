// CircularProgress — SVG donut chart matching mock test result & parent dashboard.
// Indigo→purple gradient ring, large % label in center, optional trend indicator.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { COLORS, TYPOGRAPHY } from "../../constants";

interface CircularProgressProps {
    percentage: number;   // 0–100
    size?: number;        // total SVG size, default 120
    strokeWidth?: number; // ring thickness, default 10
    label?: string;       // optional sub-label below %
    trend?: number;       // optional ±% change for parent dashboard
    style?: any;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    size = 120,
    strokeWidth = 10,
    label,
    trend,
    style,
}) => {
    const clamped = Math.min(Math.max(percentage, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const filled = (clamped / 100) * circumference;

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <Svg width={size} height={size} style={styles.svg}>
                <Defs>
                    <LinearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={COLORS.gradientStart} />
                        <Stop offset="100%" stopColor={COLORS.gradientEnd} />
                    </LinearGradient>
                </Defs>
                {/* Track */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={COLORS.surfaceContainer}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Fill */}
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

            {/* Center text */}
            <View style={styles.centerContent}>
                <Text style={[styles.percentage, { color: COLORS.primary }]}>
                    {Math.round(clamped)}
                    <Text style={styles.percentSign}>%</Text>
                </Text>
                {label && (
                    <Text style={styles.label}>{label}</Text>
                )}
                {trend !== undefined && (
                    <Text
                        style={[
                            styles.trend,
                            { color: trend >= 0 ? COLORS["success-green"] : COLORS.error },
                        ]}
                    >
                        {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    svg: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    centerContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    percentage: {
        fontFamily: "PlusJakartaSans_800ExtraBold",
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        lineHeight: TYPOGRAPHY.fontSize["2xl"] * 1.2,
        fontWeight: "800",
    },
    percentSign: {
        fontSize: TYPOGRAPHY.fontSize.lg,
    },
    label: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        marginTop: 2,
    },
    trend: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        marginTop: 2,
    },
});

export default CircularProgress;
