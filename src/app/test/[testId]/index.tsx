import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
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
import { COLORS, SPACING, getExamStructureForStandard, normalizeStudentStandard } from "@/constants";
import { TestAttemptSummary, TestWithSections } from "@/types";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { t } from "@/lib/i18n";

export default function MockTestDetailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { testId } = useLocalSearchParams<{ testId: string }>();
    const { user, onboardingData } = useAppStore();
    const targetClass = normalizeStudentStandard(user?.target_class || onboardingData.targetClass);
    const examInfo = getExamStructureForStandard(targetClass);

    const [test, setTest] = useState<TestWithSections | null>(null);
    const [summary, setSummary] = useState<TestAttemptSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const startLock = useRef(false);

    const loadTest = useCallback(async () => {
        if (!testId) {
            setError(t("tests.notFound"));
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data, error: queryError } = await fetchTestMeta(testId);
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
    }, [testId]);

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
            <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
                <LoadingSpinner message={t("tests.loadingDetail")} />
            </SafeAreaView>
        );
    }

    if (error || !test) {
        return (
            <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <View className="flex-row items-center border-b border-outline-variant p-4">
                <Pressable
                    onPress={() => router.back()}
                    className="p-2"
                    accessibilityLabel={t("common.back")}
                >
                    <MaterialIcon name="arrow_back" size={24} color={COLORS.onSurface} />
                </Pressable>
                <Text className="flex-1 text-center text-lg font-bold text-onSurface" numberOfLines={1}>
                    {test.title}
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: SPACING[5], paddingBottom: SPACING[6] }}
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center">
                    <MascotDisplay expression="encouraging" size={120} />
                </View>
                <Text className="mt-3 text-center text-2xl font-extrabold text-onSurface">{test.title}</Text>
                <Text className="mt-1 text-center text-base text-onSurfaceVariant">
                    {t("tests.detailSubtitle", { class: targetClass })}
                </Text>

                <Card variant="elevated" style={{ marginTop: 24, marginBottom: 16 }}>
                    <Text className="mb-4 text-lg font-bold text-onSurface">{t("tests.examDetails")}</Text>
                    <View className="gap-3">
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

                <Card variant="elevated" style={{ marginBottom: 16 }}>
                    <Text className="mb-4 text-lg font-bold text-onSurface">{t("tests.sections")}</Text>
                    <View className="gap-2">
                        {displaySections.map((section, idx) => (
                            <View
                                key={`${section.name}-${idx}`}
                                className="flex-row items-center justify-between py-2"
                                style={{
                                    borderBottomWidth: idx < displaySections.length - 1 ? 1 : 0,
                                    borderBottomColor: COLORS.outlineVariant,
                                }}
                            >
                                <Text className="flex-1 text-base font-medium text-onSurface">{section.name}</Text>
                                <Text className="text-base text-onSurfaceVariant">{section.detail}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                <Card variant="surface" style={{ backgroundColor: COLORS.primaryFixed, marginBottom: 16 }}>
                    <View className="flex-row items-start">
                        <MaterialIcon name="info" size={22} color={COLORS.primary} />
                        <View className="ml-2 flex-1">
                            <Text className="font-bold text-primary">{t("tests.instructionsTitle")}</Text>
                            <Text className="mt-1 text-sm leading-5 text-onSurfaceVariant">
                                {inProgress ? t("tests.resumeHint") : t("tests.persistHint")}
                            </Text>
                            <Text className="mt-2 text-sm leading-5 text-onSurfaceVariant">
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
                        style={{ marginBottom: 12 }}
                    />
                ) : null}
            </ScrollView>

            <View
                style={{
                    paddingHorizontal: SPACING[5],
                    paddingTop: SPACING[3],
                    paddingBottom: Math.max(insets.bottom, SPACING[4]),
                    backgroundColor: COLORS.background,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.outlineVariant,
                }}
            >
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
    icon: MaterialIconName;
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
