// Mock Test Result — Stitch-aligned screen shown after a mock test completes.
// Per Stitch: mascot + headline, score circle card, accuracy progress, stat cards,
// performance section cards, sticky bottom actions.
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { CircularProgress } from "../../components/shared/CircularProgress";
import { BORDER_RADIUS, SPACING, TYPOGRAPHY, XP_REWARDS } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";

type ResultTier = "excellent" | "good" | "trying" | "practice";

const TONE = {
    excellent: "toneExcellent",
    good: "toneGood",
    trying: "toneTrying",
    practice: "tonePractice",
} as const;

const FILL = {
    excellent: "fillExcellent",
    good: "fillGood",
    trying: "fillTrying",
    practice: "fillPractice",
} as const;

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: SPACING[5],
        },
        header: {
            alignItems: "center" as const,
            marginBottom: SPACING[5],
            marginTop: SPACING[2],
        },
        headline: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize["3xl"],
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            textAlign: "center" as const,
            marginTop: SPACING[3],
        },
        toneExcellent: { color: colors.success },
        toneGood: { color: colors.primary },
        toneTrying: { color: colors.warning },
        tonePractice: { color: colors.error },
        subheadline: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurfaceVariant,
            textAlign: "center" as const,
            marginTop: SPACING[1],
        },
        scoreCard: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["3xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[5],
            marginBottom: SPACING[4],
            alignItems: "center" as const,
        },
        scoreCircle: {
            width: 120,
            height: 120,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            marginBottom: SPACING[4],
        },
        scoreCircleInner: {
            position: "absolute" as const,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
        scorePercent: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        scoreStats: {
            gap: SPACING[5],
        },
        scoreStatItem: {
            alignItems: "center" as const,
        },
        scoreStatValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        scoreStatLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            marginTop: 2,
        },
        scoreDivider: {
            width: 1,
            height: 32,
            backgroundColor: colors.outlineVariant,
        },
        xpCard: {
            gap: SPACING[3],
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[4],
            marginBottom: SPACING[4],
        },
        xpIcon: {
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: colors.warningLight,
        },
        xpContent: {
            flex: 1,
        },
        xpValue: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.xpGold,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        xpLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        xpBreakdown: {
            alignItems: "flex-start" as const,
        },
        xpBreakdownText: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            lineHeight: 18,
        },
        xpPerfect: { color: colors.success },
        performanceCard: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[5],
            marginBottom: SPACING[4],
        },
        sectionTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            marginBottom: SPACING[4],
        },
        progressSection: {
            marginBottom: SPACING[4],
        },
        progressHeader: {
            marginBottom: SPACING[2],
        },
        progressLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        progressValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        progressBar: {
            height: 10,
            backgroundColor: colors.surfaceVariant,
            borderRadius: BORDER_RADIUS.full,
            overflow: "hidden" as const,
        },
        progressFill: {
            height: "100%" as const,
            borderRadius: BORDER_RADIUS.full,
        },
        fillExcellent: { backgroundColor: colors.success },
        fillGood: { backgroundColor: colors.primary },
        fillTrying: { backgroundColor: colors.warning },
        fillPractice: { backgroundColor: colors.error },
        progressMarkers: {
            marginTop: 4,
        },
        progressMarker: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: 10,
            color: colors.onSurfaceVariant,
        },
        questionStats: {
            gap: SPACING[3],
        },
        questionStatItem: {
            flex: 1,
            alignItems: "center" as const,
            padding: SPACING[3],
            borderRadius: BORDER_RADIUS.lg,
        },
        statCorrect: { backgroundColor: colors.successLight },
        statWrong: { backgroundColor: colors.errorLight },
        questionStatValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        statCorrectText: { color: colors.success },
        statWrongText: { color: colors.error },
        questionStatLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            marginTop: 2,
        },
        tipsCard: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[4],
            marginBottom: SPACING[4],
        },
        tipsHeader: {
            gap: SPACING[2],
            marginBottom: SPACING[2],
        },
        tipsTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.warning,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        tipsText: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
            lineHeight: 22,
        },
        actions: {
            gap: SPACING[3],
            marginTop: SPACING[2],
        },
    };
}

export default function TestResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    const correct = parseInt(params.correct as string) || 0;
    const total = parseInt(params.total as string) || 0;
    const timeSpent = parseInt(params.time as string) || 0;
    const testType = params.type as string;
    const sectionName = params.section as string;
    const questionsJson = params.questions as string;

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    // Calculate XP
    const baseXP = correct * XP_REWARDS.correctAnswer;
    const completionXP = XP_REWARDS.mockTestComplete;
    const perfectBonus = percentage === 100 ? XP_REWARDS.perfectScore : 0;
    const totalXP = baseXP + completionXP + perfectBonus;

    const getResult = (): { emoji: "celebrating" | "happy" | "encouraging" | "thinking"; text: string; tier: ResultTier } => {
        if (percentage >= 80) return { emoji: "celebrating", text: "Excellent!", tier: "excellent" };
        if (percentage >= 60) return { emoji: "happy", text: "Good Job!", tier: "good" };
        if (percentage >= 40) return { emoji: "encouraging", text: "Keep Trying!", tier: "trying" };
        return { emoji: "thinking", text: "Need Practice", tier: "practice" };
    };

    const result = getResult();
    const progressWidth = useMemo(
        () => StyleSheet.create({ bar: { width: `${percentage}%` as `${number}%` } }).bar,
        [percentage]
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <MascotDisplay
                        expression={result.emoji}
                        size={140}
                    />
                    <Text style={[styles.headline, styles[TONE[result.tier]]]}>
                        {result.text}
                    </Text>
                    <Text style={styles.subheadline}>
                        {testType === "sectional" && sectionName ? `${sectionName} Test` :
                            testType === "speed" ? "Speed Test" : "Full Mock Test"} Completed
                    </Text>
                </View>

                <View style={styles.scoreCard}>
                    <View style={styles.scoreCircle}>
                        <CircularProgress
                            percentage={percentage}
                            size={100}
                            strokeWidth={8}
                        />
                        <View style={styles.scoreCircleInner}>
                            <Text style={[styles.scorePercent, styles[TONE[result.tier]]]}>{percentage}%</Text>
                        </View>
                    </View>
                    <View style={[layout.row, styles.scoreStats]}>
                        <View style={styles.scoreStatItem}>
                            <Text style={styles.scoreStatValue}>{correct}/{total}</Text>
                            <Text style={styles.scoreStatLabel}>Score</Text>
                        </View>
                        <View style={styles.scoreDivider} />
                        <View style={styles.scoreStatItem}>
                            <Text style={styles.scoreStatValue}>{minutes}m {seconds}s</Text>
                            <Text style={styles.scoreStatLabel}>Time</Text>
                        </View>
                    </View>
                </View>

                <View style={[layout.row, styles.xpCard]}>
                    <View style={[layout.center, styles.xpIcon]}>
                        <MaterialIcon name="bolt" size={28} color={colors.xpGold} filled />
                    </View>
                    <View style={styles.xpContent}>
                        <Text style={styles.xpValue}>+{totalXP} XP</Text>
                        <Text style={styles.xpLabel}>XP Earned</Text>
                    </View>
                    <View style={styles.xpBreakdown}>
                        <Text style={styles.xpBreakdownText}>• Correct: +{baseXP} XP</Text>
                        {perfectBonus > 0 && (
                            <Text style={[styles.xpBreakdownText, styles.xpPerfect]}>
                                • Perfect: +{perfectBonus} XP 🎉
                            </Text>
                        )}
                        <Text style={styles.xpBreakdownText}>• Completion: +{completionXP} XP</Text>
                    </View>
                </View>

                <View style={styles.performanceCard}>
                    <Text style={styles.sectionTitle}>Performance Breakdown</Text>

                    <View style={styles.progressSection}>
                        <View style={[layout.rowBetween, styles.progressHeader]}>
                            <Text style={styles.progressLabel}>Your Score</Text>
                            <Text style={styles.progressValue}>{percentage}%</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, styles[FILL[result.tier]], progressWidth]} />
                        </View>
                        <View style={[layout.rowBetween, styles.progressMarkers]}>
                            <Text style={styles.progressMarker}>0%</Text>
                            <Text style={styles.progressMarker}>50%</Text>
                            <Text style={styles.progressMarker}>100%</Text>
                        </View>
                    </View>

                    <View style={[layout.row, styles.questionStats]}>
                        <View style={[styles.questionStatItem, styles.statCorrect]}>
                            <Text style={[styles.questionStatValue, styles.statCorrectText]}>
                                {correct}/{total}
                            </Text>
                            <Text style={[styles.questionStatLabel, styles.statCorrectText]}>
                                Correct
                            </Text>
                        </View>
                        <View style={[styles.questionStatItem, styles.statWrong]}>
                            <Text style={[styles.questionStatValue, styles.statWrongText]}>
                                {total - correct}
                            </Text>
                            <Text style={[styles.questionStatLabel, styles.statWrongText]}>
                                Wrong
                            </Text>
                        </View>
                    </View>
                </View>

                {percentage < 60 && (
                    <View style={styles.tipsCard}>
                        <View style={[layout.row, styles.tipsHeader]}>
                            <MaterialIcon name="lightbulb" size={22} color={colors.warning} />
                            <Text style={styles.tipsTitle}>How to Improve</Text>
                        </View>
                        <Text style={styles.tipsText}>
                            Focus on understanding concepts rather than memorizing. Review explanations for wrong answers and practice similar questions.
                        </Text>
                    </View>
                )}

                <View style={styles.actions}>
                    <Button
                        title="Review Answers"
                        variant="outline"
                        fullWidth
                        size="lg"
                        onPress={() =>
                            router.push({
                                pathname: "/test/analysis" as any,
                                params: {
                                    correct: correct.toString(),
                                    total: total.toString(),
                                    time: timeSpent.toString(),
                                    type: testType || "",
                                    questions: questionsJson || "",
                                },
                            })
                        }
                    />
                    <Button
                        title="Take Another Test"
                        fullWidth
                        size="lg"
                        onPress={() => router.back()}
                    />
                    <Button
                        title="Back to Home"
                        variant="outline"
                        fullWidth
                        size="lg"
                        onPress={() => router.replace("/(tabs)" as any)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
