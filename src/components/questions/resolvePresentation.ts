import type { QuestionOption, QuestionType } from '../../types';
import type {
    QuestionContentFlags,
    QuestionPresentation,
    QuestionRenderItem,
    ResolvePresentationOptions,
    SelectionMode,
} from './types';

const LONG_OPTION_CHARS = 42;
const CODE_SYMBOL_RE = /[→←↑↓]/;
const CODE_WORD_RE = /\b(?:coding|decode|symbol)\b/i;
const ALL_CAPS_CODE_RE = /^[A-Z0-9\s\-_/\\]+$/;

function looksCodeLike(value: string): boolean {
    return (
        CODE_SYMBOL_RE.test(value) ||
        CODE_WORD_RE.test(value) ||
        ALL_CAPS_CODE_RE.test(value)
    );
}

function avgOptionLength(options: QuestionOption[]): number {
    if (!options.length) return 0;
    const total = options.reduce((sum, o) => sum + (o.option_text?.length ?? 0), 0);
    return total / options.length;
}

function optionsLookCodeLike(options: QuestionOption[], stem?: string): boolean {
    if (stem && looksCodeLike(stem)) return true;
    return options.some((o) => {
        const t = o.option_text ?? '';
        return t.length > 0 && t.length < 28 && looksCodeLike(t);
    });
}

function tagsInclude(tags: string[] | undefined, ...needles: string[]): boolean {
    if (!tags?.length) return false;
    const lower = tags.map((t) => t.toLowerCase());
    return needles.some((n) => lower.includes(n.toLowerCase()));
}

/** Derive content flags used by resolvePresentation (no DB schema). */
export function getContentFlags(question: QuestionRenderItem): QuestionContentFlags {
    const options = question.options ?? [];
    const hints = question.presentationHints;
    const hasOptionImages = options.some((o) => !!o.option_image_path);
    const hasProblemFigures = !!(hints?.problemFigureUris && hints.problemFigureUris.length > 0);
    const hasEquation = !!(
        hints?.equation ||
        tagsInclude(question.tags, 'equation', 'fraction', 'arithmetic')
    );
    const hasInlineMath = !!(
        (hints?.inlineMathChips && hints.inlineMathChips.length > 0) ||
        tagsInclude(question.tags, 'inline_math', 'inline-math') ||
        /\$.+\$|\{math:/.test(question.question_text ?? '')
    );

    const avgLen = avgOptionLength(options);
    const optionsAreLong = avgLen >= LONG_OPTION_CHARS;
    const optionsAreCodeLike = optionsLookCodeLike(options, question.question_text);

    return {
        hasDiagram: !!(question.has_diagram || question.diagram_path),
        hasOptionImages,
        hasProblemFigures,
        hasEquation,
        hasInlineMath,
        optionsAreLong,
        optionsAreCodeLike,
        questionType: question.question_type,
    };
}

function resolveLeafPresentation(question: QuestionRenderItem): QuestionPresentation {
    const forced = question.presentationHints?.forcePresentation;
    if (forced) return forced;

    const type = question.question_type as QuestionType;
    const flags = getContentFlags(question);

    if (type === 'assertion_reason') return 'assertion_reason';
    if (type === 'matching') return 'matching_lists';

    // mcq_single / true_false / others with content flags
    if (type === 'mcq_single' || type === 'true_false' || type === 'mcq_multi') {
        if (flags.hasProblemFigures || flags.hasOptionImages) return 'figure_series';
        if (flags.hasDiagram) return 'mcq_diagram';
        if (flags.hasEquation) return 'mcq_equation';
        if (flags.hasInlineMath) return 'mcq_inline_math';
        if (type === 'true_false') return 'mcq_text_grid';
        if (flags.optionsAreLong || flags.optionsAreCodeLike) return 'mcq_text_stack';
        return 'mcq_text_grid';
    }

    // Unsupported leaf types: fall back to stack for longer prompts
    if (type === 'fill_blank' || type === 'short_answer') {
        return 'mcq_text_stack';
    }

    // Orphan leaf `comprehension` enum — treat as stack until group chrome is used
    if (type === 'comprehension') return 'mcq_text_stack';

    return 'mcq_text_grid';
}

/**
 * Maps question_type + content flags → presentation variant per design §5.
 * Resolution order is locked in docs/question_types_design.md.
 */
export function resolvePresentation(
    question: QuestionRenderItem,
    options: ResolvePresentationOptions = {}
): QuestionPresentation {
    const { mode, listPreview, group, isGroupChild } = options;

    // 1. Group context → comprehension_group (children still resolve leaves)
    if (group && !isGroupChild) {
        return 'comprehension_group';
    }

    const leaf = resolveLeafPresentation(question);

    // 8. Feed/browse → may wrap as list_preview
    if (listPreview || mode === 'browse') {
        return 'list_preview';
    }

    return leaf;
}

/** Resolve the underlying leaf when list_preview wraps a question. */
export function resolveLeafForPreview(question: QuestionRenderItem): QuestionPresentation {
    return resolveLeafPresentation(question);
}

export function getOptionValue(
    option: QuestionOption,
    selectionMode: SelectionMode
): string {
    return selectionMode === 'option_id' ? option.id : option.option_key;
}

export function findCorrectOptionValue(
    options: QuestionOption[],
    selectionMode: SelectionMode
): string | null {
    const correct = options.find((o) => o.is_correct);
    if (!correct) return null;
    return getOptionValue(correct, selectionMode);
}
