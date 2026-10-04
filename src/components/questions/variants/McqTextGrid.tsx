import React from 'react';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionGrid } from '../OptionGrid';
import { OptionStack } from '../OptionStack';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps } from '../types';

/** Short MCQ answers in a 2×2 grid. Two-choice questions, including true/false, stack instead. */
export const McqTextGrid: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared(props);
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');
    const optionProps = {
        options: props.question.options,
        selectedValue: props.selectedValue,
        selectionMode: props.selectionMode,
        mode: props.mode,
        revealed: props.revealed,
        browseRevealed,
        onSelect: props.onSelect,
    };
    const stacked =
        props.question.question_type === 'true_false' || props.question.options.length <= 2;

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            {stacked ? <OptionStack {...optionProps} showRadio={false} /> : <OptionGrid {...optionProps} />}
        </QuestionCardShell>
    );
};

export default McqTextGrid;
