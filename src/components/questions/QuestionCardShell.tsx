import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import { DIFFICULTY_COLORS } from '../../constants/theme';
import { MaterialIcon } from '../ui/MaterialIcon';
import type { QuestionCardShellProps, QuestionSolveStatus } from './types';

const STATUS_COPY: Record<
    QuestionSolveStatus,
    { label: string; color: string; icon: 'verified' | 'cancel' | 'help' }
> = {
    correct: {
        label: 'Solved • Correct',
        color: COLORS.success,
        icon: 'verified',
    },
    incorrect: {
        label: 'Solved • Incorrect',
        color: COLORS['weakness-red'],
        icon: 'cancel',
    },
    unattempted: {
        label: 'Unattempted',
        color: COLORS.onSurfaceVariant,
        icon: 'help',
    },
};

export const QuestionCardShell: React.FC<QuestionCardShellProps> = ({
    questionNumber,
    difficulty,
    source,
    tags,
    isBookmarked = false,
    showBookmark = false,
    onToggleBookmark,
    stem,
    children,
    footerStatus = null,
    footerMarks = null,
    footerCtaLabel,
    onFooterCta,
    showFooter = false,
}) => {
    const difficultyColors = difficulty ? DIFFICULTY_COLORS[difficulty] : null;
    const statusMeta = footerStatus ? STATUS_COPY[footerStatus] : null;
    const highYield = tags?.some((t) => t.toLowerCase() === 'high_yield' || t.toLowerCase() === 'high-yield');

    return (
        <View style={styles.card}>
            {/* Header row */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {questionNumber != null && (
                        <View style={styles.qBadge}>
                            <Text style={styles.qBadgeText}>Q{questionNumber}</Text>
                        </View>
                    )}
                    {difficulty && difficultyColors && (
                        <View style={[styles.pill, { backgroundColor: COLORS.surfaceContainer }]}>
                            <View style={[styles.dot, { backgroundColor: difficultyColors.text }]} />
                            <Text style={[styles.pillText, { color: COLORS.onSurfaceVariant }]}>
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </Text>
                        </View>
                    )}
                    {source ? (
                        <View style={[styles.pill, { backgroundColor: COLORS.tertiaryFixed }]}>
                            <Text style={[styles.pillText, { color: COLORS.tertiary }]} numberOfLines={1}>
                                {source}
                            </Text>
                        </View>
                    ) : null}
                    {highYield ? (
                        <View style={[styles.pill, { backgroundColor: COLORS.primaryFixedDim }]}>
                            <Text style={[styles.pillText, { color: COLORS.primary, fontWeight: '700' }]}>
                                High Yield
                            </Text>
                        </View>
                    ) : null}
                </View>
                {showBookmark && (
                    <Pressable
                        onPress={onToggleBookmark}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    >
                        <MaterialIcon
                            name={isBookmarked ? 'bookmark' : 'bookmark_border'}
                            size={22}
                            color={isBookmarked ? COLORS['warning-amber'] : COLORS.outlineVariant}
                            filled={isBookmarked}
                        />
                    </Pressable>
                )}
            </View>

            {stem != null && <View style={styles.stemSlot}>{stem}</View>}

            {children != null && <View style={styles.bodySlot}>{children}</View>}

            {showFooter && (
                <View style={styles.footer}>
                    {statusMeta ? (
                        <View style={styles.statusRow}>
                            <MaterialIcon name={statusMeta.icon} size={16} color={statusMeta.color} />
                            <Text style={[styles.statusText, { color: statusMeta.color }]}>
                                {statusMeta.label}
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
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[4],
        gap: SPACING[3],
        shadowColor: COLORS.onSurface,
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: SPACING[2],
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: SPACING[2],
    },
    qBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: SPACING[1],
        borderRadius: BORDER_RADIUS.lg,
    },
    qBadgeText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.onPrimary,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: SPACING[2],
        paddingVertical: SPACING[1],
        borderRadius: BORDER_RADIUS.lg,
        maxWidth: 140,
    },
    pillText: {
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: 11,
        fontWeight: '600',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    stemSlot: {
        gap: SPACING[2],
    },
    bodySlot: {
        gap: SPACING[2],
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: SPACING[2],
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusText: {
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: 12,
        fontWeight: '600',
    },
    ctaText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
    },
});

export default QuestionCardShell;
