// Dedicated previous-year paper session (does not reuse /test/session).
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    BackHandler,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { GradientProgressBar } from "@/components/shared/GradientProgressBar";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { QuestionRenderer, QuestionAssist, paperQuestionToRenderItem } from "@/components/questions";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";
import { useAppStore, isAutoShowSolution } from "@/store/useAppStore";
import { trackEvent, EVENTS } from "@/lib/analytics";
import {
    clearLocalPaperSession,
    enqueueOfflineAnswer,
    flushOfflineAnswerQueue,
    getPaperSessionQuestions,
    loadLocalPaperSession,
    mapSessionPayload,
    saveLocalPaperSession,
    savePaperAnswer,
    startPaperAttempt,
    submitPaperAttempt,
    PaperValidationIssue,
} from "@/lib/papers";
import { Paper, PaperSessionQuestion, ReviewStatus } from "@/types";
import { t } from "@/lib/i18n";
import { cancelIncompletePaperReminder, scheduleIncompletePaperReminder } from "@/lib/paperNotifications";

export default function PaperSessionScreen() {
    const router = useRouter();
    const { paperId } = useLocalSearchParams<{ paperId: string; attemptId?: string }>();
    const { preferences } = useAppStore();
    const preferredLanguage = preferences?.preferredLanguage || "en";
    const autoShowSolution = isAutoShowSolution(preferences);
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    const [paper, setPaper] = useState<Paper | null>(null);
    const [questions, setQuestions] = useState<PaperSessionQuestion[]>([]);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [durationSeconds, setDurationSeconds] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [warnings, setWarnings] = useState<PaperValidationIssue[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [revealedById, setRevealedById] = useState<Record<string, boolean>>({});

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const questionStartedAt = useRef<number>(Date.now());
    const answersRef = useRef(answers);
    const flaggedRef = useRef(flagged);
    const indexRef = useRef(currentIndex);
    const timeRef = useRef(timeRemaining);
    const attemptRef = useRef(attemptId);
    const paperRef = useRef(paper);
    const questionsRef = useRef(questions);
    const durationRef = useRef(durationSeconds);
    const submittingRef = useRef(false);

    answersRef.current = answers;
    flaggedRef.current = flagged;
    indexRef.current = currentIndex;
    timeRef.current = timeRemaining;
    attemptRef.current = attemptId;
    paperRef.current = paper;
    questionsRef.current = questions;
    durationRef.current = durationSeconds;

    const persistLocal = useCallback(async () => {
        if (!paperId || !paperRef.current) return;
        await saveLocalPaperSession({
            paperId,
            attemptId: attemptRef.current,
            paper: paperRef.current,
            questions: questionsRef.current,
            answers: answersRef.current,
            flagged: Array.from(flaggedRef.current),
            currentIndex: indexRef.current,
            timeRemaining: timeRef.current,
            durationSeconds: durationRef.current,
            updatedAt: new Date().toISOString(),
            status: "in_progress",
        });
    }, [paperId]);

    const persistAnswer = useCallback(
        async (questionId: string, optionId: string | null, nextFlagged: Set<string>) => {
            if (!attemptRef.current) {
                await persistLocal();
                return;
            }
            const hasAnswer = !!optionId;
            const isFlagged = nextFlagged.has(questionId);
            let reviewStatus: ReviewStatus = "not_answered";
            if (hasAnswer && isFlagged) reviewStatus = "answered_marked_review";
            else if (hasAnswer) reviewStatus = "answered";
            else if (isFlagged) reviewStatus = "marked_review";

            const pauseData = {
                current_index: indexRef.current,
                time_remaining: timeRef.current,
                time_spent_seconds: Math.max(0, durationRef.current - timeRef.current),
                flagged: Array.from(nextFlagged),
            };

            const payload = {
                attemptId: attemptRef.current,
                questionId,
                reviewStatus,
                selectedOptions: optionId ? [optionId] : [],
                timeSpentSeconds: Math.round((Date.now() - questionStartedAt.current) / 1000),
                pauseData,
            };

            try {
                const { error: saveError } = await savePaperAnswer(payload);
                if (saveError) throw saveError;
                await flushOfflineAnswerQueue();
            } catch {
                await enqueueOfflineAnswer(payload);
            }
            await persistLocal();
        },
        [persistLocal]
    );

    const finishSubmit = useCallback(async () => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setSubmitting(true);
        if (timerRef.current) clearInterval(timerRef.current);

        try {
            await flushOfflineAnswerQueue();
            if (!attemptRef.current) throw new Error("Missing attempt");

            const { data, error: submitError } = await submitPaperAttempt(attemptRef.current);
            if (submitError) throw submitError;

            const attempt = (data as any)?.attempt;
            trackEvent(EVENTS.PAPER_COMPLETED, {
                paperId,
                attemptId: attemptRef.current,
                totalScore: attempt?.total_score,
                maxScore: attempt?.max_score,
            });

            await clearLocalPaperSession(paperId!);
            await cancelIncompletePaperReminder(paperId!);
            router.replace(`/papers/${paperId}/result?attemptId=${attemptRef.current}`);
        } catch (cause) {
            console.error("Paper submit failed:", cause);
            Alert.alert(t("papers.submitFailedTitle"), t("papers.submitFailedBody"));
            submittingRef.current = false;
            setSubmitting(false);
        }
    }, [paperId, router]);

    const handlePauseExit = useCallback(() => {
        Alert.alert(t("papers.pauseTitle"), t("papers.pauseBody"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("papers.exit"),
                style: "destructive",
                onPress: async () => {
                    await persistLocal();
                    if (attemptRef.current && questionsRef.current[indexRef.current]) {
                        const q = questionsRef.current[indexRef.current];
                        await persistAnswer(
                            q.question_id,
                            answersRef.current[q.question_id] || null,
                            flaggedRef.current
                        );
                    }
                    if (paperId) {
                        await scheduleIncompletePaperReminder(paperId, paperRef.current?.title || "Paper");
                    }
                    router.back();
                },
            },
        ]);
    }, [paperId, persistAnswer, persistLocal, router]);

    useEffect(() => {
        let cancelled = false;

        const bootstrap = async () => {
            if (!paperId) {
                setError(t("papers.notFound"));
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                await flushOfflineAnswerQueue();

                const remote = await getPaperSessionQuestions(paperId);
                if (remote.error || !remote.data) {
                    const local = await loadLocalPaperSession(paperId);
                    if (!local) throw remote.error || new Error("Paper unavailable offline");
                    if (cancelled) return;
                    setPaper(local.paper);
                    setQuestions(local.questions);
                    setAnswers(local.answers);
                    setFlagged(new Set(local.flagged));
                    setCurrentIndex(local.currentIndex);
                    setTimeRemaining(local.timeRemaining);
                    setDurationSeconds(local.durationSeconds);
                    setAttemptId(local.attemptId);
                    setWarnings([]);
                    trackEvent(EVENTS.PAPER_RESUMED, { paperId, offline: true });
                    setLoading(false);
                    return;
                }

                const mapped = mapSessionPayload(remote.data, preferredLanguage);
                const blocking = mapped.issues.filter((i) => i.blocking);
                if (blocking.length) {
                    setError(blocking[0].message);
                    setLoading(false);
                    return;
                }

                const start = await startPaperAttempt(paperId);
                if (start.error || !start.data) {
                    const local = await loadLocalPaperSession(paperId);
                    if (local?.attemptId) {
                        if (cancelled) return;
                        setPaper(mapped.paper);
                        setQuestions(mapped.questions.filter((q) => q.supported));
                        setWarnings(mapped.issues);
                        setAnswers(local.answers);
                        setFlagged(new Set(local.flagged));
                        setCurrentIndex(local.currentIndex);
                        setTimeRemaining(
                            local.timeRemaining || (mapped.paper.duration_minutes || 150) * 60
                        );
                        setDurationSeconds(
                            local.durationSeconds || (mapped.paper.duration_minutes || 150) * 60
                        );
                        setAttemptId(local.attemptId);
                        setLoading(false);
                        return;
                    }
                    throw start.error || new Error("Could not start attempt");
                }

                const attempt = (start.data as any).attempt;
                const resumed = !!(start.data as any).resumed;
                const savedAnswers = ((start.data as any).answers || []) as any[];
                const duration = (mapped.paper.duration_minutes || 150) * 60;
                const pause = (attempt.pause_data || {}) as Record<string, unknown>;

                const nextAnswers: Record<string, string> = {};
                savedAnswers.forEach((row) => {
                    const selected = row.selected_options?.[0];
                    if (selected) nextAnswers[row.question_id] = selected;
                });

                const nextFlagged = new Set<string>(
                    Array.isArray(pause.flagged)
                        ? (pause.flagged as string[])
                        : savedAnswers
                              .filter((r) =>
                                  ["marked_review", "answered_marked_review"].includes(r.review_status)
                              )
                              .map((r) => r.question_id)
                );

                let index = typeof pause.current_index === "number" ? (pause.current_index as number) : 0;
                let remaining =
                    typeof pause.time_remaining === "number"
                        ? (pause.time_remaining as number)
                        : duration;

                const local = await loadLocalPaperSession(paperId);
                if (local && local.status === "in_progress" && local.updatedAt) {
                    const localTs = Date.parse(local.updatedAt);
                    const serverTs = Date.parse(attempt.started_at);
                    if (localTs > serverTs) {
                        Object.assign(nextAnswers, local.answers);
                        local.flagged.forEach((id) => nextFlagged.add(id));
                        index = local.currentIndex;
                        remaining = local.timeRemaining;
                    }
                }

                if (cancelled) return;

                const supported = mapped.questions.filter((q) => q.supported);
                setPaper(mapped.paper);
                setQuestions(supported);
                setWarnings(mapped.issues);
                setAttemptId(attempt.id);
                setAnswers(nextAnswers);
                setFlagged(nextFlagged);
                setCurrentIndex(Math.min(index, Math.max(0, supported.length - 1)));
                setDurationSeconds(duration);
                setTimeRemaining(Math.max(0, remaining));

                trackEvent(resumed ? EVENTS.PAPER_RESUMED : EVENTS.PAPER_STARTED, {
                    paperId,
                    attemptId: attempt.id,
                });
            } catch (cause) {
                console.error("Failed to load paper session:", cause);
                if (!cancelled) setError(t("papers.sessionLoadFailed"));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        bootstrap();
        return () => {
            cancelled = true;
        };
    }, [paperId, preferredLanguage]);

    useEffect(() => {
        if (loading || error || !questions.length) return;

        timerRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    finishSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const persistTimer = setInterval(() => {
            persistLocal();
        }, 5000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            clearInterval(persistTimer);
        };
    }, [loading, error, questions.length, finishSubmit, persistLocal]);

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            handlePauseExit();
            return true;
        });
        return () => sub.remove();
    }, [handlePauseExit]);

    const handleSelect = (optionId: string) => {
        const q = questions[currentIndex];
        if (!q?.supported) return;
        if (revealedById[q.question_id]) return;
        setAnswers((prev) => ({ ...prev, [q.question_id]: optionId }));
        persistAnswer(q.question_id, optionId, flagged);
    };

    const handleRevealCurrent = useCallback(() => {
        const q = questions[currentIndex];
        if (!q) return;
        setRevealedById((prev) => (prev[q.question_id] ? prev : { ...prev, [q.question_id]: true }));
    }, [currentIndex, questions]);

    const handleToggleFlag = () => {
        const q = questions[currentIndex];
        if (!q) return;
        const next = new Set(flagged);
        if (next.has(q.question_id)) next.delete(q.question_id);
        else next.add(q.question_id);
        setFlagged(next);
        persistAnswer(q.question_id, answers[q.question_id] || null, next);
    };

    const goTo = (index: number) => {
        const prev = questions[currentIndex];
        if (prev) {
            persistAnswer(prev.question_id, answers[prev.question_id] || null, flagged);
        }
        questionStartedAt.current = Date.now();
        setCurrentIndex(index);
        persistLocal();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingSpinner message={t("papers.loadingSession")} />
            </SafeAreaView>
        );
    }

    if (error || !questions.length) {
        return (
            <SafeAreaView style={styles.container}>
                <EmptyState
                    title={t("papers.sessionUnavailable")}
                    description={error || t("papers.noQuestions")}
                    mascot="sad"
                    actionLabel={t("common.back")}
                    onAction={() => router.back()}
                />
            </SafeAreaView>
        );
    }

    const current = questions[currentIndex];
    const progress = (currentIndex + 1) / questions.length;
    const isLowTime = timeRemaining < 300;
    const selected = answers[current.question_id];

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <Pressable
                    onPress={handlePauseExit}
                    style={({ pressed }) => [styles.iconBtn, pressed && layout.pressed]}
                    accessibilityLabel={t("common.back")}
                >
                    <MaterialIcon name="close" size={22} color={colors.onSurface} />
                </Pressable>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {paper?.title || t("papers.title")}
                    </Text>
                    <Text style={styles.headerSub}>
                        {current.section || t("papers.generalSection")} · Q{currentIndex + 1}/{questions.length}
                    </Text>
                </View>
                <View style={[styles.timerPill, isLowTime && styles.timerLow]}>
                    <MaterialIcon name="schedule" size={16} color={isLowTime ? colors.error : colors.primary} />
                    <Text style={[styles.timerText, isLowTime && styles.timerTextLow]}>
                        {formatTime(timeRemaining)}
                    </Text>
                </View>
            </View>

            <View style={styles.progressWrap}>
                <GradientProgressBar progress={progress} />
            </View>

            {warnings.length > 0 && (
                <View style={styles.warnBanner}>
                    <Text style={styles.warnText}>{warnings[0].message}</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.marksLabel}>
                    {current.marks} {t("papers.marks")}
                    {current.negative_marks > 0
                        ? ` · −${current.negative_marks} ${t("papers.negative")}`
                        : ""}
                </Text>
                <View style={styles.options}>
                    <QuestionRenderer
                        question={paperQuestionToRenderItem(current)}
                        mode="exam"
                        selectionMode="option_id"
                        selectedValue={selected ?? null}
                        revealed={!!revealedById[current.question_id]}
                        onSelect={(optionId) => {
                            if (!current.supported) return;
                            handleSelect(optionId);
                        }}
                        questionNumber={currentIndex + 1}
                        showBookmark={false}
                        showFooter={false}
                        debugSource="PaperSession"
                    />
                    <QuestionAssist
                        key={current.question_id}
                        hint={current.hint}
                        solution={current.explanation}
                        solutionDiagramUri={current.explanation_diagram_path}
                        answered={!!selected}
                        revealed={!!revealedById[current.question_id]}
                        isCorrect={
                            !!selected &&
                            current.options.some((o) => o.is_correct && o.id === selected)
                        }
                        correctOptionLabel={current.options.find((o) => o.is_correct)?.option_key?.toUpperCase()}
                        autoShowSolution={autoShowSolution}
                        onReveal={handleRevealCurrent}
                    />
                    {!current.supported && (
                        <Text style={styles.unsupported}>{t("papers.unsupportedType")}</Text>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable
                    onPress={handleToggleFlag}
                    style={({ pressed }) => [styles.flagBtn, pressed && layout.pressed]}
                    accessibilityLabel={t("papers.markReview")}
                >
                    <MaterialIcon
                        name="flag"
                        size={22}
                        color={flagged.has(current.question_id) ? colors.warning : colors.onSurfaceVariant}
                    />
                </Pressable>
                <Button
                    title={t("common.back")}
                    variant="outline"
                    size="sm"
                    disabled={currentIndex === 0}
                    onPress={() => goTo(currentIndex - 1)}
                    style={styles.fill}
                />
                {currentIndex < questions.length - 1 ? (
                    <Button
                        title={t("common.next")}
                        size="sm"
                        onPress={() => goTo(currentIndex + 1)}
                        style={styles.fill}
                    />
                ) : (
                    <Button
                        title={t("tests.submitTest")}
                        size="sm"
                        onPress={() => setShowSubmitConfirm(true)}
                        style={styles.fill}
                    />
                )}
            </View>

            {showSubmitConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>{t("papers.confirmSubmitTitle")}</Text>
                        <Text style={styles.modalBody}>
                            {t("papers.confirmSubmitBody", {
                                answered: String(Object.keys(answers).length),
                                total: String(questions.length),
                            })}
                        </Text>
                        <View style={styles.modalActions}>
                            <Button
                                title={t("common.cancel")}
                                variant="outline"
                                onPress={() => setShowSubmitConfirm(false)}
                                style={styles.fill}
                            />
                            <Button
                                title={submitting ? t("common.loading") : t("tests.submitTest")}
                                onPress={finishSubmit}
                                disabled={submitting}
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
        container: { flex: 1, backgroundColor: colors.background },
        header: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[2],
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineVariant,
            gap: SPACING[2],
        },
        iconBtn: { padding: SPACING[1] },
        headerCenter: { flex: 1 },
        headerTitle: { ...TYPOGRAPHY.labelLg, color: colors.onSurface },
        headerSub: { ...TYPOGRAPHY.labelSm, color: colors.onSurfaceVariant, marginTop: 2 },
        timerPill: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 4,
            backgroundColor: colors.primaryFixed,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: BORDER_RADIUS.full,
        },
        timerLow: { backgroundColor: colors.errorLight },
        timerText: { ...TYPOGRAPHY.labelSm, color: colors.primary },
        timerTextLow: { color: colors.error },
        progressWrap: { paddingHorizontal: SPACING[4], paddingTop: SPACING[2] },
        warnBanner: {
            marginHorizontal: SPACING[4],
            marginTop: SPACING[2],
            backgroundColor: colors.warningLight,
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING[2],
        },
        warnText: { ...TYPOGRAPHY.labelSm, color: colors.onSurfaceVariant, fontWeight: TYPOGRAPHY.fontWeight.regular },
        content: { padding: SPACING[4], paddingBottom: 120 },
        marksLabel: { ...TYPOGRAPHY.labelSm, color: colors.onSurfaceVariant, marginBottom: SPACING[2] },
        unsupported: { marginTop: SPACING[2], color: colors.warning, ...TYPOGRAPHY.labelSm },
        options: { gap: SPACING[1] },
        footer: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: SPACING[2],
            padding: SPACING[4],
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            backgroundColor: colors.surface,
        },
        flagBtn: { padding: SPACING[2] },
        fill: { flex: 1 },
        modalOverlay: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.overlay,
            justifyContent: "center" as const,
            padding: SPACING[6],
        },
        modalCard: {
            backgroundColor: colors.surface,
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING[6],
        },
        modalTitle: { ...TYPOGRAPHY.headlineMd, color: colors.onSurface, fontSize: 20 },
        modalBody: { ...TYPOGRAPHY.bodyMd, color: colors.onSurfaceVariant, marginTop: SPACING[2] },
        modalActions: { flexDirection: "row" as const, gap: SPACING[2], marginTop: SPACING[6] },
    };
}
