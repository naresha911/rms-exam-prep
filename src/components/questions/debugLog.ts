import type { QuestionContentFlags, QuestionPresentation, QuestionRenderItem, QuestionUiMode } from './types';
import { getContentFlags } from './resolvePresentation';

const PREFIX = '[QuestionUI]';

/**
 * Dev-only logging for which presentation path is active.
 * Filter Metro/console with: QuestionUI
 */
export function logQuestionPresentation(params: {
    source: string;
    question: Pick<QuestionRenderItem, 'id' | 'question_type' | 'has_diagram' | 'diagram_path' | 'tags'> & {
        options?: { option_text?: string; option_image_path?: string | null }[];
        question_text?: string;
        presentationHints?: QuestionRenderItem['presentationHints'];
    };
    mode?: QuestionUiMode;
    presentation?: QuestionPresentation;
    selectionMode?: string;
    questionNumber?: number;
    extra?: Record<string, unknown>;
}): void {
    if (typeof __DEV__ === 'undefined' || !__DEV__) return;

    const flags: QuestionContentFlags | null = params.question
        ? getContentFlags(params.question as QuestionRenderItem)
        : null;

    // eslint-disable-next-line no-console
    console.log(PREFIX, {
        source: params.source,
        questionId: params.question.id,
        questionNumber: params.questionNumber,
        question_type: params.question.question_type,
        presentation: params.presentation ?? '(unresolved)',
        mode: params.mode,
        selectionMode: params.selectionMode,
        flags,
        stemPreview: (params.question.question_text || '').slice(0, 80),
        ...params.extra,
    });
}
