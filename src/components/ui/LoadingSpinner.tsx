import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";

interface LoadingSpinnerProps {
    message?: string;
    size?: "small" | "large";
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message,
    size = "large",
    fullScreen = false,
}) => {
    if (fullScreen) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: COLORS.background,
                }}
            >
                <ActivityIndicator size={size} color={COLORS.primary} />
                {message && (
                    <Text
                        style={{
                            marginTop: SPACING[4],
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                        }}
                    >
                        {message}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                padding: SPACING[6],
            }}
        >
            <ActivityIndicator size={size} color={COLORS.primary} />
            {message && (
                <Text
                    style={{
                        marginTop: SPACING[3],
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        color: COLORS.textSecondary,
                    }}
                >
                    {message}
                </Text>
            )}
        </View>
    );
};

export default LoadingSpinner;
