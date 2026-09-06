import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../constants';

interface StemTextProps {
    children: string;
}

/** Shared stem typography (~15px semibold on-surface). */
export const StemText: React.FC<StemTextProps> = ({ children }) => (
    <Text style={styles.stem}>{children || 'Question text loading...'}</Text>
);

const styles = StyleSheet.create({
    stem: {
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: 15,
        lineHeight: 15 * 1.35,
        fontWeight: '600',
        color: COLORS.onSurface,
    },
});

export default StemText;
