import { DarkTheme, DefaultTheme } from 'expo-router';
import type { Appearance, ColorPalette } from './palette';

/** Navigation chrome follows the active palette. Import themes from expo-router, not @react-navigation. */
export function createNavigationTheme(colors: ColorPalette, appearance: Appearance) {
    const base = appearance === 'dark' ? DarkTheme : DefaultTheme;
    return {
        ...base,
        dark: appearance === 'dark',
        colors: {
            ...base.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.textPrimary,
            border: colors.outlineVariant,
            notification: colors.error,
        },
    };
}
