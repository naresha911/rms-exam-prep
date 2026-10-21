// Full mock tests — catalogue, details, and session helpers
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ensureStudentProfile, supabase } from './supabase';
import { fetchStandardIdForClass } from './papers';
import {
    PaperListStatus,
    Test,
    TestAttempt,
    TestAttemptSummary,
    TestSection,
    TestStatus,
    TestWithSections,
} from '../types';

const TEST_CATALOGUE_KEY = 'tests:catalogue:v1';

type CountEmbed = { count?: number }[] | null | undefined;

function questionCountFromRow(row: { test_questions?: CountEmbed; question_count?: number }): number {
    if (typeof row.question_count === 'number') return row.question_count;
    const embedded = row.test_questions;
    if (Array.isArray(embedded) && embedded[0]?.count != null) return Number(embedded[0].count);
    return 0;
}

function mapTestRow(row: any): Test {
    const { test_questions, test_sections, ...rest } = row || {};
    return {
        ...(rest as Test),
        question_count: questionCountFromRow(row),
    };
}

export function getTestListStatus(
    summary?: Pick<TestAttemptSummary, 'status'> | null
): PaperListStatus {
    if (!summary) return 'unattempted';
    if (summary.status === 'in_progress') return 'in_progress';
    if (summary.status === 'submitted') return 'completed';
    return 'attempted';
}

export async function fetchTestsPage(
    standardId: number | null,
    options?: { from?: number; to?: number; admin?: boolean }
) {
    const from = options?.from ?? 0;
    const to = options?.to ?? 19;
    let query = supabase
        .from('tests')
        .select(`
            *,
            test_sections (id, name, section_order, default_marks, time_limit_seconds),
            test_questions (count)
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (!options?.admin) {
        if (standardId != null) query = query.eq('standard_id', standardId);
        query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    return {
        data: ((data || []) as any[]).map(mapTestRow),
        error,
    };
}

export async function fetchTestMeta(testId: string, admin = false) {
    let query = supabase
        .from('tests')
        .select(`
            *,
            test_sections (*),
            test_questions (count)
        `)
        .eq('id', testId);

    if (!admin) query = query.eq('is_published', true);

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
        return { data: null as TestWithSections | null, error };
    }

    const test = mapTestRow(data);
    const sections = ((data as any).test_sections || []) as TestSection[];
    sections.sort((a, b) => (a.section_order ?? 0) - (b.section_order ?? 0));

    return {
        data: {
            ...test,
            test_sections: sections,
        } as TestWithSections,
        error: null,
    };
}

export async function fetchMyTestAttemptSummaries() {
    await ensureStudentProfile();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        return { data: [] as TestAttemptSummary[], error: userError };
    }

    const { data, error } = await supabase
        .from('test_attempts')
        .select(
            'id, test_id, status, total_score, max_score, attempt_number, started_at, submitted_at, time_spent_seconds, is_paused, pause_data'
        )
        .eq('student_id', user.id)
        .order('started_at', { ascending: false });

    if (error) return { data: [] as TestAttemptSummary[], error };

    const latest = new Map<string, TestAttemptSummary>();
    (data || []).forEach((row: any) => {
        if (!row.test_id || latest.has(row.test_id)) return;
        latest.set(row.test_id, {
            test_id: row.test_id,
            attempt_id: row.id,
            status: row.status as TestStatus,
            total_score: row.total_score,
            max_score: row.max_score,
            attempt_number: row.attempt_number ?? 1,
            started_at: row.started_at,
            submitted_at: row.submitted_at,
            time_spent_seconds: row.time_spent_seconds,
            is_paused: !!row.is_paused,
            pause_data: row.pause_data ?? null,
        });
    });

    return { data: Array.from(latest.values()), error: null };
}

export type TestSessionQuestion = {
    id: string;
    question_text: string;
    question_type?: TestQuestionType;
    has_diagram?: boolean;
    diagram_path?: string | null;
    section?: string | null;
    marks?: number;
    negative_marks?: number;
    explanation?: string;
    hint?: string | null;
    explanation_diagram_path?: string | null;
    options: {
        id: string;
        option_key: string;
        option_text: string;
        option_image_path?: string | null;
        is_correct: boolean;
        display_order?: number | null;
    }[];
};

type TestQuestionType =
    | 'mcq_single'
    | 'true_false'
    | 'assertion_reason'
    | 'matching'
    | 'mcq_multi'
    | 'fill_blank'
    | 'short_answer'
    | 'comprehension';

type TranslationRow = { language_code: string; question_text?: string | null; hint?: string | null; explanation?: string | null; explanation_diagram_path?: string | null };
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

function mapRpcQuestions(payload: any, preferredLanguage: string): {
    test: Test | null;
    questions: TestSessionQuestion[];
} {
    const test = (payload?.test || payload?.paper || null) as Test | null;
    const raw = (payload?.questions || []) as any[];
    const questions: TestSessionQuestion[] = raw.map((entry) => {
        const translations = (entry.translations || []) as TranslationRow[];
        const picked = pickTranslation(translations, preferredLanguage);
        const options = ((entry.options || []) as any[]).map((opt, i) => {
            const ot = pickTranslation((opt.translations || []) as OptionTranslationRow[], preferredLanguage);
            return {
                id: opt.id as string,
                option_key: opt.option_key as string,
                display_order: opt.display_order ?? i,
                option_text: ot?.option_text || opt.option_text || '',
                option_image_path: ot?.option_image_path ?? opt.option_image_path ?? null,
                is_correct: !!opt.is_correct,
            };
        });
        return {
            id: entry.question_id || entry.id,
            section: entry.section ?? null,
            marks: Number(entry.marks ?? 1),
            negative_marks: Number(entry.negative_marks ?? 0),
            question_type: (entry.question_type || 'mcq_single') as TestQuestionType,
            has_diagram: !!entry.has_diagram,
            diagram_path: entry.diagram_path ?? null,
            question_text: picked?.question_text || entry.question_text || 'Question text unavailable',
            hint: picked?.hint || entry.hint || null,
            explanation: picked?.explanation || entry.explanation || undefined,
            explanation_diagram_path: picked?.explanation_diagram_path || entry.explanation_diagram_path || null,
            options,
        };
    });
    return { test, questions };
}

function mapNestedTestDetails(test: any, preferredLanguage: string): TestSessionQuestion[] {
    const rows = (test?.test_questions || []) as any[];
    const sectionName = (sectionId: string | null) =>
        ((test?.test_sections || []) as TestSection[]).find((s) => s.id === sectionId)?.name ?? null;

    return rows
        .slice()
        .sort((a, b) => (a.question_order ?? 0) - (b.question_order ?? 0))
        .map((entry) => {
            const q = entry.questions;
            if (!q) return null;
            const translations = (q.question_translations || []) as TranslationRow[];
            const picked = pickTranslation(translations, preferredLanguage);
            const options = ((q.question_options || []) as any[]).map((opt: any, i: number) => {
                const ot = pickTranslation(
                    (opt.option_translations || []) as OptionTranslationRow[],
                    preferredLanguage
                );
                return {
                    id: opt.id as string,
                    option_key: opt.option_key as string,
                    display_order: opt.display_order ?? i,
                    option_text: ot?.option_text || '',
                    option_image_path: ot?.option_image_path ?? null,
                    is_correct: !!opt.is_correct,
                };
            });
            return {
                id: q.id as string,
                section: sectionName(entry.section_id),
                marks: Number(entry.marks ?? q.marks ?? 1),
                negative_marks: Number(entry.negative_marks ?? q.negative_marks ?? 0),
                question_type: (q.question_type || 'mcq_single') as TestQuestionType,
                has_diagram: !!q.has_diagram,
                diagram_path: q.diagram_path ?? null,
                question_text: picked?.question_text || 'Question text unavailable',
                hint: picked?.hint || null,
                explanation: picked?.explanation || undefined,
                explanation_diagram_path: picked?.explanation_diagram_path || null,
                options,
            } as TestSessionQuestion;
        })
        .filter(Boolean) as TestSessionQuestion[];
}

export async function getTestSessionQuestions(testId: string, preferredLanguage = 'en', admin = false) {
    if (!admin) {
        const rpc = await supabase.rpc('get_test_session_questions', { p_test_id: testId });
        if (!rpc.error && rpc.data) {
            return { ...mapRpcQuestions(rpc.data, preferredLanguage), error: null };
        }
    }

    let nestedQuery = supabase
        .from('tests')
        .select(`
            *,
            test_sections (*),
            test_questions (
                question_id, section_id, question_order, marks, negative_marks,
                questions (
                    *,
                    question_translations (*),
                    question_options (
                        id, option_key, is_correct, display_order,
                        option_translations (language_code, option_text, option_image_path)
                    )
                )
            )
        `)
        .eq('id', testId);

    if (!admin) nestedQuery = nestedQuery.eq('is_published', true);

    const nested = await nestedQuery.maybeSingle();

    if (nested.error || !nested.data) {
        return { test: null as Test | null, questions: [] as TestSessionQuestion[], error: nested.error };
    }

    return {
        test: mapTestRow(nested.data),
        questions: mapNestedTestDetails(nested.data, preferredLanguage),
        error: null,
    };
}

export async function startTestAttempt(testId: string) {
    await ensureStudentProfile();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        return { data: null as TestAttempt | null, error: userError || { message: 'Not authenticated' } };
    }

    const { data: existing } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('test_id', testId)
        .eq('student_id', user.id)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (existing) {
        return { data: existing as TestAttempt, error: null, resumed: true };
    }

    const { count } = await supabase
        .from('test_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('test_id', testId)
        .eq('student_id', user.id);

    const { data, error } = await supabase
        .from('test_attempts')
        .insert({
            test_id: testId,
            student_id: user.id,
            attempt_number: (count || 0) + 1,
            status: 'in_progress',
        })
        .select()
        .single();

    return { data: data as TestAttempt | null, error, resumed: false };
}

export async function completeTestAttempt(params: {
    attemptId: string;
    totalScore: number;
    maxScore: number;
    timeSpentSeconds: number;
}) {
    const { data, error } = await supabase
        .from('test_attempts')
        .update({
            submitted_at: new Date().toISOString(),
            time_spent_seconds: params.timeSpentSeconds,
            total_score: params.totalScore,
            max_score: params.maxScore,
            status: 'submitted',
            is_paused: false,
        })
        .eq('id', params.attemptId)
        .select()
        .single();

    return { data, error };
}

export async function getCachedTestCatalogue(standardId: number): Promise<Test[] | null> {
    try {
        const raw = await AsyncStorage.getItem(`${TEST_CATALOGUE_KEY}:${standardId}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { tests: Test[]; savedAt: number };
        return parsed.tests;
    } catch {
        return null;
    }
}

export async function setCachedTestCatalogue(standardId: number, tests: Test[]) {
    await AsyncStorage.setItem(
        `${TEST_CATALOGUE_KEY}:${standardId}`,
        JSON.stringify({ tests, savedAt: Date.now() })
    );
}

export { fetchStandardIdForClass };
