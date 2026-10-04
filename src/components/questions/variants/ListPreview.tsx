import React from 'react';
import { QuestionCardShell } from '../QuestionCardShell';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps } from '../types';

/** Browse card: stem, status, and action. Options stay on the question screen. */
export const ListPreview: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared({
        ...props,
        showFooter: props.showFooter ?? true,
        footerCtaLabel:
            props.footerCtaLabel ??
            (props.solveStatus === 'unattempted' || !props.solveStatus ? 'Solve Now' : 'Review'),
    });

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>} />
    );
};

export default ListPreview;
