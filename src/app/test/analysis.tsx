// Test Analysis Screen - Per-question breakdown after test
import { ScrollView, Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { SPACING, TYPOGRAPHY } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
import { LatexText } from "../../components/questions/LatexText";

interface QuestionResult {
    index: number;
    questionText: string;
    isCorrect: boolean;
    selectedAnswer?: string;
    correctAnswer: string;
    explanation?: string;
}

type StatTone = "correct" | "wrong" | "accuracy";

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scroll: { padding: SPACING[5] },
        header: {
            alignItems: "center" as const,
            marginBottom: SPACING[5],
        },
        title: {
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            color: colors.textPrimary,
            marginTop: SPACING[2],
            textAlign: "center" as const,
        },
        subtitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
            marginTop: SPACING[1],
        },
        summaryRow: {
            gap: SPACING[3],
            marginBottom: SPACING[5],
        },
        reviewTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.textPrimary,
            marginBottom: SPACING[3],
        },
        questionCardCorrect: {
            marginBottom: SPACING[3],
            borderLeftWidth: 4,
            borderLeftColor: colors.success,
        },
        questionCardIncorrect: {
            marginBottom: SPACING[3],
            borderLeftWidth: 4,
            borderLeftColor: colors.error,
        },
        questionHead: {
            marginBottom: SPACING[2],
        },
        statusRow: {
            gap: SPACING[2],
        },
        badge: {
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
        badgeSuccess: { backgroundColor: colors.success },
        badgeError: { backgroundColor: colors.error },
        badgeText: {
            color: colors.onPrimary,
            fontSize: 12,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
        },
        statusSuccess: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.success,
        },
        statusError: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.error,
        },
        stem: { marginBottom: SPACING[2] },
        answerStack: { gap: SPACING[1] },
        answerRow: {
            padding: SPACING[2],
            borderRadius: 8,
        },
        answerSuccess: { backgroundColor: colors.successLight },
        answerError: { backgroundColor: colors.errorLight },
        answerEmoji: { fontSize: 12, marginRight: SPACING[2] },
        answerText: {
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
        },
        answerTextSuccess: { color: colors.success },
        answerTextError: { color: colors.error },
        explanation: {
            marginTop: SPACING[2],
            padding: SPACING[3],
            backgroundColor: colors.infoLight,
            borderRadius: 8,
        },
        explanationTitle: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.info,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            marginBottom: 4,
        },
        emptyCard: {
            alignItems: "center" as const,
            padding: SPACING[6],
        },
        emptyEmoji: { fontSize: 48, marginBottom: SPACING[3] },
        emptyTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.textPrimary,
            textAlign: "center" as const,
            marginBottom: SPACING[2],
        },
        emptyBody: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
            textAlign: "center" as const,
            lineHeight: 20,
        },
        actions: {
            gap: SPACING[3],
            marginTop: SPACING[4],
        },
        statBox: {
            flex: 1,
            padding: SPACING[3],
            borderRadius: 12,
            alignItems: "center" as const,
        },
        statCorrect: { backgroundColor: colors.successLight },
        statWrong: { backgroundColor: colors.errorLight },
        statAccuracy: { backgroundColor: colors.primaryFixed },
        statEmoji: { fontSize: 18 },
        statValue: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            marginTop: 4,
        },
        statValueCorrect: { color: colors.success },
        statValueWrong: { color: colors.error },
        statValueAccuracy: { color: colors.primary },
        statLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
            marginTop: 2,
        },
    };
}

const STAT_BOX = {
    correct: "statCorrect",
    wrong: "statWrong",
    accuracy: "statAccuracy",
} as const;

const STAT_VALUE = {
    correct: "statValueCorrect",
    wrong: "statValueWrong",
    accuracy: "statValueAccuracy",
} as const;

function StatBox({
    label,
    value,
    tone,
    emoji,
}: {
    label: string;
    value: string;
    tone: StatTone;
    emoji: string;
}) {
    const styles = useThemedStyles(createStyles);

    return (
        <View style={[styles.statBox, styles[STAT_BOX[tone]]]}>
            <Text style={styles.statEmoji}>{emoji}</Text>
            <Text style={[styles.statValue, styles[STAT_VALUE[tone]]]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

export default function TestAnalysisScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

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
    const wrongCount = (total - correct - Math.max(unanswered, 0)).toString();

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <MascotDisplay
                        expression={percentage >= 60 ? "celebrating" : "encouraging"}
                        size={100}
                    />
                    <Text style={styles.title}>Test Analysis</Text>
                    <Text style={styles.subtitle}>Review your answers</Text>
                </View>

                <View style={[layout.row, styles.summaryRow]}>
                    <StatBox label="Correct" value={correct.toString()} tone="correct" emoji="✅" />
                    <StatBox label="Wrong" value={wrongCount} tone="wrong" emoji="❌" />
                    <StatBox label="Accuracy" value={`${percentage}%`} tone="accuracy" emoji="🎯" />
                </View>

                {questionResults.length > 0 ? (
                    <>
                        <Text style={styles.reviewTitle}>Question-by-Question Review</Text>
                        {questionResults.map((q) => (
                            <Card
                                key={q.index}
                                variant="elevated"
                                style={q.isCorrect ? styles.questionCardCorrect : styles.questionCardIncorrect}
                            >
                                <View style={[layout.rowBetween, styles.questionHead]}>
                                    <View style={[layout.row, styles.statusRow]}>
                                        <View style={[layout.center, styles.badge, q.isCorrect ? styles.badgeSuccess : styles.badgeError]}>
                                            <Text style={styles.badgeText}>{q.index + 1}</Text>
                                        </View>
                                        <Text style={q.isCorrect ? styles.statusSuccess : styles.statusError}>
                                            {q.isCorrect ? "Correct ✓" : "Incorrect ✗"}
                                        </Text>
                                    </View>
                                </View>

                                <LatexText
                                    content={q.questionText}
                                    color={colors.textPrimary}
                                    fontSize={TYPOGRAPHY.fontSize.base}
                                    fontWeight="600"
                                    lineHeight={22}
                                    containerStyle={styles.stem}
                                />

                                {q.selectedAnswer ? (
                                    <View style={styles.answerStack}>
                                        <View
                                            style={[
                                                layout.row,
                                                styles.answerRow,
                                                q.isCorrect ? styles.answerSuccess : styles.answerError,
                                            ]}
                                        >
                                            <Text style={styles.answerEmoji}>{q.isCorrect ? "✅" : "❌"}</Text>
                                            <Text
                                                style={[styles.answerText, q.isCorrect ? styles.answerTextSuccess : styles.answerTextError]}
                                                numberOfLines={2}
                                            >
                                                Your answer: {q.selectedAnswer}
                                            </Text>
                                        </View>
                                        {!q.isCorrect ? (
                                            <View style={[layout.row, styles.answerRow, styles.answerSuccess]}>
                                                <Text style={styles.answerEmoji}>✓</Text>
                                                <Text style={[styles.answerText, styles.answerTextSuccess]} numberOfLines={2}>
                                                    Correct: {q.correctAnswer}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </View>
                                ) : null}

                                {q.explanation && !q.isCorrect ? (
                                    <View style={styles.explanation}>
                                        <Text style={styles.explanationTitle}>💡 Solution</Text>
                                        <LatexText
                                            content={q.explanation}
                                            color={colors.textSecondary}
                                            fontSize={TYPOGRAPHY.fontSize.sm}
                                            lineHeight={20}
                                        />
                                    </View>
                                ) : null}
                            </Card>
                        ))}
                    </>
                ) : (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyEmoji}>📋</Text>
                        <Text style={styles.emptyTitle}>Detailed breakdown not available</Text>
                        <Text style={styles.emptyBody}>
                            Your score was {correct}/{total} ({percentage}%). Take more tests to see detailed analysis of each question.
                        </Text>
                    </Card>
                )}

                <View style={styles.actions}>
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
