import React from 'react';
import { Text, View } from 'react-native';
import { BORDER_RADIUS } from '../../constants';
import { layout, useThemedStyles, type ColorPalette } from '../../theme';

interface XpDisplayProps {
    xp: number;
    level: number;
    levelName?: string;
    size?: 'sm' | 'md' | 'lg';
}

const PILL = { sm: 'pillSm', md: 'pillMd', lg: 'pillLg' } as const;
const ICON = { sm: 'iconSm', md: 'iconMd', lg: 'iconLg' } as const;
const VALUE = { sm: 'valueSm', md: 'valueMd', lg: 'valueLg' } as const;
const META = { sm: 'metaSm', md: 'metaMd', lg: 'metaLg' } as const;

function createStyles(colors: ColorPalette) {
    const pill = {
        backgroundColor: colors.warningLight,
        borderRadius: BORDER_RADIUS.full,
        gap: 4,
    };
    const value = {
        fontWeight: '700' as const,
        color: colors.practiceModeTopicText,
    };
    const meta = {
        color: colors.textSecondary,
        fontWeight: '500' as const,
    };
    return {
        pillSm: { ...pill, paddingHorizontal: 6, paddingVertical: 3 },
        pillMd: { ...pill, paddingHorizontal: 10, paddingVertical: 5 },
        pillLg: { ...pill, paddingHorizontal: 14, paddingVertical: 7 },
        iconSm: { fontSize: 14 },
        iconMd: { fontSize: 16 },
        iconLg: { fontSize: 20 },
        valueSm: { ...value, fontSize: 14 },
        valueMd: { ...value, fontSize: 16 },
        valueLg: { ...value, fontSize: 20 },
        metaSm: { ...meta, fontSize: 12 },
        metaMd: { ...meta, fontSize: 14 },
        metaLg: { ...meta, fontSize: 18 },
    };
}

export const XpDisplay: React.FC<XpDisplayProps> = ({
    xp,
    level,
    size = 'md',
}) => {
    const styles = useThemedStyles(createStyles);

    return (
        <View style={[layout.row, styles[PILL[size]]]}>
            <Text style={styles[ICON[size]]}>⭐</Text>
            <Text style={styles[VALUE[size]]}>{xp} XP</Text>
            <Text style={styles[META[size]]}>L{level}</Text>
        </View>
    );
};

export default XpDisplay;
