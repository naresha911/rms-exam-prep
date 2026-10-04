import { useAppStore } from '../store/useAppStore';
import { paletteFor, type Appearance, type ColorPalette } from './palette';

export function useAppearance(): Appearance {
    return useAppStore((state) => state.preferences.appearance);
}

export function useColors(): ColorPalette {
    const appearance = useAppearance();
    return paletteFor(appearance);
}
