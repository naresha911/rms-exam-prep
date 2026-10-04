// SectionPerformanceCard — mock test result "Section Performance" row.
// Colored circle icon + subject name + bold percentage.
// Matches stitch_screens/mock_test_result_analysis/code.html lines 238–266.

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon, MaterialIconName } from '../ui/MaterialIcon';

interface SectionPerformanceCardProps {
    icon: MaterialIconName;
    iconBg: string;
    iconColor: string;
    subject: string;
    percentage: number; // 0–100
    style?: any;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            padding: SPACING[4],
            backgroundColor: colors.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            borderRadius: SPACING[3],
            gap: SPACING[3],
        },
        iconWrap: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        subject: {
            flex: 1,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        percentage: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize['2xl'],
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
    };
}

export const SectionPerformanceCard: React.FC<SectionPerformanceCardProps> = ({
    icon,
    iconBg,
    iconColor,
    subject,
    percentage,
    style,
}) => {
    const styles = useThemedStyles(createStyles);
    const dynamic = useMemo(
        () =>
            StyleSheet.create({
                iconWrap: { backgroundColor: iconBg },
                percentage: { color: iconColor },
            }),
        [iconBg, iconColor],
    );

    return (
        <View style={[layout.row, styles.container, style]}>
            <View style={[layout.center, styles.iconWrap, dynamic.iconWrap]}>
                <MaterialIcon name={icon} size={20} color={iconColor} />
            </View>
            <Text style={styles.subject}>{subject}</Text>
            <Text style={[styles.percentage, dynamic.percentage]}>{Math.round(percentage)}%</Text>
        </View>
    );
};

export default SectionPerformanceCard;
