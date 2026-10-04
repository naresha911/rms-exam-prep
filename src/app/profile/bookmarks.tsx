// Bookmarks Screen - Shows all bookmarked questions
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAppStore } from "../../store/useAppStore";
import { fetchBookmarks, toggleBookmark } from "../../lib/supabase";
import { SPACING, TYPOGRAPHY } from "../../constants";
import { LatexText } from "../../components/questions/LatexText";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
import type { PracticeQuestion, QuestionOption } from "../../types";

interface BookmarkItem {
    id: string;
    question_id: string;
    created_at: string;
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
        count: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            marginBottom: SPACING[3],
        },
        card: {
            marginBottom: SPACING[3],
        },
        question: {
            marginBottom: SPACING[3],
        },
        options: {
            gap: SPACING[2],
        },
        option: {
            padding: SPACING[2],
            borderRadius: 8,
        },
        optionCorrect: {
            backgroundColor: colors.successLight,
        },
        optionDefault: {
            backgroundColor: colors.backgroundSecondary,
        },
        optionKey: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: "600" as const,
            marginRight: SPACING[2],
            width: 24,
        },
        optionKeyCorrect: {
            color: colors.success,
        },
        optionKeyDefault: {
            color: colors.textSecondary,
        },
        optionText: {
            flex: 1,
        },
        check: {
            fontSize: 16,
        },
        explanation: {
            marginTop: SPACING[3],
            padding: SPACING[3],
            backgroundColor: colors.infoLight,
            borderRadius: 8,
        },
        solutionLabel: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.info,
            fontWeight: "600" as const,
            marginBottom: 4,
        },
        actions: {
            gap: SPACING[2],
            marginTop: SPACING[3],
        },
        removeButton: {
            flex: 1,
            paddingVertical: SPACING[2],
            paddingHorizontal: SPACING[3],
            backgroundColor: colors.errorLight,
            borderRadius: 8,
        },
        removeLabel: {
            color: colors.error,
            fontWeight: "600" as const,
            fontSize: TYPOGRAPHY.fontSize.sm,
        },
        practiceButton: {
            flex: 1,
            paddingVertical: SPACING[2],
            paddingHorizontal: SPACING[3],
            backgroundColor: colors.primary,
            borderRadius: 8,
        },
        practiceLabel: {
            color: colors.textInverse,
            fontWeight: "600" as const,
            fontSize: TYPOGRAPHY.fontSize.sm,
        },
        date: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textTertiary,
            textAlign: "center" as const,
            marginTop: SPACING[2],
        },
    };
}

export default function BookmarksScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
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

        return (
            <Card style={styles.card}>
                <LatexText
                    content={questionText}
                    color={colors.textPrimary}
                    fontSize={TYPOGRAPHY.fontSize.base}
                    fontWeight="600"
                    containerStyle={styles.question}
                />

                <View style={styles.options}>
                    {options.slice(0, 4).map((option, index) => {
                        const optionText = (option as any).option_translations?.option_text || option.option_key;
                        const isCorrect = option.is_correct;

                        return (
                            <View
                                key={option.id || index}
                                style={[layout.row, styles.option, isCorrect ? styles.optionCorrect : styles.optionDefault]}
                            >
                                <Text style={[styles.optionKey, isCorrect ? styles.optionKeyCorrect : styles.optionKeyDefault]}>
                                    {String.fromCharCode(65 + index)}.
                                </Text>
                                <LatexText
                                    content={optionText}
                                    color={isCorrect ? colors.success : colors.textSecondary}
                                    fontSize={TYPOGRAPHY.fontSize.sm}
                                    containerStyle={styles.optionText}
                                />
                                {isCorrect ? <Text style={styles.check}>✓</Text> : null}
                            </View>
                        );
                    })}
                </View>

                {explanation ? (
                    <View style={styles.explanation}>
                        <Text style={styles.solutionLabel}>💡 Solution</Text>
                        <LatexText
                            content={explanation}
                            color={colors.textSecondary}
                            fontSize={TYPOGRAPHY.fontSize.sm}
                            lineHeight={20}
                        />
                    </View>
                ) : null}

                <View style={[layout.row, styles.actions]}>
                    <Pressable
                        onPress={() => handleRemoveBookmark(item.question_id)}
                        style={({ pressed }) => [layout.center, styles.removeButton, pressed ? layout.pressed : null]}
                    >
                        <Text style={styles.removeLabel}>
                            {removingId === item.question_id ? "Removing..." : "🗑️ Remove"}
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => handlePracticeQuestion(question)}
                        style={({ pressed }) => [layout.center, styles.practiceButton, pressed ? layout.pressed : null]}
                    >
                        <Text style={styles.practiceLabel}>📝 Practice</Text>
                    </Pressable>
                </View>

                <Text style={styles.date}>
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
            <SafeAreaView style={[layout.fill, styles.screen]}>
                <LoadingSpinner message="Loading bookmarks..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[layout.fill, styles.screen]}>
            <View style={[layout.row, styles.header]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backButton, pressed ? layout.pressed : null]}
                >
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>🔖 Bookmarks</Text>
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
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text style={styles.count}>
                            {bookmarks.length} bookmarked question{bookmarks.length !== 1 ? "s" : ""}
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}
