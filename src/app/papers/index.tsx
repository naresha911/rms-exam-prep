import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { COLORS } from "@/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import {
    difficultyLabel,
    fetchMyPaperAttemptSummaries,
    fetchPaperSectionStats,
    fetchPapersPage,
    fetchStandardIdForClass,
    getCachedPaperCatalogue,
    setCachedPaperCatalogue,
} from "@/lib/papers";
import { Paper, PaperAttemptSummary, PaperSectionStat } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { t, setLanguage } from "@/lib/i18n";

const PAGE_SIZE = 20;

export default function PapersScreen() {
    const { user, onboardingData, streak, preferences } = useAppStore();
    const targetClass = user?.target_class || onboardingData.targetClass || "6";
    const cadetName = user?.full_name || t("papers.cadetFallback");

    useEffect(() => {
        const lang = preferences?.preferredLanguage === "hi" ? "hi" : "en";
        setLanguage(lang);
    }, [preferences?.preferredLanguage]);

    const [papers, setPapers] = useState<Paper[]>([]);
    const [summaries, setSummaries] = useState<Record<string, PaperAttemptSummary>>({});
    const [sectionStats, setSectionStats] = useState<Record<string, PaperSectionStat[]>>({});
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [standardId, setStandardId] = useState<number | null>(null);

    const summaryMap = useMemo(() => summaries, [summaries]);

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

    const yearFilters = Array.from(new Set(papers.map((paper) => String(paper.year))));
    const filters = ["All", "Recent", ...yearFilters];
    const visiblePapers =
        activeFilter === "Recent"
            ? papers.slice(0, 3)
            : activeFilter !== "All"
              ? papers.filter((paper) => String(paper.year) === activeFilter)
              : papers;
    const latestPaper = papers[0];
    const yearsCovered = new Set(papers.map((paper) => paper.year)).size;

    const statusFor = (paperId: string) => {
        const s = summaryMap[paperId];
        if (!s) return { label: t("papers.statusUnattempted"), tone: "neutral" as const };
        if (s.status === "in_progress") return { label: t("papers.statusInProgress"), tone: "warn" as const };
        if (s.status === "submitted") {
            return {
                label: `${t("papers.score")} ${s.total_score ?? 0}/${s.max_score ?? "—"}`,
                tone: "ok" as const,
            };
        }
        return { label: t("papers.statusAttempted"), tone: "neutral" as const };
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <ScrollView
                className="flex-1"
                contentContainerClassName="px-4 pb-10"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadPage({ refresh: true })}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View className="mt-3 mb-4 flex-row items-center">
                    <View className="mr-3 h-12 w-12 overflow-hidden rounded-full bg-primary-fixed">
                        {user?.avatar_url ? (
                            <Image source={{ uri: user.avatar_url }} className="h-12 w-12" />
                        ) : (
                            <View className="h-12 w-12 items-center justify-center">
                                <MaterialIcon name="person" size={28} color={COLORS.primary} />
                            </View>
                        )}
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-extrabold text-onSurface">{cadetName}</Text>
                        <Text className="text-sm text-onSurfaceVariant">
                            {t("papers.headerSubtitle", { class: targetClass })}
                            {streak ? ` · 🔥 ${streak}` : ""}
                        </Text>
                    </View>
                    <Pressable className="p-2" accessibilityLabel={t("papers.notifications")}>
                        <MaterialIcon name="notifications" size={24} color={COLORS.onSurfaceVariant} />
                    </Pressable>
                </View>

                <View className="mb-5">
                    <Text className="text-2xl font-extrabold text-onSurface">{t("papers.title")}</Text>
                    <Text className="mt-1 text-base text-onSurfaceVariant">{t("papers.subtitle")}</Text>
                </View>

                <Card variant="elevated" padding="none" style={{ backgroundColor: COLORS.primary }}>
                    <View className="items-center p-4">
                        <Text className="text-xl font-extrabold text-white">{t("papers.missionTitle")}</Text>
                        <Text className="mt-2 text-center text-base text-white">{t("papers.missionBody")}</Text>
                        <Button
                            title={t("papers.startLatest")}
                            size="sm"
                            onPress={() => latestPaper && router.push(`/papers/${latestPaper.id}`)}
                            disabled={!latestPaper}
                            iconRight="arrow_forward"
                            style={{ marginTop: 16 }}
                        />
                        <MascotDisplay expression="studying" size={116} showBackground />
                    </View>
                </Card>

                <View className="mb-4 flex-row gap-2">
                    <View className="flex-1 rounded-2xl bg-primary p-3">
                        <Text className="text-center text-xl font-extrabold text-white">{papers.length}</Text>
                        <Text className="text-center text-xs text-white">{t("papers.available")}</Text>
                    </View>
                    <View className="flex-1 rounded-2xl bg-surface-container-high p-3">
                        <Text className="text-center text-xl font-extrabold text-onSurface">{yearsCovered}</Text>
                        <Text className="text-center text-xs text-onSurfaceVariant">{t("papers.yearsCovered")}</Text>
                    </View>
                </View>

                <View className="mb-4 flex-row gap-2">
                    {filters.map((filter) => (
                        <Pressable
                            key={filter}
                            onPress={() => {
                                setActiveFilter(filter);
                                trackEvent(EVENTS.PAPER_FILTER_SELECTED, { filter });
                            }}
                            className={`rounded-full border px-4 py-2 ${
                                activeFilter === filter
                                    ? "border-primary bg-primary"
                                    : "border-outline-variant bg-surface-container-low"
                            }`}
                        >
                            <Text
                                className={`text-sm font-semibold ${
                                    activeFilter === filter ? "text-white" : "text-onSurfaceVariant"
                                }`}
                            >
                                {filter === "All" ? t("papers.filterClass", { class: targetClass }) : filter === "Recent" ? t("papers.filterRecent") : filter}
                            </Text>
                        </Pressable>
                    ))}
                </View>

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
                ) : visiblePapers.length === 0 ? (
                    <EmptyState
                        title={t("papers.emptyTitle")}
                        description={t("papers.emptyBody", { class: targetClass })}
                        mascot="thinking"
                    />
                ) : (
                    visiblePapers.map((paper) => {
                        const level = difficultyLabel(paper.difficulty, paper.year);
                        const status = statusFor(paper.id);
                        const sections = (sectionStats[paper.id] || []).slice(0, 3);
                        const cta =
                            summaryMap[paper.id]?.status === "in_progress"
                                ? t("papers.resume")
                                : summaryMap[paper.id]?.status === "submitted"
                                  ? t("papers.viewOrRetry")
                                  : t("papers.startPaper");

                        return (
                            <Card key={paper.id} variant="elevated" padding="none" style={{ marginBottom: 12 }}>
                                <Pressable onPress={() => router.push(`/papers/${paper.id}`)} className="flex-row items-center p-4">
                                    <View className="mr-3 rounded-xl bg-primary-fixed p-3">
                                        <MaterialIcon name="assignment" size={24} color={COLORS.primary} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-base font-bold text-onSurface" numberOfLines={1}>
                                            {paper.title}
                                        </Text>
                                        <Text className="mt-1 text-sm text-onSurfaceVariant">
                                            AISSEE {paper.year} • Class {targetClass}
                                        </Text>
                                        <Text
                                            className={`mt-1 text-xs font-bold ${
                                                status.tone === "ok"
                                                    ? "text-success"
                                                    : status.tone === "warn"
                                                      ? "text-warning"
                                                      : "text-onSurfaceVariant"
                                            }`}
                                        >
                                            {status.label}
                                        </Text>
                                    </View>
                                    <MaterialIcon name="chevron_right" size={22} color={COLORS.onSurfaceVariant} />
                                </Pressable>

                                {sections.length > 0 && (
                                    <View className="flex-row flex-wrap gap-2 px-4 pb-2">
                                        {sections.map((s) => (
                                            <View key={s.section} className="rounded-full bg-surface-container-high px-2 py-1">
                                                <Text className="text-[10px] font-semibold text-onSurfaceVariant">
                                                    {s.section} · {s.question_count}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                <View className="mt-1 flex-row items-center border-t border-outline-variant px-4 pt-3 pb-1">
                                    <MaterialIcon name="schedule" size={16} color={COLORS.onSurfaceVariant} />
                                    <Text className="ml-1 text-xs text-onSurfaceVariant">
                                        {paper.duration_minutes || 180} {t("papers.mins")}
                                    </Text>
                                    <MaterialIcon name="stars" size={16} color={COLORS.onSurfaceVariant} />
                                    <Text className="ml-1 text-xs text-onSurfaceVariant">
                                        {paper.total_marks || "-"} {t("papers.marks")}
                                    </Text>
                                    <View
                                        className={`ml-auto rounded-full px-3 py-1 ${
                                            level.toLowerCase() === "easy" ? "bg-success-light" : "bg-warning-light"
                                        }`}
                                    >
                                        <Text
                                            className={`text-xs font-bold ${
                                                level.toLowerCase() === "easy" ? "text-success" : "text-warning"
                                            }`}
                                        >
                                            {level}
                                        </Text>
                                    </View>
                                </View>

                                <Button
                                    title={cta}
                                    size="sm"
                                    fullWidth
                                    onPress={() => router.push(`/papers/${paper.id}`)}
                                    style={{ margin: 12 }}
                                />
                            </Card>
                        );
                    })
                )}

                {hasMore && visiblePapers.length > 0 && activeFilter === "All" ? (
                    <Button
                        title={loadingMore ? t("common.loading") : t("papers.loadMore")}
                        variant="outline"
                        onPress={() => loadPage({ append: true })}
                        disabled={loadingMore}
                        fullWidth
                    />
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}
