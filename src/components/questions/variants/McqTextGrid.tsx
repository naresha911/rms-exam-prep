import React from 'react';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionGrid } from '../OptionGrid';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps } from '../types';

/** Classic AISSEE MCQ with short options — 2×2 grid. */
export const McqTextGrid: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared(props);
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            <OptionGrid
                options={props.question.options}
                selectedValue={props.selectedValue}
                selectionMode={props.selectionMode}
                mode={props.mode}
                revealed={props.revealed}
                browseRevealed={browseRevealed}
                onSelect={props.onSelect}
            />
        </QuestionCardShell>
    );
};

export default McqTextGrid;
