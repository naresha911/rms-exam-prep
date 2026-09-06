import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { fetchPaperDetails } from "@/lib/supabase";
import {
    createPaperPdfSignedUrl,
    fetchMyPaperAttemptSummaries,
    loadLocalPaperSession,
} from "@/lib/papers";
import { useAppStore } from "@/store/useAppStore";
import { COLORS, EXAM_STRUCTURE } from "@/constants";
import { PaperAttemptSummary, PaperWithQuestions } from "@/types";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { t } from "@/lib/i18n";

export default function PaperDetailScreen() {
    const router = useRouter();
    const { paperId } = useLocalSearchParams<{ paperId: string }>();
    const { user, onboardingData } = useAppStore();
    const targetClass = user?.target_class || onboardingData.targetClass || "6";
    const examInfo = targetClass === "9" ? EXAM_STRUCTURE.class9 : EXAM_STRUCTURE.class6;

    const [paper, setPaper] = useState<PaperWithQuestions | null>(null);
    const [summary, setSummary] = useState<PaperAttemptSummary | null>(null);
    const [hasLocal, setHasLocal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [pdfBusy, setPdfBusy] = useState(false);
    const [pdfProgress, setPdfProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const startLock = useRef(false);

    const loadPaper = useCallback(async () => {
        if (!paperId) {
            setError(t("papers.notFound"));
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data, error: queryError } = await fetchPaperDetails(paperId);
            if (queryError || !data) throw queryError || new Error("Paper not found");
            setPaper(data as PaperWithQuestions);

            const local = await loadLocalPaperSession(paperId);
            setHasLocal(!!local && local.status === "in_progress");

            const { data: summaries } = await fetchMyPaperAttemptSummaries();
            const mine = (summaries || []).find((s) => s.paper_id === paperId) || null;
            setSummary(mine);

            trackEvent(EVENTS.PAPER_OPENED, { paperId, year: (data as any).year });
        } catch (cause) {
            console.error("Failed to load paper:", cause);
            setError(t("papers.detailLoadFailed"));
        } finally {
            setLoading(false);
        }
    }, [paperId]);

    useEffect(() => {
        loadPaper();
    }, [loadPaper]);

    const inProgress = summary?.status === "in_progress" || hasLocal;
    const completed = summary?.status === "submitted";

    const startOrResume = async () => {
        if (!paper || startLock.current) return;
        startLock.current = true;
        setStarting(true);
        try {
            router.push(`/papers/${paper.id}/session`);
        } finally {
            setTimeout(() => {
                startLock.current = false;
                setStarting(false);
            }, 800);
        }
    };

    const openPdf = async () => {
        if (!paper?.pdf_path) {
            Alert.alert(t("papers.pdfMissingTitle"), t("papers.pdfMissingBody"));
            return;
        }
        setPdfBusy(true);
        setPdfProgress(0);
        try {
            const { data, error: signError } = await createPaperPdfSignedUrl(paper.pdf_path);
            if (signError || !data?.signedUrl) throw signError || new Error("No signed URL");

            const cacheDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
            const fileName = paper.pdf_path.split("/").pop() || `paper-${paper.id}.pdf`;
            const localUri = `${cacheDir}papers/${fileName}`;

            await FileSystem.makeDirectoryAsync(`${cacheDir}papers`, { intermediates: true }).catch(
                () => undefined
            );

            const info = await FileSystem.getInfoAsync(localUri);
            if (!info.exists) {
                const download = FileSystem.createDownloadResumable(
                    data.signedUrl,
                    localUri,
                    {},
                    (progress) => {
                        if (progress.totalBytesExpectedToWrite > 0) {
                            setPdfProgress(
                                progress.totalBytesWritten / progress.totalBytesExpectedToWrite
                            );
                        }
                    }
                );
                const result = await download.downloadAsync();
                if (!result?.uri) throw new Error("Download failed");
            }

            trackEvent(EVENTS.PAPER_PDF_OPENED, { paperId: paper.id });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(localUri, {
                    mimeType: "application/pdf",
                    dialogTitle: paper.title,
                });
            } else {
                await WebBrowser.openBrowserAsync(data.signedUrl);
            }
        } catch (cause) {
            console.error("PDF open failed:", cause);
            trackEvent(EVENTS.PAPER_DOWNLOAD_FAILED, { paperId: paper?.id });
            Alert.alert(t("papers.pdfFailedTitle"), t("papers.pdfFailedBody"));
        } finally {
            setPdfBusy(false);
            setPdfProgress(null);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <LoadingSpinner message={t("papers.loadingDetail")} />
            </SafeAreaView>
        );
    }

    if (error || !paper) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <EmptyState
                    title={t("papers.unavailable")}
                    description={error || t("papers.notFound")}
                    actionLabel={error ? t("common.retry") : t("papers.backToPapers")}
                    onAction={error ? loadPaper : () => router.back()}
                    mascot="sad"
                />
            </SafeAreaView>
        );
    }

    const questionCount = paper.paper_questions.length || examInfo.totalQuestions;
    const marks = paper.total_marks || examInfo.totalMarks;
    const duration = paper.duration_minutes || examInfo.durationMinutes;
    const sections = Array.from(
        new Set(paper.paper_questions.map((q) => q.section).filter(Boolean) as string[])
    );

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <View className="flex-row items-center border-b border-outline-variant p-4">
                <Pressable onPress={() => router.back()} className="p-2" accessibilityLabel={t("common.back")}>
                    <MaterialIcon name="arrow_back" size={24} color={COLORS.onSurface} />
                </Pressable>
                <Text className="flex-1 text-center text-lg font-bold text-onSurface" numberOfLines={1}>
                    {paper.title}
                </Text>
                <View className="w-10" />
            </View>

            <View className="flex-1 p-5">
                <View className="items-center">
                    <MascotDisplay expression="encouraging" size={120} />
                </View>
                <Text className="mt-3 text-center text-2xl font-extrabold text-onSurface">{paper.title}</Text>
                <Text className="mt-1 text-center text-base text-onSurfaceVariant">
                    {t("papers.detailSubtitle", { class: targetClass })}
                </Text>

                <Card variant="elevated" style={{ marginTop: 24, marginBottom: 16 }}>
                    <View className="gap-3">
                        <InfoRow icon="calendar_today" label={t("papers.year")} value={String(paper.year)} />
                        <InfoRow icon="school" label={t("papers.class")} value={`Class ${targetClass}`} />
                        <InfoRow icon="help" label={t("papers.questions")} value={String(questionCount)} />
                        <InfoRow icon="stars" label={t("papers.totalMarks")} value={String(marks)} />
                        <InfoRow icon="schedule" label={t("papers.duration")} value={`${duration} ${t("papers.minutes")}`} />
                        {paper.difficulty ? (
                            <InfoRow icon="trending_up" label={t("papers.difficulty")} value={paper.difficulty} />
                        ) : null}
                        {completed && summary?.total_score != null ? (
                            <InfoRow
                                icon="emoji_events"
                                label={t("papers.lastScore")}
                                value={`${summary.total_score}/${summary.max_score ?? marks}`}
                            />
                        ) : null}
                    </View>
                </Card>

                {sections.length > 0 && (
                    <View className="mb-4 flex-row flex-wrap gap-2">
                        {sections.map((section) => (
                            <View key={section} className="rounded-full bg-surface-container-high px-3 py-1">
                                <Text className="text-xs font-semibold text-onSurfaceVariant">{section}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <Card variant="surface" style={{ backgroundColor: COLORS.primaryFixed, marginBottom: 12 }}>
                    <View className="flex-row items-start">
                        <MaterialIcon name="info" size={22} color={COLORS.primary} />
                        <View className="ml-2 flex-1">
                            <Text className="font-bold text-primary">{t("papers.officialPractice")}</Text>
                            <Text className="mt-1 text-sm leading-5 text-onSurfaceVariant">
                                {inProgress
                                    ? t("papers.resumeHint")
                                    : t("papers.persistHint")}
                            </Text>
                        </View>
                    </View>
                </Card>

                {paper.pdf_path ? (
                    <Button
                        title={
                            pdfBusy
                                ? pdfProgress != null
                                    ? `${t("papers.downloading")} ${Math.round(pdfProgress * 100)}%`
                                    : t("papers.downloading")
                                : t("papers.openPdf")
                        }
                        variant="outline"
                        fullWidth
                        onPress={openPdf}
                        disabled={pdfBusy}
                        icon={<MaterialIcon name="assignment" size={20} color={COLORS.primary} />}
                        style={{ marginBottom: 12 }}
                    />
                ) : null}

                {completed ? (
                    <Button
                        title={t("papers.viewResult")}
                        variant="outline"
                        fullWidth
                        onPress={() =>
                            router.push(`/papers/${paper.id}/result?attemptId=${summary!.attempt_id}`)
                        }
                        style={{ marginBottom: 12 }}
                    />
                ) : null}

                <View className="flex-1" />

                <Button
                    title={
                        starting
                            ? t("common.loading")
                            : inProgress
                              ? t("papers.resume")
                              : completed
                                ? t("papers.reattempt")
                                : t("papers.attempt")
                    }
                    fullWidth
                    size="lg"
                    onPress={startOrResume}
                    disabled={starting}
                    iconRight="arrow_forward"
                />
                {starting ? <ActivityIndicator style={{ marginTop: 8 }} color={COLORS.primary} /> : null}
            </View>
        </SafeAreaView>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: "calendar_today" | "school" | "help" | "stars" | "schedule" | "trending_up" | "emoji_events";
    label: string;
    value: string;
}) {
    return (
        <View className="flex-row items-center">
            <MaterialIcon name={icon} size={20} color={COLORS.onSurfaceVariant} />
            <Text className="ml-3 flex-1 text-base text-onSurfaceVariant">{label}</Text>
            <Text className="text-base font-semibold text-onSurface">{value}</Text>
        </View>
    );
}
