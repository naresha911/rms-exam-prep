// OptionCard — a tappable answer option card for MCQ questions
import React from 'react';
import { Pressable, View, Text, Image } from 'react-native';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants';
import { layout, useThemedStyles, type ColorPalette } from '../../theme';

interface OptionCardProps {
    optionKey: string;
    optionText?: string;
    optionImagePath?: string | null;
    isSelected: boolean;
    isCorrect?: boolean | null;
    isDisabled: boolean;
    onPress: () => void;
}

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect';

const SURFACE = {
    default: 'surfaceDefault',
    selected: 'surfaceSelected',
    correct: 'surfaceCorrect',
    incorrect: 'surfaceIncorrect',
} as const;

const LABEL = {
    default: 'labelDefault',
    selected: 'labelSelected',
    correct: 'labelCorrect',
    incorrect: 'labelIncorrect',
} as const;

const LABEL_TEXT = {
    default: 'labelTextDefault',
    selected: 'labelTextSelected',
    correct: 'labelTextCorrect',
    incorrect: 'labelTextIncorrect',
} as const;

const BODY = {
    default: 'bodyDefault',
    selected: 'bodySelected',
    correct: 'bodyCorrect',
    incorrect: 'bodyIncorrect',
} as const;

function optionState(isSelected: boolean, isCorrect?: boolean | null): OptionState {
    if (isCorrect === true) return 'correct';
    if (isCorrect === false && isSelected) return 'incorrect';
    if (isSelected) return 'selected';
    return 'default';
}

function createStyles(colors: ColorPalette) {
    return {
        card: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            borderWidth: 2,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[3],
            marginBottom: SPACING[2],
            ...SHADOWS.sm,
        },
        surfaceDefault: {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
        },
        surfaceSelected: {
            backgroundColor: colors.primaryFixed,
            borderColor: colors.primary,
        },
        surfaceCorrect: {
            backgroundColor: colors.successLight,
            borderColor: colors.success,
        },
        surfaceIncorrect: {
            backgroundColor: colors.errorLight,
            borderColor: colors.error,
        },
        label: {
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            marginRight: SPACING[3],
            flexShrink: 0,
        },
        labelDefault: { backgroundColor: colors.backgroundSecondary },
        labelSelected: { backgroundColor: colors.primary },
        labelCorrect: { backgroundColor: colors.success },
        labelIncorrect: { backgroundColor: colors.error },
        labelText: {
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontSize: TYPOGRAPHY.fontSize.base,
        },
        labelTextDefault: { color: colors.textSecondary },
        labelTextSelected: { color: colors.textInverse },
        labelTextCorrect: { color: colors.textInverse },
        labelTextIncorrect: { color: colors.textInverse },
        body: { flex: 1 },
        bodyText: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            lineHeight: 22,
        },
        bodyDefault: { color: colors.textPrimary },
        bodySelected: { color: colors.primary },
        bodyCorrect: { color: colors.successText },
        bodyIncorrect: { color: colors.errorText },
        image: {
            width: '100%' as const,
            height: 100,
            borderRadius: BORDER_RADIUS.md,
            resizeMode: 'contain' as const,
        },
        imageOffset: { marginTop: SPACING[2] },
        mark: { fontSize: 20, marginLeft: SPACING[2] },
    };
}

export const OptionCard: React.FC<OptionCardProps> = ({
    optionKey,
    optionText,
    optionImagePath,
    isSelected,
    isCorrect,
    isDisabled,
    onPress,
}) => {
    const styles = useThemedStyles(createStyles);
    const state = optionState(isSelected, isCorrect);
    const showMark = isCorrect !== null && isCorrect !== undefined && (isSelected || isCorrect === true);

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.card,
                styles[SURFACE[state]],
                pressed && !isDisabled ? layout.pressed : null,
            ]}
        >
            <View style={[styles.label, styles[LABEL[state]]]}>
                <Text style={[styles.labelText, styles[LABEL_TEXT[state]]]}>{optionKey}</Text>
            </View>

            <View style={styles.body}>
                {optionText ? (
                    <Text style={[styles.bodyText, styles[BODY[state]]]}>{optionText}</Text>
                ) : null}
                {optionImagePath ? (
                    <Image
                        source={{ uri: optionImagePath }}
                        style={[styles.image, optionText ? styles.imageOffset : null]}
                    />
                ) : null}
            </View>

            {showMark ? <Text style={styles.mark}>{isCorrect ? '✅' : '❌'}</Text> : null}
        </Pressable>
    );
};

export default OptionCard;
