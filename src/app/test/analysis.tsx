// Test Analysis Screen - Per-question breakdown after test
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";
import { LatexText } from "../../components/questions/LatexText";

interface QuestionResult {
    index: number;
    questionText: string;
    isCorrect: boolean;
    selectedAnswer?: string;
    correctAnswer: string;
    explanation?: string;
}

export default function TestAnalysisScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const correct = parseInt(params.correct as string) || 0;
    const total = parseInt(params.total as string) || 0;
    const timeSpent = parseInt(params.time as string) || 0;
    const testType = params.type as string;
    const questionsJson = params.questions as string;

    // Parse question results if available
    let questionResults: QuestionResult[] = [];
    try {
        if (questionsJson) {
            questionResults = JSON.parse(questionsJson);
        }
    } catch {
        questionResults = [];
    }

    const unanswered = total - correct - questionResults.filter((q) => !q.isCorrect).length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ alignItems: "center", marginBottom: SPACING[5] }}>
                    <MascotDisplay
                        expression={percentage >= 60 ? "celebrating" : "encouraging"}
                        size={100}
                    />
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            marginTop: SPACING[2],
                            textAlign: "center",
                        }}
                    >
                        Test Analysis
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            marginTop: SPACING[1],
                        }}
                    >
                        Review your answers
                    </Text>
                </View>

                {/* Summary Stats */}
                <View style={{ flexDirection: "row", gap: SPACING[3], marginBottom: SPACING[5] }}>
                    <StatBox label="Correct" value={correct.toString()} color={COLORS.success} bgColor={COLORS.successLight} emoji="✅" />
                    <StatBox label="Wrong" value={(total - correct - Math.max(unanswered, 0)).toString()} color={COLORS.error} bgColor={COLORS.errorLight} emoji="❌" />
                    <StatBox label="Accuracy" value={`${percentage}%`} color={COLORS.primary} bgColor={COLORS.primaryFixed} emoji="🎯" />
                </View>

                {/* Question Results */}
                {questionResults.length > 0 ? (
                    <>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.lg,
                                fontWeight: "700",
                                color: COLORS.textPrimary,
                                marginBottom: SPACING[3],
                            }}
                        >
                            Question-by-Question Review
                        </Text>
                        {questionResults.map((q) => (
                            <Card
                                key={q.index}
                                variant="elevated"
                                style={{
                                    marginBottom: SPACING[3],
                                    borderLeftWidth: 4,
                                    borderLeftColor: q.isCorrect ? COLORS.success : COLORS.error,
                                }}
                            >
                                {/* Question Number & Status */}
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING[2] }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: SPACING[2],
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 14,
                                                backgroundColor: q.isCorrect ? COLORS.success : COLORS.error,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                                                {q.index + 1}
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.sm,
                                                fontWeight: "700",
                                                color: q.isCorrect ? COLORS.success : COLORS.error,
                                            }}
                                        >
                                            {q.isCorrect ? "Correct ✓" : "Incorrect ✗"}
                                        </Text>
                                    </View>
                                </View>

                                {/* Question Text */}
                                <LatexText
                                    content={q.questionText}
                                    color={COLORS.textPrimary}
                                    fontSize={TYPOGRAPHY.fontSize.base}
                                    fontWeight="600"
                                    lineHeight={22}
                                    containerStyle={{ marginBottom: SPACING[2] }}
                                />

                                {/* Answers */}
                                {q.selectedAnswer && (
                                    <View style={{ gap: SPACING[1] }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                padding: SPACING[2],
                                                borderRadius: 8,
                                                backgroundColor: q.isCorrect ? COLORS.successLight : COLORS.errorLight,
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, marginRight: SPACING[2] }}>
                                                {q.isCorrect ? "✅" : "❌"}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                                    color: q.isCorrect ? COLORS.success : COLORS.error,
                                                    fontWeight: "500",
                                                }}
                                                numberOfLines={2}
                                            >
                                                Your answer: {q.selectedAnswer}
                                            </Text>
                                        </View>
                                        {!q.isCorrect && (
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    padding: SPACING[2],
                                                    borderRadius: 8,
                                                    backgroundColor: COLORS.successLight,
                                                }}
                                            >
                                                <Text style={{ fontSize: 12, marginRight: SPACING[2] }}>✓</Text>
                                                <Text
                                                    style={{
                                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                                        color: COLORS.success,
                                                        fontWeight: "500",
                                                    }}
                                                    numberOfLines={2}
                                                >
                                                    Correct: {q.correctAnswer}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Explanation */}
                                {q.explanation && !q.isCorrect && (
                                    <View
                                        style={{
                                            marginTop: SPACING[2],
                                            padding: SPACING[3],
                                            backgroundColor: COLORS.infoLight,
                                            borderRadius: 8,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.sm,
                                                color: COLORS.info,
                                                fontWeight: "600",
                                                marginBottom: 4,
                                            }}
                                        >
                                            💡 Solution
                                        </Text>
                                    <LatexText
                                        content={q.explanation}
                                        color={COLORS.textSecondary}
                                        fontSize={TYPOGRAPHY.fontSize.sm}
                                        lineHeight={20}
                                    />
                                    </View>
                                )}
                            </Card>
                        ))}
                    </>
                ) : (
                    <Card style={{ alignItems: "center", padding: SPACING[6] }}>
                        <Text style={{ fontSize: 48, marginBottom: SPACING[3] }}>📋</Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.lg,
                                fontWeight: "700",
                                color: COLORS.textPrimary,
                                textAlign: "center",
                                marginBottom: SPACING[2],
                            }}
                        >
                            Detailed breakdown not available
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.textSecondary,
                                textAlign: "center",
                                lineHeight: 20,
                            }}
                        >
                            Your score was {correct}/{total} ({percentage}%). Take more tests to see detailed analysis of each question.
                        </Text>
                    </Card>
                )}

                {/* Actions */}
                <View style={{ gap: SPACING[3], marginTop: SPACING[4] }}>
                    <Button
                        title="🔄 Take Another Test"
                        onPress={() => router.replace("/(tabs)/tests")}
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

function StatBox({
    label,
    value,
    color,
    bgColor,
    emoji,
}: {
    label: string;
    value: string;
    color: string;
    bgColor: string;
    emoji: string;
}) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: bgColor,
                padding: SPACING[3],
                borderRadius: 12,
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 18 }}>{emoji}</Text>
            <Text
                style={{
                    fontSize: TYPOGRAPHY.fontSize.lg,
                    fontWeight: "800",
                    color,
                    marginTop: 4,
                }}
            >
                {value}
            </Text>
            <Text
                style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.textSecondary,
                    marginTop: 2,
                }}
            >
                {label}
            </Text>
        </View>
    );
}
