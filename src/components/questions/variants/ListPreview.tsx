import React from 'react';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionGrid } from '../OptionGrid';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import { resolveLeafForPreview } from '../resolvePresentation';
import type { SharedQuestionProps } from '../types';

const GRID_LEAVES = new Set([
    'mcq_text_grid',
    'mcq_inline_math',
    'mcq_equation',
    'mcq_diagram',
]);

/**
 * Browse/feed density — stem + status footer; options only for solved-correct preview.
 */
export const ListPreview: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared({
        ...props,
        showFooter: props.showFooter ?? true,
        footerCtaLabel:
            props.footerCtaLabel ??
            (props.solveStatus === 'unattempted' || !props.solveStatus
                ? 'Solve Now'
                : 'Review'),
    });

    const leaf = resolveLeafForPreview(props.question);
    const showOptionsPreview = props.solveStatus === 'correct' && GRID_LEAVES.has(leaf);

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            {showOptionsPreview && (
                <OptionGrid
                    options={props.question.options}
                    selectedValue={props.selectedValue}
                    selectionMode={props.selectionMode}
                    mode="browse"
                    browseRevealed
                    compact
                />
            )}
        </QuestionCardShell>
    );
};

export default ListPreview;
