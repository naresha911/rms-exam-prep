// Mock Test Session - Active test with timer and questions
import { View, Text, ScrollView, Pressable, Alert, BackHandler } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { COLORS, SPACING, TYPOGRAPHY, EXAM_STRUCTURE } from "../../constants";
import { supabase, fetchPracticeQuestions } from "../../lib/supabase";
import { useAppStore } from "../../store/useAppStore";
import { trackEvent, trackTestSubmitted, EVENTS } from "../../lib/analytics";
import type { PracticeQuestion, QuestionOption } from "../../types";

interface TestQuestion {
    id: string;
    question_text: string;
    options: { id: string; option_key: string; option_text: string; is_correct: boolean }[];
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const [reviewStatus, setReviewStatus] = useState<Record<string, 'not_visited' | 'answered' | 'not_answered' | 'marked_review' | 'answered_marked_review'>>({});

    // Timer
    const [timeRemaining, setTimeRemaining] = useState(() => {
        if (testType === "speed") return 5 * 60;
        if (testType === "sectional") {
            const section = examInfo.sections.find(s => s.name === sectionName);
            return section ? Math.round(section.marks / 2) * 60 : 30 * 60;
        }
        return examInfo.durationMinutes * 60;
    });
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // UI State
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Fetch questions from Supabase (with fallback to mock data)
    useEffect(() => {
        loadQuestions();
        trackEvent(EVENTS.TEST_STARTED, { testType, targetClass });
    }, []);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const standardId = targetClass === '9' ? 2 : 1;
            const questionCount = testType === 'speed' ? 10 : examInfo.totalQuestions;

            // For sectional tests, we could filter by subject; for full/speed, get all
            const subjectFilter = testType === 'sectional' ? undefined : undefined;

            const { data, error } = await fetchPracticeQuestions(
                subjectFilter,
                undefined,
                standardId,
                undefined,
                questionCount
            );

            if (data && data.length > 0 && !error) {
                const transformed: TestQuestion[] = data.map((q: any) => ({
                    id: q.id,
                    question_text: q.question_translations?.[0]?.question_text || 'Question text unavailable',
                    options: (q.question_options || []).map((opt: any) => ({
                        id: opt.id,
                        option_key: opt.option_key,
                        option_text: opt.option_translations?.[0]?.option_text || '',
                        is_correct: opt.is_correct,
                    })),
                    explanation: q.question_translations?.[0]?.explanation || undefined,
                }));
                setQuestions(transformed);
            } else {
                // No questions available in Supabase for this subject/class
                setQuestions([]);
            }
        } catch (e) {
            console.error('Failed to load test questions:', e);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Timer effect
    useEffect(() => {
        if (!isPaused && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleSubmitTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused]);

    // Back handler
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handlePauseTest();
            return true;
        });
        return () => backHandler.remove();
    }, []);

    const handlePauseTest = () => {
        Alert.alert(
            "Pause Test",
            "Do you want to pause the test? The timer will stop but you cannot pause during the actual exam.",
            [
                { text: "Continue Test", style: "cancel" },
                {
                    text: "Submit Now",
                    style: "destructive",
                    onPress: () => handleSubmitTest(),
                },
            ]
        );
    };

    const handleSelectOption = (optionId: string) => {
        setSelectedOption(optionId);
        const questionId = questions[currentIndex].id;
        setAnswers(prev => ({ ...prev, [questionId]: [optionId] }));
        setReviewStatus(prev => ({
            ...prev,
            [questionId]: flagged.has(questionId) ? 'answered_marked_review' : 'answered'
        }));
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
            setSelectedOption(null);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setSelectedOption(null);
        }
    };

    const handleSubmitTest = () => {
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);

        // Calculate score and build question results
        let correct = 0;
        let total = questions.length;
        const questionResults: Array<{
            index: number;
            questionText: string;
            isCorrect: boolean;
            selectedAnswer?: string;
            correctAnswer: string;
            explanation?: string;
        }> = [];

        questions.forEach((q, idx) => {
            const userAnswer = answers[q.id]?.[0];
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
        return examInfo.durationMinutes * 60;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const answeredCount = Object.keys(answers).length;
    const flaggedCount = flagged.size;
    const currentQuestion = questions[currentIndex];

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
                <LoadingSpinner message="Loading test..." />
            </SafeAreaView>
        );
    }

    if (!currentQuestion) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
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

    const isLowTime = timeRemaining < 300; // Less than 5 minutes

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Timer Header */}
            <View
                style={{
                    backgroundColor: isLowTime ? COLORS.error : COLORS.primary,
                    paddingVertical: SPACING[3],
                    paddingHorizontal: SPACING[4],
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Pressable onPress={handlePauseTest}>
                    <Text style={{ color: "#fff", fontSize: 20 }}>⏸️</Text>
                </Pressable>
                <View style={{ alignItems: "center" }}>
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                        }}
                    >
                        {formatTime(timeRemaining)}
                    </Text>
                    {testType === "sectional" && sectionName && (
                        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: TYPOGRAPHY.fontSize.xs }}>
                            {sectionName}
                        </Text>
                    )}
                </View>
                <View style={{ flexDirection: "row", gap: SPACING[3] }}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ color: "#fff", fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: "700" }}>
                            {answeredCount}
                        </Text>
                        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Answered</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ color: "#fff", fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: "700" }}>
                            {flaggedCount}
                        </Text>
                        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Flagged</Text>
                    </View>
                </View>
            </View>

            {/* Progress Bar */}
            <ProgressBar
                progress={(currentIndex + 1) / questions.length}
                label={`Question ${currentIndex + 1} of ${questions.length}`}
            />

            {/* Question */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: SPACING[4] }}
                showsVerticalScrollIndicator={false}
            >
                <Card style={{ marginBottom: SPACING[4] }}>
                    {/* Question Number & Flag */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING[3] }}>
                        <View
                            style={{
                                paddingHorizontal: SPACING[2],
                                paddingVertical: 4,
                                backgroundColor: COLORS.primaryLight + "30",
                                borderRadius: 4,
                            }}
                        >
                            <Text style={{ color: COLORS.primary, fontWeight: "700", fontSize: TYPOGRAPHY.fontSize.sm }}>
                                Q{currentIndex + 1}
                            </Text>
                        </View>
                        <Pressable onPress={handleToggleFlag}>
                            <Text style={{ fontSize: 20 }}>
                                {flagged.has(currentQuestion.id) ? "🚩" : "⚑"}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Question Text */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "600",
                            color: COLORS.textPrimary,
                            lineHeight: 26,
                            marginBottom: SPACING[5],
                        }}
                    >
                        {currentQuestion.question_text}
                    </Text>

                    {/* Options */}
                    <View style={{ gap: SPACING[3] }}>
                        {currentQuestion.options.map((option) => {
                            const isSelected = answers[currentQuestion.id]?.[0] === option.id;
                            return (
                                <Pressable
                                    key={option.id}
                                    onPress={() => handleSelectOption(option.id)}
                                    style={({ pressed }) => ({
                                        padding: SPACING[4],
                                        borderRadius: 12,
                                        borderWidth: 2,
                                        borderColor: isSelected ? COLORS.primary : COLORS.cardBorder,
                                        backgroundColor: isSelected ? COLORS.primary + "10" : COLORS.background,
                                        opacity: pressed ? 0.8 : 1,
                                    })}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 16,
                                                borderWidth: 2,
                                                borderColor: isSelected ? COLORS.primary : COLORS.cardBorder,
                                                backgroundColor: isSelected ? COLORS.primary : "transparent",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: SPACING[3],
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                                    fontWeight: "700",
                                                    color: isSelected ? COLORS.textInverse : COLORS.textSecondary,
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
                                        {isSelected && <Text style={{ fontSize: 18, color: COLORS.primary }}>✓</Text>}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </Card>
            </ScrollView>

            {/* Bottom Navigation */}
            <View
                style={{
                    padding: SPACING[4],
                    borderTopWidth: 1,
                    borderTopColor: COLORS.cardBorder,
                    flexDirection: "row",
                    gap: SPACING[3],
                }}
            >
                <Button
                    title="Previous"
                    variant="outline"
                    onPress={handlePrev}
                    disabled={currentIndex === 0}
                    style={{ flex: 1 }}
                />
                {currentIndex < questions.length - 1 ? (
                    <Button
                        title="Next"
                        onPress={handleNext}
                        style={{ flex: 1 }}
                    />
                ) : (
                    <Button
                        title="Submit"
                        variant="secondary"
                        onPress={() => setShowSubmitConfirm(true)}
                        style={{ flex: 1, backgroundColor: COLORS.success }}
                    />
                )}
            </View>

            {/* Submit Confirmation Modal */}
            {showSubmitConfirm && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: COLORS.overlay,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: SPACING[5],
                    }}
                >
                    <Card style={{ width: "100%" }}>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.xl,
                                fontWeight: "800",
                                color: COLORS.textPrimary,
                                textAlign: "center",
                                marginBottom: SPACING[3],
                            }}
                        >
                            Submit Test?
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.base,
                                color: COLORS.textSecondary,
                                textAlign: "center",
                                marginBottom: SPACING[4],
                            }}
                        >
                            You have answered {answeredCount} of {questions.length} questions.
                            {answeredCount < questions.length && `\n\n${questions.length - answeredCount} questions are unanswered.`}
                        </Text>
                        <View style={{ flexDirection: "row", gap: SPACING[3] }}>
                            <Button
                                title="Review"
                                variant="outline"
                                onPress={() => setShowSubmitConfirm(false)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Submit"
                                onPress={handleSubmitTest}
                                style={{ flex: 1, backgroundColor: COLORS.success }}
                            />
                        </View>
                    </Card>
                </View>
            )}
        </SafeAreaView>
    );
}
