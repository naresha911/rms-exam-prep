import React from 'react';
import { View } from 'react-native';
import { useThemedStyles, type ColorPalette } from '../../theme';
import { OptionRow, type OptionRowState } from './OptionRow';
import { useResponsive } from '../../hooks/useResponsive';
import type { QuestionOption } from '../../types';
import type { QuestionUiMode, SelectionMode } from './types';
import { deriveOptionState } from './optionState';
import { getOptionValue } from './resolvePresentation';

export interface OptionStackProps {
    options: QuestionOption[];
    selectedValue: string | null;
    selectionMode: SelectionMode;
    mode: QuestionUiMode;
    revealed?: boolean;
    browseRevealed?: boolean;
    onSelect?: (value: string) => void;
}

function createStyles(_colors: ColorPalette) {
    return {
        stack: { gap: 8 },
        stackTablet: { gap: 10 },
    };
}

/** Full-width rows inside the question card's answer well. */
export const OptionStack: React.FC<OptionStackProps> = ({
    options,
    selectedValue,
    selectionMode,
    mode,
    revealed,
    browseRevealed,
    onSelect,
}) => {
    const styles = useThemedStyles(createStyles);
    const { isTablet } = useResponsive();
    const sorted = [...options].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    return (
        <View style={[styles.stack, isTablet ? styles.stackTablet : null]}>
            {sorted.map((option) => {
                const value = getOptionValue(option, selectionMode);
                const state = deriveOptionState({
                    option,
                    selectedValue,
                    selectionMode,
                    mode,
                    revealed,
                    browseRevealed,
                }) as OptionRowState;
                const interactive = mode !== 'browse' || !!onSelect;
                const disabledReveal =
                    (mode === 'browse' && browseRevealed) || (mode !== 'browse' && !!revealed);

                return (
                    <OptionRow
                        key={option.id}
                        label={option.option_key.toUpperCase()}
                        text={option.option_text || ''}
                        state={state}
                        onPress={
                            interactive && !disabledReveal && onSelect
                                ? () => onSelect(value)
                                : undefined
                        }
                    />
                );
            })}
        </View>
    );
};

export default OptionStack;
