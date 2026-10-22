import React from 'react';
import { View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../../theme';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionStack } from '../OptionStack';
import { LatexText } from '../LatexText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps } from '../types';

function createStyles(colors: ColorPalette) {
    return {
        stemWrap: {
            gap: SPACING[2],
        },
        chips: {
            flexDirection: 'row' as const,
            flexWrap: 'wrap' as const,
            gap: SPACING[2],
        },
        chip: {
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: BORDER_RADIUS.lg,
            paddingHorizontal: SPACING[2],
            paddingVertical: SPACING[1],
        },
    };
}

/** Word stem with expression chips and full-width numeric rows. */
export const McqInlineMath: React.FC<SharedQuestionProps> = (props) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
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
                        color={colors.onSurface}
                        fontSize={16}
                        fontFamily={TYPOGRAPHY.fontFamily.medium}
                        fontWeight="500"
                        lineHeight={22}
                    />
                    {chips?.length ? (
                        <View style={styles.chips}>
                            {chips.map((chip, index) => (
                                <View key={`chip-${index}`} style={styles.chip}>
                                    <LatexText
                                        content={`$${chip}$`}
                                        color={colors.primary}
                                        fontSize={14}
                                        fontFamily={TYPOGRAPHY.fontFamily.semibold}
                                        fontWeight="600"
                                    />
                                </View>
                            ))}
                        </View>
                    ) : null}
                </View>
            }
        >
            <OptionStack
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

export default McqInlineMath;
