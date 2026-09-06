import type { QuestionUiMode, OptionUiState, SelectionMode } from './types';
import type { QuestionOption } from '../../types';
import { getOptionValue } from './resolvePresentation';

export interface DeriveOptionStateParams {
    option: QuestionOption;
    selectedValue: string | null;
    selectionMode: SelectionMode;
    mode: QuestionUiMode;
    /** Practice/review reveal flag */
    revealed?: boolean;
    /** Browse: already know outcome */
    browseRevealed?: boolean;
}

/**
 * Mode matrix:
 * - exam: select only → never correct/incorrect
 * - practice: reveal when revealed
 * - browse: reveal when browseRevealed / already solved
 */
export function deriveOptionState({
    option,
    selectedValue,
    selectionMode,
    mode,
    revealed = false,
    browseRevealed = false,
}: DeriveOptionStateParams): OptionUiState {
    const value = getOptionValue(option, selectionMode);
    const isSelected = selectedValue != null && selectedValue === value;
    const showCorrectness =
        mode === 'practice'
            ? revealed
            : mode === 'browse'
              ? browseRevealed
              : false; // exam

    if (showCorrectness) {
        if (option.is_correct) return 'correct';
        if (isSelected) return 'incorrect';
        return 'disabled';
    }

    if (isSelected) return 'selected';
    return 'default';
}

export function shouldShowCorrectCheck(
    option: QuestionOption,
    mode: QuestionUiMode,
    revealed?: boolean,
    browseRevealed?: boolean
): boolean {
    if (!option.is_correct) return false;
    if (mode === 'exam') return false;
    if (mode === 'practice') return !!revealed;
    return !!browseRevealed;
}
