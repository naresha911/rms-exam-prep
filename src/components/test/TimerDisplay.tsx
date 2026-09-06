// TimerDisplay — countdown timer display for mock test sessions
import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface TimerDisplayProps {
    timeRemaining: number; // seconds
    totalTime?: number;    // for progress calculation
    size?: 'sm' | 'md' | 'lg';
    showProgress?: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
    timeRemaining,
    totalTime,
    size = 'md',
    showProgress = false,
}) => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    const timeString = hours > 0
        ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Color changes based on time left
    const isWarning = totalTime ? timeRemaining / totalTime < 0.25 : timeRemaining < 300; // < 5 min
    const isDanger = totalTime ? timeRemaining / totalTime < 0.1 : timeRemaining < 60;    // < 1 min

    const timerColor = isDanger
        ? COLORS.error
        : isWarning
            ? COLORS.warning
            : COLORS.textPrimary;

    const sizeConfig = {
        sm: { fontSize: TYPOGRAPHY.fontSize.base, padding: SPACING[2], iconSize: 14 },
        md: { fontSize: TYPOGRAPHY.fontSize.xl, padding: SPACING[3], iconSize: 16 },
        lg: { fontSize: TYPOGRAPHY.fontSize['2xl'], padding: SPACING[4], iconSize: 18 },
    };

    const cfg = sizeConfig[size];

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isDanger
                        ? COLORS.errorLight
                        : isWarning
                            ? COLORS.warningLight
                            : COLORS.backgroundSecondary,
                    paddingHorizontal: cfg.padding,
                    paddingVertical: cfg.padding / 2,
                    borderRadius: BORDER_RADIUS.lg,
                    gap: SPACING[1],
                }}
            >
                <Text style={{ fontSize: cfg.iconSize }}>⏱️</Text>
                <Text
                    style={{
                        fontSize: cfg.fontSize,
                        fontWeight: '800',
                        color: timerColor,
                        fontVariant: ['tabular-nums'],
                    }}
                >
                    {timeString}
                </Text>
            </View>

            {/* Optional thin progress bar */}
            {showProgress && totalTime && totalTime > 0 && (
                <View
                    style={{
                        height: 3,
                        backgroundColor: COLORS.cardBorder,
                        borderRadius: 2,
                        marginTop: 4,
                        overflow: 'hidden',
                    }}
                >
                    <View
                        style={{
                            height: '100%',
                            width: `${(timeRemaining / totalTime) * 100}%`,
                            backgroundColor: timerColor,
                            borderRadius: 2,
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default TimerDisplay;
