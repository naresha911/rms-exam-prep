import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnswerCard, type AnswerState } from '../practice/AnswerCard';
import { SPACING } from '../../constants';
import type { QuestionOption } from '../../types';
import type { QuestionUiMode, SelectionMode } from './types';
import { deriveOptionState, shouldShowCorrectCheck } from './optionState';
import { getOptionValue } from './resolvePresentation';

export interface OptionGridProps {
    options: QuestionOption[];
    selectedValue: string | null;
    selectionMode: SelectionMode;
    mode: QuestionUiMode;
    revealed?: boolean;
    browseRevealed?: boolean;
    onSelect?: (value: string) => void;
    /** Compact inline letter style for list previews */
    compact?: boolean;
}

export const OptionGrid: React.FC<OptionGridProps> = ({
    options,
    selectedValue,
    selectionMode,
    mode,
    revealed,
    browseRevealed,
    onSelect,
    compact = false,
}) => {
    const sorted = [...options].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    return (
        <View style={styles.grid}>
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
                    (mode === 'practice' && revealed) || (mode === 'browse' && browseRevealed);

                return (
                    <View key={option.id} style={styles.cell}>
                        <AnswerCard
                            label={option.option_key.toUpperCase()}
                            text={option.option_text || ''}
                            state={state}
                            showCheck={shouldShowCorrectCheck(option, mode, revealed, browseRevealed)}
                            onPress={
                                interactive && !disabledReveal && onSelect
                                    ? () => onSelect(value)
                                    : undefined
                            }
                            style={compact ? styles.compactCard : styles.card}
                        />
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING[2],
    },
    cell: {
        width: '48%',
        flexGrow: 1,
        flexBasis: '46%',
    },
    card: {
        minHeight: SPACING['touch-target'],
    },
    compactCard: {
        minHeight: 44,
        paddingVertical: SPACING[2],
    },
});

export default OptionGrid;
