// MissionRow — single task row used in "Today's Plan" on the home dashboard.
// Per Stitch: icon tile (primary/secondary/tertiary container bg) + title + subtitle + status circle.
// Matches stitch_screens/home_dashboard/code.html lines 250–292.

import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon, MaterialIconName } from '../ui/MaterialIcon';

export type MissionStatus = 'not_started' | 'completed' | 'in_progress';

interface MissionRowProps {
    icon: MaterialIconName;
    title: string;
    subtitle: string;
    status?: MissionStatus;
    iconBg?: string;
    iconColor?: string;
    onPress?: () => void;
    style?: any;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            padding: SPACING[3],
            borderRadius: SPACING[4],
            gap: SPACING[4],
        },
        rowPressed: {
            backgroundColor: colors.surfaceMuted,
        },
        iconWrap: {
            width: 48,
            height: 48,
            borderRadius: 12,
        },
        content: {
            flex: 1,
        },
        title: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        subtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
            marginTop: 2,
        },
        statusCircle: {
            width: 32,
            height: 32,
            borderRadius: 16,
        },
        statusDone: {
            backgroundColor: colors['success-green'],
        },
        statusActive: {
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: colors.primary,
        },
        statusIdle: {
            borderWidth: 2,
            borderColor: colors.outlineVariant,
            backgroundColor: 'transparent',
        },
    };
}

export const MissionRow: React.FC<MissionRowProps> = ({
    icon,
    title,
    subtitle,
    status = 'not_started',
    iconBg,
    iconColor,
    onPress,
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const tileBg = iconBg ?? colors.primaryContainer;
    const glyph = iconColor ?? colors.onPrimaryContainer;
    const tile = useMemo(
        () => StyleSheet.create({ iconWrap: { backgroundColor: tileBg } }),
        [tileBg],
    );

    const statusStyle =
        status === 'completed' ? styles.statusDone : status === 'in_progress' ? styles.statusActive : styles.statusIdle;

    const body = (
        <>
            <View style={[layout.center, styles.iconWrap, tile.iconWrap]}>
                <MaterialIcon name={icon} size={22} color={glyph} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
            <View style={layout.center}>
                {status === 'completed' ? (
                    <View style={[layout.center, styles.statusCircle, styles.statusDone]}>
                        <MaterialIcon name="check" size={14} color={colors.onPrimary} weight={700} />
                    </View>
                ) : (
                    <View style={[layout.center, styles.statusCircle, statusStyle]} />
                )}
            </View>
        </>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    layout.row,
                    styles.container,
                    pressed ? styles.rowPressed : null,
                    pressed ? layout.pressed : null,
                    style,
                ]}
            >
                {body}
            </Pressable>
        );
    }

    return <View style={[layout.row, styles.container, style]}>{body}</View>;
};

export default MissionRow;
