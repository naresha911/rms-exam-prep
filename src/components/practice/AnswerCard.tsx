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
import { LatexText } from '../questions/LatexText';

export type AnswerState = Exclude<OptionVisualState, 'disabled'>;

interface AnswerCardProps {
    label: string;
    text: string;
    state?: AnswerState;
    showCheck?: boolean;
    trailing?: React.ReactNode;
    onPress?: () => void;
}

function createStyles(colors: ColorPalette) {
    const chrome = optionChrome(colors);
    return {
        card: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            paddingVertical: SPACING[3],
            paddingHorizontal: SPACING[4],
            borderWidth: 2,
            borderRadius: BORDER_RADIUS.xl,
            minHeight: 56,
            gap: SPACING[3],
        },
        surfaceDefault: {
            backgroundColor: chrome.default.background,
            borderColor: chrome.default.border,
        },
        surfaceSelected: {
            backgroundColor: chrome.selected.background,
            borderColor: chrome.selected.border,
        },
        surfaceCorrect: {
            backgroundColor: chrome.correct.background,
            borderColor: chrome.correct.border,
        },
        surfaceIncorrect: {
            backgroundColor: chrome.incorrect.background,
            borderColor: chrome.incorrect.border,
        },
        letter: {
            width: 36,
            height: 36,
            borderRadius: 10,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        letterDefault: { backgroundColor: chrome.default.letterBackground },
        letterSelected: { backgroundColor: chrome.selected.letterBackground },
        letterCorrect: { backgroundColor: chrome.correct.letterBackground },
        letterIncorrect: { backgroundColor: chrome.incorrect.letterBackground },
        letterText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: '700' as const,
        },
        letterTextDefault: { color: chrome.default.letterColor },
        letterTextSelected: { color: chrome.selected.letterColor },
        letterTextCorrect: { color: chrome.correct.letterColor },
        letterTextIncorrect: { color: chrome.incorrect.letterColor },
        textWrap: { flex: 1 },
        check: { marginLeft: 'auto' as const },
    };
}

const SURFACE = {
    default: 'surfaceDefault',
    selected: 'surfaceSelected',
    correct: 'surfaceCorrect',
    incorrect: 'surfaceIncorrect',
} as const;

const LETTER = {
    default: 'letterDefault',
    selected: 'letterSelected',
    correct: 'letterCorrect',
    incorrect: 'letterIncorrect',
} as const;

const LETTER_TEXT = {
    default: 'letterTextDefault',
    selected: 'letterTextSelected',
    correct: 'letterTextCorrect',
    incorrect: 'letterTextIncorrect',
} as const;

/** Full-width MCQ row for long options, assertion choices, and matching codes. */
export const AnswerCard: React.FC<AnswerCardProps> = ({
    label,
    text,
    state = 'default',
    showCheck = false,
    trailing,
    onPress,
}) => {
    const styles = useThemedStyles(createStyles);
    const chrome = optionChrome(useColors());

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                styles[SURFACE[state]],
                pressed && onPress ? layout.pressed : null,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: state === 'selected' }}
        >
            <View style={[styles.letter, styles[LETTER[state]]]}>
                <Text style={[styles.letterText, styles[LETTER_TEXT[state]]]}>{label}</Text>
            </View>
            <View style={styles.textWrap}>
                <LatexText
                    content={text}
                    color={chrome[state].text}
                    fontSize={TYPOGRAPHY.fontSize.base}
                    fontFamily={TYPOGRAPHY.fontFamily.medium}
                    fontWeight="500"
                    lineHeight={22}
                />
            </View>
            {showCheck ? (
                <View style={styles.check}>
                    <MaterialIcon name="check_circle" size={22} color={chrome.correct.border} filled />
                </View>
            ) : (
                trailing
            )}
        </Pressable>
    );
};

export default AnswerCard;
