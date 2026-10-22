import type { ColorPalette } from './palette';

export type OptionVisualState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

export interface OptionChrome {
    /** Option surface fill. */
    background: string;
    border: string;
    /** Border weight per state — selection reads through a heavier border. */
    borderWidth: number;
    letterBackground: string;
    letterColor: string;
    text: string;
}

/**
 * Single option-state color map for grid pills, stacked rows, and figure tiles.
 * Default rows sit on `optionSurface` with a hairline so they read as tiles
 * inside the tinted answer well; selection flips fill, border weight and badge
 * fill together.
 */
export function optionChrome(colors: ColorPalette): Record<OptionVisualState, OptionChrome> {
    return {
        default: {
            background: colors.optionSurface,
            border: colors.outlineVariant,
            borderWidth: 1,
            letterBackground: colors.surfaceContainerHigh,
            letterColor: colors.onSurfaceVariant,
            text: colors.onSurface,
        },
        selected: {
            background: colors.primaryFixed,
            border: colors.primary,
            borderWidth: 2,
            letterBackground: colors.primary,
            letterColor: colors.onPrimary,
            text: colors.onPrimaryFixed,
        },
        correct: {
            background: colors.successLight,
            border: colors.success,
            borderWidth: 1.5,
            letterBackground: colors.success,
            letterColor: colors.onPrimary,
            text: colors.successText,
        },
        incorrect: {
            background: colors.errorLight,
            border: colors.error,
            borderWidth: 1.5,
            letterBackground: colors.error,
            letterColor: colors.onPrimary,
            text: colors.errorText,
        },
        disabled: {
            background: colors.surfaceContainerLow,
            border: colors.outlineVariant,
            borderWidth: 1,
            letterBackground: colors.surfaceContainer,
            letterColor: colors.textTertiary,
            text: colors.textTertiary,
        },
    };
}

export interface QuestionChrome {
    cardBackground: string;
    cardBorder: string;
    bandBackground: string;
    bandAccent: string;
    bandText: string;
    chipBackground: string;
    chipText: string;
}

/** Chrome tokens for the question card shell — keeps light and dark in lockstep. */
export function questionChrome(colors: ColorPalette): QuestionChrome {
    return {
        cardBackground: colors.surfaceContainerLowest,
        cardBorder: colors.outlineVariant,
        bandBackground: colors.primaryFixed,
        bandAccent: colors.primary,
        bandText: colors.primary,
        chipBackground: colors.primaryFixed,
        chipText: colors.primary,
    };
}

export function difficultyColors(colors: ColorPalette) {
    return {
        easy: { background: colors.successLight, text: colors.easy },
        medium: { background: colors.warningLight, text: colors.medium },
        hard: { background: colors.errorLight, text: colors.hard },
    } as const;
}
