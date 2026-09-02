// QuestionPalette — grid of question numbers for test navigation
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

export type QuestionStatus =
    | 'not_visited'
    | 'answered'
    | 'not_answered'
    | 'marked_review'
    | 'answered_marked_review';

interface QuestionPaletteProps {
    totalQuestions: number;
    currentIndex: number;
    answers: Record<string, string[]>;
    flagged: Set<string>;
    questionIds: string[];
    onNavigate: (index: number) => void;
}

const STATUS_STYLES: Record<
    QuestionStatus,
    { bg: string; border: string; text: string }
> = {
    not_visited: {
        bg: COLORS.backgroundSecondary,
        border: COLORS.cardBorder,
        text: COLORS.textSecondary,
    },
    not_answered: {
        bg: '#FEE2E2',
        border: COLORS.error,
        text: COLORS.error,
    },
    answered: {
        bg: '#D1FAE5',
        border: COLORS.success,
        text: '#065F46',
    },
    marked_review: {
        bg: '#FEF3C7',
        border: COLORS.warning,
        text: '#92400E',
    },
    answered_marked_review: {
        bg: '#EDE9FE',
        border: COLORS.primary,
        text: COLORS.primary,
    },
};

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
    totalQuestions,
    currentIndex,
    answers,
    flagged,
    questionIds,
    onNavigate,
}) => {
    const getStatus = (qId: string): QuestionStatus => {
        const hasAnswer = (answers[qId]?.length ?? 0) > 0;
        const isFlagged = flagged.has(qId);

        if (isFlagged && hasAnswer) return 'answered_marked_review';
        if (isFlagged) return 'marked_review';
        if (hasAnswer) return 'answered';
        // If the user has visited (i.e., index <= currentIndex) but not answered
        const idx = questionIds.indexOf(qId);
        if (idx < currentIndex) return 'not_answered';
        return 'not_visited';
    };

    const answered = questionIds.filter(id => (answers[id]?.length ?? 0) > 0).length;
    const notAnswered = questionIds.filter(id => {
        const idx = questionIds.indexOf(id);
        return idx < currentIndex && !(answers[id]?.length > 0);
    }).length;
    const markedReview = questionIds.filter(id => flagged.has(id)).length;
    const notVisited = totalQuestions - answered - notAnswered - markedReview;

    return (
        <View>
            {/* Legend */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING[2], marginBottom: SPACING[3] }}>
                <LegendItem color={STATUS_STYLES.answered.bg} border={STATUS_STYLES.answered.border} label={`${answered} Answered`} />
                <LegendItem color={STATUS_STYLES.not_answered.bg} border={STATUS_STYLES.not_answered.border} label={`${notAnswered} Not Answered`} />
                <LegendItem color={STATUS_STYLES.marked_review.bg} border={STATUS_STYLES.marked_review.border} label={`${markedReview} Marked`} />
                <LegendItem color={STATUS_STYLES.not_visited.bg} border={STATUS_STYLES.not_visited.border} label={`${notVisited} Not Visited`} />
            </View>

            {/* Question number grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING[2] }}>
                {questionIds.map((qId, idx) => {
                    const status = getStatus(qId);
                    const style = STATUS_STYLES[status];
                    const isCurrent = idx === currentIndex;

                    return (
                        <Pressable
                            key={qId}
                            onPress={() => onNavigate(idx)}
                            style={({ pressed }) => ({
                                width: 40,
                                height: 40,
                                borderRadius: BORDER_RADIUS.md,
                                backgroundColor: style.bg,
                                borderWidth: isCurrent ? 3 : 1.5,
                                borderColor: isCurrent ? COLORS.primary : style.border,
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: pressed ? 0.7 : 1,
                            })}
                        >
                            <Text style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: '700',
                                color: isCurrent ? COLORS.primary : style.text,
                            }}>
                                {idx + 1}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

function LegendItem({
    color,
    border,
    label,
}: {
    color: string;
    border: string;
    label: string;
}) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View
                style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    backgroundColor: color,
                    borderWidth: 1.5,
                    borderColor: border,
                }}
            />
            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                {label}
            </Text>
        </View>
    );
}

export default QuestionPalette;
