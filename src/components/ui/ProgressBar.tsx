import React from "react";
import { View, Text, ViewStyle } from "react-native";
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from "../../constants";

interface ProgressBarProps {
    progress: number; // 0 to 1
    height?: number;
    color?: string;
    backgroundColor?: string;
    showLabel?: boolean;
    label?: string;
    style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 8,
    color = COLORS.primary,
    backgroundColor = COLORS.backgroundTertiary,
    showLabel = false,
    label,
    style,
}) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const percentage = Math.round(clampedProgress * 100);

    return (
        <View style={style}>
            {showLabel && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: SPACING[1],
                    }}
                >
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            fontWeight: "600",
                            color: COLORS.textPrimary,
                        }}
                    >
                        {label || `${percentage}%`}
                    </Text>
                    {label && (
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.textSecondary,
                            }}
                        >
                            {percentage}%
                        </Text>
                    )}
                </View>
            )}
            <View
                style={{
                    height,
                    backgroundColor,
                    borderRadius: BORDER_RADIUS.full,
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        backgroundColor: color,
                        borderRadius: BORDER_RADIUS.full,
                    }}
                />
            </View>
        </View>
    );
};

export default ProgressBar;
