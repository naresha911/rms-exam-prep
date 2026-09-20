import React from 'react';
import { LatexText } from './LatexText';
import { COLORS, TYPOGRAPHY } from '../../constants';

interface StemTextProps {
    children: string;
}

/** Shared stem typography (~15px semibold on-surface), including TeX. */
export const StemText: React.FC<StemTextProps> = ({ children }) => (
    <LatexText
        content={children || 'Question text loading...'}
        color={COLORS.onSurface}
        fontSize={15}
        fontFamily={TYPOGRAPHY.fontFamily.semibold}
        fontWeight="600"
        lineHeight={Math.round(15 * 1.35)}
    />
);

export default StemText;
