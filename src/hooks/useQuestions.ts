// useQuestions — fetch and cache questions from Supabase
import { useState, useCallback } from 'react';
import { fetchPracticeQuestions } from '../lib/supabase';
import type { PracticeQuestion } from '../types';

interface UseQuestionsOptions {
    subjectId: number;
    topicId?: number;
    standardId?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    limit?: number;
}

interface UseQuestionsResult {
    questions: PracticeQuestion[];
    loading: boolean;
    error: string | null;
    fetchQuestions: () => Promise<void>;
    reset: () => void;
}

/**
 * Fetches practice questions from Supabase with loading/error state management.
 * Transforms the raw Supabase response into typed PracticeQuestion objects.
 */
export const useQuestions = (options: UseQuestionsOptions): UseQuestionsResult => {
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await fetchPracticeQuestions(
                options.subjectId,
                options.topicId,
                options.standardId,
                options.difficulty,
                options.limit ?? 10
            );

            if (fetchError) {
                setError('Failed to load questions. Please try again.');
                return;
            }

            if (data && data.length > 0) {
                // Transform Supabase response to PracticeQuestion format
                const transformed: PracticeQuestion[] = (data as any[]).map((q) => ({
                    ...q,
                    question_text:
                        q.question_translations?.[0]?.question_text ?? 'Question text unavailable',
                    explanation: q.question_translations?.[0]?.explanation ?? null,
                    explanation_diagram_path:
                        q.question_translations?.[0]?.explanation_diagram_path ?? null,
                    options: (q.question_options ?? [])
                        .sort(
                            (a: any, b: any) =>
                                (a.display_order ?? 0) - (b.display_order ?? 0)
                        )
                        .map((opt: any) => ({
                            ...opt,
                            option_text:
                                opt.option_translations?.[0]?.option_text ?? '',
                            option_image_path:
                                opt.option_translations?.[0]?.option_image_path ?? null,
                        })),
                }));

                setQuestions(transformed);
            } else {
                setQuestions([]);
                setError('No questions available for this topic yet.');
            }
        } catch (e) {
            setError('An unexpected error occurred. Please try again.');
            console.error('useQuestions:', e);
        } finally {
            setLoading(false);
        }
    }, [
        options.subjectId,
        options.topicId,
        options.standardId,
        options.difficulty,
        options.limit,
    ]);

    const reset = useCallback(() => {
        setQuestions([]);
        setError(null);
        setLoading(false);
    }, []);

    return { questions, loading, error, fetchQuestions, reset };
};

export default useQuestions;
