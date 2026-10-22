import React from 'react';
import { TYPOGRAPHY } from '../../constants';
import { useColors } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';
import { LatexText } from './LatexText';

interface StemTextProps {
    children: string;
}

/** Above this length a stem is a paragraph, not a prompt — drop to medium. */
const LONG_STEM_CHARS = 140;

/** Shared stem typography, including TeX. */
export const StemText: React.FC<StemTextProps> = ({ children }) => {
    const colors = useColors();
    const { isTablet } = useResponsive();
    const content = children || '';
    const long = content.length > LONG_STEM_CHARS;
    const size = isTablet ? 19 : 17;

    return (
        <LatexText
            content={content || 'Question text loading...'}
            color={colors.onSurface}
            fontSize={size}
            fontFamily={
                long ? TYPOGRAPHY.fontFamily.medium : TYPOGRAPHY.fontFamily.semibold
            }
            fontWeight={long ? '500' : '600'}
            lineHeight={long ? (isTablet ? 30 : 27) : isTablet ? 29 : 26}
        />
    );
};

export default StemText;
