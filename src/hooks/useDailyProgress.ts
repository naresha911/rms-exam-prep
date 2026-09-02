// useDailyProgress — manages and checks daily progress against user's goal
import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

interface UseDailyProgressResult {
    questionsAnswered: number;
    correctAnswers: number;
    xpEarned: number;
    streakMaintained: boolean;
    dailyGoal: number;
    progress: number; // 0–1 fraction
    remaining: number;
    isGoalComplete: boolean;
    recordAnswer: (isCorrect: boolean) => void;
    checkAndResetIfNewDay: () => void;
}

/**
 * Provides a clean interface for daily progress tracking.
 * Handles new-day detection and resets automatically.
 */
export const useDailyProgress = (): UseDailyProgressResult => {
    const {
        dailyProgress,
        preferences,
        updateDailyProgress,
        resetDailyProgress,
        checkDailyGoal,
        addXP,
        updateStreak,
        checkBadgeEligibility,
    } = useAppStore();

    const dailyGoal = preferences.dailyGoal;

    /**
     * Record a question answer — updates progress, XP, streak, and checks badges
     */
    const recordAnswer = useCallback(
        (isCorrect: boolean) => {
            // Reset if it's a new day
            checkAndResetIfNewDay();

            updateDailyProgress(1, isCorrect);

            if (isCorrect) {
                addXP(10); // XP_REWARDS.correctAnswer
            }

            // Update streak and check badges
            updateStreak();
            checkBadgeEligibility();
        },
        [updateDailyProgress, addXP, updateStreak, checkBadgeEligibility]
    );

    /**
     * Check if today's date differs from the tracked date; if so, reset progress
     */
    const checkAndResetIfNewDay = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        if (dailyProgress.date !== today) {
            resetDailyProgress();
        }
    }, [dailyProgress.date, resetDailyProgress]);

    const progress = Math.min(dailyProgress.questionsAnswered / Math.max(dailyGoal, 1), 1);
    const remaining = Math.max(dailyGoal - dailyProgress.questionsAnswered, 0);
    const isGoalComplete = checkDailyGoal();

    return {
        questionsAnswered: dailyProgress.questionsAnswered,
        correctAnswers: dailyProgress.correctAnswers,
        xpEarned: dailyProgress.xpEarned,
        streakMaintained: dailyProgress.streakMaintained,
        dailyGoal,
        progress,
        remaining,
        isGoalComplete,
        recordAnswer,
        checkAndResetIfNewDay,
    };
};

export default useDailyProgress;
