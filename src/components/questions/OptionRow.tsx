import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../../constants';
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
import { useResponsive } from '../../hooks/useResponsive';

export type OptionRowState = OptionVisualState;

interface OptionRowProps {
    label: string;
    text: string;
    state?: OptionRowState;
    onPress?: () => void;
}

function createStyles(colors: ColorPalette) {
    const chrome = optionChrome(colors);
    const surface = (state: OptionVisualState) => ({
        backgroundColor: chrome[state].background,
        borderColor: chrome[state].border,
        borderWidth: chrome[state].borderWidth,
    });
    const letter = (state: OptionVisualState) => ({
        backgroundColor: chrome[state].letterBackground,
    });
    const letterText = (state: OptionVisualState) => ({ color: chrome[state].letterColor });

    return {
        row: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            minHeight: 54,
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 14,
            gap: 12,
        },
        rowTablet: {
            minHeight: 60,
            paddingVertical: 14,
            paddingHorizontal: 14,
            gap: 14,
        },
        surfaceDefault: surface('default'),
        surfaceSelected: surface('selected'),
        surfaceCorrect: surface('correct'),
        surfaceIncorrect: surface('incorrect'),
        surfaceDisabled: surface('disabled'),
        badge: {
            width: 30,
            height: 30,
            borderRadius: 9,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            flexShrink: 0,
        },
        badgeTablet: {
            width: 32,
            height: 32,
            borderRadius: 10,
        },
        badgeDefault: letter('default'),
        badgeSelected: letter('selected'),
        badgeCorrect: letter('correct'),
        badgeIncorrect: letter('incorrect'),
        badgeDisabled: letter('disabled'),
        badgeText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 12.5,
            fontWeight: '700' as const,
        },
        badgeTextTablet: { fontSize: 13 },
        badgeTextDefault: letterText('default'),
        badgeTextSelected: letterText('selected'),
        badgeTextCorrect: letterText('correct'),
        badgeTextIncorrect: letterText('incorrect'),
        badgeTextDisabled: letterText('disabled'),
        icon: { flexShrink: 0 },
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

const BADGE = {
    default: 'badgeDefault',
    selected: 'badgeSelected',
    correct: 'badgeCorrect',
    incorrect: 'badgeIncorrect',
    disabled: 'badgeDisabled',
} as const;

const BADGE_TEXT = {
    default: 'badgeTextDefault',
    selected: 'badgeTextSelected',
    correct: 'badgeTextCorrect',
    incorrect: 'badgeTextIncorrect',
    disabled: 'badgeTextDisabled',
} as const;

/**
 * Full-width answer row: letter badge + option text.
 * Selection is carried by fill, border weight and badge fill together — there is
 * deliberately no radio control.
 */
export const OptionRow: React.FC<OptionRowProps> = ({
    label,
    text,
    state = 'default',
    onPress,
}) => {
    const styles = useThemedStyles(createStyles);
    const chrome = optionChrome(useColors());
    const { isTablet } = useResponsive();

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [
                styles.row,
                isTablet ? styles.rowTablet : null,
                styles[SURFACE[state]],
                pressed && onPress ? layout.pressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${label}. ${text}`}
            accessibilityState={{ selected: state === 'selected', disabled: state === 'disabled' }}
        >
            <View
                style={[
                    styles.badge,
                    isTablet ? styles.badgeTablet : null,
                    styles[BADGE[state]],
                ]}
            >
                <Text
                    style={[
                        styles.badgeText,
                        isTablet ? styles.badgeTextTablet : null,
                        styles[BADGE_TEXT[state]],
                    ]}
                >
                    {label}
                </Text>
            </View>
            <View style={styles.textWrap}>
                <LatexText
                    content={text}
                    color={chrome[state].text}
                    fontSize={isTablet ? 16.5 : 15}
                    fontFamily={TYPOGRAPHY.fontFamily.medium}
                    fontWeight="500"
                    lineHeight={isTablet ? 24 : 22}
                />
            </View>
            {state === 'correct' ? (
                <View style={styles.icon}>
                    <MaterialIcon name="check_circle" size={20} color={chrome.correct.border} filled />
                </View>
            ) : state === 'incorrect' ? (
                <View style={styles.icon}>
                    <MaterialIcon name="cancel" size={20} color={chrome.incorrect.border} filled />
                </View>
            ) : null}
        </Pressable>
    );
};

export default OptionRow;
