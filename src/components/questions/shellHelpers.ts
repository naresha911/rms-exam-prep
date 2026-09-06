import type { SharedQuestionProps, QuestionSolveStatus } from './types';

/** Map shared props → shell footer / header fields. */
export function shellFromShared(props: SharedQuestionProps) {
    const {
        question,
        questionNumber,
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
        questionNumber,
        difficulty: question.difficulty,
        source: question.source,
        tags: question.tags,
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
