import React from 'react';
import { Image, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../../theme';
import { LatexText } from '../LatexText';
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
    selectedByQuestionId: Record<string, string | null | undefined>;
    revealedByQuestionId?: Record<string, boolean | undefined>;
    solveStatusByQuestionId?: Record<string, QuestionSolveStatus | undefined>;
    onSelectChild: (questionId: string, value: string) => void;
    showBookmark?: boolean;
    bookmarkedByQuestionId?: Record<string, boolean | undefined>;
    onToggleBookmarkChild?: (questionId: string) => void;
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

function createStyles(colors: ColorPalette) {
    return {
        wrap: { gap: SPACING[4] },
        passagePanel: {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: BORDER_RADIUS.xl,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[4],
            gap: SPACING[2],
        },
        passageLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 12,
            fontWeight: '700' as const,
            color: colors.primary,
            textTransform: 'uppercase' as const,
            letterSpacing: 0.6,
        },
        passageImage: {
            width: '100%' as const,
            height: 160,
            marginTop: SPACING[2],
            borderRadius: BORDER_RADIUS.lg,
            backgroundColor: colors.figurePlate,
        },
        marksNote: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: 12,
            color: colors.onSurfaceVariant,
            marginTop: SPACING[1],
        },
        children: { gap: SPACING[3] },
    };
}

/** Passage panel plus one card per child question. */
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
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    return (
        <View style={styles.wrap}>
            <View style={styles.passagePanel}>
                <Text style={styles.passageLabel}>Passage</Text>
                <LatexText
                    content={group.shared_text}
                    color={colors.onSurface}
                    fontSize={16}
                    fontFamily={TYPOGRAPHY.fontFamily.regular}
                    lineHeight={24}
                />
                {group.shared_image_path ? (
                    <Image
                        source={{ uri: group.shared_image_path }}
                        style={styles.passageImage}
                        resizeMode="contain"
                    />
                ) : null}
                <Text style={styles.marksNote}>Read the passage, then answer each question.</Text>
            </View>
            <View style={styles.children}>
                {group.children.map((child, index) => {
                    const leaf = resolvePresentation(child, {
                        mode,
                        isGroupChild: true,
                        group,
                    });
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
                    return <View key={child.id}>{renderLeaf(leaf, shared)}</View>;
                })}
            </View>
        </View>
    );
};

export default ComprehensionGroup;
