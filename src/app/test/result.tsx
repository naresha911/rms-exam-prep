// Test Result Screen - Shows score and analysis after test completion
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { COLORS, SPACING, TYPOGRAPHY, XP_REWARDS } from "../../constants";

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

    // Calculate XP earned
    const baseXP = correct * XP_REWARDS.correctAnswer;
    const completionXP = XP_REWARDS.mockTestComplete;
    const perfectBonus = percentage === 100 ? XP_REWARDS.perfectScore : 0;
    const totalXP = baseXP + completionXP + perfectBonus;

    // Determine result
    const getResult = () => {
        if (percentage >= 80) return { emoji: "🏆", text: "Excellent!", color: COLORS.success };
        if (percentage >= 60) return { emoji: "👍", text: "Good Job!", color: COLORS.primary };
        if (percentage >= 40) return { emoji: "💪", text: "Keep Trying!", color: COLORS.warning };
        return { emoji: "📚", text: "Need Practice", color: COLORS.error };
    };

    const result = getResult();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ alignItems: "center", marginVertical: SPACING[4] }}>
                    <MascotDisplay
                        expression={percentage >= 60 ? "celebrating" : "encouraging"}
                        size={140}
                    />
                </View>

                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize["3xl"],
                        fontWeight: "800",
                        color: result.color,
                        textAlign: "center",
                        marginBottom: SPACING[1],
                    }}
                >
                    {result.emoji} {result.text}
                </Text>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        color: COLORS.textSecondary,
                        textAlign: "center",
                        marginBottom: SPACING[6],
                    }}
                >
                    {testType === "sectional" && sectionName ? `${sectionName} Test` : testType === "speed" ? "Speed Test" : "Full Mock Test"} Completed
                </Text>

                {/* Score Card */}
                <Card style={{ marginBottom: SPACING[4] }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <ScoreCircle
                            value={correct}
                            label="Correct"
                            color={COLORS.success}
                            suffix=""
                        />
                        <ScoreCircle
                            value={total - correct}
                            label="Wrong"
                            color={COLORS.error}
                            suffix=""
                        />
                        <ScoreCircle
                            value={percentage}
                            label="Accuracy"
                            color={COLORS.primary}
                            suffix="%"
                        />
                    </View>
                </Card>

                {/* Time Taken */}
                <Card style={{ marginBottom: SPACING[4] }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 24, marginRight: SPACING[3] }}>⏱️</Text>
                        <View>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>
                                Time Taken
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: "800", color: COLORS.textPrimary }}>
                                {minutes}m {seconds}s
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* XP Earned */}
                <Card style={{ marginBottom: SPACING[4], backgroundColor: COLORS.xpGold + "20", borderColor: COLORS.xpGold }}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 40 }}>⭐</Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize["3xl"],
                                fontWeight: "800",
                                color: COLORS.xpGold,
                            }}
                        >
                            +{totalXP} XP
                        </Text>
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>
                            XP Earned
                        </Text>
                    </View>
                    <View
                        style={{
                            marginTop: SPACING[3],
                            paddingTop: SPACING[3],
                            borderTopWidth: 1,
                            borderTopColor: COLORS.cardBorder,
                            gap: SPACING[1],
                        }}
                    >
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                            • Correct answers: +{baseXP} XP
                        </Text>
                        {perfectBonus > 0 && (
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.success }}>
                                • Perfect score bonus: +{perfectBonus} XP 🎉
                            </Text>
                        )}
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                            • Completion bonus: +{completionXP} XP
                        </Text>
                    </View>
                </Card>

                {/* Performance Breakdown */}
                <Card style={{ marginBottom: SPACING[4] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[3],
                        }}
                    >
                        📊 Performance Breakdown
                    </Text>

                    {/* Progress Bar */}
                    <View style={{ marginBottom: SPACING[4] }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING[1] }}>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>
                                Your Score
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: "600", color: COLORS.textPrimary }}>
                                {percentage}%
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 12,
                                backgroundColor: COLORS.cardBorder,
                                borderRadius: 6,
                                overflow: "hidden",
                            }}
                        >
                            <View
                                style={{
                                    height: "100%",
                                    width: `${percentage}%`,
                                    backgroundColor: result.color,
                                    borderRadius: 6,
                                }}
                            />
                        </View>
                        {/* Markers */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                            <Text style={{ fontSize: 10, color: COLORS.textTertiary }}>0%</Text>
                            <Text style={{ fontSize: 10, color: COLORS.textTertiary }}>50%</Text>
                            <Text style={{ fontSize: 10, color: COLORS.textTertiary }}>100%</Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={{ flexDirection: "row", gap: SPACING[3] }}>
                        <View style={{ flex: 1, alignItems: "center", padding: SPACING[3], backgroundColor: COLORS.successLight, borderRadius: 8 }}>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: "800", color: COLORS.success }}>
                                {correct}/{total}
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.success }}>
                                Questions Right
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: "center", padding: SPACING[3], backgroundColor: COLORS.errorLight, borderRadius: 8 }}>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: "800", color: COLORS.error }}>
                                {total - correct}
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.error }}>
                                Questions Wrong
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Tips */}
                {percentage < 60 && (
                    <Card style={{ marginBottom: SPACING[4], backgroundColor: COLORS.infoLight }}>
                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                            <Text style={{ fontSize: 24, marginRight: SPACING[2] }}>💡</Text>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: "700",
                                        color: COLORS.info,
                                        marginBottom: 4,
                                    }}
                                >
                                    How to Improve
                                </Text>
                                <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, lineHeight: 20 }}>
                                    Focus on understanding concepts rather than memorizing. Review explanations for wrong answers and practice similar questions.
                                </Text>
                            </View>
                        </View>
                    </Card>
                )}

                {/* Actions */}
                <View style={{ gap: SPACING[3] }}>
                    <Button
                        title="📝 Review Answers"
                        variant="outline"
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
                        title="🔄 Take Another Test"
                        onPress={() => router.back()}
                    />
                    <Button
                        title="🏠 Back to Home"
                        variant="secondary"
                        onPress={() => router.replace("/(tabs)" as any)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ScoreCircle({
    value,
    label,
    color,
    suffix,
}: {
    value: number;
    label: string;
    color: string;
    suffix: string;
}) {
    return (
        <View style={{ alignItems: "center" }}>
            <View
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    borderWidth: 4,
                    borderColor: color,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: SPACING[2],
                }}
            >
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize["2xl"],
                        fontWeight: "800",
                        color: color,
                    }}
                >
                    {value}{suffix}
                </Text>
            </View>
            <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>
                {label}
            </Text>
        </View>
    );
}
