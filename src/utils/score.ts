// Score and performance calculation utilities

import { XP_REWARDS, LEVEL_THRESHOLDS, LEVEL_NAMES } from '../constants';
import type { PracticeQuestion } from '../types';

/**
 * Calculate accuracy percentage from correct/total
 */
export const calculateAccuracy = (correct: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
};

/**
 * Calculate score from a practice session
 */
export const calculatePracticeScore = (
    questions: PracticeQuestion[],
    answers: Record<string, string[]>
): {
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
    score: number;
    maxScore: number;
    accuracy: number;
    xpEarned: number;
} => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let score = 0;
    let maxScore = 0;

    for (const question of questions) {
        const selectedOptions = answers[question.id];
        const marksForQ = question.marks || 1;
        maxScore += marksForQ;

        if (!selectedOptions || selectedOptions.length === 0) {
            unanswered++;
            continue;
        }

        const correctOptions = question.options
            .filter(o => o.is_correct)
            .map(o => o.option_key);

        const isCorrect =
            selectedOptions.length === correctOptions.length &&
            selectedOptions.every(opt => correctOptions.includes(opt));

        if (isCorrect) {
            correct++;
            score += marksForQ;
        } else {
            incorrect++;
            // Apply negative marking if set
            if (question.negative_marks > 0) {
                score -= question.negative_marks;
            }
        }
    }

    const total = questions.length;
    const accuracy = calculateAccuracy(correct, total - unanswered);

    // Calculate XP earned
    let xpEarned = correct * XP_REWARDS.correctAnswer;
    if (correct === total) xpEarned += XP_REWARDS.perfectScore;

    return {
        correct,
        incorrect,
        unanswered,
        total,
        score: Math.max(0, score),
        maxScore,
        accuracy,
        xpEarned,
    };
};

/**
 * Determine if an answer is correct for a given question
 */
export const isAnswerCorrect = (
    selectedOptions: string[],
    correctOptions: string[]
): boolean => {
    if (selectedOptions.length !== correctOptions.length) return false;
    return selectedOptions.every(opt => correctOptions.includes(opt));
};

/**
 * Calculate level and name from total XP
 */
export const calculateLevel = (totalXP: number): { level: number; name: string } => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVEL_THRESHOLDS[i]) {
            return { level: i + 1, name: LEVEL_NAMES[i] };
        }
    }
    return { level: 1, name: LEVEL_NAMES[0] };
};

/**
 * Get XP needed for next level
 */
export const getXpForNextLevel = (currentXP: number): {
    currentLevelXP: number;
    nextLevelXP: number;
    progressPercent: number;
} => {
    let currentLevelIndex = 0;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (currentXP >= LEVEL_THRESHOLDS[i]) {
            currentLevelIndex = i;
            break;
        }
    }

    const currentLevelXP = LEVEL_THRESHOLDS[currentLevelIndex] ?? 0;
    const nextLevelXP = LEVEL_THRESHOLDS[currentLevelIndex + 1] ?? currentLevelXP;

    const progressInLevel = currentXP - currentLevelXP;
    const levelRange = nextLevelXP - currentLevelXP;
    const progressPercent = levelRange > 0 ? (progressInLevel / levelRange) * 100 : 100;

    return { currentLevelXP, nextLevelXP, progressPercent };
};

/**
 * Get performance label based on accuracy
 */
export const getPerformanceLabel = (accuracy: number): {
    label: string;
    emoji: string;
    color: string;
} => {
    if (accuracy >= 90) return { label: 'Outstanding', emoji: '🏆', color: '#10B981' };
    if (accuracy >= 75) return { label: 'Excellent', emoji: '🌟', color: '#10B981' };
    if (accuracy >= 60) return { label: 'Good', emoji: '👍', color: '#F59E0B' };
    if (accuracy >= 40) return { label: 'Keep Practicing', emoji: '💪', color: '#F59E0B' };
    return { label: 'Needs Improvement', emoji: '📚', color: '#EF4444' };
};

/**
 * Get section-wise breakdown of mock test answers
 */
export const calculateSectionScores = (
    sections: Array<{ name: string; questions: number; marks: number }>,
    answers: Record<string, string[]>,
    questionIds: string[]
): Array<{ name: string; attempted: number; correct: number; score: number; maxScore: number }> => {
    // This is a simplified implementation - full version would need question-to-section mapping
    return sections.map((section, i) => {
        const sectionQuestionCount = section.questions;
        const startIndex = sections.slice(0, i).reduce((acc, s) => acc + s.questions, 0);
        const sectionIds = questionIds.slice(startIndex, startIndex + sectionQuestionCount);

        const attempted = sectionIds.filter(id => answers[id]?.length > 0).length;

        return {
            name: section.name,
            attempted,
            correct: 0, // Would need actual correct answers to compute
            score: 0,
            maxScore: section.marks,
        };
    });
};
