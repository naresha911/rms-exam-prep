// Bookmarks Screen - Shows all bookmarked questions
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { fetchBookmarks, toggleBookmark } from "../../lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";
import { LatexText } from "../../components/questions/LatexText";
import type { PracticeQuestion, QuestionOption } from "../../types";

interface BookmarkItem {
    id: string;
    question_id: string;
    created_at: string;
    questions: PracticeQuestion;
}

export default function BookmarksScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const loadBookmarks = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        const { data, error } = await fetchBookmarks(user.id);

        if (!error && data) {
            setBookmarks(data as BookmarkItem[]);
        }
        setLoading(false);
    }, [user?.id]);

    useEffect(() => {
        loadBookmarks();
    }, [loadBookmarks]);

    const handleRemoveBookmark = async (questionId: string) => {
        if (!user?.id) return;

        setRemovingId(questionId);
        const { error } = await toggleBookmark(user.id, questionId);

        if (!error) {
            setBookmarks(prev => prev.filter(b => b.question_id !== questionId));
        } else {
            Alert.alert("Error", "Failed to remove bookmark");
        }
        setRemovingId(null);
    };

    const handlePracticeQuestion = (question: PracticeQuestion) => {
        router.push({
            pathname: "/practice/session",
            params: {
                subjectId: question.subject_id.toString(),
                topicId: question.topic_id.toString(),
                count: "1"
            }
        });
    };

    const renderBookmarkItem = ({ item }: { item: BookmarkItem }) => {
        const question = item.questions;
        const questionText = (question as any).question_translations?.question_text || "Question text not available";
        const explanation = (question as any).question_translations?.explanation;
        const options: QuestionOption[] = (question as any).question_options || [];
        const correctOption = options.find(o => o.is_correct);
        const correctAnswer = correctOption
            ? (correctOption as any).option_translations?.option_text || correctOption.option_key
            : "Answer not available";

        return (
            <Card style={{ marginBottom: SPACING[3] }}>
                {/* Question */}
                <LatexText
                    content={questionText}
                    color={COLORS.textPrimary}
                    fontSize={TYPOGRAPHY.fontSize.base}
                    fontWeight="600"
                    containerStyle={{ marginBottom: SPACING[3] }}
                />

                {/* Options */}
                <View style={{ gap: SPACING[2] }}>
                    {options.slice(0, 4).map((option, index) => {
                        const optionText = (option as any).option_translations?.option_text || option.option_key;
                        const isCorrect = option.is_correct;

                        return (
                            <View
                                key={option.id || index}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: SPACING[2],
                                    borderRadius: 8,
                                    backgroundColor: isCorrect ? COLORS.successLight : COLORS.backgroundSecondary,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        fontWeight: "600",
                                        color: isCorrect ? COLORS.success : COLORS.textSecondary,
                                        marginRight: SPACING[2],
                                        width: 24,
                                    }}
                                >
                                    {String.fromCharCode(65 + index)}.
                                </Text>
                                <LatexText
                                    content={optionText}
                                    color={isCorrect ? COLORS.success : COLORS.textSecondary}
                                    fontSize={TYPOGRAPHY.fontSize.sm}
                                    containerStyle={{ flex: 1 }}
                                />
                                {isCorrect && <Text style={{ fontSize: 16 }}>✓</Text>}
                            </View>
                        );
                    })}
                </View>

                {/* Explanation */}
                {explanation && (
                    <View
                        style={{
                            marginTop: SPACING[3],
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
                        content={explanation}
                        color={COLORS.textSecondary}
                        fontSize={TYPOGRAPHY.fontSize.sm}
                        lineHeight={20}
                    />
                    </View>
                )}

                {/* Actions */}
                <View style={{ flexDirection: "row", gap: SPACING[2], marginTop: SPACING[3] }}>
                    <Pressable
                        onPress={() => handleRemoveBookmark(item.question_id)}
                        style={{
                            flex: 1,
                            paddingVertical: SPACING[2],
                            paddingHorizontal: SPACING[3],
                            backgroundColor: COLORS.errorLight,
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: COLORS.error, fontWeight: "600", fontSize: TYPOGRAPHY.fontSize.sm }}>
                            {removingId === item.question_id ? "Removing..." : "🗑️ Remove"}
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => handlePracticeQuestion(question)}
                        style={{
                            flex: 1,
                            paddingVertical: SPACING[2],
                            paddingHorizontal: SPACING[3],
                            backgroundColor: COLORS.primary,
                            borderRadius: 8,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: COLORS.textInverse, fontWeight: "600", fontSize: TYPOGRAPHY.fontSize.sm }}>
                            📝 Practice
                        </Text>
                    </Pressable>
                </View>

                {/* Date */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        color: COLORS.textTertiary,
                        textAlign: "center",
                        marginTop: SPACING[2],
                    }}
                >
                    Bookmarked on {new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    })}
                </Text>
            </Card>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
                <LoadingSpinner message="Loading bookmarks..." />
            </SafeAreaView>
        );
    }

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
                    🔖 Bookmarks
                </Text>
            </View>

            {bookmarks.length === 0 ? (
                <EmptyState
                    title="No Bookmarks Yet"
                    description="Bookmark questions while practicing to review them later. Tap the 🔖 icon on any question to save it."
                    mascot="thinking"
                />
            ) : (
                <FlatList
                    data={bookmarks}
                    renderItem={renderBookmarkItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: SPACING[4] }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.textSecondary,
                                marginBottom: SPACING[3],
                            }}
                        >
                            {bookmarks.length} bookmarked question{bookmarks.length !== 1 ? "s" : ""}
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}
