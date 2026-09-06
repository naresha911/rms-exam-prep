import React from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
    ViewStyle,
    TextStyle,
    StyleSheet,
    Platform,
} from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon, MaterialIconName } from "./MaterialIcon";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "outline" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconRight?: MaterialIconName;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const VARIANT_BG: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: COLORS.primary,
    secondary: COLORS.secondaryContainer,
    outline: COLORS.cardBackground,
    danger: COLORS.error,
};

const VARIANT_BORDER: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "transparent",
    secondary: "transparent",
    outline: COLORS.primary,
    danger: "transparent",
};

const VARIANT_SHADOW: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: COLORS.onPrimaryFixedVariant,
    secondary: COLORS.onSecondaryFixedVariant,
    outline: "transparent",
    danger: COLORS.errorText,
};

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    iconRight,
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;

    const rightIconColor =
        variant === "primary" || variant === "danger" || variant === "secondary"
            ? COLORS.onPrimary
            : variant === "outline"
                ? COLORS.primary
                : COLORS.onSurface;
    const rightIconSize = size === "lg" ? 22 : size === "sm" ? 16 : 18;

    const textColor =
        variant === "primary" || variant === "danger"
            ? COLORS.onPrimary
            : variant === "secondary"
                ? COLORS.onSecondaryContainer
                : variant === "outline"
                    ? COLORS.primary
                    : COLORS.textPrimary;

    const sizePad =
        size === "lg"
            ? { paddingVertical: SPACING[4], paddingHorizontal: SPACING[8], minHeight: 56 }
            : size === "sm"
                ? { paddingVertical: SPACING[2], paddingHorizontal: SPACING[4], minHeight: 40 }
                : { paddingVertical: SPACING[3], paddingHorizontal: SPACING[6], minHeight: 48 };

    const textSize =
        size === "lg"
            ? TYPOGRAPHY.fontSize.lg
            : size === "sm"
                ? TYPOGRAPHY.fontSize.sm
                : TYPOGRAPHY.fontSize.base;

    // Outer Pressable is transparent hit-target; painted surface is the inner View.
    // NativeWind remaps Pressable and can drop backgroundColor from style callbacks,
    // which made primary CTAs render as white-on-white on device.
    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.pressable,
                fullWidth && styles.fullWidth,
                {
                    opacity: isDisabled ? 0.5 : 1,
                    transform: [{ translateY: pressed && !isDisabled ? 2 : 0 }],
                },
                style,
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled }}
        >
            {({ pressed }) => (
                <View
                    style={[
                        styles.surface,
                        sizePad,
                        fullWidth && styles.fullWidth,
                        {
                            backgroundColor: VARIANT_BG[variant],
                            borderWidth: variant === "outline" ? 2 : 0,
                            borderColor: VARIANT_BORDER[variant],
                            // 3D tactile bottom edge (Stitch btn-3d)
                            borderBottomWidth: variant === "outline" ? 2 : 4,
                            borderBottomColor:
                                variant === "outline"
                                    ? COLORS.primary
                                    : VARIANT_SHADOW[variant],
                            shadowColor: VARIANT_SHADOW[variant],
                            shadowOffset: {
                                width: 0,
                                height: pressed && !isDisabled ? 2 : 4,
                            },
                            shadowOpacity: variant === "outline" ? 0 : pressed && !isDisabled ? 0.5 : 1,
                            shadowRadius: 0,
                            elevation:
                                variant === "outline"
                                    ? 0
                                    : Platform.OS === "android"
                                        ? pressed && !isDisabled
                                            ? 2
                                            : 4
                                        : 0,
                        },
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator
                            color={
                                variant === "primary" || variant === "danger"
                                    ? COLORS.onPrimary
                                    : COLORS.primary
                            }
                            size="small"
                        />
                    ) : (
                        <View style={styles.content}>
                            {icon && <View style={styles.iconLeft}>{icon}</View>}
                            <Text
                                style={[
                                    styles.label,
                                    { color: textColor, fontSize: textSize },
                                    textStyle,
                                ]}
                            >
                                {title}
                            </Text>
                            {iconRight && (
                                <View style={styles.iconRight}>
                                    <MaterialIcon
                                        name={iconRight}
                                        size={rightIconSize}
                                        color={rightIconColor}
                                        weight={700}
                                        filled
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        borderRadius: BORDER_RADIUS.xl,
        alignSelf: "stretch",
    },
    fullWidth: {
        width: "100%",
    },
    surface: {
        borderRadius: BORDER_RADIUS.xl,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    iconLeft: {
        marginRight: SPACING[2],
    },
    iconRight: {
        marginLeft: SPACING[2],
    },
    label: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontWeight: "700",
        color: COLORS.onPrimary,
    },
});

export default Button;
