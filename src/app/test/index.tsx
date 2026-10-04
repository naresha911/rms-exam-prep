import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href } from "expo-router";
import { SPACING, normalizeStudentStandard } from "@/constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { HeroHeaderCard } from "@/components/shared/HeroHeaderCard";
import { ProTipCard } from "@/components/shared/ProTipCard";
import { PaperCard, PaperCardAction } from "@/components/papers/PaperCard";
import {
    fetchMyTestAttemptSummaries,
    fetchStandardIdForClass,
    fetchTestsPage,
    getCachedTestCatalogue,
    getTestListStatus,
    setCachedTestCatalogue,
} from "@/lib/tests";
import { PaperListStatus, Test, TestAttemptSummary } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { t, setLanguage } from "@/lib/i18n";

const PAGE_SIZE = 20;

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: { paddingBottom: 40 },
        heroWrap: { paddingHorizontal: SPACING[4], marginTop: SPACING[2] },
        tipWrap: { paddingHorizontal: SPACING[4], marginTop: SPACING[3] },
        list: { paddingHorizontal: SPACING[4], marginTop: SPACING[4], gap: SPACING[3] },
    };
}

function formatAttemptDate(iso: string | null | undefined): string {
    if (!iso) return "";
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "";
    }
}

function statusLabel(status: PaperListStatus): string {
    switch (status) {
        case "completed":
            return t("tests.statusCompleted");
        case "attempted":
            return t("tests.statusAttempted");
        case "in_progress":
            return t("tests.statusInProgress");
        default:
            return t("tests.statusUnattempted");
    }
}

export default function MockTestsScreen() {
    const { user, onboardingData, streak, preferences } = useAppStore();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const targetClass = normalizeStudentStandard(user?.target_class || onboardingData.targetClass);

    useEffect(() => {
        const lang = preferences?.preferredLanguage === "hi" ? "hi" : "en";
        setLanguage(lang);
    }, [preferences?.preferredLanguage]);

    const [tests, setTests] = useState<Test[]>([]);
    const [summaries, setSummaries] = useState<Record<string, TestAttemptSummary>>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [standardId, setStandardId] = useState<number | null>(null);

    const loadPage = useCallback(
        async (opts?: { refresh?: boolean; append?: boolean }) => {
            const isRefresh = !!opts?.refresh;
            const append = !!opts?.append;
            if (isRefresh) setRefreshing(true);
            else if (append) setLoadingMore(true);
            else setLoading(true);
            setError(null);

            try {
                const sid =
                    append && standardId != null
                        ? standardId
                        : await fetchStandardIdForClass(targetClass);
                if (sid == null) throw new Error("Standard not found");
                setStandardId(sid);

                if (!append && !isRefresh) {
                    const cached = await getCachedTestCatalogue(sid);
                    if (cached?.length) {
                        setTests(cached);
                        setLoading(false);
                    }
                }

                const from = append ? tests.length : 0;
                const to = from + PAGE_SIZE - 1;
                const { data, error: queryError } = await fetchTestsPage(sid, { from, to });
                if (queryError) throw queryError;

                const page = data || [];
                setHasMore(page.length === PAGE_SIZE);
                const nextTests = append ? [...tests, ...page] : page;
                setTests(nextTests);
                await setCachedTestCatalogue(sid, nextTests);

                const { data: attemptSummaries } = await fetchMyTestAttemptSummaries();
                const map: Record<string, TestAttemptSummary> = {};
                (attemptSummaries || []).forEach((s) => {
                    map[s.test_id] = s;
                });
                setSummaries(map);
            } catch (cause) {
                console.error("Failed to load mock tests:", cause);
                if (!tests.length) {
                    setError(t("tests.listLoadFailed"));
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
                setLoadingMore(false);
            }
        },
        [standardId, targetClass, tests]
    );

    useEffect(() => {
        loadPage();
        trackEvent(EVENTS.TESTS_LIST_VIEWED, { targetClass });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetClass]);

    const latestTest = tests[0];
    const solvedCount = useMemo(
        () => Object.values(summaries).filter((s) => s.status === "submitted").length,
        [summaries]
    );
    const pendingCount = Math.max(tests.length - solvedCount, 0);

    const openTest = (testId: string) => {
        router.push(`/test/${testId}` as Href);
    };

    const openAnalysis = (test: Test, summary: TestAttemptSummary) => {
        const max = summary.max_score ?? test.total_marks ?? 0;
        const score = summary.total_score ?? 0;
        router.push({
            pathname: "/test/result",
            params: {
                correct: String(Math.round(score)),
                total: String(Math.round(max) || tests.length || 0),
                time: String(summary.time_spent_seconds ?? 0),
                type: "full",
            },
        });
    };

    const buildActions = (
        test: Test,
        status: PaperListStatus,
        summary?: TestAttemptSummary
    ): { primary: PaperCardAction; secondary?: PaperCardAction; accent: "none" | "success" | "warning" } => {
        if (status === "completed" && summary?.attempt_id) {
            return {
                accent: "success",
                secondary: {
                    label: t("tests.analysis"),
                    icon: "analytics",
                    variant: "outline",
                    onPress: () => openAnalysis(test, summary),
                },
                primary: {
                    label: t("tests.reattempt"),
                    icon: "replay",
                    variant: "muted",
                    onPress: () => openTest(test.id),
                },
            };
        }
        if (status === "attempted") {
            return {
                accent: "warning",
                primary: {
                    label: t("tests.retake"),
                    icon: "replay",
                    variant: "soft",
                    onPress: () => openTest(test.id),
                },
            };
        }
        if (status === "in_progress") {
            return {
                accent: "warning",
                primary: {
                    label: t("tests.resume"),
                    icon: "play_circle",
                    variant: "primary",
                    onPress: () => openTest(test.id),
                },
            };
        }
        return {
            accent: "none",
            primary: {
                label: t("tests.startPaper"),
                variant: "primary",
                onPress: () => openTest(test.id),
            },
        };
    };

    const cardSubtitle = (
        test: Test,
        status: PaperListStatus,
        summary?: TestAttemptSummary
    ): string | undefined => {
        if (status === "completed") {
            const count = 4;
            return t("tests.completeAttempt", { count });
        }
        if (status === "attempted") {
            const date = formatAttemptDate(summary?.submitted_at || summary?.started_at);
            return date ? t("tests.needsRevision", { date }) : t("tests.statusAttempted");
        }
        if (test.duration_minutes && test.total_marks) {
            return `${test.duration_minutes} mins • ${test.total_marks} marks`;
        }
        return test.description || undefined;
    };

    const cardMetrics = (status: PaperListStatus, summary?: TestAttemptSummary) => {
        if (status !== "completed" && status !== "attempted") return undefined;
        if (!summary) return undefined;
        const max = summary.max_score ?? 0;
        const score = summary.total_score ?? 0;
        const pct = max > 0 ? Math.round((score / max) * 100) : 0;
        const mins =
            summary.time_spent_seconds != null
                ? Math.max(1, Math.round(summary.time_spent_seconds / 60))
                : null;
        return {
            scoreLabel: t("tests.scoreLine", { score, max: max || "—", pct }),
            durationLabel: mins != null ? t("tests.durationMins", { mins }) : undefined,
        };
    };

    return (
        <SafeAreaView style={styles.screen} edges={["top"]}>
            <TopAppBar
                title="AISSEE"
                highlight="Cadet"
                subtitle={t("tests.headerSubtitle", { class: targetClass })}
                avatarUri={user?.avatar_url}
                streak={streak || 0}
                onPressProfile={() => router.push("/(tabs)/me")}
            />

            <ScrollView
                style={layout.fill}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadPage({ refresh: true })}
                        tintColor={colors.primary}
                    />
                }
            >
                <View style={styles.heroWrap}>
                    <HeroHeaderCard
                        badgeIcon="assignment"
                        badgeLabel={t("tests.missionBadge")}
                        title={t("tests.missionTitle")}
                        description={t("tests.missionBody")}
                        illustration={<MascotDisplay expression="encouraging" size={68} showBackground={false} />}
                        durationLabel={
                            latestTest?.duration_minutes
                                ? t("tests.durationShort", { mins: latestTest.duration_minutes })
                                : undefined
                        }
                        stats={[
                            {
                                label: t("tests.statTotal"),
                                value: t("tests.statTotalValue", { count: tests.length }),
                                hint: t("tests.full"),
                            },
                            {
                                label: t("tests.statSolved"),
                                value: t("tests.statSolvedValue", { count: solvedCount }),
                                hint: t("tests.statPending", { count: pendingCount }),
                                tone: "success",
                            },
                        ]}
                    />
                </View>

                <View style={styles.tipWrap}>
                    <ProTipCard title={t("tests.proTipTitle")} body={t("tests.proTipBody")} />
                </View>

                <View style={styles.list}>
                    {loading && !tests.length ? (
                        <LoadingSpinner message={t("tests.loadingList")} />
                    ) : error && !tests.length ? (
                        <EmptyState
                            title={t("tests.unableToLoad")}
                            description={error}
                            actionLabel={t("common.retry")}
                            onAction={() => loadPage()}
                            mascot="sad"
                        />
                    ) : tests.length === 0 ? (
                        <EmptyState
                            title={t("tests.emptyTitle")}
                            description={t("tests.emptyBody", { class: targetClass })}
                            mascot="thinking"
                        />
                    ) : (
                        tests.map((test) => {
                            const summary = summaries[test.id];
                            const status = getTestListStatus(summary);
                            const actions = buildActions(test, status, summary);

                            return (
                                <PaperCard
                                    key={test.id}
                                    title={test.title}
                                    subtitle={cardSubtitle(test, status, summary)}
                                    status={status}
                                    statusLabel={statusLabel(status)}
                                    isLatest={test.id === latestTest?.id}
                                    latestLabel={t("tests.latestMock")}
                                    metrics={cardMetrics(status, summary)}
                                    accent={actions.accent}
                                    primaryAction={actions.primary}
                                    secondaryAction={actions.secondary}
                                />
                            );
                        })
                    )}

                    {hasMore && tests.length > 0 ? (
                        <Button
                            title={loadingMore ? t("common.loading") : t("tests.loadMore")}
                            variant="outline"
                            onPress={() => loadPage({ append: true })}
                            disabled={loadingMore}
                            fullWidth
                        />
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
