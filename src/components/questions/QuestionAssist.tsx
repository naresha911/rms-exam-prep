import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { MascotDisplay } from '../shared/MascotDisplay';
import { MaterialIcon } from '../ui/MaterialIcon';
import { LatexText } from './LatexText';
import { hasTextContent } from '../../utils/latex';
import { t } from '../../lib/i18n';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface QuestionAssistProps {
    hint?: string | null;
    solution?: string | null;
    solutionDiagramUri?: string | null;
    answered: boolean;
    revealed: boolean;
    isCorrect?: boolean;
    correctOptionLabel?: string;
    autoShowSolution: boolean;
    onReveal?: () => void;
    showOutcome?: boolean;
}

export const QuestionAssist: React.FC<QuestionAssistProps> = ({
    hint,
    solution,
    solutionDiagramUri,
    answered,
    revealed,
    isCorrect = false,
    correctOptionLabel,
    autoShowSolution,
    onReveal,
    showOutcome = true,
}) => {
    const hasHint = hasTextContent(hint);
    const hasSolution = hasTextContent(solution) || !!solutionDiagramUri;
    const [hintOpen, setHintOpen] = useState(false);
    const [solutionOpen, setSolutionOpen] = useState(false);
    const requestedReveal = React.useRef(false);

    useEffect(() => {
        if (answered && autoShowSolution && !revealed && !requestedReveal.current) {
            requestedReveal.current = true;
            onReveal?.();
        }
    }, [answered, autoShowSolution, revealed, onReveal]);

    useEffect(() => {
        if (revealed && autoShowSolution) {
            setSolutionOpen(true);
        }
    }, [revealed, autoShowSolution]);

    const handleShowSolution = () => {
        setSolutionOpen(true);
        if (!revealed) onReveal?.();
    };

    const outcome = isCorrect
        ? {
              mascot: 'celebrating' as const,
              headline: t('practice.correct'),
              subtext: t('question.correctSubtext'),
              bg: COLORS.successLight,
              border: COLORS.success,
              headlineColor: COLORS.successText,
          }
        : {
              mascot: 'encouraging' as const,
              headline: t('practice.incorrect'),
              subtext: correctOptionLabel
                  ? t('question.incorrectSubtext', { answer: correctOptionLabel })
                  : t('question.incorrectSubtextGeneric'),
              bg: COLORS.warningLight,
              border: COLORS.warning,
              headlineColor: COLORS.warningText,
          };

    if (!hasHint && !answered && !revealed) {
        return null;
    }

    return (
        <View style={styles.stack}>
            {hasHint ? (
                <View style={styles.hintCard}>
                    <Pressable
                        onPress={() => setHintOpen((open) => !open)}
                        style={styles.hintHeader}
                        accessibilityRole="button"
                        accessibilityLabel={hintOpen ? t('question.hideHint') : t('question.showHint')}
                    >
                        <MaterialIcon name="lightbulb" size={20} color={COLORS.tertiary} filled={hintOpen} />
                        <Text style={styles.hintTitle}>{hintOpen ? t('question.hideHint') : t('question.showHint')}</Text>
                    </Pressable>
                    {hintOpen ? (
                        <View style={styles.hintBody}>
                            <LatexText
                                content={hint}
                                color={COLORS.onSurface}
                                fontSize={TYPOGRAPHY.fontSize.base}
                                fontFamily={TYPOGRAPHY.fontFamily.medium}
                            />
                        </View>
                    ) : null}
                </View>
            ) : null}

            {revealed && showOutcome ? (
                <View style={[styles.outcomeCard, { backgroundColor: outcome.bg, borderColor: outcome.border }]}>
                    <View style={styles.outcomeHeader}>
                        <MascotDisplay expression={outcome.mascot} size={56} />
                        <View style={styles.outcomeCopy}>
                            <Text style={[styles.outcomeHeadline, { color: outcome.headlineColor }]}>
                                {outcome.headline}
                            </Text>
                            <Text style={styles.outcomeSubtext}>{outcome.subtext}</Text>
                        </View>
                    </View>
                </View>
            ) : null}

            {answered && !revealed ? (
                <Pressable
                    onPress={handleShowSolution}
                    style={styles.solutionCta}
                    accessibilityRole="button"
                    accessibilityLabel={t('question.showSolution')}
                >
                    <MaterialIcon name="menu_book" size={20} color={COLORS.primary} />
                    <Text style={styles.solutionCtaText}>{t('question.showSolution')}</Text>
                </Pressable>
            ) : null}

            {revealed ? (
                solutionOpen ? (
                    <View style={styles.solutionCard}>
                        <View style={styles.solutionHeader}>
                            <Text style={styles.solutionLabel}>{t('question.solution')}</Text>
                            {!autoShowSolution ? (
                                <Pressable onPress={() => setSolutionOpen(false)} hitSlop={8}>
                                    <Text style={styles.hideLink}>{t('question.hideSolution')}</Text>
                                </Pressable>
                            ) : null}
                        </View>
                        {hasSolution ? (
                            <>
                                {hasTextContent(solution) ? (
                                    <LatexText
                                        content={solution}
                                        color={COLORS.onSurface}
                                        fontSize={TYPOGRAPHY.fontSize.base}
                                        fontFamily={TYPOGRAPHY.fontFamily.medium}
                                        lineHeight={24}
                                    />
                                ) : null}
                                {solutionDiagramUri ? (
                                    <Image
                                        source={{ uri: solutionDiagramUri }}
                                        style={styles.diagram}
                                        resizeMode="contain"
                                    />
                                ) : null}
                            </>
                        ) : (
                            <Text style={styles.emptySolution}>{t('question.noSolution')}</Text>
                        )}
                    </View>
                ) : (
                    <Pressable
                        onPress={handleShowSolution}
                        style={styles.solutionCta}
                        accessibilityRole="button"
                    >
                        <MaterialIcon name="menu_book" size={20} color={COLORS.primary} />
                        <Text style={styles.solutionCtaText}>{t('question.showSolution')}</Text>
                    </Pressable>
                )
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    stack: {
        gap: SPACING[3],
        marginTop: SPACING[3],
    },
    hintCard: {
        backgroundColor: COLORS.tertiaryFixed,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        overflow: 'hidden',
    },
    hintHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[2],
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
        minHeight: SPACING['touch-target'],
    },
    hintTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.tertiary,
    },
    hintBody: {
        paddingHorizontal: SPACING[4],
        paddingBottom: SPACING[4],
    },
    outcomeCard: {
        borderRadius: BORDER_RADIUS['2xl'],
        borderWidth: 2,
        padding: SPACING[4],
    },
    outcomeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[3],
    },
    outcomeCopy: {
        flex: 1,
    },
    outcomeHeadline: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: '800',
    },
    outcomeSubtext: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    solutionCta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING[2],
        minHeight: SPACING['touch-target'],
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryFixed,
        paddingHorizontal: SPACING[4],
    },
    solutionCtaText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.primary,
    },
    solutionCard: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[4],
        gap: SPACING[3],
    },
    solutionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    solutionLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.onSurfaceVariant,
    },
    hideLink: {
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },
    emptySolution: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    diagram: {
        width: '100%',
        height: 200,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: '#fff',
    },
});

export default QuestionAssist;
