import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MascotDisplay } from '../shared/MascotDisplay';
import { MaterialIcon } from '../ui/MaterialIcon';
import { LatexText } from './LatexText';
import { hasTextContent } from '../../utils/latex';
import { t } from '../../lib/i18n';

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

function createStyles(colors: ColorPalette) {
    return {
        stack: {
            gap: SPACING[3],
            marginTop: SPACING[3],
        },
        hintCard: {
            backgroundColor: colors.tertiaryFixed,
            borderRadius: BORDER_RADIUS.xl,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            overflow: 'hidden' as const,
        },
        hintHeader: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: SPACING[2],
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[3],
            minHeight: SPACING['touch-target'],
        },
        hintTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 14,
            fontWeight: '700' as const,
            color: colors.tertiary,
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
        outcomeCorrect: {
            backgroundColor: colors.successLight,
            borderColor: colors.success,
        },
        outcomeIncorrect: {
            backgroundColor: colors.warningLight,
            borderColor: colors.warning,
        },
        outcomeHeader: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: SPACING[3],
        },
        outcomeCopy: { flex: 1 },
        outcomeHeadline: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: '800' as const,
        },
        headlineCorrect: { color: colors.successText },
        headlineIncorrect: { color: colors.warningText },
        outcomeSubtext: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 2,
        },
        solutionCta: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            gap: SPACING[2],
            minHeight: SPACING['touch-target'],
            borderRadius: BORDER_RADIUS.xl,
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: colors.primaryFixed,
            paddingHorizontal: SPACING[4],
        },
        solutionCtaText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 15,
            fontWeight: '700' as const,
            color: colors.primary,
        },
        solutionCard: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS.xl,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[4],
            gap: SPACING[3],
        },
        solutionHeader: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
        },
        solutionLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 14,
            fontWeight: '700' as const,
            color: colors.onSurfaceVariant,
        },
        hideLink: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 13,
            fontWeight: '600' as const,
            color: colors.primary,
        },
        emptySolution: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            fontStyle: 'italic' as const,
        },
        diagram: {
            width: '100%' as const,
            height: 200,
            borderRadius: BORDER_RADIUS.lg,
            backgroundColor: colors.figurePlate,
        },
    };
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
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
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

    if (!hasHint && !answered && !revealed) {
        return null;
    }

    const headline = isCorrect ? t('practice.correct') : t('practice.incorrect');
    const subtext = isCorrect
        ? t('question.correctSubtext')
        : correctOptionLabel
            ? t('question.incorrectSubtext', { answer: correctOptionLabel })
            : t('question.incorrectSubtextGeneric');

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
                        <MaterialIcon name="lightbulb" size={20} color={colors.tertiary} filled={hintOpen} />
                        <Text style={styles.hintTitle}>{hintOpen ? t('question.hideHint') : t('question.showHint')}</Text>
                    </Pressable>
                    {hintOpen ? (
                        <View style={styles.hintBody}>
                            <LatexText
                                content={hint}
                                color={colors.onSurface}
                                fontSize={TYPOGRAPHY.fontSize.base}
                                fontFamily={TYPOGRAPHY.fontFamily.medium}
                            />
                        </View>
                    ) : null}
                </View>
            ) : null}

            {revealed && showOutcome ? (
                <View style={[styles.outcomeCard, isCorrect ? styles.outcomeCorrect : styles.outcomeIncorrect]}>
                    <View style={styles.outcomeHeader}>
                        <MascotDisplay expression={isCorrect ? 'celebrating' : 'encouraging'} size={56} />
                        <View style={styles.outcomeCopy}>
                            <Text style={[styles.outcomeHeadline, isCorrect ? styles.headlineCorrect : styles.headlineIncorrect]}>
                                {headline}
                            </Text>
                            <Text style={styles.outcomeSubtext}>{subtext}</Text>
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
                    <MaterialIcon name="menu_book" size={20} color={colors.primary} />
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
                                        color={colors.onSurface}
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
                        <MaterialIcon name="menu_book" size={20} color={colors.primary} />
                        <Text style={styles.solutionCtaText}>{t('question.showSolution')}</Text>
                    </Pressable>
                )
            ) : null}
        </View>
    );
};

export default QuestionAssist;
