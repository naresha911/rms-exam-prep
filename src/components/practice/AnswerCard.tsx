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
import { useResponsive } from '../../hooks/useResponsive';

export type AnswerState = OptionVisualState;

interface AnswerCardProps {
    label: string;
    text: string;
    state?: AnswerState;
    trailing?: React.ReactNode;
    onPress?: () => void;
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
        card: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            minHeight: 60,
            paddingVertical: SPACING[3],
            paddingHorizontal: 14,
            borderWidth: 1.5,
            borderRadius: BORDER_RADIUS.xl,
            gap: SPACING[3],
        },
        cardTablet: {
            minHeight: 64,
            paddingVertical: 14,
            paddingHorizontal: 18,
            gap: 14,
        },
        surfaceDefault: surface('default'),
        surfaceSelected: surface('selected'),
        surfaceCorrect: surface('correct'),
        surfaceIncorrect: surface('incorrect'),
        surfaceDisabled: surface('disabled'),
        letter: {
            width: 36,
            height: 36,
            borderRadius: BORDER_RADIUS.lg,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            flexShrink: 0,
        },
        letterTablet: {
            width: 40,
            height: 40,
            borderRadius: 12,
        },
        letterDefault: letter('default'),
        letterSelected: letter('selected'),
        letterCorrect: letter('correct'),
        letterIncorrect: letter('incorrect'),
        letterDisabled: letter('disabled'),
        letterText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 14,
            fontWeight: '700' as const,
        },
        letterTextDefault: letterText('default'),
        letterTextSelected: letterText('selected'),
        letterTextCorrect: letterText('correct'),
        letterTextIncorrect: letterText('incorrect'),
        letterTextDisabled: letterText('disabled'),
        textWrap: {
            flex: 1,
            justifyContent: 'center' as const,
        },
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

/** Full-width MCQ row: letter badge, option text, and trailing radio/result icon. */
export const AnswerCard: React.FC<AnswerCardProps> = ({
    label,
    text,
    state = 'default',
    trailing,
    onPress,
}) => {
    const styles = useThemedStyles(createStyles);
    const chrome = optionChrome(useColors());
    const { isTablet } = useResponsive();

    const resultIcon =
        state === 'correct' ? (
            <MaterialIcon name="check_circle" size={22} color={chrome.correct.border} filled />
        ) : state === 'incorrect' ? (
            <MaterialIcon name="cancel" size={22} color={chrome.incorrect.border} filled />
        ) : (
            trailing
        );

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [
                styles.card,
                isTablet ? styles.cardTablet : null,
                styles[SURFACE[state]],
                pressed && onPress ? layout.pressed : null,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: state === 'selected', disabled: state === 'disabled' }}
        >
            <View style={[styles.letter, isTablet ? styles.letterTablet : null, styles[LETTER[state]]]}>
                <Text style={[styles.letterText, styles[LETTER_TEXT[state]]]}>{label}</Text>
            </View>
            <View style={styles.textWrap}>
                <LatexText
                    content={text}
                    color={chrome[state].text}
                    fontSize={isTablet ? 17 : 16}
                    fontFamily={TYPOGRAPHY.fontFamily.medium}
                    fontWeight="500"
                    lineHeight={isTablet ? 24 : 22}
                />
            </View>
            {resultIcon}
        </Pressable>
    );
};

export default AnswerCard;
