// ProTipCard — compact tip banner reused across feature screens.

import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { SHADOWS, SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon, MaterialIconName } from '../ui/MaterialIcon';

interface ProTipCardProps {
    title: string;
    body: string;
    icon?: MaterialIconName;
    style?: ViewStyle;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            gap: SPACING[3],
            backgroundColor: colors.surfaceContainerLow,
            borderWidth: 1,
            borderColor: colors.primaryFixed,
            borderRadius: 16,
            padding: SPACING[3],
            ...SHADOWS.sm,
        },
        iconWrap: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primaryFixed,
            flexShrink: 0,
        },
        copy: {
            flex: 1,
            minWidth: 0,
        },
        title: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.primary,
        },
        body: {
            marginTop: 2,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            lineHeight: 16,
        },
    };
}

export const ProTipCard: React.FC<ProTipCardProps> = ({
    title,
    body,
    icon = 'verified',
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);

    return (
        <View style={[layout.row, styles.container, style]}>
            <View style={[layout.center, styles.iconWrap]}>
                <MaterialIcon name={icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.copy}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{body}</Text>
            </View>
        </View>
    );
};

export default ProTipCard;
