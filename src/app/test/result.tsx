// Mock Test Result — Stitch-aligned screen shown after a mock test completes.
// Per Stitch: mascot + headline, score circle card, accuracy progress, stat cards,
// performance section cards, sticky bottom actions.
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { CircularProgress } from "../../components/shared/CircularProgress";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, XP_REWARDS } from "../../constants";

export default function TestResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

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

    const getResult = () => {
        if (percentage >= 80) return { emoji: "celebrating" as const, text: "Excellent!", color: COLORS.success };
        if (percentage >= 60) return { emoji: "happy" as const, text: "Good Job!", color: COLORS.primary };
        if (percentage >= 40) return { emoji: "encouraging" as const, text: "Keep Trying!", color: COLORS.warning };
        return { emoji: "thinking" as const, text: "Need Practice", color: COLORS.error };
    };

    const result = getResult();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header — mascot + headline */}
                <View style={styles.header}>
                    <MascotDisplay
                        expression={result.emoji}
                        size={140}
                    />
                    <Text style={[styles.headline, { color: result.color }]}>
                        {result.text}
                    </Text>
                    <Text style={styles.subheadline}>
                        {testType === "sectional" && sectionName ? `${sectionName} Test` :
                            testType === "speed" ? "Speed Test" : "Full Mock Test"} Completed
                    </Text>
                </View>

                {/* Score Card — Stitch: surface with circular score indicator */}
                <View style={styles.scoreCard}>
                    <View style={styles.scoreCircle}>
                        <CircularProgress
                            percentage={percentage}
                            size={100}
                            strokeWidth={8}
                        />
                        <View style={styles.scoreCircleInner}>
                            <Text style={[styles.scorePercent, { color: result.color }]}>{percentage}%</Text>
                        </View>
                    </View>
                    <View style={styles.scoreStats}>
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

                {/* XP Earned Card */}
                <View style={styles.xpCard}>
                    <View style={styles.xpIcon}>
                        <MaterialIcon name="bolt" size={28} color={COLORS.xpGold} filled />
                    </View>
                    <View style={styles.xpContent}>
                        <Text style={styles.xpValue}>+{totalXP} XP</Text>
                        <Text style={styles.xpLabel}>XP Earned</Text>
                    </View>
                    <View style={styles.xpBreakdown}>
                        <Text style={styles.xpBreakdownText}>• Correct: +{baseXP} XP</Text>
                        {perfectBonus > 0 && (
                            <Text style={[styles.xpBreakdownText, { color: COLORS.success }]}>
                                • Perfect: +{perfectBonus} XP 🎉
                            </Text>
                        )}
                        <Text style={styles.xpBreakdownText}>• Completion: +{completionXP} XP</Text>
                    </View>
                </View>

                {/* Performance Breakdown Card */}
                <View style={styles.performanceCard}>
                    <Text style={styles.sectionTitle}>Performance Breakdown</Text>

                    {/* Progress bar */}
                    <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Your Score</Text>
                            <Text style={styles.progressValue}>{percentage}%</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${percentage}%`, backgroundColor: result.color },
                                ]}
                            />
                        </View>
                        <View style={styles.progressMarkers}>
                            <Text style={styles.progressMarker}>0%</Text>
                            <Text style={styles.progressMarker}>50%</Text>
                            <Text style={styles.progressMarker}>100%</Text>
                        </View>
                    </View>

                    {/* Question stats */}
                    <View style={styles.questionStats}>
                        <View style={[styles.questionStatItem, { backgroundColor: COLORS.successLight }]}>
                            <Text style={[styles.questionStatValue, { color: COLORS.success }]}>
                                {correct}/{total}
                            </Text>
                            <Text style={[styles.questionStatLabel, { color: COLORS.success }]}>
                                Correct
                            </Text>
                        </View>
                        <View style={[styles.questionStatItem, { backgroundColor: COLORS.errorLight }]}>
                            <Text style={[styles.questionStatValue, { color: COLORS.error }]}>
                                {total - correct}
                            </Text>
                            <Text style={[styles.questionStatLabel, { color: COLORS.error }]}>
                                Wrong
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Tips card */}
                {percentage < 60 && (
                    <View style={styles.tipsCard}>
                        <View style={styles.tipsHeader}>
                            <MaterialIcon name="lightbulb" size={22} color={COLORS.warning} />
                            <Text style={styles.tipsTitle}>How to Improve</Text>
                        </View>
                        <Text style={styles.tipsText}>
                            Focus on understanding concepts rather than memorizing. Review explanations for wrong answers and practice similar questions.
                        </Text>
                    </View>
                )}

                {/* Actions */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING[5],
    },
    header: {
        alignItems: "center",
        marginBottom: SPACING[5],
        marginTop: SPACING[2],
    },
    headline: {
        fontFamily: TYPOGRAPHY.fontFamily.extrabold,
        fontSize: TYPOGRAPHY.fontSize["3xl"],
        fontWeight: "800",
        textAlign: "center",
        marginTop: SPACING[3],
    },
    subheadline: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
        marginTop: SPACING[1],
    },
    scoreCard: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["3xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[5],
        marginBottom: SPACING[4],
        alignItems: "center",
    },
    scoreCircle: {
        width: 120,
        height: 120,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING[4],
    },
    scoreCircleInner: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    scorePercent: {
        fontFamily: TYPOGRAPHY.fontFamily.extrabold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        fontWeight: "800",
    },
    scoreStats: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[5],
    },
    scoreStatItem: {
        alignItems: "center",
    },
    scoreStatValue: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.onSurface,
        fontWeight: "800",
    },
    scoreStatLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        fontWeight: "600",
        marginTop: 2,
    },
    scoreDivider: {
        width: 1,
        height: 32,
        backgroundColor: COLORS.outlineVariant,
    },
    xpCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[3],
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[4],
        marginBottom: SPACING[4],
    },
    xpIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.warningLight,
        alignItems: "center",
        justifyContent: "center",
    },
    xpContent: {
        flex: 1,
    },
    xpValue: {
        fontFamily: TYPOGRAPHY.fontFamily.extrabold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.xpGold,
        fontWeight: "800",
    },
    xpLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        fontWeight: "600",
    },
    xpBreakdown: {
        alignItems: "flex-start",
    },
    xpBreakdownText: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        lineHeight: 18,
    },
    performanceCard: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[5],
        marginBottom: SPACING[4],
    },
    sectionTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        fontWeight: "700",
        marginBottom: SPACING[4],
    },
    progressSection: {
        marginBottom: SPACING[4],
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: SPACING[2],
    },
    progressLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        fontWeight: "600",
    },
    progressValue: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurface,
        fontWeight: "700",
    },
    progressBar: {
        height: 10,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: BORDER_RADIUS.full,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: BORDER_RADIUS.full,
    },
    progressMarkers: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },
    progressMarker: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: 10,
        color: COLORS.onSurfaceVariant,
    },
    questionStats: {
        flexDirection: "row",
        gap: SPACING[3],
    },
    questionStatItem: {
        flex: 1,
        alignItems: "center",
        padding: SPACING[3],
        borderRadius: BORDER_RADIUS.lg,
    },
    questionStatValue: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: "800",
    },
    questionStatLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: "600",
        marginTop: 2,
    },
    tipsCard: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[4],
        marginBottom: SPACING[4],
    },
    tipsHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
        marginBottom: SPACING[2],
    },
    tipsTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.warning,
        fontWeight: "700",
    },
    tipsText: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        lineHeight: 22,
    },
    actions: {
        gap: SPACING[3],
        marginTop: SPACING[2],
    },
});
