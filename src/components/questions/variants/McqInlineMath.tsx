import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionGrid } from '../OptionGrid';
import { shellFromShared } from '../shellHelpers';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants';
import type { SharedQuestionProps } from '../types';

/** Split stem into plain + mono math chips. Supports `{math:...}` markers. */
function parseStemSegments(stem: string, chips?: string[]): React.ReactNode[] {
    if (chips?.length) {
        // Alternate: assume chips are the math parts interleaved — render stem with chips appended
        return [
            <Text key="stem" style={styles.stemPlain}>
                {stem}
            </Text>,
            ...chips.map((c, i) => (
                <View key={`chip-${i}`} style={styles.chip}>
                    <Text style={styles.chipText}>{c}</Text>
                </View>
            )),
        ];
    }

    const parts = stem.split(/(\{math:[^}]+\}|\$[^$]+\$)/g).filter(Boolean);
    return parts.map((part, i) => {
        const mathMatch = part.match(/^\{math:([^}]+)\}$/) || part.match(/^\$([^$]+)\$$/);
        if (mathMatch) {
            return (
                <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{mathMatch[1]}</Text>
                </View>
            );
        }
        return (
            <Text key={i} style={styles.stemPlain}>
                {part}
            </Text>
        );
    });
}

/** Word stem with embedded expression chips + 2×2 numeric options. */
export const McqInlineMath: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared(props);
    const chips = props.question.presentationHints?.inlineMathChips;
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    return (
        <QuestionCardShell
            {...shell}
            stem={
                <View style={styles.stemWrap}>
                    {parseStemSegments(props.question.question_text || '', chips)}
                </View>
            }
        >
            <OptionGrid
                options={props.question.options}
                selectedValue={props.selectedValue}
                selectionMode={props.selectionMode}
                mode={props.mode}
                revealed={props.revealed}
                browseRevealed={browseRevealed}
                onSelect={props.onSelect}
            />
        </QuestionCardShell>
    );
};

const styles = StyleSheet.create({
    stemWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: SPACING[2],
    },
    stemPlain: {
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: 15,
        lineHeight: 15 * 1.35,
        fontWeight: '600',
        color: COLORS.onSurface,
    },
    chip: {
        backgroundColor: COLORS.surfaceContainerHigh,
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING[2],
        paddingVertical: SPACING[1],
    },
    chipText: {
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
        letterSpacing: 0.3,
    },
});

export default McqInlineMath;
