import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { questionChrome, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon } from '../ui/MaterialIcon';
import { useResponsive } from '../../hooks/useResponsive';
import { t } from '../../lib/i18n';
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

const STATUS_TEXT_STYLE = {
    correct: 'statusTextCorrect',
    incorrect: 'statusTextIncorrect',
    unattempted: 'statusTextUnattempted',
} as const;

function createStyles(colors: ColorPalette) {
    const chrome = questionChrome(colors);
    return {
        card: {
            backgroundColor: chrome.cardBackground,
            borderRadius: BORDER_RADIUS.card,
            borderWidth: 1,
            borderColor: chrome.cardBorder,
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
            gap: SPACING[2],
        },
        counterGroup: {
            flex: 1,
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: SPACING[2],
        },
        counterChip: {
            minWidth: 28,
            height: 28,
            borderRadius: 9,
            paddingHorizontal: 6,
            backgroundColor: chrome.chipBackground,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        counterChipText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 12.5,
            fontWeight: '700' as const,
            color: chrome.chipText,
        },
        counterText: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 11.5,
            fontWeight: '600' as const,
            letterSpacing: 1.1,
            textTransform: 'uppercase' as const,
            color: colors.onSurfaceVariant,
        },
        sectionBand: {
            flexDirection: 'row' as const,
            backgroundColor: chrome.bandBackground,
            borderRadius: BORDER_RADIUS.lg,
            overflow: 'hidden' as const,
        },
        sectionAccent: {
            width: 3,
            alignSelf: 'stretch' as const,
            backgroundColor: chrome.bandAccent,
        },
        sectionText: {
            flex: 1,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 13.5,
            fontWeight: '600' as const,
            color: chrome.bandText,
            paddingHorizontal: 12,
            paddingVertical: 9,
        },
        stemSlot: { gap: SPACING[2] },
        contextSlot: { gap: SPACING[3] },
        /** Answer rows sit directly on the card as bordered pills — no tinted inset. */
        well: {
            gap: SPACING[2],
        },
        wellTablet: {
            gap: 10,
        },
        footer: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
            gap: SPACING[2],
            paddingTop: SPACING[3],
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
        },
        statusPill: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: 6,
            borderRadius: BORDER_RADIUS.full,
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        statusCorrect: { backgroundColor: colors.successLight },
        statusIncorrect: { backgroundColor: colors.errorLight },
        statusUnattempted: { backgroundColor: colors.surfaceContainer },
        statusText: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 12,
            fontWeight: '600' as const,
        },
        statusTextCorrect: { color: colors.successText },
        statusTextIncorrect: { color: colors.errorText },
        statusTextUnattempted: { color: colors.onSurfaceVariant },
        cta: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: 2,
        },
        ctaText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 13,
            fontWeight: '700' as const,
            color: colors.primary,
        },
    };
}

export const QuestionCardShell: React.FC<QuestionCardShellProps> = ({
    counterNumber,
    counterTotal,
    headerAction,
    sectionLabel,
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
    const statusColor =
        footerStatus === 'correct'
            ? colors.success
            : footerStatus === 'incorrect'
                ? colors.error
                : colors.onSurfaceVariant;

    const headerRight = showBookmark ? (
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
    ) : headerAction ? (
        headerAction
    ) : null;

    const counterText =
        counterTotal != null ? t('question.ofTotal', { total: counterTotal }) : null;
    const counterA11y =
        counterNumber != null
            ? t('question.counterA11y', {
                  current: counterNumber,
                  total: counterTotal ?? counterNumber,
              })
            : (counterText ?? undefined);
    const hasCounter = counterNumber != null || !!counterText;

    return (
        <View style={[styles.card, isTablet ? styles.cardTablet : null]}>
            {hasCounter || headerRight ? (
                <View style={styles.header}>
                    {hasCounter ? (
                        <View
                            style={styles.counterGroup}
                            accessible
                            accessibilityLabel={counterA11y}
                        >
                            {counterNumber != null ? (
                                <View style={styles.counterChip}>
                                    <Text style={styles.counterChipText}>
                                        {String(counterNumber).padStart(2, '0')}
                                    </Text>
                                </View>
                            ) : null}
                            {counterText ? (
                                <Text style={styles.counterText}>{counterText}</Text>
                            ) : null}
                        </View>
                    ) : (
                        <View style={styles.counterGroup} />
                    )}
                    {headerRight}
                </View>
            ) : null}

            {sectionLabel ? (
                <View style={styles.sectionBand}>
                    <View style={styles.sectionAccent} />
                    <Text style={styles.sectionText}>{sectionLabel}</Text>
                </View>
            ) : null}

            {stem != null ? <View style={styles.stemSlot}>{stem}</View> : null}
            {context != null ? <View style={styles.contextSlot}>{context}</View> : null}
            {children != null ? (
                <View style={[styles.well, isTablet ? styles.wellTablet : null]}>{children}</View>
            ) : null}

            {showFooter ? (
                <View style={styles.footer}>
                    {footerStatus ? (
                        <View style={[styles.statusPill, styles[STATUS_STYLE[footerStatus]]]}>
                            <MaterialIcon name={STATUS_ICON[footerStatus]} size={14} color={statusColor} />
                            <Text style={[styles.statusText, styles[STATUS_TEXT_STYLE[footerStatus]]]}>
                                {STATUS_LABEL[footerStatus]}
                                {footerStatus === 'correct' && footerMarks != null ? ` (+${footerMarks})` : ''}
                            </Text>
                        </View>
                    ) : (
                        <View />
                    )}
                    {footerCtaLabel && onFooterCta ? (
                        <Pressable onPress={onFooterCta} hitSlop={6} accessibilityRole="button">
                            <View style={styles.cta}>
                                <Text style={styles.ctaText}>{footerCtaLabel}</Text>
                                <MaterialIcon name="chevron_right" size={16} color={colors.primary} />
                            </View>
                        </Pressable>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
};

export default QuestionCardShell;
