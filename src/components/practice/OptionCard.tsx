// OptionCard — a tappable answer option card for MCQ questions
import React from 'react';
import { Pressable, View, Text, Image } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants';

interface OptionCardProps {
    optionKey: string;
    optionText?: string;
    optionImagePath?: string | null;
    isSelected: boolean;
    isCorrect?: boolean | null; // null = not revealed yet
    isDisabled: boolean;
    onPress: () => void;
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
    // Determine card appearance based on state
    const getStyles = () => {
        if (isCorrect === true && isSelected) {
            // Correct and selected
            return {
                bg: '#D1FAE5',
                border: COLORS.success,
                labelBg: COLORS.success,
                labelColor: '#fff',
                textColor: '#065F46',
            };
        }
        if (isCorrect === false && isSelected) {
            // Wrong answer selected
            return {
                bg: '#FEE2E2',
                border: COLORS.error,
                labelBg: COLORS.error,
                labelColor: '#fff',
                textColor: '#7F1D1D',
            };
        }
        if (isCorrect === true && !isSelected) {
            // Show correct answer after wrong selection
            return {
                bg: '#D1FAE5',
                border: COLORS.success,
                labelBg: COLORS.success,
                labelColor: '#fff',
                textColor: '#065F46',
            };
        }
        if (isSelected) {
            // Selected but not yet revealed
            return {
                bg: '#EDE9FE',
                border: COLORS.primary,
                labelBg: COLORS.primary,
                labelColor: '#fff',
                textColor: COLORS.primary,
            };
        }
        // Default unselected state
        return {
            bg: COLORS.cardBackground,
            border: COLORS.cardBorder,
            labelBg: COLORS.backgroundSecondary,
            labelColor: COLORS.textSecondary,
            textColor: COLORS.textPrimary,
        };
    };

    const s = getStyles();

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: s.bg,
                borderWidth: 2,
                borderColor: s.border,
                borderRadius: BORDER_RADIUS.xl,
                padding: SPACING[3],
                marginBottom: SPACING[2],
                opacity: pressed && !isDisabled ? 0.85 : 1,
                ...SHADOWS.sm,
            })}
        >
            {/* Option label (A, B, C, D) */}
            <View
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: s.labelBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: SPACING[3],
                    flexShrink: 0,
                }}
            >
                <Text style={{ color: s.labelColor, fontWeight: '800', fontSize: TYPOGRAPHY.fontSize.base }}>
                    {optionKey}
                </Text>
            </View>

            {/* Option content */}
            <View style={{ flex: 1 }}>
                {optionText && (
                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.base, color: s.textColor, fontWeight: '500', lineHeight: 22 }}>
                        {optionText}
                    </Text>
                )}
                {optionImagePath && (
                    <Image
                        source={{ uri: optionImagePath }}
                        style={{
                            width: '100%',
                            height: 100,
                            borderRadius: BORDER_RADIUS.md,
                            resizeMode: 'contain',
                            marginTop: optionText ? SPACING[2] : 0,
                        }}
                    />
                )}
            </View>

            {/* Correct/incorrect indicator */}
            {isCorrect !== null && isCorrect !== undefined && (isSelected || isCorrect === true) && (
                <Text style={{ fontSize: 20, marginLeft: SPACING[2] }}>
                    {isCorrect ? '✅' : '❌'}
                </Text>
            )}
        </Pressable>
    );
};

export default OptionCard;
