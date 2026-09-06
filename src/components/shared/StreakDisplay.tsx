import React from "react";
import { View, Text } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

interface StreakDisplayProps {
    streak: number;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
    streak,
    size = "md",
    showLabel = true,
}) => {
    const sizeStyles = {
        sm: { fontSize: 14, padding: 6, icon: 16 },
        md: { fontSize: 16, padding: 8, icon: 20 },
        lg: { fontSize: 20, padding: 12, icon: 24 },
    };

    const style = sizeStyles[size];

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.tertiaryLight,
                paddingHorizontal: style.padding,
                paddingVertical: style.padding / 2,
                borderRadius: BORDER_RADIUS.full,
                gap: 4,
            }}
        >
            <Text style={{ fontSize: style.icon }}>🔥</Text>
            <Text
                style={{
                    fontSize: style.fontSize,
                    fontWeight: "700",
                    color: COLORS.streakFire,
                }}
            >
                {streak}
            </Text>
            {showLabel && (
                <Text
                    style={{
                        fontSize: style.fontSize - 2,
                        color: COLORS.textSecondary,
                        fontWeight: "500",
                    }}
                >
                    day{streak !== 1 ? "s" : ""}
                </Text>
            )}
        </View>
    );
};

export default StreakDisplay;
