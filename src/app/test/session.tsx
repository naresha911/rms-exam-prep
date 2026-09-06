// Mock Test Session — Stitch-aligned active test screen.
// Sticky header with timer, progress bar, QuestionRenderer (exam mode), bottom nav, submit confirm.
import { View, Text, ScrollView, Pressable, Alert, BackHandler, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { GradientProgressBar } from "../../components/shared/GradientProgressBar";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { QuestionRenderer, testQuestionToRenderItem } from "../../components/questions";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, EXAM_STRUCTURE } from "../../constants";
import { fetchPracticeQuestions, fetchPaperDetails } from "../../lib/supabase";
import { trackEvent, trackTestSubmitted, EVENTS } from "../../lib/analytics";

interface TestQuestion {
    id: string;
    question_text: string;
    question_type?: "mcq_single" | "true_false" | "assertion_reason" | "matching" | "mcq_multi" | "fill_blank" | "short_answer" | "comprehension";
    has_diagram?: boolean;
    diagram_path?: string | null;
    options: {
        id: string;
        option_key: string;
        option_text: string;
        option_image_path?: string | null;
        is_correct: boolean;
        display_order?: number | null;
    }[];
    explanation?: string;
}

export default function TestSessionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const testType = params.type as string;
    const sectionName = params.section as string;
    const targetClass = params.class as string;
    const examInfo = targetClass === "9" ? EXAM_STRUCTURE.class9 : EXAM_STRUCTURE.class6;

    // Test configuration
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [paperDuration, setPaperDuration] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [flagged, setFlagged] = useState<Set<string>>(new Set());

    // Timer
    const [timeRemaining, setTimeRemaining] = useState(() => {
        if (testType === "speed") return 5 * 60;
        if (testType === "sectional") {
            const section = examInfo.sections.find(s => s.name === sectionName);
            return section ? Math.round(section.marks / 2) * 60 : 30 * 60;
        }
        return (paperDuration || examInfo.durationMinutes) * 60;
    });
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // UI State
    const [loading, setLoading] = useState(true);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    useEffect(() => {
        loadQuestions();
        trackEvent(EVENTS.TEST_STARTED, { testType, targetClass });
    }, [loading]);

    useEffect(() => {
        if (loading) return;
        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [loading]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handlePauseTest();
            return true;
        });
        return () => backHandler.remove();
    }, [loading]);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            if (testType === "paper") {
                const { data, error } = await fetchPaperDetails(params.paperId as string);
                if (error || !data) throw error || new Error("Paper not found");
                setPaperDuration(data.duration_minutes || examInfo.durationMinutes);
                setTimeRemaining((data.duration_minutes || examInfo.durationMinutes) * 60);
                const transformed: TestQuestion[] = (data.paper_questions || []).map((entry: any) => entry.questions).filter(Boolean).map((q: any) => ({
                    id: q.id,
                    question_text: q.question_translations?.[0]?.question_text || "Question text unavailable",
                    question_type: q.question_type || "mcq_single",
                    has_diagram: !!q.has_diagram,
                    diagram_path: q.diagram_path ?? null,
                    options: (q.question_options || []).map((opt: any, i: number) => ({
                        id: opt.id,
                        option_key: opt.option_key,
                        option_text: opt.option_translations?.[0]?.option_text || "",
                        option_image_path: opt.option_image_path ?? null,
                        is_correct: opt.is_correct,
                        display_order: opt.display_order ?? i,
                    })),
                    explanation: q.question_translations?.[0]?.explanation || undefined,
                }));
                setQuestions(transformed);
            } else {
                const standardId = targetClass === '9' ? 2 : 1;
                const questionCount = testType === 'speed' ? 10 : examInfo.totalQuestions;
                const { data, error } = await fetchPracticeQuestions(undefined, undefined, standardId, undefined, questionCount);
                if (data && data.length > 0 && !error) {
                    setQuestions(data.map((q: any) => ({
                        id: q.id,
                        question_text: q.question_translations?.[0]?.question_text || 'Question text unavailable',
                        question_type: q.question_type || 'mcq_single',
                        has_diagram: !!q.has_diagram,
                        diagram_path: q.diagram_path ?? null,
                        options: (q.question_options || []).map((opt: any, i: number) => ({
                            id: opt.id,
                            option_key: opt.option_key,
                            option_text: opt.option_translations?.[0]?.option_text || '',
                            option_image_path: opt.option_image_path ?? null,
                            is_correct: opt.is_correct,
                            display_order: opt.display_order ?? i,
                        })),
                        explanation: q.question_translations?.[0]?.explanation || undefined,
                    })));
                } else setQuestions([]);
            }
        } catch (e) {
            console.error('Failed to load test questions:', e);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePauseTest = () => {
        Alert.alert(
            "Pause Test",
            "Do you want to exit the test? Your progress will be lost.",
            [
                { text: "Continue Test", style: "cancel" },
                { text: "Exit", style: "destructive", onPress: () => router.back() },
            ]
        );
    };

    const handleSelectOption = (optionId: string) => {
        const questionId = questions[currentIndex].id;
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleToggleFlag = () => {
        const questionId = questions[currentIndex].id;
        setFlagged(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSubmitTest = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        let correct = 0;
        const total = questions.length;
        const questionResults: Array<{
            index: number;
            questionText: string;
            isCorrect: boolean;
            selectedAnswer?: string;
            correctAnswer: string;
            explanation?: string;
        }> = [];

        questions.forEach((q, idx) => {
            const userAnswer = answers[q.id];
            const correctOption = q.options.find(o => o.is_correct);
            const isCorrect = !!(userAnswer && correctOption && userAnswer === correctOption.id);
            if (isCorrect) correct++;

            questionResults.push({
                index: idx,
                questionText: q.question_text,
                isCorrect,
                selectedAnswer: userAnswer ? q.options.find(o => o.id === userAnswer)?.option_text : undefined,
                correctAnswer: correctOption?.option_text || '',
                explanation: q.explanation,
            });
        });

        const durationSeconds = getDuration() - timeRemaining;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        trackTestSubmitted({
            testType,
            totalScore: correct,
            maxScore: total,
            accuracy,
            durationSeconds,
        });

        router.replace({
            pathname: "/test/result",
            params: {
                correct: correct.toString(),
                total: total.toString(),
                time: durationSeconds.toString(),
                type: testType,
                section: sectionName || '',
                questions: JSON.stringify(questionResults),
            }
        });
    };

    const getDuration = () => {
        if (testType === "speed") return 5 * 60;
        if (testType === "sectional") {
            const section = examInfo.sections.find(s => s.name === sectionName);
            return section ? Math.round(section.marks / 2) * 60 : 30 * 60;
        }
        return (paperDuration || examInfo.durationMinutes) * 60;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const answeredCount = Object.keys(answers).length;
    const flaggedCount = flagged.size;
    const currentQuestion = questions[currentIndex];
    const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
    const isLowTime = timeRemaining < 300;

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingSpinner message="Loading test..." />
            </SafeAreaView>
        );
    }

    if (!currentQuestion) {
        return (
            <SafeAreaView style={styles.container}>
                <EmptyState
                    title="No Questions Available"
                    description="Looks like this test doesn't have any questions yet. Try a different test or come back later!"
                    mascot="thinking"
                    actionLabel="Go Back"
                    onAction={() => router.back()}
                />
            </SafeAreaView>
        );
    }

    const selectedOptionId = answers[currentQuestion.id];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Stitch-style sticky header */}
            <View style={styles.header}>
                <Pressable
                    onPress={handlePauseTest}
                    style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
                    accessibilityLabel="Exit test"
                >
                    <MaterialIcon name="close" size={22} color={COLORS.onSurface} />
                </Pressable>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    {testType === "paper" ? "Previous Year Paper" : testType === "sectional" && sectionName ? sectionName : "Mock Test"}
                </Text>

                {/* Timer pill — Stitch: surface-container-high bg, error color when low */}
                <View style={[
                    styles.timerPill,
                    isLowTime && styles.timerPillLow,
                ]}>
                    <MaterialIcon
                        name="timer"
                        size={16}
                        color={isLowTime ? COLORS.error : COLORS.onSurfaceVariant}
                    />
                    <Text style={[
                        styles.timerText,
                        isLowTime && styles.timerTextLow,
                    ]}>
                        {formatTime(timeRemaining)}
                    </Text>
                </View>
            </View>

            {/* Main scrollable canvas */}
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
                        <Pressable
                            onPress={handleToggleFlag}
                            style={({ pressed }) => [styles.flagBtn, pressed && styles.headerBtnPressed]}
                        >
                            <MaterialIcon
                                name="flag"
                                size={20}
                                color={flagged.has(currentQuestion.id) ? COLORS.warning : COLORS.onSurfaceVariant}
                                filled={flagged.has(currentQuestion.id)}
                            />
                        </Pressable>
                    </View>
                    <GradientProgressBar progress={progress} height={6} style={styles.progressBar} />
                </View>

                {/* Question presentation — shared variants via QuestionRenderer */}
                <View style={styles.optionsContainer}>
                    <QuestionRenderer
                        question={testQuestionToRenderItem(currentQuestion)}
                        mode="exam"
                        selectionMode="option_id"
                        selectedValue={selectedOptionId ?? null}
                        revealed={false}
                        onSelect={handleSelectOption}
                        questionNumber={currentIndex + 1}
                        showBookmark={false}
                        showFooter={false}
                        debugSource="TestSession"
                    />
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* Stitch-style sticky bottom nav */}
            <View style={styles.bottomNav}>
                <Button
                    title="Previous"
                    variant="outline"
                    onPress={handlePrev}
                    disabled={currentIndex === 0}
                    style={{ flex: 1 }}
                />
                <View style={{ width: SPACING[3] }} />
                {currentIndex < questions.length - 1 ? (
                    <Button
                        title="Next"
                        onPress={handleNext}
                        style={{ flex: 1 }}
                        iconRight="arrow_forward"
                    />
                ) : (
                    <Button
                        title="Submit"
                        onPress={() => setShowSubmitConfirm(true)}
                        style={{ flex: 1 }}
                    />
                )}
            </View>

            {/* Submit confirmation modal */}
            {showSubmitConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Submit Test?</Text>
                        <Text style={styles.modalBody}>
                            You have answered {answeredCount} of {questions.length} questions.
                            {answeredCount < questions.length && `\n\n${questions.length - answeredCount} questions are unanswered.`}
                        </Text>
                        <View style={styles.modalActions}>
                            <Button
                                title="Review"
                                variant="outline"
                                onPress={() => setShowSubmitConfirm(false)}
                                style={{ flex: 1 }}
                            />
                            <View style={{ width: SPACING[3] }} />
                            <Button
                                title="Submit"
                                onPress={handleSubmitTest}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                </View>
            )}
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
    timerPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: COLORS.surfaceContainerHigh,
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[2],
        borderRadius: BORDER_RADIUS.full,
    },
    timerPillLow: {
        backgroundColor: COLORS.errorLight,
    },
    timerText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        fontWeight: "700",
    },
    timerTextLow: {
        color: COLORS.error,
    },
    scrollContent: {
        padding: SPACING[4],
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
    flagBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    progressBar: {
        borderRadius: BORDER_RADIUS.full,
        overflow: "hidden",
    },
    optionsContainer: {
        gap: SPACING[3],
    },
    bottomPadding: {
        height: SPACING[6],
    },
    bottomNav: {
        flexDirection: "row",
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[4],
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING[5],
    },
    modalCard: {
        width: "100%",
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        padding: SPACING[6],
    },
    modalTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.onSurface,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: SPACING[3],
    },
    modalBody: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
        marginBottom: SPACING[5],
        lineHeight: 24,
    },
    modalActions: {
        flexDirection: "row",
    },
});
