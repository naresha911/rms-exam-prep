import React, { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
}

function createStyles(colors: ColorPalette) {
    return {
        label: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: '600' as const,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            color: colors.textPrimary,
            marginBottom: SPACING[2],
        },
        field: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            borderWidth: 2,
            borderRadius: BORDER_RADIUS.lg,
            paddingHorizontal: SPACING[4],
            minHeight: 52,
            zIndex: 1,
            elevation: Platform.OS === 'android' ? 1 : 0,
            backgroundColor: colors.surfaceMuted,
            borderColor: colors.outlineVariant,
        },
        fieldFocused: {
            backgroundColor: colors.cardBackground,
            borderColor: colors.primary,
        },
        fieldError: {
            borderColor: colors.error,
        },
        iconLeft: { marginRight: SPACING[2] },
        iconRight: { marginLeft: SPACING[2] },
        input: {
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textPrimary,
            paddingVertical: SPACING[3],
        },
        error: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.error,
            marginTop: SPACING[1],
        },
    };
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
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={containerStyle}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={[styles.field, isFocused ? styles.fieldFocused : null, error ? styles.fieldError : null]}>
                {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={colors.textTertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon ? (
                    <Pressable onPress={onRightIconPress} style={styles.iconRight}>
                        {rightIcon}
                    </Pressable>
                ) : null}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

export default Input;
