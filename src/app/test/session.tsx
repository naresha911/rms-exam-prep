// Mock Test Session — Stitch-aligned active test screen.
// Sticky header with timer, progress bar, QuestionRenderer (exam mode), bottom nav, submit confirm.
import { View, Text, ScrollView, Pressable, Alert, BackHandler } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "../../components/ui/Button";
import { NavArrowButton } from "../../components/ui/NavArrowButton";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { GradientProgressBar } from "../../components/shared/GradientProgressBar";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { QuestionPalette, type PaletteState } from "../../components/test/QuestionPalette";
import { QuestionRenderer, QuestionAssist, testQuestionToRenderItem } from "../../components/questions";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, getExamStructureForStandard, getStandardIdFallback, normalizeStudentStandard } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
import { useResponsive } from "../../hooks/useResponsive";
import { fetchPracticeQuestions, fetchPaperDetails } from "../../lib/supabase";
import { completeTestAttempt, getTestSessionQuestions, startTestAttempt } from "../../lib/tests";
import { useAppStore, isAutoShowSolution } from "../../store/useAppStore";
import { trackEvent, trackTestSubmitted, EVENTS } from "../../lib/analytics";

interface TestQuestion {
    id: string;
    question_text: string;
    question_type?: "mcq_single" | "true_false" | "assertion_reason" | "matching" | "mcq_multi" | "fill_blank" | "short_answer" | "comprehension";
    has_diagram?: boolean;
    diagram_path?: string | null;
    section?: string | null;
    options: {
        id: string;
        option_key: string;
        option_text: string;
        option_image_path?: string | null;
        is_correct: boolean;
        display_order?: number | null;
    }[];
    hint?: string | null;
    explanation?: string;
    explanation_diagram_path?: string | null;
}

export default function TestSessionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const testType = params.type as string;
    const sectionName = params.section as string;
    const selectedTestId = (params.testId as string) || "";
    const targetClass = normalizeStudentStandard(params.class as string);
    const examInfo = getExamStructureForStandard(targetClass);
    const preferredLanguage = useAppStore((s) => s.preferences?.preferredLanguage) || "en";
    const isAdmin = useAppStore((s) => s.user?.role === 'admin');
    const autoShowSolution = isAutoShowSolution(useAppStore((s) => s.preferences));
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const { isTablet, isWide } = useResponsive();

    // Test configuration
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [paperDuration, setPaperDuration] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const attemptIdRef = useRef<string | null>(null);

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
    const [revealedById, setRevealedById] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadQuestions();
        trackEvent(EVENTS.TEST_STARTED, { testType, targetClass, testId: selectedTestId || null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTestId, testType, targetClass, sectionName]);

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
            if (selectedTestId) {
                const { test, questions: sessionQuestions, error } = await getTestSessionQuestions(
                    selectedTestId,
                    preferredLanguage,
                    isAdmin
                );
                if (error) throw error;
                const duration = test?.duration_minutes || examInfo.durationMinutes;
                setPaperDuration(duration);
                setTimeRemaining(duration * 60);
                setQuestions(sessionQuestions);
                const started = await startTestAttempt(selectedTestId);
                if (started.data?.id) attemptIdRef.current = started.data.id;
            } else if (testType === "paper") {
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
                    hint: q.question_translations?.[0]?.hint || undefined,
                    explanation: q.question_translations?.[0]?.explanation || undefined,
                    explanation_diagram_path: q.question_translations?.[0]?.explanation_diagram_path || undefined,
                }));
                setQuestions(transformed);
            } else {
                const standardId = getStandardIdFallback(targetClass);
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
                        hint: q.question_translations?.[0]?.hint || undefined,
                        explanation: q.question_translations?.[0]?.explanation || undefined,
                        explanation_diagram_path: q.question_translations?.[0]?.explanation_diagram_path || undefined,
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
        if (revealedById[questionId]) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleRevealCurrent = useCallback(() => {
        const questionId = questions[currentIndex]?.id;
        if (!questionId) return;
        setRevealedById((prev) => (prev[questionId] ? prev : { ...prev, [questionId]: true }));
    }, [currentIndex, questions]);

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

        if (attemptIdRef.current) {
            completeTestAttempt({
                attemptId: attemptIdRef.current,
                totalScore: correct,
                maxScore: total,
                timeSpentSeconds: durationSeconds,
            }).catch((cause) => console.warn("Failed to persist mock attempt:", cause));
        }

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

    const paletteStates = useMemo(() => {
        const result: Record<number, PaletteState> = {};
        questions.forEach((question, index) => {
            if (flagged.has(question.id)) result[index] = "marked";
            else if (answers[question.id]) result[index] = "answered";
            else if (index < currentIndex) result[index] = "skipped";
            else result[index] = "unanswered";
        });
        return result;
    }, [questions, flagged, answers, currentIndex]);

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
    const isMarked = flagged.has(currentQuestion.id);

    const resolveSectionLabel = (index: number): string | undefined => {
        if (testType === "sectional") return sectionName || undefined;

        // Prefer the question's real section (from the test's DB sections) so the band
        // shows the actual subject instead of a position-based guess.
        const realSection = questions[index]?.section;
        if (realSection) {
            const order: string[] = [];
            for (const q of questions) {
                if (q.section && !order.includes(q.section)) order.push(q.section);
            }
            const pos = order.indexOf(realSection);
            return pos >= 0 ? `Section ${String.fromCharCode(65 + pos)}: ${realSection}` : realSection;
        }

        if (testType === "paper" || !questions.length) return undefined;
        const sections = examInfo.sections;
        const totalSectionQuestions = sections.reduce((sum, section) => sum + section.questions, 0);
        if (!totalSectionQuestions) return undefined;
        let acc = 0;
        for (let i = 0; i < sections.length; i++) {
            acc += Math.round((sections[i].questions / totalSectionQuestions) * questions.length);
            if (index < acc) {
                return `Section ${String.fromCharCode(65 + i)}: ${sections[i].name}`;
            }
        }
        return undefined;
    };

    const markPill = (
        <Pressable
            onPress={handleToggleFlag}
            style={({ pressed }) => [
                styles.markPill,
                isMarked && styles.markPillActive,
                pressed && layout.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={isMarked ? "Remove mark for review" : "Mark for review"}
        >
            <MaterialIcon
                name="flag"
                size={16}
                color={isMarked ? colors.warning : colors.onSurfaceVariant}
                filled={isMarked}
            />
            <Text style={[styles.markPillText, isMarked && styles.markPillTextActive]}>Mark</Text>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Stitch-style sticky header */}
            <View style={[styles.header, isTablet ? styles.headerTablet : null]}>
                <Pressable
                    onPress={handlePauseTest}
                    style={({ pressed }) => [styles.headerBtn, pressed && layout.pressed]}
                    accessibilityLabel="Exit test"
                >
                    <MaterialIcon name="close" size={22} color={colors.onSessionHeader} />
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
                        color={isLowTime ? colors.error : colors['warning-amber']}
                    />
                    <Text style={[
                        styles.timerText,
                        isLowTime && styles.timerTextLow,
                    ]}>
                        {formatTime(timeRemaining)}
                    </Text>
                </View>
            </View>

            <View style={[styles.body, isWide ? styles.bodyWide : null]}>
                <View style={[styles.mainColumn, isWide ? styles.mainColumnWide : null]}>
                    {/* Main scrollable canvas */}
                    <ScrollView
                        style={layout.fill}
                        contentContainerStyle={[
                            styles.scrollContent,
                            isTablet ? styles.scrollContentTablet : null,
                        ]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.contentColumn}>
                            {/* Progress bar */}
                            <View style={styles.progressSection}>
                                <GradientProgressBar
                                    progress={progress}
                                    height={6}
                                    style={styles.progressBar}
                                />
                            </View>

                            {/* Question presentation — shared variants via QuestionRenderer */}
                            <View style={styles.optionsContainer}>
                                <QuestionRenderer
                                    question={testQuestionToRenderItem(currentQuestion)}
                                    mode="exam"
                                    selectionMode="option_id"
                                    selectedValue={selectedOptionId ?? null}
                                    revealed={!!revealedById[currentQuestion.id]}
                                    onSelect={handleSelectOption}
                                    questionNumber={currentIndex + 1}
                                    counterTotal={questions.length}
                                    headerAction={markPill}
                                    sectionLabel={resolveSectionLabel(currentIndex)}
                                    showBookmark={false}
                                    showFooter={false}
                                    debugSource="TestSession"
                                />
                                <QuestionAssist
                                    key={currentQuestion.id}
                                    hint={currentQuestion.hint}
                                    solution={currentQuestion.explanation}
                                    solutionDiagramUri={currentQuestion.explanation_diagram_path}
                                    answered={!!selectedOptionId}
                                    revealed={!!revealedById[currentQuestion.id]}
                                    isCorrect={
                                        !!selectedOptionId &&
                                        currentQuestion.options.some((o) => o.is_correct && o.id === selectedOptionId)
                                    }
                                    correctOptionLabel={currentQuestion.options.find((o) => o.is_correct)?.option_key?.toUpperCase()}
                                    autoShowSolution={autoShowSolution}
                                    onReveal={handleRevealCurrent}
                                />
                            </View>

                            <View style={styles.bottomPadding} />
                        </View>
                    </ScrollView>

                    {/* Stitch-style sticky bottom nav */}
                    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, SPACING[4]) }]}>
                        <View style={styles.bottomNavInner}>
                            <NavArrowButton
                                direction="back"
                                onPress={handlePrev}
                                disabled={currentIndex === 0}
                            />
                            {currentIndex < questions.length - 1 ? (
                                <NavArrowButton direction="forward" onPress={handleNext} />
                            ) : (
                                <Pressable
                                    onPress={() => setShowSubmitConfirm(true)}
                                    style={({ pressed }) => [
                                        styles.submitPill,
                                        pressed && layout.pressed,
                                    ]}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.submitPillText}>Submit</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>

                {isWide ? (
                    <View style={styles.paletteRail}>
                        <QuestionPalette
                            total={questions.length}
                            current={currentIndex + 1}
                            states={paletteStates}
                            onQuestionPress={setCurrentIndex}
                        />
                    </View>
                ) : null}
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
                                style={styles.fill}
                            />
                            <View style={styles.navGap} />
                            <Button
                                title="Submit"
                                onPress={handleSubmitTest}
                                style={styles.fill}
                            />
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            justifyContent: "space-between" as const,
            paddingHorizontal: SPACING[4],
            height: 56,
            backgroundColor: colors.sessionHeader,
        },
        headerTablet: {
            paddingHorizontal: SPACING[6],
        },
        body: {
            flex: 1,
        },
        bodyWide: {
            flexDirection: "row" as const,
            justifyContent: "center" as const,
            gap: SPACING[6],
        },
        mainColumn: {
            flex: 1,
        },
        mainColumnWide: {
            flex: 1,
            maxWidth: 760,
        },
        paletteRail: {
            width: 300,
            maxHeight: 460,
            marginTop: SPACING[4],
            marginRight: SPACING[6],
            alignSelf: "flex-start" as const,
            backgroundColor: colors.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            borderRadius: BORDER_RADIUS.xl,
            overflow: "hidden" as const,
        },
        headerBtn: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
        headerTitle: {
            flex: 1,
            textAlign: "center" as const,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSessionHeader,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            marginHorizontal: SPACING[2],
        },
        timerPill: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 4,
            backgroundColor: colors.sessionHeaderPill,
            paddingHorizontal: SPACING[3],
            paddingVertical: SPACING[2],
            borderRadius: BORDER_RADIUS.full,
        },
        timerPillLow: {
            backgroundColor: colors.errorLight,
        },
        timerText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSessionHeader,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        timerTextLow: {
            color: colors.error,
        },
        scrollContent: {
            padding: SPACING[4],
            alignItems: "center" as const,
        },
        scrollContentTablet: {
            padding: SPACING[6],
        },
        contentColumn: {
            width: "100%" as const,
            maxWidth: 720,
        },
        progressSection: {
            marginBottom: SPACING[5],
        },
        progressBar: {
            borderRadius: BORDER_RADIUS.full,
            overflow: "hidden" as const,
        },
        markPill: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 6,
            paddingHorizontal: SPACING[3],
            paddingVertical: 7,
            borderRadius: BORDER_RADIUS.full,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            backgroundColor: colors.surfaceContainerLowest,
        },
        markPillActive: {
            backgroundColor: colors.warningLight,
            borderColor: colors.warningLight,
        },
        markPillText: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 13,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: colors.onSurfaceVariant,
        },
        markPillTextActive: {
            color: colors.warningText,
        },
        optionsContainer: {
            gap: SPACING[3],
        },
        bottomPadding: {
            height: SPACING[6],
        },
        bottomNav: {
            paddingHorizontal: SPACING[4],
            paddingTop: SPACING[4],
            backgroundColor: colors.background,
        },
        bottomNavInner: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            justifyContent: "space-between" as const,
            width: "100%" as const,
            maxWidth: 720,
            alignSelf: "center" as const,
        },
        submitPill: {
            height: 44,
            paddingHorizontal: SPACING[6],
            borderRadius: BORDER_RADIUS.full,
            backgroundColor: colors.primary,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
        submitPillText: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "600" as const,
            color: colors.onPrimary,
        },
        fill: { flex: 1 },
        navGap: { width: SPACING[3] },
        modalOverlay: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.overlay,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            padding: SPACING[5],
        },
        modalCard: {
            width: "100%" as const,
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            padding: SPACING[6],
        },
        modalTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            textAlign: "center" as const,
            marginBottom: SPACING[3],
        },
        modalBody: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurfaceVariant,
            textAlign: "center" as const,
            marginBottom: SPACING[5],
            lineHeight: 24,
        },
        modalActions: {
            flexDirection: "row" as const,
        },
    };
}
