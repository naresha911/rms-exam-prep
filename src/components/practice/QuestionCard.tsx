// QuestionCard — displays a practice question with progress indicator
import React from 'react';
import { View, Text, Image } from 'react-native';
import { ProgressBar } from '../ui/ProgressBar';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import type { PracticeQuestion } from '../../types';

interface QuestionCardProps {
    question: PracticeQuestion;
    currentIndex: number;
    totalQuestions: number;
    showDifficulty?: boolean;
}

const DIFFICULTY_CONFIG = {
    easy: { label: 'Easy', color: COLORS.success, bg: '#D1FAE5' },
    medium: { label: 'Medium', color: '#B45309', bg: '#FEF3C7' },
    hard: { label: 'Hard', color: COLORS.error, bg: '#FEE2E2' },
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    currentIndex,
    totalQuestions,
    showDifficulty = true,
}) => {
    const progress = (currentIndex + 1) / totalQuestions;
    const difficulty = DIFFICULTY_CONFIG[question.difficulty] ?? DIFFICULTY_CONFIG.medium;

    return (
        <View
            style={{
                backgroundColor: COLORS.cardBackground,
                borderRadius: BORDER_RADIUS['2xl'],
                padding: SPACING[4],
                marginBottom: SPACING[3],
            }}
        >
            {/* Question number + progress */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING[3], gap: SPACING[3] }}>
                <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, fontWeight: '600' }}>
                    Question {currentIndex + 1} / {totalQuestions}
                </Text>
                {showDifficulty && (
                    <View style={{
                        backgroundColor: difficulty.bg,
                        paddingHorizontal: SPACING[2],
                        paddingVertical: 2,
                        borderRadius: BORDER_RADIUS.sm,
                    }}>
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: difficulty.color, fontWeight: '600' }}>
                            {difficulty.label}
                        </Text>
                    </View>
                )}
            </View>

            <ProgressBar progress={progress} height={6} color={COLORS.primary} style={{ marginBottom: SPACING[4] }} />

            {/* Diagram (if any) */}
            {question.has_diagram && question.diagram_path && (
                <Image
                    source={{ uri: question.diagram_path }}
                    style={{
                        width: '100%',
                        height: 180,
                        borderRadius: BORDER_RADIUS.lg,
                        marginBottom: SPACING[3],
                        resizeMode: 'contain',
                        backgroundColor: COLORS.backgroundSecondary,
                    }}
                />
            )}

            {/* Question text */}
            <Text
                style={{
                    fontSize: TYPOGRAPHY.fontSize.lg,
                    fontWeight: '600',
                    color: COLORS.textPrimary,
                    lineHeight: 28,
                }}
            >
                {question.question_text ?? 'Question text unavailable'}
            </Text>
        </View>
    );
};

export default QuestionCard;
