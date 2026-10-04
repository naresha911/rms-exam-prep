import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import type { ColorPalette } from './palette';
import { useColors } from './useColors';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Build a StyleSheet from the active palette.
 * Pass a module-level factory so the function identity stays stable.
 */
export function useThemedStyles<T extends NamedStyles<T>>(
    factory: (colors: ColorPalette) => T
): T {
    const colors = useColors();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors, factory]);
}
