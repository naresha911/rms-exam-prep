import React, { useState } from "react";
import {
    TextInput,
    TextInputProps,
    View,
    Text,
    Pressable,
    Platform,
} from "react-native";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../../constants";

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    rightIcon,
    leftIcon,
    onRightIconPress,
    containerStyle,
    style,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Border color follows Stitch: focused = primary, error = error, default = outline-variant
    const borderColor = error
        ? COLORS.error
        : isFocused
            ? COLORS.primary
            : COLORS.outlineVariant;

    // Background follows Stitch: white for cleanliness
    const backgroundColor = isFocused
        ? COLORS.cardBackground
        : COLORS.surfaceMuted;

    return (
        <View style={containerStyle}>
            {label && (
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: "600",
                        fontFamily: TYPOGRAPHY.fontFamily.semibold,
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[2],
                    }}
                >
                    {label}
                </Text>
            )}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor,
                    borderWidth: 2,
                    borderColor,
                    borderRadius: BORDER_RADIUS.lg,
                    paddingHorizontal: SPACING[4],
                    minHeight: 52,
                    // Force visibility
                    zIndex: 1,
                    elevation: Platform.OS === "android" ? 1 : 0,
                }}
            >
                {leftIcon && <View style={{ marginRight: SPACING[2] }}>{leftIcon}</View>}
                <TextInput
                    style={[
                        {
                            flex: 1,
                            fontSize: TYPOGRAPHY.fontSize.base,
                            fontFamily: TYPOGRAPHY.fontFamily.regular,
                            color: COLORS.textPrimary,
                            paddingVertical: SPACING[3],
                        },
                        style,
                    ]}
                    placeholderTextColor={COLORS.textTertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon && (
                    <Pressable onPress={onRightIconPress} style={{ marginLeft: SPACING[2] }}>
                        {rightIcon}
                    </Pressable>
                )}
            </View>
            {error && (
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        fontFamily: TYPOGRAPHY.fontFamily.regular,
                        color: COLORS.error,
                        marginTop: SPACING[1],
                    }}
                >
                    {error}
                </Text>
            )}
        </View>
    );
};

export default Input;
