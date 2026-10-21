import React from 'react';
import { TYPOGRAPHY } from '../../constants';
import { useColors } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';
import { LatexText } from './LatexText';

interface StemTextProps {
    children: string;
}

/** Shared stem typography, including TeX. */
export const StemText: React.FC<StemTextProps> = ({ children }) => {
    const colors = useColors();
    const { isTablet } = useResponsive();
    const size = isTablet ? 19 : 17;

    return (
        <LatexText
            content={children || 'Question text loading...'}
            color={colors.onSurface}
            fontSize={size}
            fontFamily={TYPOGRAPHY.fontFamily.semibold}
            fontWeight="600"
            lineHeight={isTablet ? 26 : 24}
        />
    );
};

export default StemText;
