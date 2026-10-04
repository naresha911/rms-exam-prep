// GradientProgressBar — Stitch "Tactile Tonal" progress indicator
// Uses indigo→purple gradient fill on a muted track, matching home dashboard and practice session.
// Height is configurable; default h-3 (12px) per Stitch spec.

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useColors } from '../../theme';

interface GradientProgressBarProps {
    progress: number; // 0–1
    height?: number;
    trackColor?: string;
    style?: any;
}

const styles = StyleSheet.create({
    track: {
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    clip: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

export const GradientProgressBar: React.FC<GradientProgressBarProps> = ({
    progress,
    height = 12,
    trackColor,
    style,
}) => {
    const colors = useColors();
    const track = trackColor ?? colors.surfaceVariant;
    const clamped = Math.min(Math.max(progress, 0), 1);
    const fillPercent = Math.round(clamped * 100);
    const metrics = useMemo(
        () =>
            StyleSheet.create({
                track: {
                    height,
                    backgroundColor: track,
                    borderRadius: height / 2,
                },
                clip: {
                    borderRadius: height / 2,
                },
            }),
        [height, track],
    );

    return (
        <View style={[styles.track, metrics.track, style]}>
            <View style={[styles.clip, metrics.clip]}>
                <Svg width="100%" height={height} style={styles.svg}>
                    <Defs>
                        <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor={colors.gradientStart} />
                            <Stop offset="100%" stopColor={colors.gradientEnd} />
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

export default GradientProgressBar;
