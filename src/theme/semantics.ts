import type { ColorPalette } from './palette';

export type OptionVisualState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

export interface OptionChrome {
    background: string;
    border: string;
    letterBackground: string;
    letterColor: string;
    text: string;
}

/** Single option-state color map for grid pills, stacked rows, and figure tiles. */
export function optionChrome(colors: ColorPalette): Record<OptionVisualState, OptionChrome> {
    return {
        default: {
            background: colors.surfaceContainerLow,
            border: colors.outlineVariant,
            letterBackground: colors.surfaceContainerHigh,
            letterColor: colors.onSurface,
            text: colors.onSurface,
        },
        selected: {
            background: colors.primaryFixed,
            border: colors.primary,
            letterBackground: colors.primary,
            letterColor: colors.onPrimary,
            text: colors.onPrimaryFixed,
        },
        correct: {
            background: colors.successLight,
            border: colors.success,
            letterBackground: colors.success,
            letterColor: colors.onPrimary,
            text: colors.successText,
        },
        incorrect: {
            background: colors.errorLight,
            border: colors.error,
            letterBackground: colors.error,
            letterColor: colors.onPrimary,
            text: colors.errorText,
        },
        disabled: {
            background: colors.surfaceMuted,
            border: colors.outlineVariant,
            letterBackground: colors.surfaceContainer,
            letterColor: colors.textTertiary,
            text: colors.textTertiary,
        },
    };
}

export function difficultyColors(colors: ColorPalette) {
    return {
        easy: { background: colors.successLight, text: colors.easy },
        medium: { background: colors.warningLight, text: colors.medium },
        hard: { background: colors.errorLight, text: colors.hard },
    } as const;
}
