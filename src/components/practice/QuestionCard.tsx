// QuestionCard — displays a practice question with progress indicator
import React from 'react';
import { View, Text, Image } from 'react-native';
import { ProgressBar } from '../ui/ProgressBar';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import type { Difficulty, PracticeQuestion } from '../../types';

interface QuestionCardProps {
    question: PracticeQuestion;
    currentIndex: number;
    totalQuestions: number;
    showDifficulty?: boolean;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
};

const BADGE = {
    easy: 'badgeEasy',
    medium: 'badgeMedium',
    hard: 'badgeHard',
} as const;

const BADGE_TEXT = {
    easy: 'badgeTextEasy',
    medium: 'badgeTextMedium',
    hard: 'badgeTextHard',
} as const;

function createStyles(colors: ColorPalette) {
    return {
        card: {
            backgroundColor: colors.cardBackground,
            borderRadius: BORDER_RADIUS['2xl'],
            padding: SPACING[4],
            marginBottom: SPACING[3],
        },
        metaRow: {
            marginBottom: SPACING[3],
            gap: SPACING[3],
        },
        counter: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        badge: {
            paddingHorizontal: SPACING[2],
            paddingVertical: 2,
            borderRadius: BORDER_RADIUS.sm,
        },
        badgeEasy: { backgroundColor: colors.successLight },
        badgeMedium: { backgroundColor: colors.warningLight },
        badgeHard: { backgroundColor: colors.errorLight },
        badgeText: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        badgeTextEasy: { color: colors.success },
        badgeTextMedium: { color: colors.amberText },
        badgeTextHard: { color: colors.error },
        progress: { marginBottom: SPACING[4] },
        diagram: {
            width: '100%' as const,
            height: 180,
            borderRadius: BORDER_RADIUS.lg,
            marginBottom: SPACING[3],
            resizeMode: 'contain' as const,
            backgroundColor: colors.backgroundSecondary,
        },
        stem: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: colors.textPrimary,
            lineHeight: 28,
        },
    };
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    currentIndex,
    totalQuestions,
    showDifficulty = true,
}) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const progress = (currentIndex + 1) / totalQuestions;
    const level = question.difficulty ?? 'medium';

    return (
        <View style={styles.card}>
            <View style={[layout.row, styles.metaRow]}>
                <Text style={styles.counter}>
                    Question {currentIndex + 1} / {totalQuestions}
                </Text>
                {showDifficulty && (
                    <View style={[styles.badge, styles[BADGE[level]]]}>
                        <Text style={[styles.badgeText, styles[BADGE_TEXT[level]]]}>
                            {DIFFICULTY_LABEL[level]}
                        </Text>
                    </View>
                )}
            </View>

            <ProgressBar progress={progress} height={6} color={colors.primary} style={styles.progress} />

            {question.has_diagram && question.diagram_path && (
                <Image source={{ uri: question.diagram_path }} style={styles.diagram} />
            )}

            <Text style={styles.stem}>
                {question.question_text ?? 'Question text unavailable'}
            </Text>
        </View>
    );
};

export default QuestionCard;
