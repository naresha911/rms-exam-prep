// ExplanationCard — shows explanation after an answer is submitted
import React from 'react';
import { View, Text, Image } from 'react-native';
import { MascotDisplay } from '../shared/MascotDisplay';
import { LatexText } from '../questions/LatexText';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';

interface ExplanationCardProps {
    isCorrect: boolean;
    correctOptionKey: string;
    explanation?: string | null;
    explanationDiagramPath?: string | null;
}

type ExplanationTone = 'correct' | 'missed';

const CARD = {
    correct: 'cardCorrect',
    missed: 'cardMissed',
} as const;

const HEADLINE = {
    correct: 'headlineCorrect',
    missed: 'headlineMissed',
} as const;

const DIVIDER = {
    correct: 'dividerCorrect',
    missed: 'dividerMissed',
} as const;

function explanationCopy(isCorrect: boolean, correctOptionKey: string) {
    if (isCorrect) {
        return {
            mascot: 'celebrating' as const,
            headline: 'Excellent! 🎉',
            subtext: "That's the right answer!",
            tone: 'correct' as const,
        };
    }
    return {
        mascot: 'encouraging' as const,
        headline: 'Almost there! 💪',
        subtext: `The correct answer is ${correctOptionKey}`,
        tone: 'missed' as const,
    };
}

function createStyles(colors: ColorPalette) {
    return {
        card: {
            borderRadius: BORDER_RADIUS['2xl'],
            borderWidth: 2,
            padding: SPACING[4],
            marginTop: SPACING[3],
        },
        cardCorrect: {
            backgroundColor: colors.successLight,
            borderColor: colors.success,
        },
        cardMissed: {
            backgroundColor: colors.warningLight,
            borderColor: colors.warning,
        },
        headlineRow: {
            gap: SPACING[3],
            marginBottom: SPACING[3],
        },
        copy: { flex: 1 },
        headline: {
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        headlineCorrect: { color: colors.successText },
        headlineMissed: { color: colors.warningText },
        subtext: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 2,
        },
        divider: {
            height: 1,
            opacity: 0.4,
            marginBottom: SPACING[3],
        },
        dividerCorrect: { backgroundColor: colors.success },
        dividerMissed: { backgroundColor: colors.warning },
        solutionLabel: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.textSecondary,
            marginBottom: SPACING[1],
        },
        empty: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            fontStyle: 'italic' as const,
        },
        diagram: {
            width: '100%' as const,
            height: 200,
            borderRadius: BORDER_RADIUS.lg,
            marginTop: SPACING[3],
            resizeMode: 'contain' as const,
            backgroundColor: colors.figurePlate,
        },
    };
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
    isCorrect,
    correctOptionKey,
    explanation,
    explanationDiagramPath,
}) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const config = explanationCopy(isCorrect, correctOptionKey);
    const tone: ExplanationTone = config.tone;

    return (
        <View style={[styles.card, styles[CARD[tone]]]}>
            <View style={[layout.row, styles.headlineRow]}>
                <MascotDisplay expression={config.mascot} size={56} />
                <View style={styles.copy}>
                    <Text style={[styles.headline, styles[HEADLINE[tone]]]}>{config.headline}</Text>
                    <Text style={styles.subtext}>{config.subtext}</Text>
                </View>
            </View>

            {explanation ? (
                <>
                    <View style={[styles.divider, styles[DIVIDER[tone]]]} />
                    <Text style={styles.solutionLabel}>📖 Solution</Text>
                    <LatexText
                        content={explanation}
                        color={colors.textPrimary}
                        fontSize={TYPOGRAPHY.fontSize.base}
                        lineHeight={24}
                    />
                </>
            ) : (
                <Text style={styles.empty}>No explanation available for this question.</Text>
            )}

            {explanationDiagramPath ? (
                <Image source={{ uri: explanationDiagramPath }} style={styles.diagram} />
            ) : null}
        </View>
    );
};

export default ExplanationCard;
