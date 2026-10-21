import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import {
    difficultyColors,
    useColors,
    useThemedStyles,
    type ColorPalette,
} from '../../theme';
import { MaterialIcon } from '../ui/MaterialIcon';
import { useResponsive } from '../../hooks/useResponsive';
import type { QuestionCardShellProps, QuestionSolveStatus } from './types';

const STATUS_ICON: Record<QuestionSolveStatus, 'verified' | 'cancel' | 'help'> = {
    correct: 'verified',
    incorrect: 'cancel',
    unattempted: 'help',
};

const STATUS_LABEL: Record<QuestionSolveStatus, string> = {
    correct: 'Solved • Correct',
    incorrect: 'Solved • Incorrect',
    unattempted: 'Unattempted',
};

const STATUS_STYLE = {
    correct: 'statusCorrect',
    incorrect: 'statusIncorrect',
    unattempted: 'statusUnattempted',
} as const;

const DOT = {
    easy: 'dotEasy',
    medium: 'dotMedium',
    hard: 'dotHard',
} as const;

function createStyles(colors: ColorPalette) {
    const difficulty = difficultyColors(colors);
    return {
        wrapper: { gap: SPACING[3] },
        wrapperTablet: { gap: 14 },
        card: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS.xl,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[4],
            gap: SPACING[3],
        },
        cardTablet: {
            padding: SPACING[5],
            gap: 14,
        },
        header: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
            gap: SPACING[2],
        },
        headerLeft: {
            flex: 1,
            flexDirection: 'row' as const,
            flexWrap: 'wrap' as const,
            alignItems: 'center' as const,
            gap: SPACING[2],
        },
        qBadge: {
            backgroundColor: colors.primaryFixed,
            paddingHorizontal: 10,
            paddingVertical: SPACING[1],
            borderRadius: BORDER_RADIUS.lg,
        },
        qBadgeText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 12,
            fontWeight: '700' as const,
            color: colors.primary,
        },
        pill: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: 6,
            paddingHorizontal: SPACING[2],
            paddingVertical: SPACING[1],
            borderRadius: BORDER_RADIUS.lg,
            maxWidth: 160,
        },
        pillNeutral: { backgroundColor: colors.surfaceContainer },
        pillSource: { backgroundColor: colors.tertiaryFixed },
        pillHighYield: { backgroundColor: colors.primaryFixedDim },
        pillText: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 11,
            fontWeight: '600' as const,
            color: colors.onSurfaceVariant,
        },
        pillSourceText: { color: colors.tertiary },
        pillHighYieldText: { color: colors.primary, fontWeight: '700' as const },
        dot: { width: 6, height: 6, borderRadius: 3 },
        dotEasy: { backgroundColor: difficulty.easy.text },
        dotMedium: { backgroundColor: difficulty.medium.text },
        dotHard: { backgroundColor: difficulty.hard.text },
        stemSlot: { gap: SPACING[2] },
        contextSlot: { gap: SPACING[3] },
        optionsSlot: { gap: SPACING[3] },
        optionsSlotTablet: { gap: 14 },
        footer: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
            paddingTop: SPACING[2],
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
        },
        footerOutside: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
            paddingHorizontal: SPACING[1],
        },
        statusRow: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: 6,
        },
        statusText: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 12,
            fontWeight: '600' as const,
        },
        statusCorrect: { color: colors.success },
        statusIncorrect: { color: colors['weakness-red'] },
        statusUnattempted: { color: colors.onSurfaceVariant },
        ctaText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 13,
            fontWeight: '700' as const,
            color: colors.primary,
        },
    };
}

export const QuestionCardShell: React.FC<QuestionCardShellProps> = ({
    questionNumber,
    difficulty,
    source,
    tags,
    isBookmarked = false,
    showBookmark = false,
    onToggleBookmark,
    stem,
    context,
    children,
    footerStatus = null,
    footerMarks = null,
    footerCtaLabel,
    onFooterCta,
    showFooter = false,
}) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { isTablet } = useResponsive();
    const highYield = tags?.some((tag) => tag.toLowerCase() === 'high_yield' || tag.toLowerCase() === 'high-yield');
    const statusColor =
        footerStatus === 'correct'
            ? colors.success
            : footerStatus === 'incorrect'
                ? colors['weakness-red']
                : colors.onSurfaceVariant;

    const footerContent = (
        <>
            {footerStatus ? (
                <View style={styles.statusRow}>
                    <MaterialIcon name={STATUS_ICON[footerStatus]} size={16} color={statusColor} />
                    <Text style={[styles.statusText, styles[STATUS_STYLE[footerStatus]]]}>
                        {STATUS_LABEL[footerStatus]}
                        {footerStatus === 'correct' && footerMarks != null ? ` (+${footerMarks})` : ''}
                    </Text>
                </View>
            ) : (
                <View />
            )}
            {footerCtaLabel && onFooterCta ? (
                <Pressable onPress={onFooterCta} hitSlop={6} accessibilityRole="button">
                    <Text style={styles.ctaText}>{footerCtaLabel}</Text>
                </Pressable>
            ) : null}
        </>
    );

    const hasOptions = children != null;

    return (
        <View style={[styles.wrapper, isTablet ? styles.wrapperTablet : null]}>
            <View style={[styles.card, isTablet ? styles.cardTablet : null]}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {questionNumber != null && (
                            <View style={styles.qBadge}>
                                <Text style={styles.qBadgeText}>Q{questionNumber}</Text>
                            </View>
                        )}
                        {difficulty ? (
                            <View style={[styles.pill, styles.pillNeutral]}>
                                <View style={[styles.dot, styles[DOT[difficulty]]]} />
                                <Text style={styles.pillText}>
                                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                </Text>
                            </View>
                        ) : null}
                        {source ? (
                            <View style={[styles.pill, styles.pillSource]}>
                                <Text style={[styles.pillText, styles.pillSourceText]} numberOfLines={1}>
                                    {source}
                                </Text>
                            </View>
                        ) : null}
                        {highYield ? (
                            <View style={[styles.pill, styles.pillHighYield]}>
                                <Text style={[styles.pillText, styles.pillHighYieldText]}>High Yield</Text>
                            </View>
                        ) : null}
                    </View>
                    {showBookmark ? (
                        <Pressable
                            onPress={onToggleBookmark}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                        >
                            <MaterialIcon
                                name={isBookmarked ? 'bookmark' : 'bookmark_border'}
                                size={22}
                                color={isBookmarked ? colors['warning-amber'] : colors.outline}
                                filled={isBookmarked}
                            />
                        </Pressable>
                    ) : null}
                </View>

                {stem != null ? <View style={styles.stemSlot}>{stem}</View> : null}
                {context != null ? <View style={styles.contextSlot}>{context}</View> : null}

                {showFooter && !hasOptions ? <View style={styles.footer}>{footerContent}</View> : null}
            </View>

            {hasOptions ? (
                <View style={[styles.optionsSlot, isTablet ? styles.optionsSlotTablet : null]}>
                    {children}
                </View>
            ) : null}

            {showFooter && hasOptions ? (
                <View style={styles.footerOutside}>{footerContent}</View>
            ) : null}
        </View>
    );
};

export default QuestionCardShell;
