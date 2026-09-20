import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionGrid } from '../OptionGrid';
import { LatexText } from '../LatexText';
import { shellFromShared } from '../shellHelpers';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants';
import type { SharedQuestionProps } from '../types';

/** Word stem with embedded TeX + 2×2 numeric options. */
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
                    <LatexText
                        content={props.question.question_text || ''}
                        color={COLORS.onSurface}
                        fontSize={15}
                        fontFamily={TYPOGRAPHY.fontFamily.semibold}
                        fontWeight="600"
                        lineHeight={Math.round(15 * 1.35)}
                    />
                    {chips?.map((chip, i) => (
                        <View key={`chip-${i}`} style={styles.chip}>
                            <LatexText
                                content={`$${chip}$`}
                                color={COLORS.primary}
                                fontSize={13}
                                fontFamily={TYPOGRAPHY.fontFamily.semibold}
                                fontWeight="600"
                            />
                        </View>
                    ))}
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
    chip: {
        backgroundColor: COLORS.surfaceContainerHigh,
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING[2],
        paddingVertical: SPACING[1],
    },
});

export default McqInlineMath;
