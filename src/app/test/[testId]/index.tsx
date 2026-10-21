import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MaterialIcon, MaterialIconName } from "@/components/ui/MaterialIcon";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { fetchMyTestAttemptSummaries, fetchTestMeta, getTestListStatus } from "@/lib/tests";
import { useAppStore } from "@/store/useAppStore";
import { SPACING, TYPOGRAPHY, getExamStructureForStandard, normalizeStudentStandard } from "@/constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";
import { TestAttemptSummary, TestWithSections } from "@/types";
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
        scroll: {
            padding: SPACING[5],
            paddingBottom: SPACING[6],
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
        cardTitle: {
            marginBottom: SPACING[4],
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.onSurface,
        },
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
        sectionsCard: { marginBottom: SPACING[4] },
        sectionList: { gap: SPACING[2] },
        sectionRow: { paddingVertical: SPACING[2] },
        sectionDivider: {
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineVariant,
        },
        sectionName: {
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            color: colors.onSurface,
        },
        sectionDetail: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.onSurfaceVariant,
        },
        instructionsCard: {
            backgroundColor: colors.primaryFixed,
            marginBottom: SPACING[4],
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
        instructionsList: { marginTop: SPACING[2] },
        resultButton: { marginBottom: SPACING[3] },
        footer: {
            paddingHorizontal: SPACING[5],
            paddingTop: SPACING[3],
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
        },
        spinner: { marginTop: SPACING[2] },
    };
}

export default function MockTestDetailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { testId } = useLocalSearchParams<{ testId: string }>();
    const { user, onboardingData } = useAppStore();
    const isAdmin = user?.role === 'admin';
    const targetClass = normalizeStudentStandard(user?.target_class || onboardingData.targetClass);
    const examInfo = getExamStructureForStandard(targetClass);

    const [test, setTest] = useState<TestWithSections | null>(null);
    const [summary, setSummary] = useState<TestAttemptSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const startLock = useRef(false);
    const footerInset = useMemo(
        () => StyleSheet.create({ pad: { paddingBottom: Math.max(insets.bottom, SPACING[4]) } }),
        [insets.bottom]
    );

    const loadTest = useCallback(async () => {
        if (!testId) {
            setError(t("tests.notFound"));
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data, error: queryError } = await fetchTestMeta(testId, isAdmin);
            if (queryError || !data) throw queryError || new Error("Test not found");
            setTest(data);

            const { data: summaries } = await fetchMyTestAttemptSummaries();
            const mine = (summaries || []).find((s) => s.test_id === testId) || null;
            setSummary(mine);

            trackEvent(EVENTS.TEST_OPENED, { testId, title: data.title });
        } catch (cause) {
            console.error("Failed to load mock test:", cause);
            setError(t("tests.detailLoadFailed"));
        } finally {
            setLoading(false);
        }
    }, [testId, isAdmin]);

    useEffect(() => {
        loadTest();
    }, [loadTest]);

    const status = getTestListStatus(summary);
    const inProgress = status === "in_progress";
    const completed = status === "completed";

    const startOrResume = async () => {
        if (!test || startLock.current) return;
        startLock.current = true;
        setStarting(true);
        try {
            router.push({
                pathname: "/test/session",
                params: {
                    type: "full",
                    testId: test.id,
                    class: targetClass,
                },
            });
        } finally {
            setTimeout(() => {
                startLock.current = false;
                setStarting(false);
            }, 800);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.screen} edges={["top"]}>
                <LoadingSpinner message={t("tests.loadingDetail")} />
            </SafeAreaView>
        );
    }

    if (error || !test) {
        return (
            <SafeAreaView style={styles.screen} edges={["top"]}>
                <EmptyState
                    title={t("tests.unavailable")}
                    description={error || t("tests.notFound")}
                    actionLabel={error ? t("common.retry") : t("tests.backToTests")}
                    onAction={error ? loadTest : () => router.back()}
                    mascot="sad"
                />
            </SafeAreaView>
        );
    }

    const questionCount = test.question_count || examInfo.totalQuestions;
    const marks = test.total_marks || examInfo.totalMarks;
    const duration = test.duration_minutes || examInfo.durationMinutes;
    const negativeLabel = test.negative_marking ? t("tests.negativeValue") : t("tests.negativeNone");

    const displaySections =
        test.test_sections?.length > 0
            ? test.test_sections.map((section) => ({
                  name: section.name,
                  detail:
                      section.time_limit_seconds != null
                          ? `${Math.round(section.time_limit_seconds / 60)} min`
                          : t("tests.sectionLine", {
                                questions: "—",
                                marks: section.default_marks ?? "—",
                            }),
              }))
            : examInfo.sections.map((section) => ({
                  name: section.name,
                  detail: t("tests.sectionLine", {
                      questions: section.questions,
                      marks: section.marks,
                  }),
              }));

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
                    {test.title}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={layout.fill}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.hero}>
                    <MascotDisplay expression="encouraging" size={120} />
                </View>
                <Text style={styles.title}>{test.title}</Text>
                <Text style={styles.subtitle}>
                    {t("tests.detailSubtitle", { class: targetClass })}
                </Text>

                <Card variant="elevated" style={styles.detailsCard}>
                    <Text style={styles.cardTitle}>{t("tests.examDetails")}</Text>
                    <View style={styles.infoList}>
                        <InfoRow icon="school" label={t("tests.class")} value={`Class ${targetClass}`} />
                        <InfoRow icon="help" label={t("tests.questions")} value={String(questionCount)} />
                        <InfoRow icon="stars" label={t("tests.totalMarks")} value={String(marks)} />
                        <InfoRow
                            icon="schedule"
                            label={t("tests.duration")}
                            value={`${duration} ${t("tests.minutes")}`}
                        />
                        <InfoRow icon="flag" label={t("tests.negativeMarking")} value={negativeLabel} />
                        {completed && summary?.total_score != null ? (
                            <InfoRow
                                icon="emoji_events"
                                label={t("tests.lastScore")}
                                value={`${summary.total_score}/${summary.max_score ?? marks}`}
                            />
                        ) : null}
                    </View>
                </Card>

                <Card variant="elevated" style={styles.sectionsCard}>
                    <Text style={styles.cardTitle}>{t("tests.sections")}</Text>
                    <View style={styles.sectionList}>
                        {displaySections.map((section, idx) => (
                            <View
                                key={`${section.name}-${idx}`}
                                style={[
                                    layout.rowBetween,
                                    styles.sectionRow,
                                    idx < displaySections.length - 1 ? styles.sectionDivider : null,
                                ]}
                            >
                                <Text style={styles.sectionName}>{section.name}</Text>
                                <Text style={styles.sectionDetail}>{section.detail}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                <Card variant="surface" style={styles.instructionsCard}>
                    <View style={[layout.row, styles.instructionsRow]}>
                        <MaterialIcon name="info" size={22} color={colors.primary} />
                        <View style={styles.instructionsBody}>
                            <Text style={styles.instructionsTitle}>{t("tests.instructionsTitle")}</Text>
                            <Text style={styles.instructionsText}>
                                {inProgress ? t("tests.resumeHint") : t("tests.persistHint")}
                            </Text>
                            <Text style={[styles.instructionsText, styles.instructionsList]}>
                                {`• ${t("tests.instruction1")}\n• ${t("tests.instruction2")}\n• ${t("tests.instruction3")}\n• ${t("tests.instruction4")}`}
                            </Text>
                        </View>
                    </View>
                </Card>

                {completed ? (
                    <Button
                        title={t("tests.viewResult")}
                        variant="outline"
                        fullWidth
                        onPress={() =>
                            router.push({
                                pathname: "/test/result",
                                params: {
                                    correct: String(Math.round(summary?.total_score ?? 0)),
                                    total: String(Math.round(summary?.max_score ?? marks)),
                                    time: String(summary?.time_spent_seconds ?? 0),
                                    type: "full",
                                },
                            })
                        }
                        style={styles.resultButton}
                    />
                ) : null}
            </ScrollView>

            <View style={[styles.footer, footerInset.pad]}>
                <Button
                    title={
                        starting
                            ? t("common.loading")
                            : inProgress
                              ? t("tests.resume")
                              : completed
                                ? t("tests.reattempt")
                                : t("tests.attempt")
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
    icon: MaterialIconName;
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
