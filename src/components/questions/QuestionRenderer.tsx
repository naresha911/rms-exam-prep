import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { resolvePresentation, getContentFlags } from './resolvePresentation';
import { logQuestionPresentation } from './debugLog';
import type {
    SharedQuestionProps,
    ComprehensionGroupData,
    QuestionPresentation,
} from './types';
import { McqTextGrid } from './variants/McqTextGrid';
import { McqTextStack } from './variants/McqTextStack';
import { McqEquation } from './variants/McqEquation';
import { McqInlineMath } from './variants/McqInlineMath';
import { McqDiagram } from './variants/McqDiagram';
import { AssertionReason } from './variants/AssertionReason';
import { FigureSeries } from './variants/FigureSeries';
import { MatchingLists } from './variants/MatchingLists';
import { ListPreview } from './variants/ListPreview';
import {
    ComprehensionGroup,
    type ComprehensionGroupProps,
} from './variants/ComprehensionGroup';

export interface QuestionRendererProps extends SharedQuestionProps {
    /** When set (and not a group child), renders comprehension_group chrome. */
    group?: ComprehensionGroupData | null;
    listPreview?: boolean;
    /** Dev log source label (e.g. PaperSession, TestSession). */
    debugSource?: string;
    /** Group-only callbacks when `group` is provided */
    selectedByQuestionId?: ComprehensionGroupProps['selectedByQuestionId'];
    revealedByQuestionId?: ComprehensionGroupProps['revealedByQuestionId'];
    solveStatusByQuestionId?: ComprehensionGroupProps['solveStatusByQuestionId'];
    onSelectChild?: ComprehensionGroupProps['onSelectChild'];
    bookmarkedByQuestionId?: ComprehensionGroupProps['bookmarkedByQuestionId'];
    onToggleBookmarkChild?: ComprehensionGroupProps['onToggleBookmarkChild'];
    startQuestionNumber?: number;
}

const UNSUPPORTED_TYPES = new Set(['mcq_multi', 'fill_blank', 'short_answer']);

function LeafByPresentation({
    presentation,
    props,
}: {
    presentation: QuestionPresentation;
    props: SharedQuestionProps;
}) {
    switch (presentation) {
        case 'mcq_text_grid':
            return <McqTextGrid {...props} />;
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
        case 'list_preview':
            return <ListPreview {...props} />;
        default:
            return <McqTextGrid {...props} />;
    }
}

/**
 * Maps question_type + content flags → variant and renders it.
 * Selection stays consistent via `selectionMode` (`option_key` | `option_id`).
 */
export const QuestionRenderer: React.FC<QuestionRendererProps> = (props) => {
    const {
        question,
        mode,
        group,
        listPreview,
        debugSource = 'QuestionRenderer',
        selectedByQuestionId,
        revealedByQuestionId,
        solveStatusByQuestionId,
        onSelectChild,
        bookmarkedByQuestionId,
        onToggleBookmarkChild,
        startQuestionNumber,
        ...sharedRest
    } = props;

    const presentation = resolvePresentation(question, {
        mode,
        listPreview,
        group,
    });

    useEffect(() => {
        logQuestionPresentation({
            source: debugSource,
            question,
            mode,
            presentation,
            selectionMode: props.selectionMode,
            questionNumber: props.questionNumber,
            extra: {
                listPreview: !!listPreview,
                hasGroup: !!group,
                contentFlags: getContentFlags(question),
                variantComponent:
                    presentation === 'comprehension_group'
                        ? 'ComprehensionGroup'
                        : presentation,
            },
        });
    }, [
        question.id,
        question.question_type,
        presentation,
        mode,
        listPreview,
        group?.id,
        props.questionNumber,
        props.selectionMode,
        debugSource,
    ]);

    if (presentation === 'comprehension_group' && group) {
        if (!onSelectChild) {
            return (
                <View style={styles.unsupported}>
                    <Text style={styles.unsupportedText}>
                        Comprehension group requires onSelectChild (per child question_id).
                    </Text>
                </View>
            );
        }
        return (
            <ComprehensionGroup
                group={group}
                mode={mode}
                selectionMode={props.selectionMode}
                selectedByQuestionId={selectedByQuestionId ?? {}}
                revealedByQuestionId={revealedByQuestionId}
                solveStatusByQuestionId={solveStatusByQuestionId}
                onSelectChild={onSelectChild}
                showBookmark={props.showBookmark}
                bookmarkedByQuestionId={bookmarkedByQuestionId}
                onToggleBookmarkChild={onToggleBookmarkChild}
                startQuestionNumber={startQuestionNumber ?? props.questionNumber}
            />
        );
    }

    const shared: SharedQuestionProps = {
        question,
        mode,
        ...sharedRest,
        listPreview,
    };

    const unsupported = UNSUPPORTED_TYPES.has(question.question_type);

    return (
        <View>
            <LeafByPresentation presentation={presentation} props={shared} />
            {unsupported && (
                <Text style={styles.unsupportedHint}>
                    Layout preview — this question type is not fully supported in sessions yet.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    unsupported: {
        padding: SPACING[4],
        backgroundColor: COLORS.surfaceContainer,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
    },
    unsupportedText: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: 13,
        color: COLORS.onSurfaceVariant,
    },
    unsupportedHint: {
        marginTop: SPACING[2],
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: 11,
        color: COLORS.onSurfaceVariant,
        textAlign: 'center',
    },
});

export default QuestionRenderer;
