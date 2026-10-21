import { useWindowDimensions } from 'react-native';

export const TABLET_BREAKPOINT = 768;
export const WIDE_BREAKPOINT = 1024;

/** Single source of truth for responsive layout values across sessions. */
export function useResponsive() {
    const { width, height } = useWindowDimensions();
    const isTablet = width >= TABLET_BREAKPOINT;
    const isWide = width >= WIDE_BREAKPOINT;
    return {
        width,
        height,
        isTablet,
        isWide,
        pagePadding: isTablet ? 24 : 16,
        contentMaxWidth: 720,
        examColumnMaxWidth: 760,
        paletteRailWidth: 300,
    };
}
