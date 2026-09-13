// Previous Year Papers — API, scoring helpers, offline cache
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ensureStudentProfile, supabase } from './supabase';
import {
    getStandardIdFallback,
    normalizeStudentStandard,
} from '../constants';
import {
    Difficulty,
    Paper,
    PaperAttempt,
    PaperAttemptAnswer,
    PaperAttemptSummary,
    PaperListStatus,
    PaperSectionStat,
    PaperSessionQuestion,
    QuestionType,
    ReviewStatus,
    Standard,
} from '../types';

const SUPPORTED_PAPER_TYPES: QuestionType[] = [
    'mcq_single',
    'true_false',
    'assertion_reason',
];

const PAPER_CATALOGUE_KEY = 'papers:catalogue:v1';
const PAPER_SESSION_CACHE_PREFIX = 'papers:session:';
const PAPER_OFFLINE_QUEUE_KEY = 'papers:offlineQueue:v1';

export type PaperValidationIssue = {
    code: 'empty' | 'duplicate' | 'order_gap' | 'marks_mismatch' | 'unsupported_types';
    message: string;
    blocking: boolean;
};

type TranslationRow = { language_code: string; question_text?: string | null; explanation?: string | null };
type OptionTranslationRow = {
    language_code: string;
    option_text?: string | null;
    option_image_path?: string | null;
};

function pickTranslation<T extends { language_code: string }>(
    rows: T[] | null | undefined,
    preferred: string
): T | undefined {
    if (!rows?.length) return undefined;
    return (
        rows.find((r) => r.language_code === preferred) ||
        rows.find((r) => r.language_code === 'en') ||
        rows[0]
    );
}

export function isSupportedPaperQuestionType(type: QuestionType | string): boolean {
    return SUPPORTED_PAPER_TYPES.includes(type as QuestionType);
}

export function validatePaperQuestions(
    questions: { question_id: string; question_order: number; marks: number; question_type: string }[],
    paperTotalMarks: number | null
): PaperValidationIssue[] {
    const issues: PaperValidationIssue[] = [];
    if (!questions.length) {
        issues.push({
            code: 'empty',
            message: 'This paper has no questions yet.',
            blocking: true,
        });
        return issues;
    }

    const ids = questions.map((q) => q.question_id);
    if (new Set(ids).size !== ids.length) {
        issues.push({
            code: 'duplicate',
            message: 'This paper has duplicate question mappings.',
            blocking: true,
        });
    }

    const orders = questions.map((q) => q.question_order).sort((a, b) => a - b);
    for (let i = 1; i < orders.length; i++) {
        if (orders[i] === orders[i - 1]) {
            issues.push({
                code: 'order_gap',
                message: 'Question order has duplicates.',
                blocking: false,
            });
            break;
        }
        if (orders[i] > orders[i - 1] + 1) {
            issues.push({
                code: 'order_gap',
                message: 'Question order has gaps.',
                blocking: false,
            });
            break;
        }
    }

    const marksSum = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    if (paperTotalMarks != null && Math.abs(marksSum - Number(paperTotalMarks)) > 0.5) {
        issues.push({
            code: 'marks_mismatch',
            message: `Question marks (${marksSum}) do not match paper total (${paperTotalMarks}).`,
            blocking: false,
        });
    }

    const unsupported = questions.filter((q) => !isSupportedPaperQuestionType(q.question_type));
    if (unsupported.length) {
        issues.push({
            code: 'unsupported_types',
            message: `${unsupported.length} question(s) use types not supported in this version.`,
            blocking: false,
        });
    }

    return issues;
}

export function mapSessionPayload(
    payload: any,
    preferredLanguage: string
): { paper: Paper; questions: PaperSessionQuestion[]; issues: PaperValidationIssue[] } {
    const paper = payload.paper as Paper;
    const raw = (payload.questions || []) as any[];
    const questions: PaperSessionQuestion[] = raw.map((entry) => {
        const translations = (entry.translations || []) as TranslationRow[];
        const picked = pickTranslation(translations, preferredLanguage);
        const options = ((entry.options || []) as any[]).map((opt) => {
            const ot = pickTranslation(
                (opt.translations || []) as OptionTranslationRow[],
                preferredLanguage
            );
            return {
                id: opt.id as string,
                option_key: opt.option_key as string,
                display_order: opt.display_order ?? null,
                option_text: ot?.option_text || '',
                option_image_path: ot?.option_image_path ?? null,
            };
        });
        const questionType = entry.question_type as QuestionType;
        return {
            question_id: entry.question_id,
            section: entry.section ?? null,
            question_order: entry.question_order ?? 0,
            marks: Number(entry.marks ?? 1),
            negative_marks: Number(entry.negative_marks ?? 0),
            question_type: questionType,
            has_diagram: !!entry.has_diagram,
            diagram_path: entry.diagram_path ?? null,
            question_text: picked?.question_text || 'Question text unavailable',
            options,
            supported: isSupportedPaperQuestionType(questionType),
        };
    });

    const issues = validatePaperQuestions(
        questions.map((q) => ({
            question_id: q.question_id,
            question_order: q.question_order,
            marks: q.marks,
            question_type: q.question_type,
        })),
        paper?.total_marks ?? null
    );

    return { paper, questions, issues };
}

/** Preview score on client (authoritative score comes from submit RPC). */
export function previewPaperScore(
    questions: PaperSessionQuestion[],
    answers: Record<string, string>
): { score: number; maxScore: number; correctCount: number } {
    let score = 0;
    let maxScore = 0;
    let correctCount = 0;
    // Without is_correct we can only sum max; preview correct requires server.
    questions.forEach((q) => {
        maxScore += q.marks;
        if (answers[q.question_id]) {
            // Tentative: count answered only for UI progress, not correctness
        }
    });
    return { score, maxScore, correctCount };
}

export async function fetchStandardIdForClass(targetClass: string): Promise<number | null> {
    const standard = normalizeStudentStandard(targetClass);
    // Student standard 5 → AISSEE Class 6; standard 8 → AISSEE Class 9.
    // DBs may name rows 5th/8th or legacy 6th/9th.
    const preferredNames =
        standard === '8'
            ? ['8th', '8', 'class 8', '9th', '9', 'class 9']
            : ['5th', '5', 'class 5', '6th', '6', 'class 6'];

    const { data, error } = await supabase.from('standards').select('id, name');

    if (error || !data?.length) {
        return getStandardIdFallback(standard);
    }

    const rows = data as Standard[];
    const standardNum = Number(standard);

    // Prefer row whose id matches student standard (e.g. id 5 for Class 5).
    const byId = rows.find((s) => s.id === standardNum);
    if (byId) return byId.id;

    const lower = (name: string) => name.trim().toLowerCase();
    for (const candidate of preferredNames) {
        const exact = rows.find((s) => lower(s.name) === candidate);
        if (exact) return exact.id;
    }
    for (const candidate of preferredNames) {
        const partial = rows.find((s) => lower(s.name).includes(candidate));
        if (partial) return partial.id;
    }

    return getStandardIdFallback(standard);
}

export async function fetchPapersPage(
    standardId: number,
    options?: { year?: number; from?: number; to?: number }
) {
    const from = options?.from ?? 0;
    const to = options?.to ?? 19;
    let query = supabase
        .from('papers')
        .select('*')
        .eq('standard_id', standardId)
        .eq('is_published', true)
        .order('year', { ascending: false })
        .range(from, to);

    if (options?.year) {
        query = query.eq('year', options.year);
    }

    return query;
}

export async function fetchPaperSectionStats(paperIds: string[]) {
    if (!paperIds.length) return { data: [] as PaperSectionStat[], error: null };
    const { data, error } = await supabase
        .from('paper_section_stats')
        .select('*')
        .in('paper_id', paperIds);
    return { data: (data || []) as PaperSectionStat[], error };
}

export async function getPaperSessionQuestions(paperId: string) {
    const { data, error } = await supabase.rpc('get_paper_session_questions', {
        p_paper_id: paperId,
    });
    return { data, error };
}

export async function startPaperAttempt(paperId: string) {
    // paper_attempts.student_id FK → profiles.id
    await ensureStudentProfile();

    const { data, error } = await supabase.rpc('start_paper_attempt', {
        p_paper_id: paperId,
    });
    return { data, error };
}

export async function savePaperAnswer(params: {
    attemptId: string;
    questionId: string;
    reviewStatus?: ReviewStatus;
    selectedOptions?: string[];
    textAnswer?: string | null;
    timeSpentSeconds?: number | null;
    pauseData?: Record<string, unknown> | null;
}) {
    const { data, error } = await supabase.rpc('save_paper_answer', {
        p_attempt_id: params.attemptId,
        p_question_id: params.questionId,
        p_review_status: params.reviewStatus ?? 'answered',
        p_selected_options: params.selectedOptions ?? [],
        p_text_answer: params.textAnswer ?? null,
        p_matching_answer: null,
        p_time_spent_seconds: params.timeSpentSeconds ?? null,
        p_pause_data: params.pauseData ?? null,
    });
    return { data, error };
}

export async function submitPaperAttempt(attemptId: string) {
    const { data, error } = await supabase.rpc('submit_paper_attempt', {
        p_attempt_id: attemptId,
    });
    return { data, error };
}

export async function fetchMyPaperAttemptSummaries(standardId?: number | null) {
    const { data, error } = await supabase.rpc('get_my_paper_attempt_summaries', {
        p_standard_id: standardId ?? null,
    });
    return { data: (data || []) as PaperAttemptSummary[], error };
}

export async function fetchPaperAttemptWithAnswers(attemptId: string) {
    const { data: attempt, error: attemptError } = await supabase
        .from('paper_attempts')
        .select('*')
        .eq('id', attemptId)
        .single();

    if (attemptError || !attempt) {
        return { attempt: null, answers: [], error: attemptError };
    }

    const { data: answers, error: answersError } = await supabase
        .from('paper_attempt_answers')
        .select('*')
        .eq('attempt_id', attemptId);

    return {
        attempt: attempt as PaperAttempt,
        answers: (answers || []) as PaperAttemptAnswer[],
        error: answersError,
    };
}

export async function fetchPaperMeta(paperId: string) {
    const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('id', paperId)
        .eq('is_published', true)
        .single();
    return { data: data as Paper | null, error };
}

export async function createPaperPdfSignedUrl(pdfPath: string, expiresIn = 3600) {
    // pdf_path may be "folder/file.pdf" or "past-paper-pdfs/folder/file.pdf"
    const path = pdfPath.replace(/^past-paper-pdfs\//, '');
    const { data, error } = await supabase.storage
        .from('past-paper-pdfs')
        .createSignedUrl(path, expiresIn);
    return { data, error };
}

// ---- Catalogue cache (stale-while-revalidate) ----

export async function getCachedPaperCatalogue(standardId: number): Promise<Paper[] | null> {
    try {
        const raw = await AsyncStorage.getItem(`${PAPER_CATALOGUE_KEY}:${standardId}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { papers: Paper[]; savedAt: number };
        return parsed.papers;
    } catch {
        return null;
    }
}

export async function setCachedPaperCatalogue(standardId: number, papers: Paper[]) {
    await AsyncStorage.setItem(
        `${PAPER_CATALOGUE_KEY}:${standardId}`,
        JSON.stringify({ papers, savedAt: Date.now() })
    );
}

// ---- Session offline cache ----

export type LocalPaperSession = {
    paperId: string;
    attemptId: string | null;
    paper: Paper;
    questions: PaperSessionQuestion[];
    answers: Record<string, string>;
    flagged: string[];
    currentIndex: number;
    timeRemaining: number;
    durationSeconds: number;
    updatedAt: string;
    status: 'in_progress' | 'submitted';
};

export async function saveLocalPaperSession(session: LocalPaperSession) {
    await AsyncStorage.setItem(
        `${PAPER_SESSION_CACHE_PREFIX}${session.paperId}`,
        JSON.stringify(session)
    );
}

export async function loadLocalPaperSession(paperId: string): Promise<LocalPaperSession | null> {
    try {
        const raw = await AsyncStorage.getItem(`${PAPER_SESSION_CACHE_PREFIX}${paperId}`);
        return raw ? (JSON.parse(raw) as LocalPaperSession) : null;
    } catch {
        return null;
    }
}

export async function clearLocalPaperSession(paperId: string) {
    await AsyncStorage.removeItem(`${PAPER_SESSION_CACHE_PREFIX}${paperId}`);
}

type OfflineAnswerJob = {
    id: string;
    attemptId: string;
    questionId: string;
    reviewStatus: ReviewStatus;
    selectedOptions: string[];
    timeSpentSeconds?: number | null;
    pauseData?: Record<string, unknown> | null;
    createdAt: string;
};

export async function enqueueOfflineAnswer(job: Omit<OfflineAnswerJob, 'id' | 'createdAt'>) {
    const raw = await AsyncStorage.getItem(PAPER_OFFLINE_QUEUE_KEY);
    const queue: OfflineAnswerJob[] = raw ? JSON.parse(raw) : [];
    queue.push({
        ...job,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem(PAPER_OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export async function flushOfflineAnswerQueue(): Promise<{ flushed: number; error?: string }> {
    const raw = await AsyncStorage.getItem(PAPER_OFFLINE_QUEUE_KEY);
    const queue: OfflineAnswerJob[] = raw ? JSON.parse(raw) : [];
    if (!queue.length) return { flushed: 0 };

    const remaining: OfflineAnswerJob[] = [];
    let flushed = 0;

    for (const job of queue) {
        const { error } = await savePaperAnswer({
            attemptId: job.attemptId,
            questionId: job.questionId,
            reviewStatus: job.reviewStatus,
            selectedOptions: job.selectedOptions,
            timeSpentSeconds: job.timeSpentSeconds,
            pauseData: job.pauseData,
        });
        if (error) {
            remaining.push(job);
        } else {
            flushed += 1;
        }
    }

    await AsyncStorage.setItem(PAPER_OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    return { flushed, error: remaining.length ? 'Some answers could not sync' : undefined };
}

export function difficultyLabel(value: Difficulty | null | undefined, year?: number): string {
    if (value) return value.charAt(0).toUpperCase() + value.slice(1);
    if (year != null) return year >= 2023 ? 'Medium' : 'Easy';
    return 'Medium';
}

/** Map latest attempt summary → list-card status. */
export function getPaperListStatus(
    summary?: Pick<PaperAttemptSummary, 'status'> | null
): PaperListStatus {
    if (!summary) return 'unattempted';
    if (summary.status === 'in_progress') return 'in_progress';
    if (summary.status === 'submitted') return 'completed';
    return 'attempted';
}

export { SUPPORTED_PAPER_TYPES };
