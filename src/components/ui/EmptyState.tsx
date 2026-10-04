import React from 'react';
import { Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { useThemedStyles, type ColorPalette } from '../../theme';
import { MascotDisplay } from '../shared/MascotDisplay';
import { Button } from './Button';
import type { MascotExpression } from '../../assets/images';

interface EmptyStateProps {
    title: string;
    description?: string;
    mascot?: MascotExpression;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'compact';
}

const MASCOT_MAP: Record<string, MascotExpression> = {
    happy: 'happy',
    thinking: 'thinking',
    encouraging: 'encouraging',
    celebrating: 'celebrating',
    studying: 'studying',
    victory: 'victory',
    surprised: 'surprised',
    sad: 'sad',
    success: 'celebrating',
    error: 'sad',
    warning: 'thinking',
    loading: 'thinking',
};

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            padding: SPACING[6],
        },
        containerCompact: { padding: SPACING[4] },
        title: {
            fontSize: TYPOGRAPHY.headlineMd.fontSize,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.textPrimary,
            marginTop: SPACING[4],
            textAlign: 'center' as const,
        },
        titleCompact: {
            fontSize: TYPOGRAPHY.fontSize.xl,
            marginTop: SPACING[3],
        },
        description: {
            fontSize: TYPOGRAPHY.bodyMd.fontSize,
            color: colors.textSecondary,
            marginTop: SPACING[2],
            textAlign: 'center' as const,
            maxWidth: 280,
            lineHeight: TYPOGRAPHY.bodyMd.lineHeight,
        },
        descriptionCompact: {
            fontSize: TYPOGRAPHY.fontSize.base,
            marginTop: SPACING[1],
            maxWidth: 240,
        },
        button: {
            marginTop: SPACING[6],
            minWidth: 160,
        },
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    mascot = 'thinking',
    actionLabel,
    onAction,
    icon,
    variant = 'default',
}) => {
    const styles = useThemedStyles(createStyles);
    const mappedMascot = MASCOT_MAP[mascot] || mascot;
    const compact = variant === 'compact';

    return (
        <View style={[styles.container, compact ? styles.containerCompact : null]}>
            {icon || (
                <MascotDisplay
                    expression={mappedMascot}
                    size={compact ? 80 : 120}
                    showBackground
                />
            )}
            <Text style={[styles.title, compact ? styles.titleCompact : null]}>{title}</Text>
            {description ? (
                <Text style={[styles.description, compact ? styles.descriptionCompact : null]}>{description}</Text>
            ) : null}
            {actionLabel && onAction ? (
                <Button title={actionLabel} onPress={onAction} variant="primary" style={styles.button} />
            ) : null}
        </View>
    );
};

export default EmptyState;
