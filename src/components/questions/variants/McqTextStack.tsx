import React from 'react';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionStack } from '../OptionStack';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps } from '../types';

/** Longer option text / coding-decoding — stacked radio rows. */
export const McqTextStack: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared(props);
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            <OptionStack
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

export default McqTextStack;
