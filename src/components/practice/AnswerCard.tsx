// AnswerCard — MCQ option card matching Stitch practice_session.
// States: default, selected, correct, incorrect.
// Per Stitch: white surface, 2px outline-variant border, A/B/C/D letter badge,
// selected = primary border + primary-fixed bg + filled letter badge.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon } from "../ui/MaterialIcon";

export type AnswerState = "default" | "selected" | "correct" | "incorrect";

interface AnswerCardProps {
    label: string;      // "A", "B", "C", "D"
    text: string;
    state?: AnswerState;
    showCheck?: boolean; // show check_circle when correct
    onPress?: () => void;
    style?: any;
}

const STATE_STYLES: Record<
    AnswerState,
    { bg: string; border: string; letterBg: string; letterColor: string; textColor: string }
> = {
    default: {
        bg: COLORS.surfaceContainerLowest,
        border: COLORS.outlineVariant,
        letterBg: COLORS.surfaceVariant,
        letterColor: COLORS.onSurface,
        textColor: COLORS.onSurface,
    },
    selected: {
        bg: COLORS.primaryFixed,
        border: COLORS.primary,
        letterBg: COLORS.primary,
        letterColor: COLORS.onPrimary,
        textColor: COLORS.onPrimaryFixed,
    },
    correct: {
        bg: COLORS.successLight,
        border: COLORS.success,
        letterBg: COLORS.success,
        letterColor: "#fff",
        textColor: COLORS.successText,
    },
    incorrect: {
        bg: COLORS.errorLight,
        border: COLORS.error,
        letterBg: COLORS.error,
        letterColor: "#fff",
        textColor: COLORS.errorText,
    },
};

export const AnswerCard: React.FC<AnswerCardProps> = ({
    label,
    text,
    state = "default",
    showCheck = false,
    onPress,
    style,
}) => {
    const s = STATE_STYLES[state];

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: s.bg,
                    borderColor: s.border,
                    opacity: pressed ? 0.85 : 1,
                },
                style,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: state === "selected" }}
        >
            {/* Letter badge */}
            <View style={[styles.letter, { backgroundColor: s.letterBg }]}>
                <Text style={[styles.letterText, { color: s.letterColor }]}>{label}</Text>
            </View>

            {/* Answer text */}
            <Text style={[styles.text, { color: s.textColor }]}>{text}</Text>

            {/* Check icon (correct state) */}
            {showCheck && (
                <View style={styles.checkIcon}>
                    <MaterialIcon name="check_circle" size={20} color={COLORS.success} filled />
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: SPACING[4],
        borderWidth: 2,
        borderRadius: BORDER_RADIUS.lg,
        minHeight: SPACING["touch-target"],
        gap: SPACING[4],
    },
    letter: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    letterText: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: "700",
    },
    text: {
        flex: 1,
        fontFamily: "PlusJakartaSans_500Medium",
        fontSize: TYPOGRAPHY.fontSize.lg,
        lineHeight: TYPOGRAPHY.fontSize.lg * 1.3,
        fontWeight: "500",
    },
    checkIcon: {
        marginLeft: "auto",
    },
});

export default AnswerCard;
