import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { EmptyState } from "../../components/ui/EmptyState";
import { fetchPracticeQuestions, toggleBookmark, reportQuestion } from "../../lib/supabase";
import { PracticeQuestion, QuestionOption } from "../../types";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, XP_REWARDS, SUBJECTS } from "../../constants";
import { trackEvent, trackPracticeCompletion, EVENTS } from "../../lib/analytics";

export default function PracticeSessionScreen() {
    const router = useRouter();
    const { subjectId, topicId, count } = useLocalSearchParams<{
        subjectId: string;
        topicId?: string;
        count: string;
    }>();
    const { user, addXP, updateDailyProgress, updateStreak, checkDailyGoal, unlockBadge, setLastPracticeActivity } = useAppStore();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [sessionStartTime] = useState(Date.now());
    const [isBookmarked, setIsBookmarked] = useState(false);

    const questionCount = parseInt(count || "10", 10);
    const subjectIdNum = parseInt(subjectId || "0", 10);
    const topicIdNum = topicId ? parseInt(topicId, 10) : undefined;

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
                user?.target_class === "9" ? 2 : 1, // standard id (1=class 6, 2=class 9)
                undefined,
                questionCount
            );

            if (error) {
                Alert.alert("Error", "Failed to load questions. Please try again.");
                return;
            }

            if (data && data.length > 0) {
                // Transform data to PracticeQuestion format
                const transformedQuestions: PracticeQuestion[] = data.map((q: any) => ({
                    ...q,
                    question_text: q.question_translations?.[0]?.question_text || "",
                    explanation: q.question_translations?.[0]?.explanation || "",
                    options: (q.question_options || []).map((opt: any) => ({
                        ...opt,
                        option_text: opt.option_translations?.[0]?.option_text || "",
                    })),
                }));
                setQuestions(transformedQuestions);
            } else {
                // No questions available in Supabase for this subject/topic
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

    const handleSelectOption = (optionKey: string) => {
        if (showFeedback) return; // Already answered
        setSelectedOptions([optionKey]);
    };

    const handleSubmit = () => {
        if (selectedOptions.length === 0) {
            Alert.alert("Select an answer", "Please select an option to continue.");
            return;
        }

        // Check if selected option is correct
        const correctOption = currentQuestion.options.find((opt) => opt.is_correct);
        const correct = correctOption && selectedOptions.includes(correctOption.option_key);

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
            // Show result
            handleFinish();
        } else {
            setCurrentIndex((i) => i + 1);
            setSelectedOptions([]);
            setShowFeedback(false);
            setIsCorrect(false);
        }
    };

    const handleFinish = () => {
        // Award daily goal bonus if completed
        if (checkDailyGoal()) {
            addXP(XP_REWARDS.dailyGoalComplete);
            unlockBadge("daily_goal_complete");
        }

        // Save last practice activity for Continue Learning card
        const allSubjects = [
            ...SUBJECTS.class6,
            ...SUBJECTS.class9,
        ];
        const subject = allSubjects.find((s) => s.id === subjectIdNum);
        setLastPracticeActivity({
            subjectId: subjectIdNum,
            subjectName: subject?.name || "Practice",
            topicId: topicIdNum || null,
            topicName: subject?.name || "Practice",
            progress: Math.round((correctCount / questions.length) * 100),
        });
        trackPracticeCompletion(subjectIdNum, correctCount, questions.length, correctCount * XP_REWARDS.correctAnswer);

        // Navigate to result
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

    const progress = (currentIndex + 1) / questions.length;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: `Question ${currentIndex + 1} of ${questions.length}`,
                    headerStyle: { backgroundColor: COLORS.background },
                    headerShadowVisible: false,
                    headerBackTitle: "Exit",
                }}
            />
            <View style={{ flex: 1, padding: SPACING[5] }}>
                {/* Progress */}
                <View style={{ marginBottom: SPACING[4] }}>
                    <ProgressBar
                        progress={progress}
                        color={COLORS.primary}
                        height={6}
                    />
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.xs,
                            color: COLORS.textSecondary,
                            marginTop: 4,
                            textAlign: "right",
                        }}
                    >
                        {currentIndex + 1}/{questions.length}
                    </Text>
                </View>

                {/* Question Card */}
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Card variant="elevated" style={{ marginBottom: SPACING[4] }}>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.xs,
                                color: COLORS.primary,
                                fontWeight: "700",
                                textTransform: "uppercase",
                                marginBottom: SPACING[2],
                            }}
                        >
                            Question {currentIndex + 1}
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.lg,
                                color: COLORS.textPrimary,
                                lineHeight: 28,
                                fontWeight: "500",
                            }}
                        >
                            {currentQuestion.question_text || "Question text loading..."}
                        </Text>
                    </Card>

                    {/* Options */}
                    <View style={{ gap: SPACING[3], marginBottom: SPACING[4] }}>
                        {currentQuestion.options.map((option) => {
                            const isSelected = selectedOptions.includes(option.option_key);
                            const isCorrectOption = option.is_correct;
                            const showAsCorrect = showFeedback && isCorrectOption;
                            const showAsWrong = showFeedback && isSelected && !isCorrectOption;

                            return (
                                <Pressable
                                    key={option.id}
                                    onPress={() => handleSelectOption(option.option_key)}
                                    disabled={showFeedback}
                                >
                                    <View
                                        style={{
                                            backgroundColor: showAsCorrect
                                                ? COLORS.successLight
                                                : showAsWrong
                                                    ? COLORS.errorLight
                                                    : isSelected
                                                        ? COLORS.primaryLight + "30"
                                                        : COLORS.background,
                                            borderWidth: 2,
                                            borderColor: showAsCorrect
                                                ? COLORS.success
                                                : showAsWrong
                                                    ? COLORS.error
                                                    : isSelected
                                                        ? COLORS.primary
                                                        : COLORS.cardBorder,
                                            borderRadius: BORDER_RADIUS.lg,
                                            padding: SPACING[4],
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 18,
                                                backgroundColor: showAsCorrect
                                                    ? COLORS.success
                                                    : showAsWrong
                                                        ? COLORS.error
                                                        : isSelected
                                                            ? COLORS.primary
                                                            : COLORS.backgroundSecondary,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: SPACING[3],
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: isSelected || showAsCorrect || showAsWrong
                                                        ? "#fff"
                                                        : COLORS.textPrimary,
                                                    fontWeight: "700",
                                                }}
                                            >
                                                {option.option_key}
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                flex: 1,
                                                fontSize: TYPOGRAPHY.fontSize.base,
                                                color: COLORS.textPrimary,
                                            }}
                                        >
                                            {option.option_text}
                                        </Text>
                                        {showAsCorrect && <Text style={{ fontSize: 20 }}>✓</Text>}
                                        {showAsWrong && <Text style={{ fontSize: 20 }}>✗</Text>}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Bookmark & Report Actions */}
                    {showFeedback && (
                        <View style={{ flexDirection: "row", gap: SPACING[3], marginBottom: SPACING[4] }}>
                            <Pressable
                                onPress={handleToggleBookmark}
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: SPACING[3],
                                    borderRadius: BORDER_RADIUS.lg,
                                    borderWidth: 1,
                                    borderColor: isBookmarked ? COLORS.primary : COLORS.cardBorder,
                                    backgroundColor: isBookmarked ? COLORS.primary + "10" : COLORS.background,
                                    gap: SPACING[2],
                                }}
                            >
                                <Text style={{ fontSize: 16 }}>{isBookmarked ? "🔖" : "📑"}</Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        fontWeight: "600",
                                        color: isBookmarked ? COLORS.primary : COLORS.textSecondary,
                                    }}
                                >
                                    {isBookmarked ? "Saved" : "Save"}
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={handleReport}
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: SPACING[3],
                                    borderRadius: BORDER_RADIUS.lg,
                                    borderWidth: 1,
                                    borderColor: COLORS.cardBorder,
                                    backgroundColor: COLORS.background,
                                    gap: SPACING[2],
                                }}
                            >
                                <Text style={{ fontSize: 16 }}>🚩</Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        fontWeight: "600",
                                        color: COLORS.textSecondary,
                                    }}
                                >
                                    Report
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Feedback / Explanation */}
                    {showFeedback && currentQuestion.explanation && (
                        <Card
                            style={{
                                backgroundColor: isCorrect ? COLORS.successLight : COLORS.errorLight,
                                borderColor: isCorrect ? COLORS.success : COLORS.error,
                                borderWidth: 1,
                                marginBottom: SPACING[4],
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING[2] }}>
                                <MascotDisplay expression={isCorrect ? "celebrating" : "encouraging"} size={40} />
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: "700",
                                        color: isCorrect ? COLORS.success : COLORS.error,
                                        marginLeft: SPACING[2],
                                    }}
                                >
                                    {isCorrect ? "Excellent! 🎉" : "Almost there! 💪"}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    color: COLORS.textPrimary,
                                    lineHeight: 20,
                                }}
                            >
                                {currentQuestion.explanation}
                            </Text>
                        </Card>
                    )}
                </ScrollView>

                {/* Bottom Action Button */}
                <View style={{ paddingTop: SPACING[3] }}>
                    {showFeedback ? (
                        <Button
                            title={isLastQuestion ? "See Results →" : "Next Question →"}
                            onPress={handleNext}
                            fullWidth
                            size="lg"
                        />
                    ) : (
                        <Button
                            title="Check Answer"
                            onPress={handleSubmit}
                            fullWidth
                            size="lg"
                            disabled={selectedOptions.length === 0}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
