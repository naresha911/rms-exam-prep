// Practice Session — Stitch-aligned MCQ practice screen.
// Sticky header, progress bar, QuestionRenderer (practice mode), inline feedback, sticky CTA.
import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { GradientProgressBar } from "../../components/shared/GradientProgressBar";
import { EmptyState } from "../../components/ui/EmptyState";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { QuestionRenderer, QuestionAssist } from "../../components/questions";
import { fetchPracticeQuestions, toggleBookmark, reportQuestion } from "../../lib/supabase";
import { PracticeQuestion } from "../../types";
import { useAppStore, isAutoShowSolution } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, XP_REWARDS, SUBJECTS, getStandardIdFallback } from "../../constants";
import { trackEvent, trackPracticeCompletion, EVENTS } from "../../lib/analytics";

export default function PracticeSessionScreen() {
    const router = useRouter();
    const { subjectId, topicId, count } = useLocalSearchParams<{
        subjectId: string;
        topicId?: string;
        count: string;
    }>();
    const { user, addXP, updateDailyProgress, updateStreak, checkDailyGoal, unlockBadge, setLastPracticeActivity, preferences } = useAppStore();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [sessionStartTime] = useState(Date.now());
    const [isBookmarked, setIsBookmarked] = useState(false);

    const questionCount = parseInt(count || "10", 10);
    const subjectIdNum = parseInt(subjectId || "0", 10);
    const topicIdNum = topicId ? parseInt(topicId, 10) : undefined;

    // Get subject name for header
    const allSubjects = [...SUBJECTS.class5, ...SUBJECTS.class8];
    const subject = allSubjects.find((s) => s.id === subjectIdNum);
    const subjectName = subject?.name || "Practice";

    useEffect(() => {
        loadQuestions();
        trackEvent(EVENTS.PRACTICE_STARTED, { subjectId: subjectIdNum, topicId: topicIdNum ?? null, count: questionCount });
    }, []);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const { data, error } = await fetchPracticeQuestions(
                subjectIdNum,
                topicIdNum,
                getStandardIdFallback(user?.target_class),
                undefined,
                questionCount
            );

            if (error) {
                Alert.alert("Error", "Failed to load questions. Please try again.");
                return;
            }

            if (data && data.length > 0) {
                const transformedQuestions: PracticeQuestion[] = data.map((q: any) => ({
                    ...q,
                    question_text: q.question_translations?.[0]?.question_text || "",
                    hint: q.question_translations?.[0]?.hint || null,
                    explanation: q.question_translations?.[0]?.explanation || "",
                    explanation_diagram_path: q.question_translations?.[0]?.explanation_diagram_path || null,
                    options: (q.question_options || []).map((opt: any) => ({
                        ...opt,
                        option_text: opt.option_translations?.[0]?.option_text || "",
                    })),
                }));
                setQuestions(transformedQuestions);
            } else {
                setQuestions([]);
            }
        } catch (e: any) {
            console.error("Error loading questions:", e);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const progress = (currentIndex + 1) / questions.length;

    const handleSelectOption = (optionKey: string) => {
        if (showFeedback) return;
        setSelectedOption(optionKey);
    };

    const handleSubmit = () => {
        if (!selectedOption) {
            Alert.alert("Select an answer", "Please select an option to continue.");
            return;
        }

        const correctOption = currentQuestion.options.find((opt) => opt.is_correct);
        const correct = correctOption && selectedOption === correctOption.option_key;

        setIsCorrect(correct || false);
        setShowFeedback(true);

        if (correct) {
            setCorrectCount((c) => c + 1);
            addXP(XP_REWARDS.correctAnswer);
        }

        updateDailyProgress(1, correct || false);
        updateStreak();
        trackEvent(EVENTS.QUESTION_ANSWERED, { subjectId: subjectIdNum, isCorrect: correct ?? false, questionIndex: currentIndex });

        if (correct) {
            unlockBadge("first_question");
        }
    };

    const handleToggleBookmark = async () => {
        if (!user?.id || !currentQuestion) return;
        const { error } = await toggleBookmark(user.id, currentQuestion.id);
        if (!error) {
            setIsBookmarked((prev) => !prev);
        }
    };

    const handleReport = () => {
        if (!currentQuestion) return;
        Alert.alert(
            'Report Question',
            'Why are you reporting this question?',
            [
                { text: 'Wrong answer', onPress: () => submitReport('wrong_answer') },
                { text: 'Typo', onPress: () => submitReport('typo') },
                { text: 'Bad image', onPress: () => submitReport('bad_image') },
                { text: 'Duplicate', onPress: () => submitReport('duplicate') },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const submitReport = async (reason: string) => {
        if (!user?.id || !currentQuestion) return;
        const { error } = await reportQuestion(currentQuestion.id, user.id, reason);
        if (!error) {
            Alert.alert('Thank you', 'Your report has been submitted.');
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            handleFinish();
        } else {
            setCurrentIndex((i) => i + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setIsCorrect(false);
        }
    };

    const handleFinish = () => {
        if (checkDailyGoal()) {
            addXP(XP_REWARDS.dailyGoalComplete);
            unlockBadge("daily_goal_complete");
        }

        const subject = allSubjects.find((s) => s.id === subjectIdNum);
        setLastPracticeActivity({
            subjectId: subjectIdNum,
            subjectName: subject?.name || "Practice",
            topicId: topicIdNum || null,
            topicName: subject?.name || "Practice",
            progress: Math.round((correctCount / questions.length) * 100),
        });
        trackPracticeCompletion(subjectIdNum, correctCount, questions.length, correctCount * XP_REWARDS.correctAnswer);

        router.replace({
            pathname: "/practice/result",
            params: {
                correct: correctCount.toString(),
                total: questions.length.toString(),
                time: Math.floor((Date.now() - sessionStartTime) / 1000).toString(),
            },
        });
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="Loading questions..." />;
    }

    if (questions.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        title: "Practice",
                        headerStyle: { backgroundColor: COLORS.background },
                        headerShadowVisible: false,
                    }}
                />
                <EmptyState
                    title="No questions found"
                    description="Looks like this topic doesn't have any questions yet. Why not try a different topic and keep up the great work!"
                    mascot="encouraging"
                    actionLabel="Go Back"
                    onAction={() => router.back()}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Stitch-style sticky header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
                    accessibilityLabel="Exit practice"
                >
                    <MaterialIcon name="close" size={24} color={COLORS.onSurface} />
                </Pressable>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    {subjectName}
                </Text>

                <View style={styles.headerActions}>
                    <Pressable
                        onPress={handleToggleBookmark}
                        style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
                        accessibilityLabel={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                    >
                        <MaterialIcon
                            name={isBookmarked ? "bookmark" : "bookmark_border"}
                            size={22}
                            color={isBookmarked ? COLORS.primary : COLORS.onSurfaceVariant}
                        />
                    </Pressable>
                    <Pressable
                        onPress={handleReport}
                        style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
                        accessibilityLabel="Report issue"
                    >
                        <MaterialIcon name="flag" size={22} color={COLORS.onSurfaceVariant} />
                    </Pressable>
                </View>
            </View>

            {/* Main scrollable content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Progress section */}
                <View style={styles.progressSection}>
                    <View style={styles.progressRow}>
                        <Text style={styles.questionCount}>
                            Question {currentIndex + 1} of {questions.length}
                        </Text>
                    </View>
                    <GradientProgressBar progress={progress} height={8} style={styles.progressBar} />
                </View>

                {/* Question presentation — shared variants via QuestionRenderer */}
                <View style={styles.optionsContainer}>
                    <QuestionRenderer
                        question={currentQuestion}
                        mode="practice"
                        selectionMode="option_key"
                        selectedValue={selectedOption}
                        revealed={showFeedback}
                        onSelect={handleSelectOption}
                        questionNumber={currentIndex + 1}
                        showBookmark={false}
                        showFooter={false}
                        debugSource="PracticeSession"
                    />
                </View>

                <QuestionAssist
                    key={currentQuestion.id}
                    hint={currentQuestion.hint}
                    solution={currentQuestion.explanation}
                    solutionDiagramUri={currentQuestion.explanation_diagram_path}
                    answered={showFeedback}
                    revealed={showFeedback}
                    isCorrect={isCorrect}
                    correctOptionLabel={currentQuestion.options.find((opt) => opt.is_correct)?.option_key?.toUpperCase()}
                    autoShowSolution={isAutoShowSolution(preferences)}
                />

                {/* Bottom padding for sticky CTA */}
                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Stitch-style sticky bottom CTA */}
            <View style={styles.ctaBar}>
                {showFeedback ? (
                    <Button
                        title={isLastQuestion ? "See Results" : "Next Question"}
                        onPress={handleNext}
                        fullWidth
                        size="lg"
                        iconRight="arrow_forward"
                    />
                ) : (
                    <Button
                        title="Check Answer"
                        onPress={handleSubmit}
                        fullWidth
                        size="lg"
                        disabled={!selectedOption}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SPACING[4],
        height: 56,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outlineVariant,
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    headerBtnPressed: {
        backgroundColor: COLORS.surfaceVariant,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        fontWeight: "700",
        marginHorizontal: SPACING[2],
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[1],
    },
    scrollContent: {
        padding: SPACING[4],
        paddingBottom: SPACING[4],
    },
    progressSection: {
        marginBottom: SPACING[5],
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING[2],
    },
    questionCount: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        fontWeight: "600",
    },
    progressBar: {
        borderRadius: BORDER_RADIUS.full,
        overflow: "hidden",
    },
    optionsContainer: {
        gap: SPACING[3],
        marginBottom: SPACING[4],
    },
    bottomPadding: {
        height: SPACING[6],
    },
    ctaBar: {
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[4],
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
    },
});
