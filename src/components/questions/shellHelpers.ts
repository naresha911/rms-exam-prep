import type { SharedQuestionProps, QuestionSolveStatus } from './types';

/** Map shared props → shell header/footer fields. */
export function shellFromShared(props: SharedQuestionProps) {
    const {
        question,
        showBookmark = false,
        isBookmarked,
        onToggleBookmark,
        showFooter = false,
        footerCtaLabel,
        onFooterCta,
        solveStatus,
        revealed,
        mode,
        selectedValue,
        counterTotal,
        headerAction,
        sectionLabel,
    } = props;

    let footerStatus: QuestionSolveStatus | null = solveStatus ?? null;
    if (!footerStatus && mode === 'practice' && revealed) {
        const correct = question.options.find((o) => o.is_correct);
        const correctVal =
            props.selectionMode === 'option_id' ? correct?.id : correct?.option_key;
        footerStatus =
            selectedValue && correctVal && selectedValue === correctVal
                ? 'correct'
                : selectedValue
                  ? 'incorrect'
                  : 'unattempted';
    }

    return {
        counterNumber: props.questionNumber,
        counterTotal,
        headerAction,
        sectionLabel,
        showBookmark,
        isBookmarked,
        onToggleBookmark,
        showFooter,
        footerStatus,
        footerMarks: footerStatus === 'correct' ? question.marks : null,
        footerCtaLabel,
        onFooterCta,
    };
}
