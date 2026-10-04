// Mistakes Screen - Review incorrectly answered questions
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAppStore } from "../../store/useAppStore";
import { fetchMistakes } from "../../lib/supabase";
import { SPACING, TYPOGRAPHY } from "../../constants";
import { LatexText } from "../../components/questions/LatexText";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
import type { AttemptAnswer, QuestionOption, PracticeQuestion } from "../../types";

interface MistakeItem extends AttemptAnswer {
    questions: PracticeQuestion;
}

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            backgroundColor: colors.background,
        },
        header: {
            padding: SPACING[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
        },
        backButton: {
            padding: SPACING[2],
        },
        backIcon: {
            fontSize: 24,
            color: colors.textPrimary,
        },
        headerTitle: {
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: "700" as const,
            color: colors.textPrimary,
            textAlign: "center" as const,
            marginRight: 40,
        },
        listContent: {
            padding: SPACING[4],
        },
        headerBlock: {
            marginBottom: SPACING[3],
        },
        intro: {
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.textSecondary,
        },
        summaryRow: {
            gap: SPACING[3],
            marginTop: SPACING[3],
        },
        summaryCard: {
            flex: 1,
            padding: SPACING[3],
            borderRadius: 8,
        },
        summaryError: {
            backgroundColor: colors.errorLight,
        },
        summaryNeutral: {
            backgroundColor: colors.backgroundSecondary,
        },
        summaryValue: {
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: "800" as const,
        },
        summaryValueError: {
            color: colors.error,
        },
        summaryValueNeutral: {
            color: colors.textPrimary,
        },
        summaryLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
        },
        card: {
            marginBottom: SPACING[3],
        },
        tagRow: {
            marginBottom: SPACING[2],
        },
        tag: {
            paddingHorizontal: SPACING[2],
            paddingVertical: 4,
            borderRadius: 4,
        },
        subjectTag: {
            backgroundColor: colors.primaryLight + "30",
        },
        tagText: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: "600" as const,
            textTransform: "capitalize" as const,
        },
        subjectTagText: {
            color: colors.primary,
        },
        badgeEasy: {
            backgroundColor: colors.easy + "20",
        },
        badgeMedium: {
            backgroundColor: colors.medium + "20",
        },
        badgeHard: {
            backgroundColor: colors.hard + "20",
        },
        badgeDefault: {
            backgroundColor: colors.backgroundSecondary,
        },
        diffEasy: {
            color: colors.easy,
        },
        diffMedium: {
            color: colors.medium,
        },
        diffHard: {
            color: colors.hard,
        },
        diffDefault: {
            color: colors.textSecondary,
        },
        question: {
            marginBottom: SPACING[3],
        },
        answers: {
            gap: SPACING[2],
        },
        answerBox: {
            padding: SPACING[2],
            borderRadius: 8,
            borderWidth: 1,
        },
        wrongBox: {
            backgroundColor: colors.errorLight,
            borderColor: colors.error + "40",
        },
        rightBox: {
            backgroundColor: colors.successLight,
            borderColor: colors.success + "40",
        },
        answerEmoji: {
            fontSize: 16,
            marginRight: SPACING[2],
        },
        answerBody: {
            flex: 1,
        },
        answerCaption: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: "600" as const,
        },
        wrongCaption: {
            color: colors.error,
        },
        rightCaption: {
            color: colors.success,
        },
        wrongAnswer: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 2,
        },
        rightAnswer: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.success,
            fontWeight: "600" as const,
            marginTop: 2,
        },
        expandButton: {
            marginTop: SPACING[3],
            paddingVertical: SPACING[2],
        },
        expandLabel: {
            color: colors.primary,
            fontWeight: "600" as const,
            fontSize: TYPOGRAPHY.fontSize.sm,
        },
        explanation: {
            padding: SPACING[3],
            backgroundColor: colors.infoLight,
            borderRadius: 8,
            marginTop: SPACING[2],
        },
        explanationTitle: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.info,
            fontWeight: "600" as const,
            marginBottom: 4,
        },
        practiceButton: {
            marginTop: SPACING[3],
            paddingVertical: SPACING[2],
            paddingHorizontal: SPACING[3],
            backgroundColor: colors.primary,
            borderRadius: 8,
        },
        practiceLabel: {
            color: colors.textInverse,
            fontWeight: "700" as const,
            fontSize: TYPOGRAPHY.fontSize.sm,
        },
    };
}

export default function MistakesScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { user } = useAppStore();
    const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadMistakes = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        const { data, error } = await fetchMistakes(user.id);

        if (!error && data) {
            setMistakes(data as MistakeItem[]);
        }
        setLoading(false);
    }, [user?.id]);

    useEffect(() => {
        loadMistakes();
    }, [loadMistakes]);

    const handlePracticeAgain = (question: PracticeQuestion) => {
        router.push({
            pathname: "/practice/session",
            params: {
                subjectId: question.subject_id.toString(),
                topicId: question.topic_id.toString(),
                count: "1"
            }
        });
    };

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const getSubjectName = (subjectId: number): string => {
        const subjectNames: Record<number, string> = {
            1: "Mathematics",
            2: "Language",
            3: "Intelligence",
            4: "General Knowledge",
            5: "English",
            6: "General Science",
            7: "Social Science",
        };
        return subjectNames[subjectId] || "Unknown";
    };

    const difficultyTone = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return { badge: styles.badgeEasy, text: styles.diffEasy };
            case "medium":
                return { badge: styles.badgeMedium, text: styles.diffMedium };
            case "hard":
                return { badge: styles.badgeHard, text: styles.diffHard };
            default:
                return { badge: styles.badgeDefault, text: styles.diffDefault };
        }
    };

    const renderMistakeItem = ({ item }: { item: MistakeItem }) => {
        const question = item.questions;
        const questionText = (question as any).question_translations?.question_text || "Question text not available";
        const explanation = (question as any).question_translations?.explanation;
        const options: QuestionOption[] = (question as any).question_options || [];

        const userAnswer = item.selected_options?.[0];
        const userOption = options.find(o => o.id === userAnswer);
        const correctOption = options.find(o => o.is_correct);

        const userAnswerText = userOption
            ? (userOption as any).option_translations?.option_text || userOption.option_key
            : "Not answered";
        const correctAnswer = correctOption
            ? (correctOption as any).option_translations?.option_text || correctOption.option_key
            : "Answer not available";

        const isExpanded = expandedId === item.id;
        const tone = difficultyTone(question.difficulty);

        return (
            <Card style={styles.card}>
                <View style={[layout.rowBetween, styles.tagRow]}>
                    <View style={[styles.tag, styles.subjectTag]}>
                        <Text style={[styles.tagText, styles.subjectTagText]}>
                            {getSubjectName(question.subject_id)}
                        </Text>
                    </View>
                    <View style={[styles.tag, tone.badge]}>
                        <Text style={[styles.tagText, tone.text]}>
                            {question.difficulty}
                        </Text>
                    </View>
                </View>

                <LatexText
                    content={questionText}
                    color={colors.textPrimary}
                    fontSize={TYPOGRAPHY.fontSize.base}
                    fontWeight="600"
                    containerStyle={styles.question}
                />

                <View style={styles.answers}>
                    <View style={[layout.row, styles.answerBox, styles.wrongBox]}>
                        <Text style={styles.answerEmoji}>❌</Text>
                        <View style={styles.answerBody}>
                            <Text style={[styles.answerCaption, styles.wrongCaption]}>Your Answer</Text>
                            <Text style={styles.wrongAnswer}>{userAnswerText}</Text>
                        </View>
                    </View>

                    <View style={[layout.row, styles.answerBox, styles.rightBox]}>
                        <Text style={styles.answerEmoji}>✓</Text>
                        <View style={styles.answerBody}>
                            <Text style={[styles.answerCaption, styles.rightCaption]}>Correct Answer</Text>
                            <Text style={styles.rightAnswer}>{correctAnswer}</Text>
                        </View>
                    </View>
                </View>

                <Pressable
                    onPress={() => toggleExpand(item.id)}
                    style={({ pressed }) => [layout.center, styles.expandButton, pressed ? layout.pressed : null]}
                >
                    <Text style={styles.expandLabel}>
                        {isExpanded ? "▲ Hide Explanation" : "▼ Show Explanation"}
                    </Text>
                </Pressable>

                {isExpanded && explanation ? (
                    <View style={styles.explanation}>
                        <Text style={styles.explanationTitle}>💡 Why is this the correct answer?</Text>
                        <LatexText
                            content={explanation}
                            color={colors.textSecondary}
                            fontSize={TYPOGRAPHY.fontSize.sm}
                            lineHeight={20}
                        />
                    </View>
                ) : null}

                <Pressable
                    onPress={() => handlePracticeAgain(question)}
                    style={({ pressed }) => [layout.center, styles.practiceButton, pressed ? layout.pressed : null]}
                >
                    <Text style={styles.practiceLabel}>📝 Practice This Question Again</Text>
                </Pressable>
            </Card>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[layout.fill, styles.screen]}>
                <LoadingSpinner message="Loading mistakes..." />
            </SafeAreaView>
        );
    }

    const mistakesBySubject = mistakes.reduce((acc, mistake) => {
        const subjectId = mistake.questions.subject_id;
        const subjectName = getSubjectName(subjectId);
        if (!acc[subjectName]) {
            acc[subjectName] = [];
        }
        acc[subjectName].push(mistake);
        return acc;
    }, {} as Record<string, MistakeItem[]>);

    return (
        <SafeAreaView style={[layout.fill, styles.screen]}>
            <View style={[layout.row, styles.header]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backButton, pressed ? layout.pressed : null]}
                >
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>❌ My Mistakes</Text>
            </View>

            {mistakes.length === 0 ? (
                <EmptyState
                    title="No Mistakes Yet! 🎉"
                    description="Great job! You haven't made any mistakes yet. Keep practicing to maintain this record!"
                    mascot="celebrating"
                />
            ) : (
                <FlatList
                    data={mistakes}
                    renderItem={renderMistakeItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.headerBlock}>
                            <Text style={styles.intro}>
                                Review questions you answered incorrectly. Understanding your mistakes helps you improve!
                            </Text>
                            <View style={[layout.row, styles.summaryRow]}>
                                <View style={[layout.center, styles.summaryCard, styles.summaryError]}>
                                    <Text style={[styles.summaryValue, styles.summaryValueError]}>{mistakes.length}</Text>
                                    <Text style={styles.summaryLabel}>Total Mistakes</Text>
                                </View>
                                <View style={[layout.center, styles.summaryCard, styles.summaryNeutral]}>
                                    <Text style={[styles.summaryValue, styles.summaryValueNeutral]}>
                                        {Object.keys(mistakesBySubject).length}
                                    </Text>
                                    <Text style={styles.summaryLabel}>Subjects</Text>
                                </View>
                            </View>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
