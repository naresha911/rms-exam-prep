import React from 'react';
import { Text, View } from 'react-native';
import { BORDER_RADIUS } from '../../constants';
import { layout, useThemedStyles, type ColorPalette } from '../../theme';

interface StreakDisplayProps {
    streak: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const PILL = { sm: 'pillSm', md: 'pillMd', lg: 'pillLg' } as const;
const ICON = { sm: 'iconSm', md: 'iconMd', lg: 'iconLg' } as const;
const VALUE = { sm: 'valueSm', md: 'valueMd', lg: 'valueLg' } as const;
const META = { sm: 'metaSm', md: 'metaMd', lg: 'metaLg' } as const;

function createStyles(colors: ColorPalette) {
    const pill = {
        backgroundColor: colors.tertiaryLight,
        borderRadius: BORDER_RADIUS.full,
        gap: 4,
    };
    const value = {
        fontWeight: '700' as const,
        color: colors.streakFire,
    };
    const meta = {
        color: colors.textSecondary,
        fontWeight: '500' as const,
    };
    return {
        pillSm: { ...pill, paddingHorizontal: 6, paddingVertical: 3 },
        pillMd: { ...pill, paddingHorizontal: 8, paddingVertical: 4 },
        pillLg: { ...pill, paddingHorizontal: 12, paddingVertical: 6 },
        iconSm: { fontSize: 16 },
        iconMd: { fontSize: 20 },
        iconLg: { fontSize: 24 },
        valueSm: { ...value, fontSize: 14 },
        valueMd: { ...value, fontSize: 16 },
        valueLg: { ...value, fontSize: 20 },
        metaSm: { ...meta, fontSize: 12 },
        metaMd: { ...meta, fontSize: 14 },
        metaLg: { ...meta, fontSize: 18 },
    };
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
    streak,
    size = 'md',
    showLabel = true,
}) => {
    const styles = useThemedStyles(createStyles);

    return (
        <View style={[layout.row, styles[PILL[size]]]}>
            <Text style={styles[ICON[size]]}>🔥</Text>
            <Text style={styles[VALUE[size]]}>{streak}</Text>
            {showLabel ? (
                <Text style={styles[META[size]]}>day{streak !== 1 ? 's' : ''}</Text>
            ) : null}
        </View>
    );
};

export default StreakDisplay;
