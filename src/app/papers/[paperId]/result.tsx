// Paper attempt result — loaded from persisted attemptId (server-scored).
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from "@/constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";
import {
    fetchPaperAttemptWithAnswers,
    fetchPaperMeta,
} from "@/lib/papers";
import { Paper, PaperAttempt, PaperAttemptAnswer } from "@/types";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { t } from "@/lib/i18n";

type ScoreTone = "excellent" | "good" | "keep";
type StatTone = "success" | "error" | "muted";

const TONE = {
    excellent: "toneExcellent",
    good: "toneGood",
    keep: "toneKeep",
} as const;

const STAT_VALUE = {
    success: "statSuccess",
    error: "statError",
    muted: "statMuted",
} as const;

function createStyles(colors: ColorPalette) {
    return {
        container: { flex: 1, backgroundColor: colors.background },
        scroll: { padding: SPACING[4], paddingBottom: 120 },
        header: { alignItems: "center" as const, marginBottom: SPACING[4] },
        headline: { ...TYPOGRAPHY.headlineMd, marginTop: SPACING[2] },
        toneExcellent: { color: colors.success },
        toneGood: { color: colors.primary },
        toneKeep: { color: colors.warning },
        sub: { ...TYPOGRAPHY.bodyMd, color: colors.onSurfaceVariant, textAlign: "center" as const, marginTop: SPACING[1] },
        scoreCard: {
            gap: SPACING[4],
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING[4],
            marginBottom: SPACING[4],
        },
        scoreStats: { flex: 1 },
        scoreValue: { ...TYPOGRAPHY.headlineMd, color: colors.onSurface },
        scoreLabel: { ...TYPOGRAPHY.labelSm, color: colors.onSurfaceVariant },
        timeValue: { ...TYPOGRAPHY.bodyMd, color: colors.onSurfaceVariant, marginTop: SPACING[1] },
        statRow: { gap: SPACING[2], marginBottom: SPACING[4] },
        statCard: {
            flex: 1,
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING[3],
            alignItems: "center" as const,
        },
        statValue: { ...TYPOGRAPHY.headlineMd, fontSize: 22 },
        statSuccess: { color: colors.success },
        statError: { color: colors.error },
        statMuted: { color: colors.onSurfaceVariant },
        statLabel: { ...TYPOGRAPHY.labelSm, color: colors.onSurfaceVariant, marginTop: 4 },
        reviewTitle: { ...TYPOGRAPHY.labelLg, color: colors.onSurface, marginBottom: SPACING[2] },
        reviewRow: {
            gap: SPACING[2],
            paddingVertical: SPACING[2],
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.outlineVariant,
        },
        reviewText: { ...TYPOGRAPHY.bodyMd, color: colors.onSurface, flex: 1 },
        footer: {
            gap: SPACING[2],
            padding: SPACING[4],
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            backgroundColor: colors.surface,
        },
        flexFill: { flex: 1 },
    };
}

function Stat({ label, value, tone }: { label: string; value: string; tone: StatTone }) {
    const styles = useThemedStyles(createStyles);
    return (
        <View style={styles.statCard}>
            <Text style={[styles.statValue, styles[STAT_VALUE[tone]]]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

export default function PaperResultScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { paperId, attemptId } = useLocalSearchParams<{ paperId: string; attemptId: string }>();
    const [paper, setPaper] = useState<Paper | null>(null);
    const [attempt, setAttempt] = useState<PaperAttempt | null>(null);
    const [answers, setAnswers] = useState<PaperAttemptAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [starting, setStarting] = useState(false);

    const load = useCallback(async () => {
        if (!attemptId) {
            setError(t("papers.resultMissing"));
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const [{ attempt: a, answers: ans, error: aErr }, meta] = await Promise.all([
                fetchPaperAttemptWithAnswers(attemptId),
                paperId ? fetchPaperMeta(paperId) : Promise.resolve({ data: null, error: null }),
            ]);
            if (aErr || !a) throw aErr || new Error("Attempt not found");
            setAttempt(a);
            setAnswers(ans);
            setPaper(meta.data);
            trackEvent(EVENTS.PAPER_RESULT_VIEWED, {
                paperId: a.paper_id,
                attemptId: a.id,
                totalScore: a.total_score,
                maxScore: a.max_score,
            });
        } catch (cause) {
            console.error("Failed to load paper result:", cause);
            setError(t("papers.resultLoadFailed"));
        } finally {
            setLoading(false);
        }
    }, [attemptId, paperId]);

    useEffect(() => {
        load();
    }, [load]);

    const sectionBreakdown = useMemo(() => {
        // Without question→section map on answers alone, group by marks only.
        const correct = answers.filter((a) => a.is_correct === true).length;
        const wrong = answers.filter((a) => a.is_correct === false).length;
        const skipped = answers.filter((a) => a.is_correct == null || a.selected_options?.length === 0).length;
        return { correct, wrong, skipped };
    }, [answers]);

    const handleReattempt = async () => {
        if (!paperId || starting) return;
        setStarting(true);
        try {
            // Abandon is implicit: start creates new after previous submitted
            trackEvent(EVENTS.PAPER_REATTEMPTED, { paperId, previousAttemptId: attemptId });
            router.replace(`/papers/${paperId}/session`);
        } finally {
            setStarting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingSpinner message={t("papers.loadingResult")} />
            </SafeAreaView>
        );
    }

    if (error || !attempt) {
        return (
            <SafeAreaView style={styles.container}>
                <EmptyState
                    title={t("papers.resultUnavailable")}
                    description={error || t("common.error")}
                    mascot="sad"
                    actionLabel={t("common.back")}
                    onAction={() => router.replace("/papers")}
                />
            </SafeAreaView>
        );
    }

    const score = Number(attempt.total_score ?? 0);
    const max = Number(attempt.max_score ?? 0);
    const percentage = max > 0 ? Math.round((score / max) * 100) : 0;
    const minutes = Math.floor((attempt.time_spent_seconds || 0) / 60);
    const seconds = (attempt.time_spent_seconds || 0) % 60;
    const tone: ScoreTone = percentage >= 80 ? "excellent" : percentage >= 50 ? "good" : "keep";
    const expression = percentage >= 80 ? "celebrating" : percentage >= 50 ? "happy" : "encouraging";

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <MascotDisplay expression={expression as any} size={120} />
                    <Text style={[styles.headline, styles[TONE[tone]]]}>
                        {percentage >= 80
                            ? t("papers.resultExcellent")
                            : percentage >= 50
                              ? t("papers.resultGood")
                              : t("papers.resultKeepGoing")}
                    </Text>
                    <Text style={styles.sub}>
                        {paper?.title || t("papers.title")} · {t("papers.attempt")} #{attempt.attempt_number}
                    </Text>
                </View>

                <View style={[layout.row, styles.scoreCard]}>
                    <CircularProgress percentage={percentage} size={100} strokeWidth={8} />
                    <View style={styles.scoreStats}>
                        <Text style={styles.scoreValue}>
                            {score}/{max}
                        </Text>
                        <Text style={styles.scoreLabel}>{t("papers.marks")}</Text>
                        <Text style={styles.timeValue}>
                            {minutes}m {seconds}s
                        </Text>
                    </View>
                </View>

                <View style={[layout.row, styles.statRow]}>
                    <Stat label={t("papers.correct")} value={String(sectionBreakdown.correct)} tone="success" />
                    <Stat label={t("papers.incorrect")} value={String(sectionBreakdown.wrong)} tone="error" />
                    <Stat label={t("papers.skipped")} value={String(sectionBreakdown.skipped)} tone="muted" />
                </View>

                <Text style={styles.reviewTitle}>{t("papers.answerReview")}</Text>
                {answers.map((ans, idx) => (
                    <View key={ans.id} style={[layout.row, styles.reviewRow]}>
                        <MaterialIcon
                            name={ans.is_correct ? "check_circle" : "cancel"}
                            size={20}
                            color={
                                ans.is_correct
                                    ? colors.success
                                    : ans.is_correct === false
                                      ? colors.error
                                      : colors.onSurfaceVariant
                            }
                        />
                        <Text style={styles.reviewText}>
                            Q{idx + 1}:{" "}
                            {ans.is_correct
                                ? t("papers.correct")
                                : ans.is_correct === false
                                  ? t("papers.incorrect")
                                  : t("papers.skipped")}
                            {ans.marks_awarded != null ? ` (${ans.marks_awarded})` : ""}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View style={[layout.row, styles.footer]}>
                <Button
                    title={t("papers.backToPapers")}
                    variant="outline"
                    onPress={() => router.replace("/papers")}
                    style={styles.flexFill}
                />
                <Button
                    title={starting ? t("common.loading") : t("papers.reattempt")}
                    onPress={handleReattempt}
                    disabled={starting}
                    style={styles.flexFill}
                />
            </View>
        </SafeAreaView>
    );
}
