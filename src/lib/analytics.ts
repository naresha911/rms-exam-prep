// PostHog Analytics Integration
// Initializes PostHog and provides tracking helpers for the app

import { PostHog } from 'posthog-react-native';
import type { PostHogEventProperties } from '@posthog/core';

// Type alias for PostHog event properties (compatible with PostHog's JsonType)
type AnalyticsProperties = PostHogEventProperties;

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY || '';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let posthogClient: PostHog | null = null;

/**
 * Initialize PostHog. Call once at app startup.
 */
export const initAnalytics = (): void => {
    // Development devices frequently cannot reach the configured PostHog host.
    // Avoid starting the SDK in Expo development so failed flush retries do not
    // fill the screen with LogBox errors or interfere with UI interaction.
    if (__DEV__) {
        console.log('[Analytics] Development build, analytics disabled');
        return;
    }

    if (!POSTHOG_API_KEY) {
        console.warn('[Analytics] No PostHog API key found, analytics disabled');
        return;
    }

    try {
        // PostHog v4 - using memory persistence to avoid expo-file-system deprecation issues
        // The 'memory' persistence option stores data in memory only (no file system)
        posthogClient = new PostHog(POSTHOG_API_KEY, {
            host: POSTHOG_HOST,
            persistence: 'memory', // Use memory storage to avoid file system operations
            captureAppLifecycleEvents: true,
        });
        console.log('[Analytics] PostHog initialized');
    } catch (e) {
        console.warn('[Analytics] Failed to initialize PostHog:', e);
    }
};

/**
 * Identify the current user with PostHog
 */
export const identifyUser = (userId: string, traits?: AnalyticsProperties): void => {
    if (!posthogClient) return;
    try {
        posthogClient.identify(userId, traits);
    } catch (e) {
        console.warn('[Analytics] identify failed:', e);
    }
};

/**
 * Capture an analytics event
 */
export const trackEvent = (eventName: string, properties?: AnalyticsProperties): void => {
    if (__DEV__) {
        console.log('[Analytics]', eventName, properties);
    }
    if (!posthogClient) return;
    try {
        posthogClient.capture(eventName, properties);
    } catch (e) {
        console.warn('[Analytics] capture failed:', e);
    }
};

/**
 * Track a screen view
 */
export const trackScreen = (screenName: string, properties?: AnalyticsProperties): void => {
    trackEvent('$screen', { $screen_name: screenName, ...properties });
};

/**
 * Reset analytics on logout
 */
export const resetAnalytics = (): void => {
    if (!posthogClient) return;
    try {
        posthogClient.reset();
    } catch (e) {
        console.warn('[Analytics] reset failed:', e);
    }
};

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

    // Previous Year Papers
    PAPERS_LIST_VIEWED: 'papers_list_viewed',
    PAPER_FILTER_SELECTED: 'paper_filter_selected',
    PAPER_OPENED: 'paper_opened',
    PAPER_STARTED: 'paper_started',
    PAPER_RESUMED: 'paper_resumed',
    PAPER_COMPLETED: 'paper_completed',
    PAPER_RESULT_VIEWED: 'paper_result_viewed',
    PAPER_REATTEMPTED: 'paper_reattempted',
    PAPER_PDF_OPENED: 'paper_pdf_opened',
    PAPER_DOWNLOAD_FAILED: 'paper_download_failed',

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

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * Track a practice completion event
 */
export const trackPracticeCompletion = (
    subjectId: number,
    correctCount: number,
    totalCount: number,
    xpEarned: number,
) => {
    trackEvent(EVENTS.PRACTICE_COMPLETED, {
        subject_id: subjectId,
        correct_count: correctCount,
        total_count: totalCount,
        accuracy: Math.round((correctCount / totalCount) * 100),
        xp_earned: xpEarned,
    });
};

/**
 * Track when a test is submitted
 */
export const trackTestSubmitted = (params: {
    testId?: string;
    testType: string;
    totalScore: number;
    maxScore: number;
    accuracy: number;
    durationSeconds: number;
}) => {
    trackEvent(EVENTS.TEST_SUBMITTED, params);
};

/**
 * Track XP earned
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

export default { initAnalytics, identifyUser, trackEvent, trackScreen, resetAnalytics, EVENTS };
