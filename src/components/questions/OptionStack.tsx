import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnswerCard, type AnswerState } from '../practice/AnswerCard';
import { MaterialIcon } from '../ui/MaterialIcon';
import { COLORS, SPACING } from '../../constants';
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
    /** Show trailing radio / check affordance */
    showRadio?: boolean;
}

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
    const sorted = [...options].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

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

                return (
                    <View key={option.id} style={styles.row}>
                        <AnswerCard
                            label={option.option_key.toUpperCase()}
                            text={option.option_text || ''}
                            state={state}
                            showCheck={showCheck}
                            onPress={
                                interactive && !disabledReveal && onSelect
                                    ? () => onSelect(value)
                                    : undefined
                            }
                            style={styles.card}
                        />
                        {showRadio && !showCheck && mode === 'exam' && (
                            <View style={styles.radioOverlay} pointerEvents="none">
                                <MaterialIcon
                                    name={isSelected ? 'check_circle' : 'help'}
                                    size={20}
                                    color={isSelected ? COLORS.primary : COLORS.outlineVariant}
                                    filled={isSelected}
                                />
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    stack: {
        gap: SPACING[2],
    },
    row: {
        position: 'relative',
    },
    card: {
        minHeight: SPACING['touch-target'],
    },
    radioOverlay: {
        position: 'absolute',
        right: SPACING[4],
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
});

export default OptionStack;
