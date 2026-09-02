// Semantic theme mappings for Cadet Quest Design System
// Maps UI contexts to appropriate theme tokens
// Use this file when you need a consistent semantic color across screens

import { COLORS } from './index';

/**
 * Practice mode card color schemes
 * Each mode has a soft background and a strong text color
 */
export const PRACTICE_MODE_COLORS = {
    quick: {
        background: COLORS.practiceModeQuick,
        text: COLORS.practiceModeQuickText,
    },
    topic: {
        background: COLORS.practiceModeTopic,
        text: COLORS.practiceModeTopicText,
    },
    weak: {
        background: COLORS.practiceModeWeak,
        text: COLORS.practiceModeWeakText,
    },
    speed: {
        background: COLORS.practiceModeSpeed,
        text: COLORS.practiceModeSpeedText,
    },
} as const;

/**
 * Subject color mapping for consistent subject identification
 */
export const SUBJECT_COLORS = {
    mathematics: {
        background: COLORS.surfaceContainerLow,
        text: COLORS.primary,
    },
    english: {
        background: COLORS.surfaceContainerLow,
        text: COLORS.secondary,
    },
    intelligence: {
        background: COLORS.surfaceContainerLow,
        text: COLORS.tertiary,
    },
    general_knowledge: {
        background: COLORS.surfaceContainerLow,
        text: COLORS.info,
    },
} as const;

/**
 * Answer feedback color states for MCQ interactions
 */
export const ANSWER_STATES = {
    default: {
        background: COLORS.cardBackground,
        border: COLORS.cardBorder,
        text: COLORS.textPrimary,
    },
    selected: {
        background: COLORS.primaryFixed,
        border: COLORS.primary,
        text: COLORS.onPrimaryFixed,
    },
    correct: {
        background: COLORS.successLight,
        border: COLORS.success,
        text: COLORS.textPrimary,
    },
    incorrect: {
        background: COLORS.errorLight,
        border: COLORS.error,
        text: COLORS.textPrimary,
    },
    disabled: {
        background: COLORS.surfaceMuted,
        border: COLORS.outlineVariant,
        text: COLORS.textTertiary,
    },
} as const;

/**
 * Difficulty color tokens
 */
export const DIFFICULTY_COLORS = {
    easy: {
        background: COLORS.successLight,
        text: COLORS.easy,
    },
    medium: {
        background: COLORS.warningLight,
        text: COLORS.medium,
    },
    hard: {
        background: COLORS.errorLight,
        text: COLORS.hard,
    },
} as const;

/**
 * Mastery level color tokens (based on Stitch design)
 * - Green: 80%+ mastery
 * - Amber: 60-79% mastery
 * - Red: <60% mastery
 */
export const MASTERY_COLORS = {
    high: {
        background: COLORS.successLight,
        text: COLORS['success-green'],
        label: 'Mastered',
    },
    medium: {
        background: COLORS.warningLight,
        text: COLORS['warning-amber'],
        label: 'Developing',
    },
    low: {
        background: COLORS.errorLight,
        text: COLORS['weakness-red'],
        label: 'Needs Work',
    },
} as const;

/**
 * Gamification accent colors
 */
export const GAMIFICATION_COLORS = {
    xp: COLORS.xpGold,
    streak: COLORS.streakFire,
    badge: COLORS.tertiary,
    level: COLORS.primary,
} as const;

/**
 * Card variants with proper token references
 */
export const CARD_VARIANTS = {
    default: {
        background: COLORS.cardBackground,
        shadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    elevated: {
        background: COLORS.cardBackground,
        shadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    surface: {
        background: COLORS.surfaceContainer,
        shadow: 'none',
    },
    surfaceMuted: {
        background: COLORS.surfaceMuted,
        shadow: 'none',
    },
} as const;

/**
 * Standard shadow tokens from Stitch Design System
 */
export const SHADOW_TOKENS = {
    soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    tactilePrimary: {
        shadowColor: COLORS.onPrimaryFixedVariant,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    tactileSecondary: {
        shadowColor: COLORS.onSecondaryFixedVariant,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
} as const;
