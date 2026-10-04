import React from 'react';
import { TYPOGRAPHY } from '../../constants';
import { useColors } from '../../theme';
import { LatexText } from './LatexText';

interface StemTextProps {
    children: string;
}

const STEM_SIZE = 16;

/** Shared stem typography, including TeX. */
export const StemText: React.FC<StemTextProps> = ({ children }) => {
    const colors = useColors();
    return (
        <LatexText
            content={children || 'Question text loading...'}
            color={colors.onSurface}
            fontSize={STEM_SIZE}
            fontFamily={TYPOGRAPHY.fontFamily.semibold}
            fontWeight="600"
            lineHeight={Math.round(STEM_SIZE * 1.4)}
        />
    );
};

export default StemText;
