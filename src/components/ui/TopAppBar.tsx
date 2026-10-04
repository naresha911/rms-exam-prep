// TopAppBar — sticky header used in home dashboard, parent dashboard, papers list.
// Per Stitch: avatar (round, primary container bg, primary border) + "AISSEE Cadet" brand
// (Cadet in primary) + optional subtitle + trailing streak pill + notification icon.

import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon } from './MaterialIcon';

interface TopAppBarProps {
    title?: string; // override brand text
    highlight?: string; // part of the brand to render in primary (default "Cadet")
    subtitle?: string;
    avatarUri?: string | null;
    streak?: number;
    onPressProfile?: () => void;
    onPressNotification?: () => void;
    onPressLogo?: () => void;
    backgroundColor?: string;
    showNotification?: boolean;
    rightSlot?: React.ReactNode;
    style?: any;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            paddingHorizontal: SPACING[4],
            height: 64,
            width: '100%' as const,
        },
        brandWrap: {
            gap: 10,
            flexShrink: 1,
            minWidth: 0,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primaryContainer,
            borderWidth: 1,
            borderColor: colors.primaryFixed,
            overflow: 'hidden' as const,
            flexShrink: 0,
        },
        avatarImage: {
            width: '100%' as const,
            height: '100%' as const,
        },
        brandTextWrap: {
            flexShrink: 1,
            minWidth: 0,
        },
        brand: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.primary,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            letterSpacing: -0.2,
        },
        brandHighlight: {
            color: colors.primary,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        subtitle: {
            marginTop: 1,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
        },
        actions: {
            gap: SPACING[2],
            flexShrink: 0,
        },
        streakPill: {
            gap: 4,
            backgroundColor: colors.surfaceContainerHigh,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: BORDER_RADIUS.full,
        },
        streakValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.tertiary,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        iconButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
        },
        iconButtonPressed: {
            backgroundColor: colors.surfaceVariant,
        },
    };
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
    title = 'AISSEE',
    highlight = 'Cadet',
    subtitle,
    avatarUri,
    streak,
    onPressProfile,
    onPressNotification,
    onPressLogo,
    backgroundColor,
    showNotification = true,
    rightSlot,
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const barColor = backgroundColor ?? colors.surface;
    const barStyle = useMemo(
        () => StyleSheet.create({ bar: { backgroundColor: barColor } }),
        [barColor],
    );

    return (
        <View style={[layout.rowBetween, styles.container, barStyle.bar, style]}>
            <Pressable
                onPress={onPressLogo ?? onPressProfile}
                style={[layout.row, styles.brandWrap]}
                accessibilityRole="button"
                accessibilityLabel="Profile"
            >
                <View style={[layout.center, styles.avatar]}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                    ) : (
                        <MaterialIcon name="person" size={20} color={colors.onPrimaryContainer} filled />
                    )}
                </View>
                <View style={styles.brandTextWrap}>
                    <Text style={styles.brand} numberOfLines={1}>
                        {title}{' '}
                        <Text style={styles.brandHighlight}>{highlight}</Text>
                    </Text>
                    {subtitle ? (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
            </Pressable>

            <View style={[layout.row, styles.actions]}>
                {streak !== undefined && (
                    <View style={[layout.row, styles.streakPill]}>
                        <Text style={styles.streakValue}>{streak}</Text>
                        <MaterialIcon name="local_fire_department" size={16} color={colors['warning-amber']} filled />
                    </View>
                )}
                {showNotification && (
                    <Pressable
                        onPress={onPressNotification}
                        style={({ pressed }) => [
                            layout.center,
                            styles.iconButton,
                            pressed ? styles.iconButtonPressed : null,
                            pressed ? layout.pressed : null,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel="Notifications"
                    >
                        <MaterialIcon name="notifications" size={22} color={colors.onSurfaceVariant} />
                    </Pressable>
                )}
                {rightSlot}
            </View>
        </View>
    );
};

export default TopAppBar;
