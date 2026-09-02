// Analytics helper functions — wraps PostHog events
// Import and use the PostHog client from lib/analytics when available

// Typed event names for consistency
export const EVENTS = {
    // Onboarding
    ONBOARDING_STARTED: 'onboarding_started',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    TARGET_CLASS_SELECTED: 'target_class_selected',
    GOAL_SELECTED: 'goal_selected',

    // Auth
    SIGN_UP: 'sign_up',
    SIGN_IN: 'sign_in',
    SIGN_OUT: 'sign_out',
    PASSWORD_RESET_REQUESTED: 'password_reset_requested',

    // Practice
    PRACTICE_STARTED: 'practice_started',
    PRACTICE_COMPLETED: 'practice_completed',
    QUESTION_ANSWERED: 'question_answered',
    QUESTION_BOOKMARKED: 'question_bookmarked',
    QUESTION_REPORTED: 'question_reported',

    // Mock Tests
    TEST_STARTED: 'test_started',
    TEST_SUBMITTED: 'test_submitted',
    TEST_ABANDONED: 'test_abandoned',
    TEST_PAUSED: 'test_paused',
    TEST_RESUMED: 'test_resumed',

    // Gamification
    XP_EARNED: 'xp_earned',
    LEVEL_UP: 'level_up',
    BADGE_UNLOCKED: 'badge_unlocked',
    STREAK_UPDATED: 'streak_updated',
    DAILY_GOAL_COMPLETED: 'daily_goal_completed',

    // Navigation
    SCREEN_VIEWED: 'screen_viewed',
    TAB_SWITCHED: 'tab_switched',

    // Profile
    PROFILE_UPDATED: 'profile_updated',
    SETTINGS_CHANGED: 'settings_changed',
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

/**
 * Track an analytics event with optional properties
 * This is a stub — connect to PostHog client from lib/analytics
 */
export const trackEvent = (eventName: EventName, properties?: Record<string, unknown>): void => {
    if (__DEV__) {
        console.log('[Analytics]', eventName, properties);
    }
    // TODO: Connect to PostHog instance
    // posthog.capture(eventName, properties);
};

/**
 * Track a screen view
 */
export const trackScreen = (screenName: string, properties?: Record<string, unknown>): void => {
    trackEvent(EVENTS.SCREEN_VIEWED, { screen: screenName, ...properties });
};

/**
 * Track when a question is answered
 */
export const trackQuestionAnswered = (params: {
    questionId: string;
    isCorrect: boolean;
    subjectId: number;
    topicId?: number;
    difficulty: string;
    timeSpentSeconds: number;
}): void => {
    trackEvent(EVENTS.QUESTION_ANSWERED, params);
};

/**
 * Track when a practice session completes
 */
export const trackPracticeCompleted = (params: {
    subjectId: number;
    topicId?: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    xpEarned: number;
    durationSeconds: number;
}): void => {
    trackEvent(EVENTS.PRACTICE_COMPLETED, params);
};

/**
 * Track when a mock test is submitted
 */
export const trackTestSubmitted = (params: {
    testId: string;
    testType: string;
    totalScore: number;
    maxScore: number;
    accuracy: number;
    durationSeconds: number;
}): void => {
    trackEvent(EVENTS.TEST_SUBMITTED, params);
};

/**
 * Track XP earned event
 */
export const trackXPEarned = (amount: number, source: string): void => {
    trackEvent(EVENTS.XP_EARNED, { amount, source });
};

/**
 * Track badge unlock
 */
export const trackBadgeUnlocked = (badgeId: string, badgeName: string): void => {
    trackEvent(EVENTS.BADGE_UNLOCKED, { badgeId, badgeName });
};
