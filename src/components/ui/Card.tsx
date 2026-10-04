import React from 'react';
import { Platform, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { BORDER_RADIUS, SHADOWS, SPACING } from '../../constants';
import { useThemedStyles, type ColorPalette } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'surface' | 'surfaceMuted';
    padding?: keyof typeof SPACING | 'none';
    style?: ViewStyle;
    onPress?: () => void;
}

function createStyles(colors: ColorPalette) {
    const pads: Record<string, ViewStyle> = { pad_none: { padding: 0 } };
    for (const [key, value] of Object.entries(SPACING)) {
        pads[`pad_${key}`] = { padding: value };
    }
    return {
        ...pads,
        base: {
            borderRadius: BORDER_RADIUS['2xl'],
            zIndex: 1,
            elevation: Platform.OS === 'android' ? 2 : 0,
        },
        default: {
            backgroundColor: colors.cardBackground,
            ...SHADOWS.sm,
        },
        elevated: {
            backgroundColor: colors.cardBackground,
            ...SHADOWS.md,
        },
        outlined: {
            backgroundColor: colors.cardBackground,
            borderWidth: 1,
            borderColor: colors.cardBorder,
        },
        surface: {
            backgroundColor: colors.surfaceContainer,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
        },
        surfaceMuted: {
            backgroundColor: colors.surfaceMuted,
        },
    };
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 4,
    style,
    onPress,
}) => {
    const styles = useThemedStyles(createStyles);
    const padKey = `pad_${padding}` as keyof typeof styles;
    const content = (
        <View style={[styles.base, styles[variant], styles[padKey], style]}>
            {children}
        </View>
    );

    if (!onPress) return content;

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            {content}
        </TouchableOpacity>
    );
};

export default Card;
