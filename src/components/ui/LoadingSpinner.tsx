import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../theme';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
    fullScreen?: boolean;
}

function createStyles(colors: ColorPalette) {
    return {
        full: {
            flex: 1,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            backgroundColor: colors.background,
        },
        inline: {
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            padding: SPACING[6],
        },
        messageFull: {
            marginTop: SPACING[4],
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.textSecondary,
        },
        messageInline: {
            marginTop: SPACING[3],
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
        },
    };
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message,
    size = 'large',
    fullScreen = false,
}) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    return (
        <View style={fullScreen ? styles.full : styles.inline}>
            <ActivityIndicator size={size} color={colors.primary} />
            {message ? (
                <Text style={fullScreen ? styles.messageFull : styles.messageInline}>{message}</Text>
            ) : null}
        </View>
    );
};

export default LoadingSpinner;
