import React from 'react';
import { View } from 'react-native';
import { SPACING } from '../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { AnswerCard, type AnswerState } from '../practice/AnswerCard';
import { MaterialIcon } from '../ui/MaterialIcon';
import type { QuestionOption } from '../../types';
import type { QuestionUiMode, SelectionMode } from './types';
import { deriveOptionState, shouldShowCorrectCheck } from './optionState';
import { getOptionValue } from './resolvePresentation';

export interface OptionStackProps {
    options: QuestionOption[];
    selectedValue: string | null;
    selectionMode: SelectionMode;
    mode: QuestionUiMode;
    revealed?: boolean;
    browseRevealed?: boolean;
    onSelect?: (value: string) => void;
    showRadio?: boolean;
}

function createStyles(_colors: ColorPalette) {
    return {
        stack: { gap: SPACING[2] },
    };
}

/** Full-width rows. The radio sits inside the row so it does not cover the answer. */
export const OptionStack: React.FC<OptionStackProps> = ({
    options,
    selectedValue,
    selectionMode,
    mode,
    revealed,
    browseRevealed,
    onSelect,
    showRadio = true,
}) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const sorted = [...options].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    return (
        <View style={styles.stack}>
            {sorted.map((option) => {
                const value = getOptionValue(option, selectionMode);
                const rawState = deriveOptionState({
                    option,
                    selectedValue,
                    selectionMode,
                    mode,
                    revealed,
                    browseRevealed,
                });
                const state = (rawState === 'disabled' ? 'default' : rawState) as AnswerState;
                const interactive = mode !== 'browse' || !!onSelect;
                const disabledReveal =
                    (mode === 'browse' && browseRevealed) || (mode !== 'browse' && !!revealed);
                const isSelected = selectedValue === value;
                const showCheck = shouldShowCorrectCheck(option, mode, revealed, browseRevealed);
                const showExamRadio = showRadio && !showCheck && mode === 'exam';

                return (
                    <AnswerCard
                        key={option.id}
                        label={option.option_key.toUpperCase()}
                        text={option.option_text || ''}
                        state={state}
                        showCheck={showCheck}
                        onPress={
                            interactive && !disabledReveal && onSelect
                                ? () => onSelect(value)
                                : undefined
                        }
                        trailing={
                            showExamRadio ? (
                                <MaterialIcon
                                    name={isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                                    size={22}
                                    color={isSelected ? colors.primary : colors.outline}
                                    filled={isSelected}
                                />
                            ) : null
                        }
                    />
                );
            })}
        </View>
    );
};

export default OptionStack;
