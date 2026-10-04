import React from 'react';
import { ActivityIndicator, Platform, Pressable, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon, type MaterialIconName } from './MaterialIcon';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconRight?: MaterialIconName;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const SIZE = {
    sm: 'sizeSm',
    md: 'sizeMd',
    lg: 'sizeLg',
} as const;

const SURFACE = {
    primary: 'primary',
    secondary: 'secondary',
    outline: 'outline',
    danger: 'danger',
} as const;

const LABEL = {
    primary: 'labelPrimary',
    secondary: 'labelSecondary',
    outline: 'labelOutline',
    danger: 'labelDanger',
} as const;

function createStyles(colors: ColorPalette) {
    const lip = {
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        overflow: 'hidden' as const,
        borderBottomWidth: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: Platform.OS === 'android' ? 4 : 0,
    };
    return {
        pressable: {
            borderRadius: BORDER_RADIUS.xl,
            alignSelf: 'stretch' as const,
        },
        fullWidth: { width: '100%' as const },
        sizeSm: { paddingVertical: SPACING[2], paddingHorizontal: SPACING[4], minHeight: 40 },
        sizeMd: { paddingVertical: SPACING[3], paddingHorizontal: SPACING[6], minHeight: 48 },
        sizeLg: { paddingVertical: SPACING[4], paddingHorizontal: SPACING[8], minHeight: 56 },
        primary: {
            ...lip,
            backgroundColor: colors.primary,
            borderBottomColor: colors.onPrimaryFixedVariant,
            shadowColor: colors.onPrimaryFixedVariant,
        },
        secondary: {
            ...lip,
            backgroundColor: colors.secondaryContainer,
            borderBottomColor: colors.onSecondaryFixedVariant,
            shadowColor: colors.onSecondaryFixedVariant,
        },
        danger: {
            ...lip,
            backgroundColor: colors.error,
            borderBottomColor: colors.errorText,
            shadowColor: colors.errorText,
        },
        outline: {
            ...lip,
            backgroundColor: colors.cardBackground,
            borderWidth: 2,
            borderColor: colors.primary,
            borderBottomWidth: 2,
            borderBottomColor: colors.primary,
            shadowOpacity: 0,
            elevation: 0,
        },
        content: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        iconLeft: { marginRight: SPACING[2] },
        iconRight: { marginLeft: SPACING[2] },
        label: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontWeight: '700' as const,
        },
        labelPrimary: { color: colors.onPrimary },
        labelSecondary: { color: colors.onSecondaryContainer },
        labelOutline: { color: colors.primary },
        labelDanger: { color: colors.onPrimary },
        labelSm: { fontSize: TYPOGRAPHY.fontSize.sm },
        labelMd: { fontSize: TYPOGRAPHY.fontSize.base },
        labelLg: { fontSize: TYPOGRAPHY.fontSize.lg },
    };
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    iconRight,
    style,
    textStyle,
}) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const isDisabled = disabled || loading;
    const iconColor =
        variant === 'outline' ? colors.primary : variant === 'secondary' ? colors.onSecondaryContainer : colors.onPrimary;
    const spinnerColor = variant === 'outline' || variant === 'secondary' ? colors.primary : colors.onPrimary;
    const iconSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 18;
    const labelSize = size === 'lg' ? styles.labelLg : size === 'sm' ? styles.labelSm : styles.labelMd;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.pressable,
                fullWidth ? styles.fullWidth : null,
                isDisabled ? layout.disabled : null,
                pressed && !isDisabled ? layout.pressed : null,
                style,
            ]}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled }}
        >
            <View style={[styles[SURFACE[variant]], styles[SIZE[size]], fullWidth ? styles.fullWidth : null]}>
                {loading ? (
                    <ActivityIndicator color={spinnerColor} size="small" />
                ) : (
                    <View style={styles.content}>
                        {icon ? <View style={styles.iconLeft}>{icon}</View> : null}
                        <Text style={[styles.label, styles[LABEL[variant]], labelSize, textStyle]}>{title}</Text>
                        {iconRight ? (
                            <View style={styles.iconRight}>
                                <MaterialIcon name={iconRight} size={iconSize} color={iconColor} weight={700} filled />
                            </View>
                        ) : null}
                    </View>
                )}
            </View>
        </Pressable>
    );
};

export default Button;
