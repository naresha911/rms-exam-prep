// QuestionPalette — question navigator for mock tests matching Stitch mock_test_interface.
// Circular indicators: success-green=answered, error=skipped, warning-amber=marked for review,
// primary=current (with ring), outline=unanswered.
// Per Stitch: sticky sidebar on tablet (md+), FAB on mobile, legend footer.

import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SPACING, TYPOGRAPHY } from "../../constants";
import { layout, useThemedStyles, type ColorPalette } from "../../theme";

export type PaletteState = "unanswered" | "answered" | "skipped" | "marked" | "current";

interface QuestionPaletteProps {
    total: number;
    current?: number;       // 1-based
    states?: Record<number, PaletteState>; // map of question index → state
    onQuestionPress?: (index: number) => void;
    style?: any;
}

const BUBBLE = {
    unanswered: "bubbleUnanswered",
    answered: "bubbleAnswered",
    skipped: "bubbleSkipped",
    marked: "bubbleMarked",
    current: "bubbleCurrent",
} as const;

const LEGEND = [
    { key: "answered", label: "Answered", dot: "legendAnswered" },
    { key: "skipped", label: "Skipped", dot: "legendSkipped" },
    { key: "marked", label: "Marked for Review", dot: "legendMarked" },
    { key: "unanswered", label: "Unanswered", dot: "legendUnanswered" },
] as const;

function createStyles(colors: ColorPalette) {
    return {
        container: {
            padding: SPACING[4],
        },
        header: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            marginBottom: SPACING[4],
        },
        grid: {
            flexDirection: "row" as const,
            flexWrap: "wrap" as const,
            gap: SPACING[2],
        },
        bubble: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            backgroundColor: "transparent",
            borderWidth: 2,
        },
        bubbleUnanswered: { borderColor: colors.outlineVariant },
        bubbleAnswered: { borderColor: colors["success-green"] },
        bubbleSkipped: { borderColor: colors.error },
        bubbleMarked: { borderColor: colors["warning-amber"] },
        bubbleCurrent: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
        },
        bubbleText: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: colors.onSurfaceVariant,
        },
        bubbleTextCurrent: {
            color: colors.onPrimary,
        },
        legend: {
            marginTop: SPACING[4],
            paddingTop: SPACING[4],
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            gap: SPACING[2],
        },
        legendItem: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: SPACING[2],
        },
        legendDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
        },
        legendAnswered: { backgroundColor: colors["success-green"] },
        legendSkipped: { backgroundColor: colors.error },
        legendMarked: { backgroundColor: colors["warning-amber"] },
        legendUnanswered: {
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: colors.outlineVariant,
        },
        legendLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
    };
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
    total,
    current = 1,
    states = {},
    onQuestionPress,
    style,
}) => {
    const styles = useThemedStyles(createStyles);

    const getState = (idx: number): PaletteState => {
        if (idx + 1 === current) return "current";
        return states[idx] ?? "unanswered";
    };

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.header}>Question Palette</Text>
            <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
                {Array.from({ length: total }, (_, i) => {
                    const state = getState(i);
                    const isCurrent = state === "current";
                    return (
                        <Pressable
                            key={i}
                            onPress={() => onQuestionPress?.(i)}
                            style={({ pressed }) => [
                                styles.bubble,
                                styles[BUBBLE[state]],
                                pressed && layout.pressed,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Question ${i + 1}`}
                        >
                            <Text style={[styles.bubbleText, isCurrent && styles.bubbleTextCurrent]}>
                                {i + 1}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <View style={styles.legend}>
                {LEGEND.map((item) => (
                    <View key={item.key} style={styles.legendItem}>
                        <View style={[styles.legendDot, styles[item.dot]]} />
                        <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default QuestionPalette;
