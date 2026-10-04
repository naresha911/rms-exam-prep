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
import { BORDER_RADIUS, SPACING, TYPOGRAPHY, getExamStructureForStandard, normalizeStudentStandard } from "@/constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";
import { PaperAttemptSummary, PaperWithQuestions } from "@/types";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { t } from "@/lib/i18n";

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            padding: SPACING[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineVariant,
        },
        backBtn: { padding: SPACING[2] },
        headerTitle: {
            flex: 1,
            textAlign: "center" as const,
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.onSurface,
        },
        headerSpacer: { width: 40 },
        body: {
            flex: 1,
            padding: SPACING[5],
        },
        hero: { alignItems: "center" as const },
        title: {
            marginTop: SPACING[3],
            textAlign: "center" as const,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            color: colors.onSurface,
        },
        subtitle: {
            marginTop: SPACING[1],
            textAlign: "center" as const,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.onSurfaceVariant,
        },
        detailsCard: { marginTop: SPACING[6], marginBottom: SPACING[4] },
        infoList: { gap: SPACING[3] },
        infoLabel: {
            marginLeft: SPACING[3],
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.onSurfaceVariant,
        },
        infoValue: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            color: colors.onSurface,
        },
        chips: {
            flexWrap: "wrap" as const,
            gap: SPACING[2],
            marginBottom: SPACING[4],
        },
        chip: {
            borderRadius: BORDER_RADIUS.full,
            backgroundColor: colors.surfaceContainerHigh,
            paddingHorizontal: SPACING[3],
            paddingVertical: SPACING[1],
        },
        chipText: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            color: colors.onSurfaceVariant,
        },
        instructionsCard: {
            backgroundColor: colors.primaryFixed,
            marginBottom: SPACING[3],
        },
        instructionsRow: { alignItems: "flex-start" as const },
        instructionsBody: { marginLeft: SPACING[2], flex: 1 },
        instructionsTitle: {
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.primary,
        },
        instructionsText: {
            marginTop: SPACING[1],
            fontSize: TYPOGRAPHY.fontSize.sm,
            lineHeight: 20,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.onSurfaceVariant,
        },
        actionButton: { marginBottom: SPACING[3] },
        spinner: { marginTop: SPACING[2] },
    };
}

export default function PaperDetailScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { paperId } = useLocalSearchParams<{ paperId: string }>();
    const { user, onboardingData } = useAppStore();
    const targetClass = normalizeStudentStandard(user?.target_class || onboardingData.targetClass);
    const examInfo = getExamStructureForStandard(targetClass);

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
            <SafeAreaView style={styles.screen}>
                <LoadingSpinner message={t("papers.loadingDetail")} />
            </SafeAreaView>
        );
    }

    if (error || !paper) {
        return (
            <SafeAreaView style={styles.screen}>
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
        <SafeAreaView style={styles.screen} edges={["top"]}>
            <View style={[layout.row, styles.header]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backBtn, pressed && layout.pressed]}
                    accessibilityLabel={t("common.back")}
                >
                    <MaterialIcon name="arrow_back" size={24} color={colors.onSurface} />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {paper.title}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.body}>
                <View style={styles.hero}>
                    <MascotDisplay expression="encouraging" size={120} />
                </View>
                <Text style={styles.title}>{paper.title}</Text>
                <Text style={styles.subtitle}>
                    {t("papers.detailSubtitle", { class: targetClass })}
                </Text>

                <Card variant="elevated" style={styles.detailsCard}>
                    <View style={styles.infoList}>
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
                    <View style={[layout.row, styles.chips]}>
                        {sections.map((section) => (
                            <View key={section} style={styles.chip}>
                                <Text style={styles.chipText}>{section}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <Card variant="surface" style={styles.instructionsCard}>
                    <View style={[layout.row, styles.instructionsRow]}>
                        <MaterialIcon name="info" size={22} color={colors.primary} />
                        <View style={styles.instructionsBody}>
                            <Text style={styles.instructionsTitle}>{t("papers.officialPractice")}</Text>
                            <Text style={styles.instructionsText}>
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
                        icon={<MaterialIcon name="assignment" size={20} color={colors.primary} />}
                        style={styles.actionButton}
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
                        style={styles.actionButton}
                    />
                ) : null}

                <View style={layout.fill} />

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
                {starting ? <ActivityIndicator style={styles.spinner} color={colors.primary} /> : null}
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
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    return (
        <View style={layout.row}>
            <MaterialIcon name={icon} size={20} color={colors.onSurfaceVariant} />
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
}
