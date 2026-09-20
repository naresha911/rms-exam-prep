import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { MaterialIcon } from '../ui/MaterialIcon';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';
import { LatexText } from './LatexText';
import type { QuestionOption } from '../../types';
import type { OptionUiState, QuestionUiMode, SelectionMode } from './types';
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

const STATE_BORDER: Record<OptionUiState, string> = {
    default: COLORS.outlineVariant,
    selected: COLORS.primary,
    correct: COLORS.success,
    incorrect: COLORS.error,
    disabled: COLORS.outlineVariant,
};

const STATE_BG: Record<OptionUiState, string> = {
    default: COLORS.surfaceContainerLow,
    selected: COLORS.primaryFixed,
    correct: COLORS.successLight,
    incorrect: COLORS.errorLight,
    disabled: COLORS.surfaceContainer,
};

export const FigureOptionTile: React.FC<FigureOptionTileProps> = ({
    option,
    selectedValue,
    selectionMode,
    mode,
    revealed,
    browseRevealed,
    onSelect,
}) => {
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
    const uri = option.option_image_path;

    return (
        <Pressable
            onPress={
                !disabledReveal && onSelect ? () => onSelect(value) : undefined
            }
            style={({ pressed }) => [
                styles.tile,
                {
                    backgroundColor: STATE_BG[state],
                    borderColor: STATE_BORDER[state],
                    opacity: pressed && !disabledReveal ? 0.85 : 1,
                },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: state === 'selected' }}
        >
            <View
                style={[
                    styles.letter,
                    {
                        backgroundColor:
                            state === 'selected' || state === 'correct'
                                ? COLORS.primary
                                : COLORS.surfaceContainerHigh,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.letterText,
                        {
                            color:
                                state === 'selected' || state === 'correct'
                                    ? COLORS.onPrimary
                                    : COLORS.onSurface,
                        },
                    ]}
                >
                    {option.option_key.toUpperCase()}
                </Text>
            </View>
            {uri ? (
                <Image source={{ uri }} style={styles.image} resizeMode="contain" />
            ) : (
                <View style={styles.fallbackWrap}>
                    <LatexText
                        content={option.option_text || ''}
                        color={COLORS.onSurface}
                        fontSize={12}
                        fontFamily={TYPOGRAPHY.fontFamily.medium}
                    />
                </View>
            )}
            {showCheck && (
                <View style={styles.check}>
                    <MaterialIcon name="check_circle" size={18} color={COLORS.success} filled />
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    tile: {
        flex: 1,
        minHeight: 88,
        borderWidth: 2,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING[2],
        alignItems: 'center',
        gap: SPACING[2],
    },
    letter: {
        alignSelf: 'flex-start',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 12,
        fontWeight: '700',
    },
    image: {
        width: '100%',
        height: 56,
    },
    fallbackWrap: {
        width: '100%',
        alignItems: 'center',
    },
    check: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});

export default FigureOptionTile;
