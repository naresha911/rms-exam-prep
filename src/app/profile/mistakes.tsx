// Mistakes Screen - Review incorrectly answered questions
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAppStore } from "../../store/useAppStore";
import { fetchMistakes } from "../../lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";
import { LatexText } from "../../components/questions/LatexText";
import type { AttemptAnswer, QuestionOption, PracticeQuestion } from "../../types";

interface MistakeItem extends AttemptAnswer {
    questions: PracticeQuestion;
}

export default function MistakesScreen() {
    const router = useRouter();
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

    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case "easy": return COLORS.easy;
            case "medium": return COLORS.medium;
            case "hard": return COLORS.hard;
            default: return COLORS.textSecondary;
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

        return (
            <Card style={{ marginBottom: SPACING[3] }}>
                {/* Subject & Difficulty Tag */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING[2] }}>
                    <View
                        style={{
                            paddingHorizontal: SPACING[2],
                            paddingVertical: 4,
                            backgroundColor: COLORS.primaryLight + "30",
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.xs,
                                color: COLORS.primary,
                                fontWeight: "600",
                            }}
                        >
                            {getSubjectName(question.subject_id)}
                        </Text>
                    </View>
                    <View
                        style={{
                            paddingHorizontal: SPACING[2],
                            paddingVertical: 4,
                            backgroundColor: getDifficultyColor(question.difficulty) + "20",
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.xs,
                                color: getDifficultyColor(question.difficulty),
                                fontWeight: "600",
                                textTransform: "capitalize",
                            }}
                        >
                            {question.difficulty}
                        </Text>
                    </View>
                </View>

                {/* Question */}
                <LatexText
                    content={questionText}
                    color={COLORS.textPrimary}
                    fontSize={TYPOGRAPHY.fontSize.base}
                    fontWeight="600"
                    containerStyle={{ marginBottom: SPACING[3] }}
                />

                {/* Your Answer vs Correct Answer */}
                <View style={{ gap: SPACING[2] }}>
                    {/* Your Answer */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: SPACING[2],
                            borderRadius: 8,
                            backgroundColor: COLORS.errorLight,
                            borderWidth: 1,
                            borderColor: COLORS.error + "40",
                        }}
                    >
                        <Text style={{ fontSize: 16, marginRight: SPACING[2] }}>❌</Text>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: COLORS.error,
                                    fontWeight: "600",
                                }}
                            >
                                Your Answer
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    color: COLORS.textSecondary,
                                    marginTop: 2,
                                }}
                            >
                                {userAnswerText}
                            </Text>
                        </View>
                    </View>

                    {/* Correct Answer */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: SPACING[2],
                            borderRadius: 8,
                            backgroundColor: COLORS.successLight,
                            borderWidth: 1,
                            borderColor: COLORS.success + "40",
                        }}
                    >
                        <Text style={{ fontSize: 16, marginRight: SPACING[2] }}>✓</Text>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: COLORS.success,
                                    fontWeight: "600",
                                }}
                            >
                                Correct Answer
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    color: COLORS.success,
                                    fontWeight: "600",
                                    marginTop: 2,
                                }}
                            >
                                {correctAnswer}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Expand for Explanation */}
                <Pressable
                    onPress={() => toggleExpand(item.id)}
                    style={{
                        marginTop: SPACING[3],
                        paddingVertical: SPACING[2],
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: TYPOGRAPHY.fontSize.sm }}>
                        {isExpanded ? "▲ Hide Explanation" : "▼ Show Explanation"}
                    </Text>
                </Pressable>

                {isExpanded && explanation && (
                    <View
                        style={{
                            padding: SPACING[3],
                            backgroundColor: COLORS.infoLight,
                            borderRadius: 8,
                            marginTop: SPACING[2],
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
                            💡 Why is this the correct answer?
                        </Text>
                    <LatexText
                        content={explanation}
                        color={COLORS.textSecondary}
                        fontSize={TYPOGRAPHY.fontSize.sm}
                        lineHeight={20}
                    />
                    </View>
                )}

                {/* Practice Again Button */}
                <Pressable
                    onPress={() => handlePracticeAgain(question)}
                    style={{
                        marginTop: SPACING[3],
                        paddingVertical: SPACING[2],
                        paddingHorizontal: SPACING[3],
                        backgroundColor: COLORS.primary,
                        borderRadius: 8,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: COLORS.textInverse, fontWeight: "700", fontSize: TYPOGRAPHY.fontSize.sm }}>
                        📝 Practice This Question Again
                    </Text>
                </Pressable>
            </Card>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
                <LoadingSpinner message="Loading mistakes..." />
            </SafeAreaView>
        );
    }

    // Group mistakes by subject
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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: SPACING[4],
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.cardBorder,
                }}
            >
                <Pressable onPress={() => router.back()} style={{ padding: SPACING[2] }}>
                    <Text style={{ fontSize: 24 }}>←</Text>
                </Pressable>
                <Text
                    style={{
                        flex: 1,
                        fontSize: TYPOGRAPHY.fontSize.xl,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        textAlign: "center",
                        marginRight: 40,
                    }}
                >
                    ❌ My Mistakes
                </Text>
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
                    contentContainerStyle={{ padding: SPACING[4] }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={{ marginBottom: SPACING[3] }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.base,
                                    color: COLORS.textSecondary,
                                }}
                            >
                                Review questions you answered incorrectly. Understanding your mistakes helps you improve!
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: SPACING[3],
                                    marginTop: SPACING[3],
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        padding: SPACING[3],
                                        backgroundColor: COLORS.errorLight,
                                        borderRadius: 8,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                                            fontWeight: "800",
                                            color: COLORS.error,
                                        }}
                                    >
                                        {mistakes.length}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.xs,
                                            color: COLORS.textSecondary,
                                        }}
                                    >
                                        Total Mistakes
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        padding: SPACING[3],
                                        backgroundColor: COLORS.backgroundSecondary,
                                        borderRadius: 8,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                                            fontWeight: "800",
                                            color: COLORS.textPrimary,
                                        }}
                                    >
                                        {Object.keys(mistakesBySubject).length}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.xs,
                                            color: COLORS.textSecondary,
                                        }}
                                    >
                                        Subjects
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}
