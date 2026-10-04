// BentoSelectCard — large selectable card used in onboarding class/goal selection.
// Per Stitch: bg-surface, 2px outline-variant border, icon + title + subtitle,
// circular check on right, primary overlay highlight when selected.

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon, MaterialIconName } from './MaterialIcon';

interface BentoSelectCardProps {
    icon: MaterialIconName;
    iconColor?: string;
    title: string;
    subtitle?: string;
    selected?: boolean;
    onPress?: () => void;
    style?: any;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING[6],
            overflow: 'hidden' as const,
            position: 'relative' as const,
        },
        containerSelected: {
            borderColor: colors.primary,
            borderWidth: 2,
        },
        left: {
            flex: 1,
        },
        titleRow: {
            gap: SPACING[2],
        },
        title: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize['2xl'],
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        subtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurfaceVariant,
            marginTop: SPACING[1],
        },
        check: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
        },
        checkOn: {
            borderColor: colors.primary,
            backgroundColor: colors.primary,
        },
        checkOff: {
            borderColor: colors.outlineVariant,
            backgroundColor: 'transparent',
        },
        overlay: {
            position: 'absolute' as const,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: colors.primaryFixed,
        },
    };
}

export const BentoSelectCard: React.FC<BentoSelectCardProps> = ({
    icon,
    iconColor,
    title,
    subtitle,
    selected = false,
    onPress,
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const glyph = iconColor ?? colors.primary;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                selected ? styles.containerSelected : null,
                pressed ? layout.pressed : null,
                style,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
        >
            <View style={layout.rowBetween}>
                <View style={styles.left}>
                    <View style={[layout.row, styles.titleRow]}>
                        <MaterialIcon name={icon} size={20} color={glyph} />
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </View>
                <View style={[layout.center, styles.check, selected ? styles.checkOn : styles.checkOff]}>
                    {selected ? <MaterialIcon name="check" size={14} color={colors.onPrimary} weight={700} /> : null}
                </View>
            </View>
            {selected ? <View style={styles.overlay} pointerEvents="none" /> : null}
        </Pressable>
    );
};

export default BentoSelectCard;
