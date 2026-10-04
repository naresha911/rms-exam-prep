// StatusBadge — compact status pill for catalogue cards (papers, mocks, missions).

import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon } from '../ui/MaterialIcon';
import type { PaperListStatus } from '../../types';

interface StatusBadgeProps {
    status: PaperListStatus;
    label?: string;
    style?: ViewStyle;
}

const STATUS_LABELS: Record<PaperListStatus, string> = {
    unattempted: 'Unattempted',
    in_progress: 'In progress',
    completed: 'Completed',
    attempted: 'Attempted',
};

function createStyles(colors: ColorPalette) {
    return {
        base: {
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: BORDER_RADIUS.full,
            borderWidth: 1,
        },
        text: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 10,
            fontWeight: '600' as const,
        },
        unattempted: {
            backgroundColor: colors.warningLight,
            borderColor: colors.xpGold,
        },
        unattemptedText: {
            color: colors.amberText,
        },
        inProgress: {
            backgroundColor: colors.warningLight,
            borderColor: colors.warning,
        },
        inProgressText: {
            color: colors.amberText,
        },
        completed: {
            backgroundColor: colors.successLight,
            borderColor: colors.success,
        },
        completedText: {
            color: colors.successText,
        },
        attempted: {
            backgroundColor: colors.warningLight,
            borderColor: colors.xpGold,
        },
        attemptedText: {
            color: colors.amberText,
        },
        dotAmber: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.warning,
        },
        dotWarn: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.warning,
        },
    };
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, style }) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const text = label ?? STATUS_LABELS[status];

    if (status === 'completed') {
        return (
            <View style={[layout.row, styles.base, styles.completed, style]}>
                <MaterialIcon name="check_circle" size={12} color={colors.successText} />
                <Text style={[styles.text, styles.completedText]}>{text}</Text>
            </View>
        );
    }

    if (status === 'attempted') {
        return (
            <View style={[layout.row, styles.base, styles.attempted, style]}>
                <MaterialIcon name="check" size={12} color={colors.amberText} />
                <Text style={[styles.text, styles.attemptedText]}>{text}</Text>
            </View>
        );
    }

    if (status === 'in_progress') {
        return (
            <View style={[layout.row, styles.base, styles.inProgress, style]}>
                <View style={styles.dotWarn} />
                <Text style={[styles.text, styles.inProgressText]}>{text}</Text>
            </View>
        );
    }

    return (
        <View style={[layout.row, styles.base, styles.unattempted, style]}>
            <View style={styles.dotAmber} />
            <Text style={[styles.text, styles.unattemptedText]}>{text}</Text>
        </View>
    );
};

export default StatusBadge;
