// QuestionPalette — question navigator for mock tests matching Stitch mock_test_interface.
// Circular indicators: success-green=answered, error=skipped, warning-amber=marked for review,
// primary=current (with ring), outline=unanswered.
// Per Stitch: sticky sidebar on tablet (md+), FAB on mobile, legend footer.

import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";
import { MaterialIcon } from "../ui/MaterialIcon";

export type PaletteState = "unanswered" | "answered" | "skipped" | "marked" | "current";

interface QuestionPaletteProps {
    total: number;
    current?: number;       // 1-based
    states?: Record<number, PaletteState>; // map of question index → state
    onQuestionPress?: (index: number) => void;
    style?: any;
}

const STATE_COLORS: Record<PaletteState, string> = {
    unanswered: "transparent",
    answered: COLORS["success-green"],
    skipped: COLORS.error,
    marked: COLORS["warning-amber"],
    current: COLORS.primary,
};

const STATE_TEXT_COLORS: Record<PaletteState, string> = {
    unanswered: COLORS.onSurface,
    answered: "#fff",
    skipped: "#fff",
    marked: "#fff",
    current: COLORS.onPrimary,
};

const STATE_BORDER_COLORS: Record<PaletteState, string> = {
    unanswered: COLORS.outlineVariant,
    answered: COLORS["success-green"],
    skipped: COLORS.error,
    marked: COLORS["warning-amber"],
    current: COLORS.primary,
};

const LEGEND_ITEMS: { color: string; label: string }[] = [
    { color: COLORS["success-green"], label: "Answered" },
    { color: COLORS.error, label: "Skipped" },
    { color: COLORS["warning-amber"], label: "Marked for Review" },
    { color: COLORS.outlineVariant, label: "Unanswered" },
];

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
    total,
    current = 1,
    states = {},
    onQuestionPress,
    style,
}) => {
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
                            style={[
                                styles.bubble,
                                {
                                    backgroundColor: isCurrent ? STATE_COLORS[state] : "transparent",
                                    borderColor: STATE_BORDER_COLORS[state],
                                    borderWidth: 2,
                                },
                                isCurrent && styles.bubbleCurrent,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel={`Question ${i + 1}`}
                        >
                            <Text
                                style={[
                                    styles.bubbleText,
                                    {
                                        color: isCurrent
                                            ? STATE_TEXT_COLORS[state]
                                            : COLORS.onSurfaceVariant,
                                    },
                                ]}
                            >
                                {i + 1}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Legend */}
            <View style={styles.legend}>
                {LEGEND_ITEMS.map((item) => (
                    <View key={item.label} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: item.color, borderWidth: item.color === COLORS.outlineVariant ? 2 : 0, borderColor: item.color },
                            ]}
                        />
                        <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING[4],
    },
    header: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurface,
        fontWeight: "600",
        marginBottom: SPACING[4],
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SPACING[2],
    },
    bubble: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    bubbleCurrent: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    bubbleText: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: "600",
    },
    legend: {
        marginTop: SPACING[4],
        paddingTop: SPACING[4],
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
        gap: SPACING[2],
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendLabel: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        fontWeight: "600",
    },
});

export default QuestionPalette;
