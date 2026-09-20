// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Linking from 'expo-linking';

/**
 * Deep-link used as emailRedirectTo / auth callback.
 *
 * - Dev/production builds: stable custom scheme (must be on Supabase Redirect URLs).
 * - Expo Go: Linking.createURL() emits exp://<LAN-IP>:8081/--/auth/callback and
 *   ignores scheme: 'sainikprep'. If that exact IP is not allowlisted, Supabase
 *   falls back to Site URL (http://localhost:3000) — the Gmail bug you saw.
 *
 * Supabase Redirect URLs should include:
 *   sainikprep://auth/callback
 *   exp://192.168.*.*:8081/--/auth/callback   (Expo Go LAN wildcard)
 */
export const AUTH_CALLBACK_URL =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
        ? Linking.createURL('auth/callback')
        : 'sainikprep://auth/callback';

// Types for Supabase responses
export interface SupabaseResponse<T> {
    data: T | null;
    error: SupabaseError | null;
}

export interface SupabaseError {
    message: string;
    status?: number;
    code?: string;
}

// Create Supabase client
// Uses EXPO_PUBLIC_* environment variables (exposed to the client)
// Note: As of late 2024, Supabase deprecated "anon" and "service_role" keys in favor of
// "publishable" and "secret" keys. The publishable key is used for client-side auth.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY  // Legacy fallback
    || 'your-publishable-key';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// Auth helpers
export const signUp = async (email: string, password: string, fullName?: string, metadata?: Record<string, string>) => {
    const options: { emailRedirectTo: string; data?: Record<string, string> } = {
        emailRedirectTo: AUTH_CALLBACK_URL,
    };
    if (fullName || metadata) {
        options.data = {
            ...(metadata || {}),
            ...(fullName ? { full_name: fullName } : {}),
        };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
    });
    return { data, error };
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
};

export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
};

// Password reset
export const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'sainikprep://reset-password',
    });
    return { data, error };
};

// Update password
export const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });
    return { data, error };
};

// Save onboarding / profile-setup data to user metadata (persists across sessions)
export const saveOnboardingData = async (metadata: {
    target_class?: string;
    goal?: string;
    current_school?: string;
    dream_school?: string;
    preferred_language?: string;
}) => {
    const { data, error } = await supabase.auth.updateUser({
        data: metadata,
    });
    return { data, error };
};

// Get onboarding data from user metadata
export const getOnboardingData = () => {
    const session = supabase.auth.getSession();
    // This is sync - reads from cached session
    return session;
};

// Database query helpers

// Fetch subjects by standard (class)
export const fetchSubjects = async (standardId: number) => {
    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('id');

    return { data, error };
};

// Fetch topics by subject
export const fetchTopics = async (subjectId: number) => {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId)
        .is('parent_topic_id', null)
        .order('name');

    return { data, error };
};

// Fetch sub-topics
export const fetchSubTopics = async (topicId: number) => {
    const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('parent_topic_id', topicId)
        .order('name');

    return { data, error };
};

// Fetch questions for practice
export const fetchPracticeQuestions = async (
    subjectId?: number,
    topicId?: number,
    standardId?: number,
    difficulty?: string,
    limit: number = 10
) => {
    let query = supabase
        .from('questions')
        .select(`
      *,
      question_translations (*),
      question_options (id, option_key, is_correct, display_order, option_translations (option_text))
    `)
        .eq('is_active', true)
        .eq('question_type', 'mcq_single');

    if (subjectId) {
        query = query.eq('subject_id', subjectId);
    }

    if (topicId) {
        query = query.eq('topic_id', topicId);
    }

    if (standardId) {
        query = query.eq('standard_id', standardId);
    }

    if (difficulty) {
        query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query.limit(limit);

    return { data, error };
};

// Fetch single question with full details
export const fetchQuestionDetails = async (questionId: string) => {
    const { data, error } = await supabase
        .from('questions')
        .select(`
      *,
      question_translations (*),
      question_options (
        id, option_key, is_correct, display_order,
        option_translations (option_text, option_image_path)
      )
    `)
        .eq('id', questionId)
        .single();

    return { data, error };
};

// Fetch available tests
export const fetchTests = async (standardId: number) => {
    const { data, error } = await supabase
        .from('tests')
        .select(`
      *,
      test_sections (count)
    `)
        .eq('standard_id', standardId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    return { data, error };
};

// Fetch single test with questions
export const fetchTestDetails = async (testId: string) => {
    const { data: test, error: testError } = await supabase
        .from('tests')
        .select(`
      *,
      test_sections (*),
      test_questions (
        *,
        questions (
          *,
          question_translations (*),
          question_options (
            id, option_key, is_correct, display_order,
            option_translations (option_text)
          )
        )
      )
    `)
        .eq('id', testId)
        .single();

    return { test, error: testError };
};

// Create test attempt
export const createTestAttempt = async (
    testId: string,
    studentId: string,
    attemptNumber: number = 1
) => {
    const { data, error } = await supabase
        .from('test_attempts')
        .insert({
            test_id: testId,
            student_id: studentId,
            attempt_number: attemptNumber,
            status: 'in_progress',
        })
        .select()
        .single();

    return { data, error };
};

// Update test attempt
export const updateTestAttempt = async (
    attemptId: string,
    updates: {
        submitted_at?: string;
        time_spent_seconds?: number;
        total_score?: number;
        max_score?: number;
        status?: string;
        is_paused?: boolean;
        pause_data?: Record<string, unknown>;
    }
) => {
    const { data, error } = await supabase
        .from('test_attempts')
        .update(updates)
        .eq('id', attemptId)
        .select()
        .single();

    return { data, error };
};

// Save answer
export const saveAnswer = async (attemptId: string, answer: {
    question_id: string;
    review_status: string;
    selected_options: string[];
    text_answer?: string;
    is_correct?: boolean;
    marks_awarded?: number;
    time_spent_seconds?: number;
}) => {
    const { data, error } = await supabase
        .from('attempt_answers')
        .upsert(
            {
                attempt_id: attemptId,
                ...answer,
            },
            { onConflict: 'attempt_id,question_id' }
        )
        .select()
        .single();

    return { data, error };
};

// Fetch previous attempts
export const fetchTestAttempts = async (testId: string, studentId: string) => {
    const { data, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('test_id', testId)
        .eq('student_id', studentId)
        .order('attempt_number', { ascending: false });

    return { data, error };
};

// Fetch previous year papers
export const fetchPapers = async (standardId: number, year?: number) => {
    let query = supabase
        .from('papers')
        .select('*')
        .eq('standard_id', standardId)
        .eq('is_published', true)
        .order('year', { ascending: false });

    if (year) {
        query = query.eq('year', year);
    }

    const { data, error } = await query;

    return { data, error };
};

// Fetch one published paper and its ordered questions. Paper attempts are not
// part of the current schema, so this helper only reads paper content.
export const fetchPaperDetails = async (paperId: string) => {
    const { data: paper, error: paperError } = await supabase
        .from('papers')
        .select(`
            *,
            paper_questions (
                section, question_order, marks, negative_marks,
                questions (
                    *,
                    question_translations (*),
                    question_options (
                        id, option_key, is_correct, display_order,
                        option_translations (option_text, option_image_path)
                    )
                )
            )
        `)
        .eq('id', paperId)
        .eq('is_published', true)
        .single();

    if (paperError || !paper) {
        return { data: null, error: paperError };
    }

    const orderedQuestions = [...((paper as any).paper_questions || [])].sort(
        (a, b) => (a.question_order ?? 0) - (b.question_order ?? 0)
    );

    return { data: { ...paper, paper_questions: orderedQuestions }, error: null };
};

// Fetch bookmarks
export const fetchBookmarks = async (studentId: string) => {
    const { data, error } = await supabase
        .from('bookmarks')
        .select(`
      *,
      questions (
        *,
        question_translations (*),
        question_options (
          id, option_key, is_correct,
          option_translations (option_text)
        )
      )
    `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

    return { data, error };
};

// Toggle bookmark
export const toggleBookmark = async (studentId: string, questionId: string) => {
    // Check if bookmark exists
    const { data: existing } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('student_id', studentId)
        .eq('question_id', questionId)
        .single();

    if (existing) {
        // Remove bookmark
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('student_id', studentId)
            .eq('question_id', questionId);
        return { isBookmarked: false, error };
    } else {
        // Add bookmark
        const { error } = await supabase
            .from('bookmarks')
            .insert({ student_id: studentId, question_id: questionId });
        return { isBookmarked: true, error };
    }
};

// Report question
export const reportQuestion = async (
    questionId: string,
    reportedBy: string,
    reason: string,
    comment?: string
) => {
    const { data, error } = await supabase
        .from('question_reports')
        .insert({
            question_id: questionId,
            reported_by: reportedBy,
            reason,
            comment,
        })
        .select()
        .single();

    return { data, error };
};

// Fetch student topic stats
export const fetchTopicStats = async (studentId: string) => {
    const { data, error } = await supabase
        .from('student_topic_stats')
        .select(`
      *,
      topics (
        id, name,
        subjects (id, name)
      )
    `)
        .eq('student_id', studentId);

    return { data, error };
};

// Update topic stats
export const updateTopicStats = async (
    studentId: string,
    topicId: number,
    isCorrect: boolean
) => {
    // Use upsert to handle both insert and update
    const { data, error } = await supabase.rpc('upsert_topic_stats', {
        p_student_id: studentId,
        p_topic_id: topicId,
        p_is_correct: isCorrect,
    });

    return { data, error };
};

// Fetch profile
export const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return { data, error };
};

/**
 * Ensure the signed-in auth user has a row in `profiles`
 * (required by FKs such as paper_attempts.student_id).
 * Prefers the security-definer RPC; falls back to a direct upsert.
 */
export const ensureStudentProfile = async (hints?: {
    full_name?: string | null;
}) => {
    const { data: rpcData, error: rpcError } = await supabase.rpc('ensure_student_profile');
    if (!rpcError && rpcData) {
        return { data: rpcData, error: null };
    }

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        return { data: null, error: userError || { message: 'Not authenticated' } };
    }

    const existing = await fetchProfile(user.id);
    if (existing.data) return existing;

    const fullName =
        hints?.full_name ??
        (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null);

    const { data, error } = await supabase
        .from('profiles')
        .upsert(
            {
                id: user.id,
                role: 'student',
                full_name: fullName,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
        )
        .select()
        .single();

    if (error && rpcError) {
        console.warn('ensureStudentProfile RPC unavailable:', rpcError.message);
    }

    return { data, error };
};

// Update profile
export const updateProfile = async (
    userId: string,
    updates: {
        full_name?: string;
        phone?: string;
        avatar_url?: string;
    }
) => {
    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

    return { data, error };
};

// Fetch mistakes (incorrectly answered questions)
export const fetchMistakes = async (studentId: string) => {
    const { data, error } = await supabase
        .from('attempt_answers')
        .select(`
      *,
      questions (
        *,
        question_translations (*),
        question_options (
          id, option_key, is_correct,
          option_translations (option_text)
        )
      )
    `)
        .eq('attempt_answers.student_id', studentId)
        .eq('is_correct', false)
        .order('time_spent_seconds', { ascending: true });

    return { data, error };
};

export default supabase;
