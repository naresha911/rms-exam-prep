import type { ReactNode } from 'react';
import type { Difficulty, PracticeQuestion, QuestionOption, QuestionType } from '../../types';

/** Presentation variants from docs/question_types_design.md §5 */
export type QuestionPresentation =
    | 'mcq_text_grid'
    | 'mcq_text_stack'
    | 'mcq_equation'
    | 'mcq_inline_math'
    | 'mcq_diagram'
    | 'assertion_reason'
    | 'figure_series'
    | 'matching_lists'
    | 'list_preview'
    | 'comprehension_group';

export type QuestionUiMode = 'browse' | 'exam' | 'practice';

export type SelectionMode = 'option_key' | 'option_id';

export type OptionUiState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

export type QuestionSolveStatus = 'unattempted' | 'correct' | 'incorrect';

/** Structured fraction for equation MVP (plain text fallback also supported). */
export interface FractionNode {
    numerator: string;
    denominator: string;
}

export interface EquationPayload {
    /** Plain display string, e.g. "3/4 + 1/2 = ?" */
    text?: string;
    /** Optional structured left/right fractions */
    left?: FractionNode;
    right?: FractionNode;
    operator?: string;
}

export interface MatchingListItem {
    key: string;
    text: string;
}

export interface MatchingListsPayload {
    listI: MatchingListItem[];
    listII: MatchingListItem[];
}

export interface AssertionReasonPayload {
    assertion?: string;
    reason?: string;
}

/** Optional presentation hints — no DB schema required. */
export interface QuestionPresentationHints {
    equation?: EquationPayload;
    /** Stem segments with `{math:...}` markers, or pre-split chips */
    inlineMathChips?: string[];
    problemFigureUris?: string[];
    matchingLists?: MatchingListsPayload;
    assertionReason?: AssertionReasonPayload;
    /** Force a leaf presentation when heuristics are ambiguous */
    forcePresentation?: Exclude<QuestionPresentation, 'list_preview' | 'comprehension_group'>;
}

/** Question payload accepted by renderers (practice shape + optional hints). */
export interface QuestionRenderItem extends PracticeQuestion {
    presentationHints?: QuestionPresentationHints;
}

export interface ComprehensionGroupData {
    id: string;
    shared_text: string;
    shared_image_path?: string | null;
    children: QuestionRenderItem[];
}

export interface ResolvePresentationOptions {
    mode?: QuestionUiMode;
    /** When true, wrap resolved leaf as list_preview */
    listPreview?: boolean;
    /** Group context → comprehension_group chrome */
    group?: ComprehensionGroupData | null;
    isGroupChild?: boolean;
}

export interface QuestionContentFlags {
    hasDiagram: boolean;
    hasOptionImages: boolean;
    hasProblemFigures: boolean;
    hasEquation: boolean;
    hasInlineMath: boolean;
    optionsAreLong: boolean;
    optionsAreCodeLike: boolean;
    questionType: QuestionType;
}

export interface QuestionCardShellProps {
    questionNumber?: number;
    difficulty?: Difficulty;
    source?: string | null;
    tags?: string[];
    isBookmarked?: boolean;
    showBookmark?: boolean;
    onToggleBookmark?: () => void;
    stem?: ReactNode;
    /** Prompt/equation/diagram/lists that stay inside the question card. */
    context?: ReactNode;
    children?: ReactNode;
    footerStatus?: QuestionSolveStatus | null;
    footerMarks?: number | null;
    footerCtaLabel?: string;
    onFooterCta?: () => void;
    showFooter?: boolean;
}

export interface SharedQuestionProps {
    question: QuestionRenderItem;
    mode: QuestionUiMode;
    selectionMode: SelectionMode;
    selectedValue: string | null;
    /** Practice/review: show correct/incorrect. Exam also reveals after Show Solution. */
    revealed?: boolean;
    /** Browse: prior solve status for preview */
    solveStatus?: QuestionSolveStatus;
    onSelect?: (value: string) => void;
    questionNumber?: number;
    showBookmark?: boolean;
    isBookmarked?: boolean;
    onToggleBookmark?: () => void;
    showFooter?: boolean;
    footerCtaLabel?: string;
    onFooterCta?: () => void;
    /** Hide options in list_preview unless solved-correct */
    listPreview?: boolean;
}

export type OptionValueGetter = (option: QuestionOption) => string;
