import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import {
    layout,
    optionChrome,
    useColors,
    useThemedStyles,
    type ColorPalette,
    type OptionVisualState,
} from '../../theme';
import { MaterialIcon } from '../ui/MaterialIcon';
import type { QuestionOption } from '../../types';
import type { QuestionUiMode, SelectionMode } from './types';
import { deriveOptionState, shouldShowCorrectCheck } from './optionState';
import { getOptionValue } from './resolvePresentation';
import { LatexText } from './LatexText';

export interface OptionGridProps {
    options: QuestionOption[];
    selectedValue: string | null;
    selectionMode: SelectionMode;
    mode: QuestionUiMode;
    revealed?: boolean;
    browseRevealed?: boolean;
    onSelect?: (value: string) => void;
    /** Centered value with the letter in the corner. Used for fractions and numeric answers. */
    layoutMode?: 'pill' | 'equation';
}

function createStyles(colors: ColorPalette) {
    const chrome = optionChrome(colors);
    const surface = (state: OptionVisualState) => ({
        backgroundColor: chrome[state].background,
        borderColor: chrome[state].border,
    });
    const letter = (state: OptionVisualState) => ({
        backgroundColor: chrome[state].letterBackground,
    });
    const letterText = (state: OptionVisualState) => ({
        color: chrome[state].letterColor,
    });

    return {
        grid: {
            flexDirection: 'row' as const,
            flexWrap: 'wrap' as const,
            marginHorizontal: -SPACING[1],
        },
        cell: {
            width: '50%' as const,
            padding: SPACING[1],
        },
        pill: {
            flex: 1,
            minHeight: 72,
            borderWidth: 2,
            borderRadius: BORDER_RADIUS.xl,
            paddingHorizontal: SPACING[3],
            paddingVertical: SPACING[3],
            gap: SPACING[2],
        },
        equation: {
            flex: 1,
            minHeight: 88,
            borderWidth: 2,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[3],
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        letter: {
            width: 28,
            height: 28,
            borderRadius: 8,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        letterCorner: {
            position: 'absolute' as const,
            top: SPACING[2],
            left: SPACING[2],
        },
        letterText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 13,
            fontWeight: '700' as const,
        },
        body: {
            width: '100%' as const,
        },
        equationBody: {
            width: '100%' as const,
            alignItems: 'center' as const,
            paddingTop: SPACING[4],
        },
        check: {
            position: 'absolute' as const,
            top: SPACING[2],
            right: SPACING[2],
        },
        surfaceDefault: surface('default'),
        surfaceSelected: surface('selected'),
        surfaceCorrect: surface('correct'),
        surfaceIncorrect: surface('incorrect'),
        surfaceDisabled: surface('disabled'),
        letterDefault: letter('default'),
        letterSelected: letter('selected'),
        letterCorrect: letter('correct'),
        letterIncorrect: letter('incorrect'),
        letterDisabled: letter('disabled'),
        letterTextDefault: letterText('default'),
        letterTextSelected: letterText('selected'),
        letterTextCorrect: letterText('correct'),
        letterTextIncorrect: letterText('incorrect'),
        letterTextDisabled: letterText('disabled'),
    };
}

const SURFACE = {
    default: 'surfaceDefault',
    selected: 'surfaceSelected',
    correct: 'surfaceCorrect',
    incorrect: 'surfaceIncorrect',
    disabled: 'surfaceDisabled',
} as const;

const LETTER = {
    default: 'letterDefault',
    selected: 'letterSelected',
    correct: 'letterCorrect',
    incorrect: 'letterIncorrect',
    disabled: 'letterDisabled',
} as const;

const LETTER_TEXT = {
    default: 'letterTextDefault',
    selected: 'letterTextSelected',
    correct: 'letterTextCorrect',
    incorrect: 'letterTextIncorrect',
    disabled: 'letterTextDisabled',
} as const;

/** Equal-height 2×2 pills. Short answers stay readable on a phone. */
export const OptionGrid: React.FC<OptionGridProps> = ({
    options,
    selectedValue,
    selectionMode,
    mode,
    revealed,
    browseRevealed,
    onSelect,
    layoutMode = 'pill',
}) => {
    const styles = useThemedStyles(createStyles);
    const chrome = optionChrome(useColors());
    const sorted = [...options].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const equation = layoutMode === 'equation';

    return (
        <View style={styles.grid}>
            {sorted.map((option) => {
                const value = getOptionValue(option, selectionMode);
                const state = deriveOptionState({
                    option,
                    selectedValue,
                    selectionMode,
                    mode,
                    revealed,
                    browseRevealed,
                });
                const interactive = mode !== 'browse' || !!onSelect;
                const disabledReveal =
                    (mode === 'browse' && browseRevealed) || (mode !== 'browse' && !!revealed);
                const showCheck = shouldShowCorrectCheck(option, mode, revealed, browseRevealed);

                return (
                    <View key={option.id} style={styles.cell}>
                        <Pressable
                            onPress={
                                interactive && !disabledReveal && onSelect
                                    ? () => onSelect(value)
                                    : undefined
                            }
                            style={({ pressed }) => [
                                equation ? styles.equation : styles.pill,
                                styles[SURFACE[state]],
                                pressed && interactive && !disabledReveal ? layout.pressed : null,
                            ]}
                            accessibilityRole="button"
                            accessibilityState={{ selected: state === 'selected' }}
                        >
                            <View
                                style={[
                                    styles.letter,
                                    equation ? styles.letterCorner : null,
                                    styles[LETTER[state]],
                                ]}
                            >
                                <Text style={[styles.letterText, styles[LETTER_TEXT[state]]]}>
                                    {option.option_key.toUpperCase()}
                                </Text>
                            </View>
                            <View style={equation ? styles.equationBody : styles.body}>
                                <LatexText
                                    content={option.option_text || ''}
                                    color={chrome[state].text}
                                    fontSize={equation ? 18 : 15}
                                    fontFamily={TYPOGRAPHY.fontFamily.semibold}
                                    fontWeight="600"
                                    lineHeight={equation ? 24 : 20}
                                    align={equation ? 'center' : 'left'}
                                />
                            </View>
                            {showCheck ? (
                                <View style={styles.check}>
                                    <MaterialIcon
                                        name="check_circle"
                                        size={18}
                                        color={chrome.correct.border}
                                        filled
                                    />
                                </View>
                            ) : null}
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
};

export default OptionGrid;
