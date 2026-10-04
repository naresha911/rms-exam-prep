// TimerDisplay — countdown timer display for mock test sessions
import React, { useMemo } from 'react';
import { StyleSheet, Text, View, type TextStyle } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { useThemedStyles, type ColorPalette } from '../../theme';

interface TimerDisplayProps {
    timeRemaining: number; // seconds
    totalTime?: number;    // for progress calculation
    size?: 'sm' | 'md' | 'lg';
    showProgress?: boolean;
}

type TimerTone = 'normal' | 'warning' | 'danger';
type TimerSize = 'sm' | 'md' | 'lg';

const PAD = {
    sm: 'padSm',
    md: 'padMd',
    lg: 'padLg',
} as const;

const LABEL = {
    sm: 'labelSm',
    md: 'labelMd',
    lg: 'labelLg',
} as const;

const ICON = {
    sm: 'iconSm',
    md: 'iconMd',
    lg: 'iconLg',
} as const;

const TONE_SURFACE = {
    normal: 'toneNormal',
    warning: 'toneWarning',
    danger: 'toneDanger',
} as const;

const TONE_TEXT = {
    normal: 'textNormal',
    warning: 'textWarning',
    danger: 'textDanger',
} as const;

const TONE_FILL = {
    normal: 'fillNormal',
    warning: 'fillWarning',
    danger: 'fillDanger',
} as const;

function createStyles(colors: ColorPalette) {
    return {
        pill: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            borderRadius: BORDER_RADIUS.lg,
            gap: SPACING[1],
        },
        padSm: { paddingHorizontal: SPACING[2], paddingVertical: SPACING[1] },
        padMd: { paddingHorizontal: SPACING[3], paddingVertical: SPACING[3] / 2 },
        padLg: { paddingHorizontal: SPACING[4], paddingVertical: SPACING[2] },
        toneNormal: { backgroundColor: colors.backgroundSecondary },
        toneWarning: { backgroundColor: colors.warningLight },
        toneDanger: { backgroundColor: colors.errorLight },
        iconSm: { fontSize: 14 },
        iconMd: { fontSize: 16 },
        iconLg: { fontSize: 18 },
        label: {
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
        },
        labelSm: { fontSize: TYPOGRAPHY.fontSize.base },
        labelMd: { fontSize: TYPOGRAPHY.fontSize.xl },
        labelLg: { fontSize: TYPOGRAPHY.fontSize['2xl'] },
        textNormal: { color: colors.textPrimary },
        textWarning: { color: colors.warning },
        textDanger: { color: colors.error },
        track: {
            height: 3,
            backgroundColor: colors.cardBorder,
            borderRadius: 2,
            marginTop: 4,
            overflow: 'hidden' as const,
        },
        fill: {
            height: '100%' as const,
            borderRadius: 2,
        },
        fillNormal: { backgroundColor: colors.textPrimary },
        fillWarning: { backgroundColor: colors.warning },
        fillDanger: { backgroundColor: colors.error },
    };
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
    timeRemaining,
    totalTime,
    size = 'md',
    showProgress = false,
}) => {
    const styles = useThemedStyles(createStyles);
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    const timeString = hours > 0
        ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const isWarning = totalTime ? timeRemaining / totalTime < 0.25 : timeRemaining < 300;
    const isDanger = totalTime ? timeRemaining / totalTime < 0.1 : timeRemaining < 60;
    const tone: TimerTone = isDanger ? 'danger' : isWarning ? 'warning' : 'normal';
    const sizeKey: TimerSize = size;

    const showBar = showProgress && !!totalTime && totalTime > 0;
    const progressWidth = useMemo(() => {
        const ratio = totalTime && totalTime > 0 ? timeRemaining / totalTime : 0;
        const width = `${Math.min(Math.max(ratio, 0), 1) * 100}%` as `${number}%`;
        return StyleSheet.create({ bar: { width } }).bar;
    }, [timeRemaining, totalTime]);

    return (
        <View>
            <View style={[styles.pill, styles[PAD[sizeKey]], styles[TONE_SURFACE[tone]]]}>
                <Text style={styles[ICON[sizeKey]]}>⏱️</Text>
                <Text style={[styles.label, styles[LABEL[sizeKey]], styles[TONE_TEXT[tone]]]}>
                    {timeString}
                </Text>
            </View>

            {showBar ? (
                <View style={styles.track}>
                    <View style={[styles.fill, styles[TONE_FILL[tone]], progressWidth]} />
                </View>
            ) : null}
        </View>
    );
};

export default TimerDisplay;
