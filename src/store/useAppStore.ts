// Zustand Store for Global App State
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StudentProfile,
    OnboardingData,
    DailyProgress,
    Badge,
    PracticeQuestion
} from '../types';
import { XP_REWARDS, LEVEL_THRESHOLDS, LEVEL_NAMES, DAILY_GOALS } from '../constants';

// User preferences store
interface UserPreferences {
    notifications: boolean;
    sound: boolean;
    dailyGoal: number;
    preferredLanguage: string;
    darkMode: boolean;
    /** After answering, automatically open the worked solution. Default on. */
    autoShowSolution: boolean;
}

interface AppState {
    // User state
    user: StudentProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Onboarding
    onboardingComplete: boolean;
    onboardingData: OnboardingData;

    // Daily progress
    dailyProgress: DailyProgress;
    streak: number;
    lastActivityDate: string | null;

    // XP and level
    xp: number;
    level: number;
    levelName: string;

    // Badges
    badges: Badge[];

    // Preferences
    preferences: UserPreferences;

    // Current practice session
    currentPracticeSession: {
        questions: PracticeQuestion[];
        currentIndex: number;
        answers: Record<string, string[]>;
        startTime: string;
    } | null;

    // Last practice activity (for Continue Learning card)
    lastPracticeActivity: {
        subjectId: number;
        subjectName: string;
        topicId: number | null;
        topicName: string;
        progress: number; // 0-100 percentage
        completedAt: string;
    } | null;

    // Actions
    setUser: (user: StudentProfile | null) => void;
    setAuthenticated: (isAuth: boolean) => void;
    setLoading: (isLoading: boolean) => void;

    // Onboarding actions
    setOnboardingComplete: (complete: boolean) => void;
    setOnboardingData: (data: Partial<OnboardingData>) => void;
    resetOnboarding: () => void;

    // XP and level actions
    addXP: (amount: number) => void;
    calculateLevel: (totalXP: number) => { level: number; name: string };

    // Streak actions
    updateStreak: () => void;
    checkStreakStatus: () => void;

    // Daily progress actions
    updateDailyProgress: (questionsAnswered: number, correct: boolean) => void;
    resetDailyProgress: () => void;
    checkDailyGoal: () => boolean;

    // Badge actions
    unlockBadge: (badgeId: string) => void;
    checkBadgeEligibility: () => void;

    // Preferences actions
    updatePreferences: (prefs: Partial<UserPreferences>) => void;

    // Practice session actions
    startPracticeSession: (questions: PracticeQuestion[]) => void;
    recordAnswer: (questionId: string, selectedOptions: string[]) => void;
    nextQuestion: () => void;
    endPracticeSession: () => PracticeQuestion[];

    // Last activity actions
    setLastPracticeActivity: (activity: { subjectId: number; subjectName: string; topicId: number | null; topicName: string; progress: number }) => void;

    // Reset
    resetStore: () => void;
}

// Default values
const defaultOnboardingData: OnboardingData = {
    targetClass: null,
    goal: null,
};

const defaultDailyProgress: DailyProgress = {
    date: new Date().toISOString().split('T')[0],
    questionsAnswered: 0,
    correctAnswers: 0,
    xpEarned: 0,
    streakMaintained: false,
};

const defaultPreferences: UserPreferences = {
    notifications: true,
    sound: true,
    dailyGoal: 20,
    preferredLanguage: 'en',
    darkMode: false,
    autoShowSolution: true,
};

// Calculate level from XP
const calculateLevelFromXP = (xp: number): { level: number; name: string } => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            return { level: i + 1, name: LEVEL_NAMES[i] };
        }
    }
    return { level: 1, name: LEVEL_NAMES[0] };
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: false,

            onboardingComplete: false,
            onboardingData: defaultOnboardingData,

            dailyProgress: defaultDailyProgress,
            streak: 0,
            lastActivityDate: null,

            xp: 0,
            level: 1,
            levelName: LEVEL_NAMES[0],

            badges: [],

            preferences: defaultPreferences,

            currentPracticeSession: null,

            lastPracticeActivity: null,

            // Actions
            setUser: (user) => set({ user }),

            setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

            setLoading: (isLoading) => set({ isLoading }),

            setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

            setOnboardingData: (data) => set((state) => ({
                onboardingData: { ...state.onboardingData, ...data },
            })),

            resetOnboarding: () => set({
                onboardingComplete: false,
                onboardingData: defaultOnboardingData,
            }),

            addXP: (amount) => set((state) => {
                const newXP = state.xp + amount;
                const { level, name } = calculateLevelFromXP(newXP);
                return {
                    xp: newXP,
                    level,
                    levelName: name,
                    dailyProgress: {
                        ...state.dailyProgress,
                        xpEarned: state.dailyProgress.xpEarned + amount,
                    },
                };
            }),

            calculateLevel: (totalXP) => calculateLevelFromXP(totalXP),

            updateStreak: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const lastActivity = state.lastActivityDate;

                if (!lastActivity) {
                    // First activity ever
                    return {
                        streak: 1,
                        lastActivityDate: today,
                        dailyProgress: { ...state.dailyProgress, streakMaintained: true },
                    };
                }

                const lastDate = new Date(lastActivity);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                    // Same day, no change
                    return state;
                } else if (diffDays === 1) {
                    // Consecutive day
                    const newStreak = state.streak + 1;
                    return {
                        streak: newStreak,
                        lastActivityDate: today,
                        dailyProgress: { ...state.dailyProgress, streakMaintained: true },
                    };
                } else {
                    // Streak broken
                    return {
                        streak: 1,
                        lastActivityDate: today,
                        dailyProgress: { ...state.dailyProgress, streakMaintained: false },
                    };
                }
            }),

            checkStreakStatus: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const lastActivity = state.lastActivityDate;

                if (!lastActivity) {
                    return state;
                }

                const lastDate = new Date(lastActivity);
                const todayDate = new Date(today);
                const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

                // If more than 1 day has passed, reset streak
                if (diffDays > 1) {
                    return { streak: 0 };
                }

                return state;
            }),

            updateDailyProgress: (questionsAnswered, correct) => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const isNewDay = state.dailyProgress.date !== today;

                return {
                    dailyProgress: {
                        date: today,
                        questionsAnswered: isNewDay ? questionsAnswered : state.dailyProgress.questionsAnswered + questionsAnswered,
                        correctAnswers: isNewDay ? (correct ? 1 : 0) : (correct ? state.dailyProgress.correctAnswers + 1 : state.dailyProgress.correctAnswers),
                        xpEarned: isNewDay ? 0 : state.dailyProgress.xpEarned,
                        streakMaintained: state.dailyProgress.streakMaintained,
                    },
                };
            }),

            resetDailyProgress: () => set({
                dailyProgress: {
                    date: new Date().toISOString().split('T')[0],
                    questionsAnswered: 0,
                    correctAnswers: 0,
                    xpEarned: 0,
                    streakMaintained: false,
                },
            }),

            checkDailyGoal: () => {
                const state = get();
                const dailyGoal = state.preferences.dailyGoal;
                return state.dailyProgress.questionsAnswered >= dailyGoal;
            },

            unlockBadge: (badgeId) => set((state) => {
                // Check if badge already unlocked
                if (state.badges.some(b => b.id === badgeId)) {
                    return state;
                }

                const newBadge: Badge = {
                    id: badgeId,
                    name: badgeId, // Will be replaced with proper name
                    description: '',
                    icon: '',
                    unlockedAt: new Date().toISOString(),
                };

                return { badges: [...state.badges, newBadge] };
            }),

            checkBadgeEligibility: () => {
                const state = get();

                // First question badge
                if (state.dailyProgress.questionsAnswered >= 1) {
                    get().unlockBadge('first_question');
                }

                // 100 questions badge
                if (state.dailyProgress.questionsAnswered >= 100) {
                    get().unlockBadge('questions_100');
                }

                // Streak badges
                if (state.streak >= 3) {
                    get().unlockBadge('streak_3');
                }
                if (state.streak >= 7) {
                    get().unlockBadge('streak_7');
                }
                if (state.streak >= 30) {
                    get().unlockBadge('streak_30');
                }

                // Daily goal complete badge
                if (get().checkDailyGoal()) {
                    get().unlockBadge('daily_goal_complete');
                }
            },

            updatePreferences: (prefs) => set((state) => ({
                preferences: { ...state.preferences, ...prefs },
            })),

            startPracticeSession: (questions) => set({
                currentPracticeSession: {
                    questions,
                    currentIndex: 0,
                    answers: {},
                    startTime: new Date().toISOString(),
                },
            }),

            recordAnswer: (questionId, selectedOptions) => set((state) => {
                if (!state.currentPracticeSession) return state;

                return {
                    currentPracticeSession: {
                        ...state.currentPracticeSession,
                        answers: {
                            ...state.currentPracticeSession.answers,
                            [questionId]: selectedOptions,
                        },
                    },
                };
            }),

            nextQuestion: () => set((state) => {
                if (!state.currentPracticeSession) return state;

                const nextIndex = state.currentPracticeSession.currentIndex + 1;
                const hasMore = nextIndex < state.currentPracticeSession.questions.length;

                return {
                    currentPracticeSession: {
                        ...state.currentPracticeSession,
                        currentIndex: hasMore ? nextIndex : state.currentPracticeSession.currentIndex,
                    },
                };
            }),

            endPracticeSession: () => {
                const state = get();
                const session = state.currentPracticeSession;

                set({ currentPracticeSession: null });

                return session?.questions || [];
            },

            setLastPracticeActivity: (activity) => set({
                lastPracticeActivity: {
                    ...activity,
                    completedAt: new Date().toISOString(),
                },
            }),

            resetStore: () => set({
                user: null,
                isAuthenticated: false,
                onboardingComplete: false,
                onboardingData: defaultOnboardingData,
                dailyProgress: defaultDailyProgress,
                streak: 0,
                lastActivityDate: null,
                xp: 0,
                level: 1,
                levelName: LEVEL_NAMES[0],
                badges: [],
                preferences: defaultPreferences,
                currentPracticeSession: null,
            }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                // Only persist these fields
                onboardingComplete: state.onboardingComplete,
                onboardingData: state.onboardingData,
                dailyProgress: state.dailyProgress,
                streak: state.streak,
                lastActivityDate: state.lastActivityDate,
                xp: state.xp,
                level: state.level,
                levelName: state.levelName,
                badges: state.badges,
                preferences: state.preferences,
                lastPracticeActivity: state.lastPracticeActivity,
            }),
            merge: (persistedState, currentState) => {
                const persisted = (persistedState || {}) as Partial<AppState>;
                return {
                    ...currentState,
                    ...persisted,
                    preferences: {
                        ...defaultPreferences,
                        ...(persisted.preferences || {}),
                    },
                };
            },
        }
    )
);

// Export type for convenience
export type AppStore = typeof useAppStore;

export const isAutoShowSolution = (prefs?: UserPreferences | null) =>
    prefs?.autoShowSolution !== false;

export default useAppStore;
