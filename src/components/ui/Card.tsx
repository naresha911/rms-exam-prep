import React from "react";
import { View, ViewStyle, Platform, TouchableOpacity } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, SHADOWS } from "../../constants";
import { CARD_VARIANTS } from "../../constants/theme";

interface CardProps {
    children: React.ReactNode;
    variant?: "default" | "elevated" | "outlined" | "surface" | "surfaceMuted";
    padding?: keyof typeof SPACING | "none";
    style?: ViewStyle;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = "default",
    padding = 4,
    style,
    onPress,
}) => {
    // Map our variant names to theme tokens
    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case "elevated":
                return {
                    backgroundColor: COLORS.cardBackground,
                    ...SHADOWS.md,
                };
            case "outlined":
                return {
                    backgroundColor: COLORS.cardBackground,
                    borderWidth: 1,
                    borderColor: COLORS.cardBorder,
                };
            case "surface":
                return {
                    backgroundColor: COLORS.surfaceContainer,
                    borderWidth: 1,
                    borderColor: COLORS.outlineVariant,
                };
            case "surfaceMuted":
                return {
                    backgroundColor: COLORS.surfaceMuted,
                };
            case "default":
            default:
                return {
                    backgroundColor: COLORS.cardBackground,
                    ...SHADOWS.sm,
                };
        }
    };

    const paddingValue = padding === "none" ? 0 : SPACING[padding];

    // Use TouchableOpacity for pressable cards, View for static cards
    const Wrapper = onPress ? TouchableOpacity : View;
    const wrapperProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

    return (
        <Wrapper
            {...wrapperProps}
            style={[
                {
                    // Card radius matches Stitch "Large Containers" (1rem / 16px or 24px)
                    borderRadius: BORDER_RADIUS["2xl"],
                    padding: paddingValue,
                    // Force visibility with zIndex and elevation
                    zIndex: 1,
                    elevation: Platform.OS === "android" ? 2 : 0,
                },
                getVariantStyle(),
                style,
            ]}
        >
            {children}
        </Wrapper>
    );
};

export default Card;
