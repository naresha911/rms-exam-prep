// Design Tokens and Constants for AISSEE Preparation App
// Based on Stitch Design System - "Cadet Quest" theme

// Colors - Electric Indigo primary theme with tactical gamification
export const COLORS = {
    // Primary - Electric Indigo (Stitch Design System)
    primary: '#4648d4',
    primaryLight: '#c0c1ff',
    primaryContainer: '#6063ee',
    onPrimaryContainer: '#fffbff',
    onPrimary: '#ffffff',

    // Secondary - Blue
    secondary: '#0058be',
    secondaryLight: '#d8e2ff',
    secondaryContainer: '#2170e4',
    onSecondaryContainer: '#fefcff',
    onSecondary: '#ffffff',

    // Tertiary - Orange (for mascot, streaks, gamification)
    tertiary: '#994100',
    tertiaryLight: '#ffdbca',
    tertiaryContainer: '#c05400',
    onTertiaryContainer: '#fffbff',
    onTertiary: '#ffffff',

    // Gradients
    gradientStart: '#6366F1',
    gradientEnd: '#A855F7',

    // Surfaces (Material Design 3)
    surface: '#f9f9ff',
    surfaceDim: '#cfdaf2',
    surfaceBright: '#f9f9ff',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f0f3ff',
    surfaceContainer: '#e7eeff',
    surfaceContainerHigh: '#dee8ff',
    surfaceContainerHighest: '#d8e3fb',
    surfaceMuted: '#F8FAFC',
    surfaceVariant: '#d8e3fb',

    // Backgrounds
    background: '#f9f9ff',
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',
    onBackground: '#111c2d',

    // Cards
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',

    // Text
    textPrimary: '#111c2d',
    textSecondary: '#464554',
    textTertiary: '#767586',
    textInverse: '#ffffff',
    onSurface: '#111c2d',
    onSurfaceVariant: '#464554',

    // Inverse colors
    inverseSurface: '#263143',
    inverseOnSurface: '#ecf1ff',
    inversePrimary: '#c0c1ff',

    // Outlines
    outline: '#767586',
    outlineVariant: '#c7c4d7',
    surfaceTint: '#494bd6',

    // Status Colors (Semantic)
    success: '#22C55E',
    successLight: '#DCFCE7',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#ba1a1a',
    errorLight: '#ffdad6',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // Named semantic colors from Stitch
    'success-green': '#22C55E',
    'warning-amber': '#F59E0B',
    'weakness-red': '#EF4444',

    // Difficulty Colors
    easy: '#22C55E',
    medium: '#F59E0B',
    hard: '#EF4444',

    // Semantic Practice Mode Colors (from Stitch design)
    practiceModeQuick: '#EDE9FE',      // Purple light (primary)
    practiceModeQuickText: '#4648d4',
    practiceModeTopic: '#FEF3C7',      // Amber light (warning)
    practiceModeTopicText: '#B45309',
    practiceModeWeak: '#FEE2E2',       // Red light (error)
    practiceModeWeakText: '#DC2626',
    practiceModeSpeed: '#D1FAE5',      // Green light (success)
    practiceModeSpeedText: '#059669',

    // Progress
    progressPurple: '#4648d4',
    progressOrange: '#F97316',

    // Streak
    streakFire: '#F97316',

    // XP
    xpGold: '#FBBF24',

    // Leaderboard / Gamification (Gold, Silver, Bronze)
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',

    // Onboarding / Selected state
    onPrimarySubtle: '#E9D5FF',  // Light purple for selected text on primary

    // Dark text colors for success/error states (dark shades for good contrast)
    successText: '#065F46',       // Dark green for success text
    errorText: '#7F1D1D',         // Dark red for error text
    warningText: '#92400E',        // Dark amber for warning text
    amberText: '#B45309',         // Amber text

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    // Fixed colors (from Stitch designMd)
    primaryFixed: '#e1e0ff',
    primaryFixedDim: '#c0c1ff',
    onPrimaryFixed: '#07006c',
    onPrimaryFixedVariant: '#2f2ebe',
    secondaryFixed: '#d8e2ff',
    secondaryFixedDim: '#adc6ff',
    onSecondaryFixed: '#001a42',
    onSecondaryFixedVariant: '#004395',
    tertiaryFixed: '#ffdbca',
    tertiaryFixedDim: '#ffb690',
    onTertiaryFixed: '#341100',
    onTertiaryFixedVariant: '#783200',
};

// Typography - Plus Jakarta Sans (Stitch Design System)
export const TYPOGRAPHY = {
    // Font Families
    fontFamily: {
        regular: 'PlusJakartaSans_400Regular',
        medium: 'PlusJakartaSans_500Medium',
        semibold: 'PlusJakartaSans_600SemiBold',
        bold: 'PlusJakartaSans_700Bold',
        extrabold: 'PlusJakartaSans_800ExtraBold',
    },

    // Font Sizes
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 40,
        '6xl': 48,
    },

    // Line Heights
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },

    // Font Weights
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
    },

    // Stitch Design System Typography Scale
    displayLg: {
        fontFamily: 'PlusJakartaSans_800ExtraBold',
        fontSize: 40,
        lineHeight: 48,
        letterSpacing: -0.02,
        fontWeight: '800' as const,
    },
    headlineLg: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 32,
        lineHeight: 40,
        fontWeight: '700' as const,
    },
    headlineLgMobile: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '700' as const,
    },
    headlineMd: {
        fontFamily: 'PlusJakartaSans_700Bold',
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '700' as const,
    },
    bodyLg: {
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '500' as const,
    },
    bodyMd: {
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400' as const,
    },
    labelLg: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0.01,
        fontWeight: '600' as const,
    },
    labelSm: {
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '600' as const,
    },
};

// Spacing (4px grid system) - Stitch Design System
export const SPACING = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    // Stitch design system tokens
    'stack-sm': 8,
    'stack-md': 16,
    'stack-lg': 24,
    gutter: 16,
    'margin-mobile': 16,
    'margin-desktop': 32,
    'touch-target': 48,
    base: 8,
};

// Border Radius - Stitch Design System (ROUND_EIGHT)
export const BORDER_RADIUS = {
    none: 0,
    sm: 4,
    DEFAULT: 8,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
};

// Shadows
export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

// Touch targets (accessibility)
export const TOUCH_TARGETS = {
    minimum: 44,
    comfortable: 48,
};

// Animation durations (ms)
export const ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500,
};

// App-specific constants

// Daily goal options
export const DAILY_GOALS = [10, 20, 30, 50];

// XP rewards
export const XP_REWARDS = {
    correctAnswer: 10,
    dailyGoalComplete: 50,
    mockTestComplete: 100,
    streakBonus: 20, // per day
    perfectScore: 200,
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
    0,      // Recruit
    500,    // Junior Cadet
    1500,   // Cadet
    3000,   // Senior Cadet
    5000,   // Champion
    8000,   // Hero
    12000,  // Legend
    18000,  // Master
    25000,  // Grandmaster
    35000,  // Sage
];

// Level names
export const LEVEL_NAMES = [
    'Recruit',
    'Junior Cadet',
    'Cadet',
    'Senior Cadet',
    'Champion',
    'Hero',
    'Legend',
    'Master',
    'Grandmaster',
    'Sage',
];

// AISSEE Exam Structure keyed by student standard (5 / 8)
export const EXAM_STRUCTURE = {
    class5: {
        totalQuestions: 125,
        totalMarks: 300,
        durationMinutes: 150,
        sections: [
            { name: 'Language', questions: 25, marks: 50 },
            { name: 'Mathematics', questions: 50, marks: 150 },
            { name: 'Intelligence', questions: 25, marks: 50 },
            { name: 'General Knowledge', questions: 25, marks: 50 },
        ],
    },
    class8: {
        totalQuestions: 150,
        totalMarks: 400,
        durationMinutes: 180,
        sections: [
            { name: 'Mathematics', questions: 50, marks: 200 },
            { name: 'Intelligence', questions: 25, marks: 50 },
            { name: 'English', questions: 25, marks: 50 },
            { name: 'General Science', questions: 25, marks: 50 },
            { name: 'Social Science', questions: 25, marks: 50 },
        ],
    },
};

// Subjects by student standard (5 / 8)
export const SUBJECTS = {
    class5: [
        { id: 1, name: 'Mathematics', code: 'MAT', icon: 'calculator' },
        { id: 2, name: 'Language', code: 'LNG', icon: 'book' },
        { id: 3, name: 'Intelligence', code: 'INT', icon: 'brain' },
        { id: 4, name: 'General Knowledge', code: 'GK', icon: 'globe' },
    ],
    class8: [
        { id: 1, name: 'Mathematics', code: 'MAT', icon: 'calculator' },
        { id: 5, name: 'English', code: 'ENG', icon: 'book-open' },
        { id: 3, name: 'Intelligence', code: 'INT', icon: 'brain' },
        { id: 6, name: 'General Science', code: 'GSC', icon: 'flask' },
        { id: 7, name: 'Social Science', code: 'SSC', icon: 'landmark' },
    ],
};

/** Normalize legacy 6/9 values and any raw input to DB standards 5/8. */
export function normalizeStudentStandard(value: string | null | undefined): '5' | '8' {
    if (value === '8' || value === '9') return '8';
    return '5';
}

export function getExamStructureForStandard(standard: string | null | undefined) {
    return normalizeStudentStandard(standard) === '8'
        ? EXAM_STRUCTURE.class8
        : EXAM_STRUCTURE.class5;
}

export function getSubjectsForStandard(standard: string | null | undefined) {
    return normalizeStudentStandard(standard) === '8'
        ? SUBJECTS.class8
        : SUBJECTS.class5;
}

/**
 * Fallback standards table ids when name lookup fails.
 * Live DB uses id 5 = Class 5 and id 8 = Class 8 (papers.standard_id matches these).
 */
export function getStandardIdFallback(standard: string | null | undefined): number {
    return normalizeStudentStandard(standard) === '8' ? 8 : 5;
}

// Practice question counts
export const PRACTICE_COUNTS = [5, 10, 20, 50];

// Mock test categories
export const MOCK_TEST_TYPES = [
    { id: 'full', name: 'Full Mock Test', description: 'Complete AISSEE pattern' },
    { id: 'section', name: 'Sectional Test', description: 'Practice by subject' },
    { id: 'speed', name: 'Speed Test', description: 'Timed practice' },
];

// Badge definitions
export const BADGES = [
    { id: 'first_question', name: 'First Steps', description: 'Answer your first question', icon: '🎯' },
    { id: 'first_mock_test', name: 'Mock Warrior', description: 'Complete your first mock test', icon: '📝' },
    { id: 'streak_3', name: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥' },
    { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '💪' },
    { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑' },
    { id: 'questions_100', name: 'Century', description: 'Answer 100 questions', icon: '💯' },
    { id: 'questions_500', name: 'Half Thousand', description: 'Answer 500 questions', icon: '🌟' },
    { id: 'questions_1000', name: 'Question Master', description: 'Answer 1000 questions', icon: '🏆' },
    { id: 'accuracy_80', name: 'Sharp Shooter', description: 'Achieve 80% accuracy in a test', icon: '🎯' },
    { id: 'perfect_score', name: 'Perfectionist', description: 'Score 100% in any test', icon: '💎' },
    { id: 'all_subjects', name: 'All-Rounder', description: 'Practice all subjects', icon: '🎨' },
    { id: 'early_bird', name: 'Early Bird', description: 'Study before 7 AM', icon: '🌅' },
];

// Onboarding screens
export const ONBOARDING_SCREENS = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'target', title: 'Select Class' },
    { id: 'goal', title: 'Your Goal' },
];

// Navigation icons
export const NAV_ICONS = {
    home: 'home',
    practice: 'book-open',
    tests: 'clipboard-list',
    ai: 'robot',
    profile: 'user',
};

// Error messages
export const ERROR_MESSAGES = {
    network: 'Please check your internet connection',
    server: 'Something went wrong. Please try again',
    auth: 'Please sign in to continue',
    unknown: 'An unexpected error occurred',
};

// Success messages
export const SUCCESS_MESSAGES = {
    answerCorrect: 'Excellent! 🎉',
    answerIncorrect: 'Almost there! Keep going! 💪',
    goalComplete: 'Daily goal achieved! 🌟',
    streakMaintained: 'Streak maintained! 🔥',
    testComplete: 'Test completed! Well done! 🎊',
};

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
    onboardingComplete: 'onboarding_complete',
    userProfile: 'user_profile',
    dailyProgress: 'daily_progress',
    lastActivity: 'last_activity',
    settings: 'app_settings',
    cachedQuestions: 'cached_questions',
};

// Supabase table names
export const TABLES = {
    profiles: 'profiles',
    standards: 'standards',
    streams: 'streams',
    subjects: 'subjects',
    topics: 'topics',
    questions: 'questions',
    questionTranslations: 'question_translations',
    questionOptions: 'question_options',
    optionTranslations: 'option_translations',
    tests: 'tests',
    testSections: 'test_sections',
    testQuestions: 'test_questions',
    testAttempts: 'test_attempts',
    attemptAnswers: 'attempt_answers',
    studentTopicStats: 'student_topic_stats',
    bookmarks: 'bookmarks',
    questionReports: 'question_reports',
    papers: 'papers',
    paperQuestions: 'paper_questions',
    paperAttempts: 'paper_attempts',
    paperAttemptAnswers: 'paper_attempt_answers',
    paperSectionStats: 'paper_section_stats',
};

// Supported languages
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pa', name: 'Punjabi' },
];

/** Optional dream-school choices for Profile Setup (static list; not DB-backed yet). */
export const DREAM_SAINIK_SCHOOLS = [
    'Sainik School Kunjpura, Haryana',
    'Sainik School Ghorakhal, Uttarakhand',
    'Sainik School Kapurthala, Punjab',
    'Sainik School Korukonda, Andhra Pradesh',
    'Sainik School Kazhakootam, Kerala',
    'Rashtriya Military School (RMS) Chail',
] as const;

// Disclaimer
export const DISCLAIMER = 'This is an independent educational application for AISSEE preparation and is not affiliated with or endorsed by the National Testing Agency, Sainik Schools Society, Ministry of Defence or Government of India.';
