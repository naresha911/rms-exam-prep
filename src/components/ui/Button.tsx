import React from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
    ViewStyle,
    TextStyle,
    Platform,
} from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "outline" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    style,
    textStyle,
}) => {
    // Variant styles - Stitch Design System "Tactile Tonal Layers"
    // Primary has 3D effect with bottom shadow
    const variantStyles: Record<string, ViewStyle> = {
        primary: {
            backgroundColor: COLORS.primary,
            borderWidth: 0,
            borderColor: "transparent",
            // 3D tactile effect - bottom shadow
            shadowColor: COLORS.onPrimaryFixedVariant,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
        },
        secondary: {
            backgroundColor: COLORS.secondaryContainer,
            borderWidth: 0,
            borderColor: "transparent",
            shadowColor: COLORS.onSecondaryFixedVariant,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
        },
        outline: {
            backgroundColor: COLORS.cardBackground,
            borderWidth: 2,
            borderColor: COLORS.primary,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        danger: {
            backgroundColor: COLORS.error,
            borderWidth: 0,
            borderColor: "transparent",
            shadowColor: '#7f1d1d',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 4,
        },
    };

    // Size styles with explicit minHeight to guarantee visibility
    const sizeStyles: Record<string, ViewStyle> = {
        sm: {
            paddingVertical: SPACING[2],
            paddingHorizontal: SPACING[4],
            minHeight: 40,
        },
        md: {
            paddingVertical: SPACING[3],
            paddingHorizontal: SPACING[6],
            minHeight: 48,
        },
        lg: {
            paddingVertical: SPACING[4],
            paddingHorizontal: SPACING[8],
            minHeight: 56,
        },
    };

    const textSizeStyles: Record<string, TextStyle> = {
        sm: { fontSize: TYPOGRAPHY.fontSize.sm },
        md: { fontSize: TYPOGRAPHY.fontSize.base },
        lg: { fontSize: TYPOGRAPHY.fontSize.lg },
    };

    const textColor =
        variant === "primary" || variant === "danger"
            ? COLORS.textInverse
            : variant === "secondary"
                ? COLORS.onSecondaryContainer  // Use on-secondary-container for secondary button text
                : variant === "outline"
                    ? COLORS.primary
                    : COLORS.textPrimary;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            // 3D Tactile Effect - Stitch Design System
            style={({ pressed }) => {
                const isDisabled = disabled || loading;
                const isPressed = pressed && !isDisabled;

                // 3D effect: when pressed, button moves down and shadow reduces
                const baseStyle: ViewStyle = {
                    borderRadius: BORDER_RADIUS.xl,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    width: fullWidth ? "100%" : undefined,
                    // CRITICAL: Ensure button is always visible
                    zIndex: 1,
                    elevation: Platform.OS === "android" ? 3 : 0,
                    // Apply backgroundColor explicitly
                    backgroundColor:
                        variantStyles[variant].backgroundColor || COLORS.primary,
                    // Apply border if defined
                    borderWidth: variantStyles[variant].borderWidth || 0,
                    borderColor: variantStyles[variant].borderColor || "transparent",
                    // Apply size
                    paddingVertical: sizeStyles[size].paddingVertical,
                    paddingHorizontal: sizeStyles[size].paddingHorizontal,
                    minHeight: sizeStyles[size].minHeight,
                    // 3D Transform: translate down when pressed
                    transform: [{ translateY: isPressed ? 2 : 0 }],
                    // 3D Shadow: reduce when pressed
                    shadowColor: variantStyles[variant].shadowColor || '#000',
                    shadowOffset: { width: 0, height: isPressed ? 2 : 4 },
                    shadowOpacity: isPressed ? 0.5 : 1,
                    shadowRadius: 0,
                    // Opacity for disabled states only (not pressed - preserve 3D effect)
                    opacity: isDisabled ? 0.5 : 1,
                };
                return [baseStyle, style];
            }}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === "primary" || variant === "danger" ? "#fff" : COLORS.primary}
                    size="small"
                />
            ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {icon && <View style={{ marginRight: SPACING[2] }}>{icon}</View>}
                    <Text
                        style={[
                            {
                                color: textColor,
                                fontWeight: "700",
                            },
                            textSizeStyles[size],
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </View>
            )}
        </Pressable>
    );
};

export default Button;
