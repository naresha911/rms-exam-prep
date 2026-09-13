// Performance Analysis Screen - Overall and subject-wise performance stats
import { View, Text, ScrollView, Pressable, Dimensions, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAppStore } from "../../store/useAppStore";
import { fetchTopicStats } from "../../lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY, getExamStructureForStandard, getSubjectsForStandard, normalizeStudentStandard } from "../../constants";
import { useState, useEffect, useCallback } from "react";

const { width } = Dimensions.get("window");

interface SubjectStats {
    id: number;
    name: string;
    icon: string;
    questionsAttempted: number;
    correctAnswers: number;
    accuracy: number;
    trend: "up" | "down" | "stable";
}

export default function PerformanceScreen() {
    const router = useRouter();
    const { user, dailyProgress, xp, level, streak } = useAppStore();
    const targetClass = normalizeStudentStandard(user?.target_class);
    const examInfo = getExamStructureForStandard(targetClass);
    const subjects = getSubjectsForStandard(targetClass);

    const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadPerformance = useCallback(async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const { data, error } = await fetchTopicStats(user.id);
                if (!error && data) {
                    // Transform topic stats to subject stats
                    const subjectMap = new Map<number, { attempted: number; correct: number }>();
                    data.forEach((stat: any) => {
                        const subjectId = stat.subject_id;
                        if (!subjectMap.has(subjectId)) {
                            subjectMap.set(subjectId, { attempted: 0, correct: 0 });
                        }
                        const current = subjectMap.get(subjectId)!;
                        current.attempted += stat.questions_attempted || 0;
                        current.correct += stat.correct_answers || 0;
                    });

                    const stats: SubjectStats[] = subjects.map((s, i) => {
                        const subjectData = subjectMap.get(s.id);
                        const attempted = subjectData?.attempted || 0;
                        const correct = subjectData?.correct || 0;
                        const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
                        return {
                            id: s.id,
                            name: s.name,
                            icon: getSubjectIcon(s.name),
                            questionsAttempted: attempted,
                            correctAnswers: correct,
                            accuracy,
                            trend: "stable" as "up" | "down" | "stable",
                        };
                    });
                    setSubjectStats(stats);
                }
            } catch (e) {
                console.error("Failed to load performance:", e);
            } finally {
                setLoading(false);
            }
        }, [user?.id]);
    useEffect(() => {
        loadPerformance();
    }, [user?.id]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadPerformance();
        setRefreshing(false);
    }, [user?.id]);

    const totalQuestions = subjectStats.reduce((sum, s) => sum + s.questionsAttempted, 0);
    const totalCorrect = subjectStats.reduce((sum, s) => sum + s.correctAnswers, 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const getSubjectIcon = (name: string): string => {
        const icons: Record<string, string> = {
            'Mathematics': '🔢',
            'Language': '📖',
            'Intelligence': '🧠',
            'General Knowledge': '🌍',
            'English': '📝',
            'General Science': '🔬',
            'Social Science': '🏛️',
        };
        return icons[name] || "📚";
    };

    const getAccuracyColor = (accuracy: number): string => {
        if (accuracy >= 80) return COLORS.success;
        if (accuracy >= 60) return COLORS.primary;
        if (accuracy >= 40) return COLORS.warning;
        return COLORS.error;
    };

    const getTrendIcon = (trend: string): string => {
        switch (trend) {
            case "up": return "📈";
            case "down": return "📉";
            default: return "➡️";
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: SPACING[4],
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.cardBorder,
                }}
            >
                <Pressable onPress={() => router.back()} style={{ padding: SPACING[2] }}>
                    <Text style={{ fontSize: 24 }}>←</Text>
                </Pressable>
                <Text
                    style={{
                        flex: 1,
                        fontSize: TYPOGRAPHY.fontSize.xl,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        textAlign: "center",
                        marginRight: 40,
                    }}
                >
                    📊 Performance
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: SPACING[4] }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
            >
                {/* Overall Performance Card */}
                <Card style={{ marginBottom: SPACING[4] }}>
                    <View style={{ alignItems: "center", marginBottom: SPACING[4] }}>
                        <MascotDisplay
                            expression={overallAccuracy >= 60 ? "celebrating" : "encouraging"}
                            size={100}
                        />
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize["2xl"],
                                fontWeight: "800",
                                color: getAccuracyColor(overallAccuracy),
                                marginTop: SPACING[2],
                            }}
                        >
                            {overallAccuracy}% Overall
                        </Text>
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>
                            Accuracy Score
                        </Text>
                    </View>

                    <ProgressBar
                        progress={overallAccuracy / 100}
                        color={getAccuracyColor(overallAccuracy)}
                        showLabel={false}
                    />

                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: SPACING[4] }}>
                        <StatItem value={totalQuestions.toString()} label="Questions" emoji="❓" />
                        <StatItem value={totalCorrect.toString()} label="Correct" emoji="✅" />
                        <StatItem value={`${targetClass}`} label="Class" emoji="🎯" />
                    </View>
                </Card>

                {/* Quick Stats */}
                <View style={{ flexDirection: "row", gap: SPACING[3], marginBottom: SPACING[5] }}>
                    <Card style={{ flex: 1 }}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 28 }}>🔥</Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xl,
                                    fontWeight: "800",
                                    color: COLORS.streakFire,
                                }}
                            >
                                {streak}
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                                Day Streak
                            </Text>
                        </View>
                    </Card>
                    <Card style={{ flex: 1 }}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 28 }}>⭐</Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xl,
                                    fontWeight: "800",
                                    color: COLORS.xpGold,
                                }}
                            >
                                {xp}
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                                Total XP
                            </Text>
                        </View>
                    </Card>
                    <Card style={{ flex: 1 }}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 28 }}>🎖️</Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xl,
                                    fontWeight: "800",
                                    color: COLORS.primary,
                                }}
                            >
                                {level}
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                                Level
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Subject-wise Performance */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    📚 Subject Performance
                </Text>

                {subjectStats.map((subject) => (
                    <Pressable
                        key={subject.id}
                        onPress={() => {
                            // Navigate to subject detail
                        }}
                        style={{ marginBottom: SPACING[3] }}
                    >
                        <Card>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        backgroundColor: getAccuracyColor(subject.accuracy) + "20",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 24 }}>{getSubjectIcon(subject.name)}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: SPACING[3] }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.base,
                                                fontWeight: "600",
                                                color: COLORS.textPrimary,
                                            }}
                                        >
                                            {subject.name}
                                        </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[1] }}>
                                            <Text style={{ fontSize: 14 }}>{getTrendIcon(subject.trend)}</Text>
                                            <Text
                                                style={{
                                                    fontSize: TYPOGRAPHY.fontSize.base,
                                                    fontWeight: "700",
                                                    color: getAccuracyColor(subject.accuracy),
                                                }}
                                            >
                                                {subject.accuracy}%
                                            </Text>
                                        </View>
                                    </View>
                                    <ProgressBar
                                        progress={subject.accuracy / 100}
                                        color={getAccuracyColor(subject.accuracy)}
                                        showLabel={false}
                                        height={6}
                                    />
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.xs,
                                            color: COLORS.textTertiary,
                                            marginTop: 4,
                                        }}
                                    >
                                        {subject.correctAnswers}/{subject.questionsAttempted} correct
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </Pressable>
                ))}

                {/* Weak Areas */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginTop: SPACING[2],
                        marginBottom: SPACING[3],
                    }}
                >
                    🎯 Areas to Improve
                </Text>
                <Card style={{ marginBottom: SPACING[4], backgroundColor: COLORS.errorLight }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                        <Text style={{ fontSize: 24, marginRight: SPACING[2] }}>💡</Text>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.base,
                                    fontWeight: "700",
                                    color: COLORS.error,
                                    marginBottom: 4,
                                }}
                            >
                                Focus Areas
                            </Text>
                            {subjectStats
                                .filter(s => s.accuracy < 60)
                                .slice(0, 3)
                                .map(s => (
                                    <Text key={s.id} style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, lineHeight: 20 }}>
                                        • {s.name} ({s.accuracy}% accuracy) - Practice more {s.name} questions
                                    </Text>
                                ))}
                            {subjectStats.filter(s => s.accuracy < 60).length === 0 && (
                                <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.success }}>
                                    🎉 Great job! All subjects are above 60% accuracy!
                                </Text>
                            )}
                        </View>
                    </View>
                </Card>

                {/* Exam Readiness */}
                <Card style={{ backgroundColor: COLORS.primaryLight + "20" }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            fontWeight: "700",
                            color: COLORS.primary,
                            marginBottom: SPACING[2],
                        }}
                    >
                        📋 Exam Readiness: {overallAccuracy >= 70 ? "Ready" : overallAccuracy >= 50 ? "Almost There" : "Keep Practicing"}
                    </Text>
                    <ProgressBar
                        progress={overallAccuracy / 100}
                        color={COLORS.primary}
                        label={`${overallAccuracy}% towards exam readiness`}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatItem({ value, label, emoji }: { value: string; label: string; emoji: string }) {
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}>{emoji}</Text>
            <Text
                style={{
                    fontSize: TYPOGRAPHY.fontSize.lg,
                    fontWeight: "800",
                    color: COLORS.textPrimary,
                    marginTop: 4,
                }}
            >
                {value}
            </Text>
            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                {label}
            </Text>
        </View>
    );
}
