import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
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
import { LatexText } from './LatexText';
import type { QuestionOption } from '../../types';
import type { QuestionUiMode, SelectionMode } from './types';
import { deriveOptionState, shouldShowCorrectCheck } from './optionState';
import { getOptionValue } from './resolvePresentation';

export interface FigureOptionTileProps {
    option: QuestionOption;
    selectedValue: string | null;
    selectionMode: SelectionMode;
    mode: QuestionUiMode;
    revealed?: boolean;
    browseRevealed?: boolean;
    onSelect?: (value: string) => void;
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
    const letterText = (state: OptionVisualState) => ({ color: chrome[state].letterColor });

    return {
        tile: {
            flex: 1,
            minHeight: 112,
            borderWidth: 2,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[2],
            alignItems: 'center' as const,
            gap: SPACING[2],
        },
        letter: {
            alignSelf: 'flex-start' as const,
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        letterText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 12,
            fontWeight: '700' as const,
        },
        plate: {
            width: '100%' as const,
            height: 72,
            borderRadius: BORDER_RADIUS.lg,
            backgroundColor: colors.figurePlate,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            padding: SPACING[1],
        },
        image: {
            width: '100%' as const,
            height: '100%' as const,
        },
        check: {
            position: 'absolute' as const,
            top: 8,
            right: 8,
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

export const FigureOptionTile: React.FC<FigureOptionTileProps> = ({
    option,
    selectedValue,
    selectionMode,
    mode,
    revealed,
    browseRevealed,
    onSelect,
}) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const value = getOptionValue(option, selectionMode);
    const state = deriveOptionState({
        option,
        selectedValue,
        selectionMode,
        mode,
        revealed,
        browseRevealed,
    });
    const disabledReveal =
        (mode === 'browse' && browseRevealed) || (mode !== 'browse' && !!revealed);
    const showCheck = shouldShowCorrectCheck(option, mode, revealed, browseRevealed);

    return (
        <Pressable
            onPress={!disabledReveal && onSelect ? () => onSelect(value) : undefined}
            style={({ pressed }) => [
                styles.tile,
                styles[SURFACE[state]],
                pressed && !disabledReveal ? layout.pressed : null,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: state === 'selected' }}
        >
            <View style={[styles.letter, styles[LETTER[state]]]}>
                <Text style={[styles.letterText, styles[LETTER_TEXT[state]]]}>
                    {option.option_key.toUpperCase()}
                </Text>
            </View>
            <View style={styles.plate}>
                {option.option_image_path ? (
                    <Image source={{ uri: option.option_image_path }} style={styles.image} resizeMode="contain" />
                ) : (
                    <LatexText
                        content={option.option_text || ''}
                        color={colors.onSurface}
                        fontSize={13}
                        fontFamily={TYPOGRAPHY.fontFamily.medium}
                        align="center"
                    />
                )}
            </View>
            {showCheck ? (
                <View style={styles.check}>
                    <MaterialIcon name="check_circle" size={18} color={colors.success} filled />
                </View>
            ) : null}
        </Pressable>
    );
};

export default FigureOptionTile;
