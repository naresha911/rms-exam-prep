import React from "react";
import { View, Text } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

interface XpDisplayProps {
    xp: number;
    level: number;
    levelName?: string;
    size?: "sm" | "md" | "lg";
}

export const XpDisplay: React.FC<XpDisplayProps> = ({
    xp,
    level,
    levelName,
    size = "md",
}) => {
    const sizeStyles = {
        sm: { fontSize: 14, padding: 6, icon: 14 },
        md: { fontSize: 16, padding: 10, icon: 16 },
        lg: { fontSize: 20, padding: 14, icon: 20 },
    };

    const style = sizeStyles[size];

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.warningLight,
                paddingHorizontal: style.padding,
                paddingVertical: style.padding / 2,
                borderRadius: BORDER_RADIUS.full,
                gap: 4,
            }}
        >
            <Text style={{ fontSize: style.icon }}>⭐</Text>
            <Text
                style={{
                    fontSize: style.fontSize,
                    fontWeight: "700",
                    color: COLORS.practiceModeTopicText,
                }}
            >
                {xp} XP
            </Text>
            <Text
                style={{
                    fontSize: style.fontSize - 2,
                    color: COLORS.textSecondary,
                    fontWeight: "500",
                }}
            >
                L{level}
            </Text>
        </View>
    );
};

export default XpDisplay;
