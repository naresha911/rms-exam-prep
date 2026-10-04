// HeroHeaderCard — reusable mission hero for feature catalogues.
// Badge + title/description + illustration slot + optional duration badge + stats strip.

import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon, MaterialIconName } from '../ui/MaterialIcon';

export type HeroStat = {
    label: string;
    value: string;
    hint?: string;
    tone?: 'default' | 'success';
};

interface HeroHeaderCardProps {
    badgeIcon?: MaterialIconName;
    badgeLabel: string;
    title: string;
    description: string;
    illustration?: React.ReactNode;
    durationLabel?: string;
    stats: HeroStat[];
    style?: ViewStyle;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            borderRadius: BORDER_RADIUS['2xl'],
            overflow: 'hidden' as const,
            padding: SPACING[5],
            backgroundColor: colors.primary,
            ...SHADOWS.lg,
        },
        topRow: {
            gap: SPACING[3],
        },
        copyCol: {
            flex: 1,
            maxWidth: 210,
            gap: 6,
        },
        badge: {
            alignSelf: 'flex-start' as const,
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: BORDER_RADIUS.full,
            backgroundColor: colors.primaryContainer,
            borderWidth: 1,
            borderColor: colors.primaryFixed,
        },
        badgeText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 11,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.xpGold,
        },
        title: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            color: colors.onPrimary,
            letterSpacing: -0.3,
            lineHeight: 26,
        },
        description: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            color: colors.onPrimarySubtle,
            lineHeight: 18,
        },
        illustrationWrap: {
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: colors.primaryContainer,
            borderWidth: 1,
            borderColor: colors.primaryFixed,
            padding: 4,
            flexShrink: 0,
            position: 'relative' as const,
        },
        durationBadge: {
            position: 'absolute' as const,
            bottom: -6,
            right: -6,
            backgroundColor: colors.xpGold,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: BORDER_RADIUS.full,
        },
        durationText: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: 10,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            color: colors.onPrimaryFixedVariant,
        },
        statsStrip: {
            marginTop: SPACING[4],
            paddingTop: SPACING[3],
            borderTopWidth: 1,
            borderTopColor: colors.primaryFixed,
        },
        statsGrid: {
            flexDirection: 'row' as const,
            gap: SPACING[2],
            backgroundColor: colors.primaryContainer,
            borderRadius: 16,
            padding: 10,
            borderWidth: 1,
            borderColor: colors.primaryFixed,
        },
        statCell: {
            flex: 1,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: colors.primaryFixed,
        },
        statLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 10,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            textTransform: 'uppercase' as const,
            letterSpacing: 0.6,
            color: colors.onPrimaryFixed,
        },
        statLabelSuccess: {
            color: colors.success,
        },
        statValue: {
            marginTop: 2,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: 13,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            color: colors.onPrimaryFixed,
        },
        statHint: {
            marginTop: 1,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: 10,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            color: colors.onPrimaryFixed,
        },
    };
}

export const HeroHeaderCard: React.FC<HeroHeaderCardProps> = ({
    badgeIcon = 'history_edu',
    badgeLabel,
    title,
    description,
    illustration,
    durationLabel,
    stats,
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);

    return (
        <View style={[styles.container, style]}>
            <View style={[layout.rowBetween, styles.topRow]}>
                <View style={styles.copyCol}>
                    <View style={[layout.row, styles.badge]}>
                        <MaterialIcon name={badgeIcon} size={13} color={colors.xpGold} />
                        <Text style={styles.badgeText}>{badgeLabel}</Text>
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

                {illustration ? (
                    <View style={[layout.center, styles.illustrationWrap]}>
                        {illustration}
                        {durationLabel ? (
                            <View style={styles.durationBadge}>
                                <Text style={styles.durationText}>⏱ {durationLabel}</Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}
            </View>

            {stats.length > 0 ? (
                <View style={styles.statsStrip}>
                    <View style={styles.statsGrid}>
                        {stats.map((stat) => (
                            <View key={stat.label} style={[layout.center, styles.statCell]}>
                                <Text style={[styles.statLabel, stat.tone === 'success' ? styles.statLabelSuccess : null]}>
                                    {stat.label}
                                </Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                {stat.hint ? <Text style={styles.statHint}>{stat.hint}</Text> : null}
                            </View>
                        ))}
                    </View>
                </View>
            ) : null}
        </View>
    );
};

export default HeroHeaderCard;
