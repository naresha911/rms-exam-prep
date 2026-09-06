import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants';
import type {
    ComprehensionGroupData,
    QuestionUiMode,
    SelectionMode,
    QuestionSolveStatus,
    SharedQuestionProps,
} from '../types';
import { resolvePresentation } from '../resolvePresentation';
import { McqTextGrid } from './McqTextGrid';
import { McqTextStack } from './McqTextStack';
import { McqEquation } from './McqEquation';
import { McqInlineMath } from './McqInlineMath';
import { McqDiagram } from './McqDiagram';
import { AssertionReason } from './AssertionReason';
import { FigureSeries } from './FigureSeries';
import { MatchingLists } from './MatchingLists';

export interface ComprehensionGroupProps {
    group: ComprehensionGroupData;
    mode: QuestionUiMode;
    selectionMode: SelectionMode;
    /** Per child question_id → selected value. Passage has no answer row. */
    selectedByQuestionId: Record<string, string | null | undefined>;
    revealedByQuestionId?: Record<string, boolean | undefined>;
    solveStatusByQuestionId?: Record<string, QuestionSolveStatus | undefined>;
    /** One answer per child question_id — never the group id. */
    onSelectChild: (questionId: string, value: string) => void;
    showBookmark?: boolean;
    bookmarkedByQuestionId?: Record<string, boolean | undefined>;
    onToggleBookmarkChild?: (questionId: string) => void;
    /** Prefer stack for longer English options when leaf would be ambiguous — handled by resolver. */
    startQuestionNumber?: number;
}

function renderLeaf(presentation: string, props: SharedQuestionProps) {
    switch (presentation) {
        case 'mcq_text_stack':
            return <McqTextStack {...props} />;
        case 'mcq_equation':
            return <McqEquation {...props} />;
        case 'mcq_inline_math':
            return <McqInlineMath {...props} />;
        case 'mcq_diagram':
            return <McqDiagram {...props} />;
        case 'assertion_reason':
            return <AssertionReason {...props} />;
        case 'figure_series':
            return <FigureSeries {...props} />;
        case 'matching_lists':
            return <MatchingLists {...props} />;
        case 'mcq_text_grid':
        default:
            return <McqTextGrid {...props} />;
    }
}

/**
 * Passage panel (0 marks) + ordered child cards.
 * Each child scores independently; one answer row per child question_id.
 */
export const ComprehensionGroup: React.FC<ComprehensionGroupProps> = ({
    group,
    mode,
    selectionMode,
    selectedByQuestionId,
    revealedByQuestionId,
    solveStatusByQuestionId,
    onSelectChild,
    showBookmark,
    bookmarkedByQuestionId,
    onToggleBookmarkChild,
    startQuestionNumber = 1,
}) => {
    return (
        <View style={styles.wrap}>
            <View style={styles.passagePanel}>
                <Text style={styles.passageLabel}>Passage</Text>
                <Text style={styles.passageBody}>{group.shared_text}</Text>
                {group.shared_image_path ? (
                    <Image
                        source={{ uri: group.shared_image_path }}
                        style={styles.passageImage}
                        resizeMode="contain"
                    />
                ) : null}
                <Text style={styles.marksNote}>0 marks · context only</Text>
            </View>

            <View style={styles.children}>
                {group.children.map((child, index) => {
                    const leaf = resolvePresentation(child, {
                        mode,
                        isGroupChild: true,
                        group,
                    });
                    // Prefer stack for English-length options when resolver picked grid but options are long —
                    // already handled in resolvePresentation.

                    const shared: SharedQuestionProps = {
                        question: child,
                        mode,
                        selectionMode,
                        selectedValue: selectedByQuestionId[child.id] ?? null,
                        revealed: revealedByQuestionId?.[child.id],
                        solveStatus: solveStatusByQuestionId?.[child.id],
                        onSelect: (value) => onSelectChild(child.id, value),
                        questionNumber: startQuestionNumber + index,
                        showBookmark,
                        isBookmarked: bookmarkedByQuestionId?.[child.id],
                        onToggleBookmark: onToggleBookmarkChild
                            ? () => onToggleBookmarkChild(child.id)
                            : undefined,
                    };

                    return (
                        <View key={child.id} style={styles.childCard}>
                            {renderLeaf(leaf, shared)}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        gap: SPACING[4],
    },
    passagePanel: {
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[4],
        gap: SPACING[2],
    },
    passageLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    passageBody: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.onSurface,
    },
    passageImage: {
        width: '100%',
        height: 140,
        marginTop: SPACING[2],
    },
    marksNote: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: 11,
        color: COLORS.onSurfaceVariant,
        marginTop: SPACING[1],
    },
    children: {
        gap: SPACING[3],
    },
    childCard: {
        // children own their shells
    },
});

export default ComprehensionGroup;
