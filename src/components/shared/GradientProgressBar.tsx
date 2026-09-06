// GradientProgressBar — Stitch "Tactile Tonal" progress indicator
// Uses indigo→purple gradient fill on a muted track, matching home dashboard and practice session.
// Height is configurable; default h-3 (12px) per Stitch spec.

import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { COLORS } from "../../constants";

interface GradientProgressBarProps {
    progress: number; // 0–1
    height?: number;
    trackColor?: string;
    style?: any;
}

export const GradientProgressBar: React.FC<GradientProgressBarProps> = ({
    progress,
    height = 12,
    trackColor = COLORS.surfaceVariant,
    style,
}) => {
    const clamped = Math.min(Math.max(progress, 0), 1);
    const fillPercent = Math.round(clamped * 100);

    return (
        <View
            style={[
                styles.track,
                { height, backgroundColor: trackColor, borderRadius: height / 2 },
                style,
            ]}
        >
            {/* Gradient fill — native SVG */}
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: height / 2,
                    overflow: "hidden",
                }}
            >
                <Svg
                    width="100%"
                    height={height}
                    style={{ position: "absolute", top: 0, left: 0 }}
                >
                    <Defs>
                        <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor={COLORS.gradientStart} />
                            <Stop offset="100%" stopColor={COLORS.gradientEnd} />
                        </LinearGradient>
                    </Defs>
                    <Rect
                        x="0"
                        y="0"
                        width={`${fillPercent}%`}
                        height={height}
                        rx={height / 2}
                        fill="url(#progressGradient)"
                    />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        width: "100%",
        overflow: "hidden",
        position: "relative",
    },
});

export default GradientProgressBar;
