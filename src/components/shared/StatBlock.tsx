// StatBlock — small colored card used in home dashboard and parent dashboard.
// Icon + big number + label. Per Stitch: bg-surface-container-lowest, colored icon tile.

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon, MaterialIconName } from '../ui/MaterialIcon';

interface StatBlockProps {
    icon: MaterialIconName;
    iconColor?: string;
    iconBg?: string;
    value: string | number;
    label: string;
    style?: any;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            padding: SPACING[4],
            borderRadius: SPACING[3],
            backgroundColor: colors.surfaceContainerLowest,
        },
        iconWrap: {
            width: 36,
            height: 36,
            borderRadius: 10,
            marginBottom: SPACING[2],
        },
        value: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        label: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            marginTop: 2,
            textAlign: 'center' as const,
        },
    };
}

export const StatBlock: React.FC<StatBlockProps> = ({
    icon,
    iconColor,
    iconBg,
    value,
    label,
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const glyph = iconColor ?? colors.primary;
    const tileBg = iconBg ?? colors.primaryContainer;
    const tile = useMemo(
        () => StyleSheet.create({ iconWrap: { backgroundColor: tileBg } }),
        [tileBg],
    );

    return (
        <View style={[layout.center, styles.container, style]}>
            <View style={[layout.center, styles.iconWrap, tile.iconWrap]}>
                <MaterialIcon name={icon} size={20} color={glyph} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

export default StatBlock;
