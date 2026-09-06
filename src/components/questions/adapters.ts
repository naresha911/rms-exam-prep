import type { PaperSessionQuestion, PracticeQuestion, QuestionOption } from '../../types';
import type { QuestionRenderItem } from './types';

/** Defaults for fields required by PracticeQuestion but unused by leaf UI. */
const RENDER_DEFAULTS = {
    subject_id: 0,
    topic_id: 0,
    standard_id: 0,
    stream_id: null as number | null,
    difficulty: 'medium' as const,
    year: null as number | null,
    source: null as string | null,
    tags: [] as string[],
    is_active: true,
    created_by: null as string | null,
    created_at: '',
    updated_at: '',
};

/**
 * Map paper session payload → QuestionRenderItem for QuestionRenderer.
 * Exam payloads omit is_correct; leave false so practice-style reveal never fires in exam mode.
 */
export function paperQuestionToRenderItem(q: PaperSessionQuestion): QuestionRenderItem {
    const options: QuestionOption[] = (q.options ?? []).map((o) => ({
        id: o.id,
        question_id: q.question_id,
        option_key: o.option_key,
        is_correct: false,
        display_order: o.display_order,
        option_text: o.option_text,
        option_image_path: o.option_image_path ?? null,
    }));

    return {
        ...RENDER_DEFAULTS,
        id: q.question_id,
        question_type: q.question_type,
        has_diagram: q.has_diagram,
        diagram_path: q.diagram_path,
        marks: q.marks,
        negative_marks: q.negative_marks,
        question_text: q.question_text,
        explanation: q.explanation,
        options,
    };
}

export interface MinimalTestQuestion {
    id: string;
    question_text: string;
    question_type?: PracticeQuestion['question_type'];
    has_diagram?: boolean;
    diagram_path?: string | null;
    marks?: number;
    negative_marks?: number;
    difficulty?: PracticeQuestion['difficulty'];
    tags?: string[];
    source?: string | null;
    options: {
        id: string;
        option_key: string;
        option_text?: string;
        option_image_path?: string | null;
        is_correct?: boolean;
        display_order?: number | null;
    }[];
    explanation?: string;
}

/** Map mock/sectional/speed test question → QuestionRenderItem. */
export function testQuestionToRenderItem(q: MinimalTestQuestion): QuestionRenderItem {
    const options: QuestionOption[] = (q.options ?? []).map((o, i) => ({
        id: o.id,
        question_id: q.id,
        option_key: o.option_key,
        is_correct: o.is_correct ?? false,
        display_order: o.display_order ?? i,
        option_text: o.option_text,
        option_image_path: o.option_image_path ?? null,
    }));

    return {
        ...RENDER_DEFAULTS,
        id: q.id,
        question_type: q.question_type ?? 'mcq_single',
        has_diagram: q.has_diagram ?? false,
        diagram_path: q.diagram_path ?? null,
        marks: q.marks ?? 1,
        negative_marks: q.negative_marks ?? 0,
        difficulty: q.difficulty ?? 'medium',
        tags: q.tags ?? [],
        source: q.source ?? null,
        question_text: q.question_text,
        explanation: q.explanation,
        options,
    };
}
