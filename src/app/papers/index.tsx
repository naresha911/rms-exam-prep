import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { COLORS, SPACING, normalizeStudentStandard } from "@/constants";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { HeroHeaderCard } from "@/components/shared/HeroHeaderCard";
import { ProTipCard } from "@/components/shared/ProTipCard";
import { PaperCard, PaperCardAction } from "@/components/papers/PaperCard";
import {
    fetchMyPaperAttemptSummaries,
    fetchPaperSectionStats,
    fetchPapersPage,
    fetchStandardIdForClass,
    getCachedPaperCatalogue,
    getPaperListStatus,
    setCachedPaperCatalogue,
} from "@/lib/papers";
import { Paper, PaperAttemptSummary, PaperListStatus, PaperSectionStat } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { t, setLanguage } from "@/lib/i18n";

const PAGE_SIZE = 20;

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
            return t("papers.statusCompleted");
        case "attempted":
            return t("papers.statusAttempted");
        case "in_progress":
            return t("papers.statusInProgress");
        default:
            return t("papers.statusUnattempted");
    }
}

export default function PapersScreen() {
    const { user, onboardingData, streak, preferences } = useAppStore();
    const targetClass = normalizeStudentStandard(user?.target_class || onboardingData.targetClass);

    useEffect(() => {
        const lang = preferences?.preferredLanguage === "hi" ? "hi" : "en";
        setLanguage(lang);
    }, [preferences?.preferredLanguage]);

    const [papers, setPapers] = useState<Paper[]>([]);
    const [summaries, setSummaries] = useState<Record<string, PaperAttemptSummary>>({});
    const [sectionStats, setSectionStats] = useState<Record<string, PaperSectionStat[]>>({});
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
                const sid = standardId ?? (await fetchStandardIdForClass(targetClass));
                if (sid == null) throw new Error("Standard not found");
                setStandardId(sid);

                if (!append && !isRefresh) {
                    const cached = await getCachedPaperCatalogue(sid);
                    if (cached?.length) {
                        setPapers(cached);
                        setLoading(false);
                    }
                }

                const from = append ? papers.length : 0;
                const to = from + PAGE_SIZE - 1;
                const { data, error: queryError } = await fetchPapersPage(sid, { from, to });
                if (queryError) throw queryError;

                const page = (data || []) as Paper[];
                setHasMore(page.length === PAGE_SIZE);
                const nextPapers = append ? [...papers, ...page] : page;
                setPapers(nextPapers);
                await setCachedPaperCatalogue(sid, nextPapers);

                const ids = nextPapers.map((p) => p.id);
                const [{ data: attemptSummaries }, { data: stats }] = await Promise.all([
                    fetchMyPaperAttemptSummaries(sid),
                    fetchPaperSectionStats(ids),
                ]);

                const map: Record<string, PaperAttemptSummary> = {};
                (attemptSummaries || []).forEach((s) => {
                    map[s.paper_id] = s;
                });
                setSummaries(map);

                const byPaper: Record<string, PaperSectionStat[]> = {};
                (stats || []).forEach((row) => {
                    byPaper[row.paper_id] = byPaper[row.paper_id] || [];
                    byPaper[row.paper_id].push(row);
                });
                setSectionStats(byPaper);
            } catch (cause) {
                console.error("Failed to load papers:", cause);
                if (!papers.length) {
                    setError(t("papers.listLoadFailed"));
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
                setLoadingMore(false);
            }
        },
        [papers, standardId, targetClass]
    );

    useEffect(() => {
        loadPage();
        trackEvent(EVENTS.PAPERS_LIST_VIEWED, { targetClass });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetClass]);

    const latestPaper = papers[0];
    const years = papers.map((p) => p.year);
    const yearMin = years.length ? Math.min(...years) : null;
    const yearMax = years.length ? Math.max(...years) : null;
    const yearSpan =
        yearMin != null && yearMax != null
            ? yearMin === yearMax
                ? String(yearMin)
                : `${yearMin}–${yearMax}`
            : "—";

    const solvedCount = useMemo(
        () => Object.values(summaries).filter((s) => s.status === "submitted").length,
        [summaries]
    );
    const pendingCount = Math.max(papers.length - solvedCount, 0);

    const openPaper = (paperId: string) => {
        router.push(`/papers/${paperId}`);
    };

    const openAnalysis = (paperId: string, attemptId: string) => {
        router.push(`/papers/${paperId}/result?attemptId=${attemptId}`);
    };

    const buildActions = (
        paper: Paper,
        status: PaperListStatus,
        summary?: PaperAttemptSummary
    ): { primary: PaperCardAction; secondary?: PaperCardAction; accent: "none" | "success" | "warning" } => {
        if (status === "completed" && summary?.attempt_id) {
            return {
                accent: "success",
                secondary: {
                    label: t("papers.analysis"),
                    icon: "analytics",
                    variant: "outline",
                    onPress: () => openAnalysis(paper.id, summary.attempt_id),
                },
                primary: {
                    label: t("papers.reattempt"),
                    icon: "replay",
                    variant: "muted",
                    onPress: () => openPaper(paper.id),
                },
            };
        }
        if (status === "attempted") {
            return {
                accent: "warning",
                primary: {
                    label: t("papers.retake"),
                    icon: "replay",
                    variant: "soft",
                    onPress: () => openPaper(paper.id),
                },
            };
        }
        if (status === "in_progress") {
            return {
                accent: "warning",
                primary: {
                    label: t("papers.resume"),
                    icon: "play_circle",
                    variant: "primary",
                    onPress: () => openPaper(paper.id),
                },
            };
        }
        return {
            accent: "none",
            primary: {
                label: t("papers.startPaper"),
                variant: "primary",
                onPress: () => openPaper(paper.id),
            },
        };
    };

    const cardSubtitle = (
        paper: Paper,
        status: PaperListStatus,
        summary?: PaperAttemptSummary
    ): string | undefined => {
        const sections = sectionStats[paper.id] || [];
        if (status === "completed") {
            const count = sections.length || 4;
            return t("papers.completeAttempt", { count });
        }
        if (status === "attempted") {
            const date = formatAttemptDate(summary?.submitted_at || summary?.started_at);
            return date
                ? t("papers.needsRevision", { date })
                : t("papers.statusAttempted");
        }
        return undefined;
    };

    const cardMetrics = (status: PaperListStatus, summary?: PaperAttemptSummary) => {
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
            scoreLabel: t("papers.scoreLine", { score, max: max || "—", pct }),
            durationLabel: mins != null ? t("papers.durationMins", { mins }) : undefined,
        };
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <TopAppBar
                title="AISSEE"
                highlight="Cadet"
                subtitle={t("papers.headerSubtitle", { class: targetClass })}
                avatarUri={user?.avatar_url}
                streak={streak || 0}
                onPressProfile={() => router.push("/(tabs)/me")}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadPage({ refresh: true })}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={{ paddingHorizontal: SPACING[4], marginTop: SPACING[2] }}>
                    <HeroHeaderCard
                        badgeIcon="history_edu"
                        badgeLabel={t("papers.ntaBadge")}
                        title={t("papers.missionTitle")}
                        description={t("papers.missionBody")}
                        illustration={<MascotDisplay expression="studying" size={68} showBackground={false} />}
                        durationLabel={
                            latestPaper?.duration_minutes
                                ? t("papers.durationShort", { mins: latestPaper.duration_minutes })
                                : undefined
                        }
                        stats={[
                            {
                                label: t("papers.statTotal"),
                                value: t("papers.statTotalValue", { count: papers.length }),
                                hint: yearSpan,
                            },
                            {
                                label: t("papers.statSolved"),
                                value: t("papers.statSolvedValue", { count: solvedCount }),
                                hint: t("papers.statPending", { count: pendingCount }),
                                tone: "success",
                            },
                        ]}
                    />
                </View>

                <View style={{ paddingHorizontal: SPACING[4], marginTop: SPACING[3] }}>
                    <ProTipCard title={t("papers.proTipTitle")} body={t("papers.proTipBody")} />
                </View>

                <View style={{ paddingHorizontal: SPACING[4], marginTop: SPACING[4], gap: SPACING[3] }}>
                    {loading && !papers.length ? (
                        <LoadingSpinner message={t("papers.loadingList")} />
                    ) : error && !papers.length ? (
                        <EmptyState
                            title={t("papers.unableToLoad")}
                            description={error}
                            actionLabel={t("common.retry")}
                            onAction={() => loadPage()}
                            mascot="sad"
                        />
                    ) : papers.length === 0 ? (
                        <EmptyState
                            title={t("papers.emptyTitle")}
                            description={t("papers.emptyBody", { class: targetClass })}
                            mascot="thinking"
                        />
                    ) : (
                        papers.map((paper) => {
                            const summary = summaries[paper.id];
                            const status = getPaperListStatus(summary);
                            const actions = buildActions(paper, status, summary);

                            return (
                                <PaperCard
                                    key={paper.id}
                                    title={paper.title}
                                    subtitle={cardSubtitle(paper, status, summary)}
                                    status={status}
                                    statusLabel={statusLabel(status)}
                                    isLatest={paper.id === latestPaper?.id}
                                    latestLabel={t("papers.latestExam")}
                                    metrics={cardMetrics(status, summary)}
                                    accent={actions.accent}
                                    primaryAction={actions.primary}
                                    secondaryAction={actions.secondary}
                                />
                            );
                        })
                    )}

                    {hasMore && papers.length > 0 ? (
                        <Button
                            title={loadingMore ? t("common.loading") : t("papers.loadMore")}
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
