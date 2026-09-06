// Core Types for AISSEE Preparation App

// Database table types based on Initial_Migration.txt schema

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export type QuestionType =
    | 'mcq_single'
    | 'mcq_multi'
    | 'true_false'
    | 'fill_blank'
    | 'short_answer'
    | 'matching'
    | 'comprehension'
    | 'assertion_reason';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ReviewStatus =
    | 'not_visited'
    | 'answered'
    | 'not_answered'
    | 'marked_review'
    | 'answered_marked_review';

export type TestCreationMode = 'rule_based' | 'random' | 'manual';

export type TestStatus = 'in_progress' | 'submitted' | 'abandoned';

export type QuestionGroupType =
    | 'comprehension'
    | 'cloze'
    | 'data_interpretation'
    | 'puzzle'
    | 'shared_figure';

export type ReportReason =
    | 'wrong_answer'
    | 'typo'
    | 'bad_image'
    | 'duplicate'
    | 'other';

// Profile type
export interface Profile {
    id: string;
    role: UserRole;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    school_id: string | null;
    created_at: string;
    updated_at: string;
}

// Student-specific profile extension
export interface StudentProfile extends Profile {
    target_class: '6' | '9';
    current_class: '5' | '8' | 'other';
    daily_goal: number;
    xp: number;
    level: number;
    streak: number;
    preparation_start_date: string | null;
    preferred_language: string;
}

// Standard (Class 6, Class 9)
export interface Standard {
    id: number;
    name: string;
    display_order: number | null;
}

// Stream (General, Science, Arts)
export interface Stream {
    id: number;
    name: string;
    standard_id: number;
}

// Subject
export interface Subject {
    id: number;
    name: string;
    code: string | null;
}

// Topic with hierarchy
export interface Topic {
    id: number;
    subject_id: number;
    name: string;
    parent_topic_id: number | null;
}

// Question with translations
export interface Question {
    id: string;
    question_type: QuestionType;
    subject_id: number;
    topic_id: number;
    standard_id: number;
    stream_id: number | null;
    difficulty: Difficulty;
    has_diagram: boolean;
    diagram_path: string | null;
    marks: number;
    negative_marks: number;
    year: number | null;
    source: string | null;
    tags: string[];
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    // Joined fields
    question_text?: string;
    explanation?: string;
    explanation_diagram_path?: string | null;
}

// Question Option
export interface QuestionOption {
    id: string;
    question_id: string;
    option_key: string;
    is_correct: boolean;
    display_order: number | null;
    // Joined fields
    option_text?: string;
    option_image_path?: string | null;
}

// Complete question with options for practice
export interface PracticeQuestion extends Question {
    options: QuestionOption[];
}

// Test
export interface Test {
    id: string;
    title: string;
    description: string | null;
    standard_id: number;
    stream_id: number | null;
    creation_mode: TestCreationMode;
    total_marks: number;
    duration_minutes: number;
    section_timing: boolean;
    negative_marking: boolean;
    allow_pause: boolean;
    max_attempts: number;
    is_published: boolean;
    created_by: string | null;
    created_at: string;
}

// Test Section
export interface TestSection {
    id: string;
    test_id: string;
    name: string;
    section_order: number;
    instructions: string | null;
    time_limit_seconds: number | null;
    default_marks: number;
    default_negative_marks: number;
}

// Paper (Previous Year)
export interface Paper {
    id: string;
    title: string;
    year: number;
    standard_id: number;
    stream_id: number | null;
    total_marks: number | null;
    duration_minutes: number | null;
    pdf_path: string | null;
    difficulty: Difficulty | null;
    is_published: boolean;
    created_at: string;
}

export interface PaperQuestion {
    paper_id?: string;
    question_id?: string;
    section: string | null;
    question_order: number;
    marks: number | null;
    negative_marks: number | null;
    questions: PracticeQuestion | null;
}

export interface PaperWithQuestions extends Paper {
    paper_questions: PaperQuestion[];
}

export interface PaperSectionStat {
    paper_id: string;
    section: string;
    question_count: number;
    section_marks: number;
}

export interface PaperAttempt {
    id: string;
    paper_id: string;
    student_id: string;
    attempt_number: number;
    started_at: string;
    submitted_at: string | null;
    time_spent_seconds: number | null;
    is_paused: boolean;
    pause_data: Record<string, unknown> | null;
    total_score: number | null;
    max_score: number | null;
    status: TestStatus;
}

export interface PaperAttemptAnswer {
    id: string;
    attempt_id: string;
    question_id: string;
    review_status: ReviewStatus;
    selected_options: string[];
    text_answer: string | null;
    matching_answer: Record<string, unknown> | null;
    is_correct: boolean | null;
    marks_awarded: number | null;
    time_spent_seconds: number | null;
    updated_at?: string;
}

/** Session question payload from get_paper_session_questions (no is_correct). */
export interface PaperSessionQuestion {
    question_id: string;
    section: string | null;
    question_order: number;
    marks: number;
    negative_marks: number;
    question_type: QuestionType;
    has_diagram: boolean;
    diagram_path: string | null;
    question_text: string;
    explanation?: string;
    options: {
        id: string;
        option_key: string;
        display_order: number | null;
        option_text: string;
        option_image_path?: string | null;
    }[];
    supported: boolean;
}

export type PaperListStatus = 'unattempted' | 'in_progress' | 'completed' | 'attempted';

export interface PaperAttemptSummary {
    paper_id: string;
    attempt_id: string;
    status: TestStatus;
    total_score: number | null;
    max_score: number | null;
    attempt_number: number;
    started_at: string;
    submitted_at: string | null;
    time_spent_seconds: number | null;
    is_paused: boolean;
    pause_data: Record<string, unknown> | null;
}

// Test Attempt
export interface TestAttempt {
    id: string;
    test_id: string;
    student_id: string;
    attempt_number: number;
    started_at: string;
    submitted_at: string | null;
    time_spent_seconds: number | null;
    is_paused: boolean;
    pause_data: Record<string, unknown> | null;
    total_score: number | null;
    max_score: number | null;
    status: TestStatus;
}

// Attempt Answer
export interface AttemptAnswer {
    id: string;
    attempt_id: string;
    question_id: string;
    review_status: ReviewStatus;
    selected_options: string[];
    text_answer: string | null;
    matching_answer: Record<string, unknown> | null;
    is_correct: boolean | null;
    marks_awarded: number | null;
    time_spent_seconds: number | null;
}

// Student Topic Stats
export interface StudentTopicStats {
    student_id: string;
    topic_id: number;
    questions_attempted: number;
    questions_correct: number;
    last_attempted_at: string | null;
}

// Bookmark
export interface Bookmark {
    student_id: string;
    question_id: string;
    created_at: string;
}

// Question Report
export interface QuestionReport {
    id: string;
    question_id: string;
    reported_by: string;
    reason: ReportReason;
    comment: string | null;
    status: 'open' | 'reviewing' | 'resolved' | 'rejected';
    created_at: string;
    resolved_at: string | null;
}

// Onboarding flow types
export interface OnboardingData {
    targetClass: '6' | '9' | null;
    currentClass: '5' | '8' | 'other' | null;
    goal: 'crack_aissee' | 'improve_score' | 'practice_daily' | 'prepare_mock' | null;
}

// Practice session types
export interface PracticeSession {
    subjectId: number;
    topicId: number | null;
    questionCount: number;
    difficulty: Difficulty | null;
    questions: PracticeQuestion[];
    currentIndex: number;
    answers: Map<string, string[]>;
    startTime: Date;
}

// Daily progress tracking
export interface DailyProgress {
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
    xpEarned: number;
    streakMaintained: boolean;
}

// Badge/Achievement
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string | null;
}

// Leaderboard entry
export interface LeaderboardEntry {
    rank: number;
    studentId: string;
    studentName: string;
    avatarUrl: string | null;
    xp: number;
    level: number;
}

// Navigation types
export type RootStackParamList = {
    Onboarding: undefined;
    Auth: undefined;
    Main: undefined;
    Practice: { subjectId?: number; topicId?: number };
    PracticeSession: { subjectId: number; topicId?: number; count: number };
    PracticeResult: { sessionId: string };
    MockTest: { testId: string };
    MockTestSession: { testId: string; attemptId?: string };
    MockTestResult: { attemptId: string };
    Paper: { paperId: string };
    PaperSession: { paperId: string; attemptId?: string };
    PaperResult: { attemptId: string };
    SubjectTopics: { subjectId: number };
    TopicPractice: { topicId: number };
    ProfileEdit: undefined;
    Settings: undefined;
    Bookmarks: undefined;
    Mistakes: undefined;
    Achievements: undefined;
    Performance: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    PracticeTab: undefined;
    MockTests: undefined;
    AI: undefined;
    Profile: undefined;
};
