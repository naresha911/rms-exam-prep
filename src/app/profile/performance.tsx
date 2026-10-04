// Performance Analysis Screen - Overall and subject-wise performance stats
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { fetchTopicStats } from "../../lib/supabase";
import { SPACING, TYPOGRAPHY, getSubjectsForStandard, normalizeStudentStandard } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
import { useState, useEffect, useCallback } from "react";

interface SubjectStats {
    id: number;
    name: string;
    icon: string;
    questionsAttempted: number;
    correctAnswers: number;
    accuracy: number;
    trend: "up" | "down" | "stable";
}

function getSubjectIcon(name: string): string {
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
}

function getTrendIcon(trend: string): string {
    switch (trend) {
        case "up": return "📈";
        case "down": return "📉";
        default: return "➡️";
    }
}

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            backgroundColor: colors.background,
        },
        header: {
            padding: SPACING[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
        },
        backButton: {
            padding: SPACING[2],
        },
        backIcon: {
            fontSize: 24,
            color: colors.textPrimary,
        },
        headerTitle: {
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: "700" as const,
            color: colors.textPrimary,
            textAlign: "center" as const,
            marginRight: 40,
        },
        scrollContent: {
            padding: SPACING[4],
        },
        overallCard: {
            marginBottom: SPACING[4],
        },
        overallHeader: {
            alignItems: "center" as const,
            marginBottom: SPACING[4],
        },
        overallScore: {
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: "800" as const,
            marginTop: SPACING[2],
        },
        accuracyLabel: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
        },
        statRow: {
            justifyContent: "space-around" as const,
            marginTop: SPACING[4],
        },
        quickStats: {
            flexDirection: "row" as const,
            gap: SPACING[3],
            marginBottom: SPACING[5],
        },
        quickCard: {
            flex: 1,
        },
        quickInner: {
            alignItems: "center" as const,
        },
        quickEmoji: {
            fontSize: 28,
        },
        quickValue: {
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: "800" as const,
        },
        streakValue: {
            color: colors.streakFire,
        },
        xpValue: {
            color: colors.xpGold,
        },
        levelValue: {
            color: colors.primary,
        },
        quickLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
        },
        sectionTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: "700" as const,
            color: colors.textPrimary,
            marginBottom: SPACING[3],
        },
        improveTitle: {
            marginTop: SPACING[2],
        },
        subjectPress: {
            marginBottom: SPACING[3],
        },
        subjectBody: {
            flex: 1,
            marginLeft: SPACING[3],
        },
        subjectName: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "600" as const,
            color: colors.textPrimary,
        },
        trendRow: {
            gap: SPACING[1],
        },
        trendIcon: {
            fontSize: 14,
        },
        subjectPercent: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "700" as const,
        },
        subjectMeta: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textTertiary,
            marginTop: 4,
        },
        iconWrap: {
            width: 48,
            height: 48,
            borderRadius: 12,
        },
        iconEmoji: {
            fontSize: 24,
        },
        iconBgSuccess: {
            backgroundColor: colors.success + "20",
        },
        iconBgPrimary: {
            backgroundColor: colors.primary + "20",
        },
        iconBgWarning: {
            backgroundColor: colors.warning + "20",
        },
        iconBgError: {
            backgroundColor: colors.error + "20",
        },
        toneSuccess: {
            color: colors.success,
        },
        tonePrimary: {
            color: colors.primary,
        },
        toneWarning: {
            color: colors.warning,
        },
        toneError: {
            color: colors.error,
        },
        weakCard: {
            marginBottom: SPACING[4],
            backgroundColor: colors.errorLight,
        },
        weakRow: {
            flexDirection: "row" as const,
            alignItems: "flex-start" as const,
        },
        weakEmoji: {
            fontSize: 24,
            marginRight: SPACING[2],
        },
        weakBody: {
            flex: 1,
        },
        weakTitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "700" as const,
            color: colors.error,
            marginBottom: 4,
        },
        weakItem: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            lineHeight: 20,
        },
        weakClear: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.success,
        },
        examCard: {
            backgroundColor: colors.primaryLight + "20",
        },
        examTitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "700" as const,
            color: colors.primary,
            marginBottom: SPACING[2],
        },
        statItem: {
            alignItems: "center" as const,
        },
        statEmoji: {
            fontSize: 20,
        },
        statValue: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: "800" as const,
            color: colors.textPrimary,
            marginTop: 4,
        },
        statLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
        },
    };
}

function StatItem({ value, label, emoji }: { value: string; label: string; emoji: string }) {
    const styles = useThemedStyles(createStyles);
    return (
        <View style={styles.statItem}>
            <Text style={styles.statEmoji}>{emoji}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

export default function PerformanceScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { user, xp, level, streak } = useAppStore();
    const targetClass = normalizeStudentStandard(user?.target_class);
    const subjects = getSubjectsForStandard(targetClass);

    const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
    const [, setLoading] = useState(true);
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

                    const stats: SubjectStats[] = subjects.map((s) => {
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

    const accuracyColor = (accuracy: number): string => {
        if (accuracy >= 80) return colors.success;
        if (accuracy >= 60) return colors.primary;
        if (accuracy >= 40) return colors.warning;
        return colors.error;
    };

    const toneStyle = (accuracy: number) => {
        if (accuracy >= 80) return styles.toneSuccess;
        if (accuracy >= 60) return styles.tonePrimary;
        if (accuracy >= 40) return styles.toneWarning;
        return styles.toneError;
    };

    const iconBgStyle = (accuracy: number) => {
        if (accuracy >= 80) return styles.iconBgSuccess;
        if (accuracy >= 60) return styles.iconBgPrimary;
        if (accuracy >= 40) return styles.iconBgWarning;
        return styles.iconBgError;
    };

    return (
        <SafeAreaView style={[layout.fill, styles.screen]}>
            <View style={[layout.row, styles.header]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backButton, pressed ? layout.pressed : null]}
                >
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>📊 Performance</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
            >
                <Card style={styles.overallCard}>
                    <View style={styles.overallHeader}>
                        <MascotDisplay
                            expression={overallAccuracy >= 60 ? "celebrating" : "encouraging"}
                            size={100}
                        />
                        <Text style={[styles.overallScore, toneStyle(overallAccuracy)]}>
                            {overallAccuracy}% Overall
                        </Text>
                        <Text style={styles.accuracyLabel}>Accuracy Score</Text>
                    </View>

                    <ProgressBar
                        progress={overallAccuracy / 100}
                        color={accuracyColor(overallAccuracy)}
                        showLabel={false}
                    />

                    <View style={[layout.row, styles.statRow]}>
                        <StatItem value={totalQuestions.toString()} label="Questions" emoji="❓" />
                        <StatItem value={totalCorrect.toString()} label="Correct" emoji="✅" />
                        <StatItem value={`${targetClass}`} label="Class" emoji="🎯" />
                    </View>
                </Card>

                <View style={styles.quickStats}>
                    <Card style={styles.quickCard}>
                        <View style={styles.quickInner}>
                            <Text style={styles.quickEmoji}>🔥</Text>
                            <Text style={[styles.quickValue, styles.streakValue]}>{streak}</Text>
                            <Text style={styles.quickLabel}>Day Streak</Text>
                        </View>
                    </Card>
                    <Card style={styles.quickCard}>
                        <View style={styles.quickInner}>
                            <Text style={styles.quickEmoji}>⭐</Text>
                            <Text style={[styles.quickValue, styles.xpValue]}>{xp}</Text>
                            <Text style={styles.quickLabel}>Total XP</Text>
                        </View>
                    </Card>
                    <Card style={styles.quickCard}>
                        <View style={styles.quickInner}>
                            <Text style={styles.quickEmoji}>🎖️</Text>
                            <Text style={[styles.quickValue, styles.levelValue]}>{level}</Text>
                            <Text style={styles.quickLabel}>Level</Text>
                        </View>
                    </Card>
                </View>

                <Text style={styles.sectionTitle}>📚 Subject Performance</Text>

                {subjectStats.map((subject) => (
                    <Pressable
                        key={subject.id}
                        onPress={() => {
                            // Navigate to subject detail
                        }}
                        style={styles.subjectPress}
                    >
                        <Card>
                            <View style={layout.row}>
                                <View style={[layout.center, styles.iconWrap, iconBgStyle(subject.accuracy)]}>
                                    <Text style={styles.iconEmoji}>{getSubjectIcon(subject.name)}</Text>
                                </View>
                                <View style={styles.subjectBody}>
                                    <View style={layout.rowBetween}>
                                        <Text style={styles.subjectName}>{subject.name}</Text>
                                        <View style={[layout.row, styles.trendRow]}>
                                            <Text style={styles.trendIcon}>{getTrendIcon(subject.trend)}</Text>
                                            <Text style={[styles.subjectPercent, toneStyle(subject.accuracy)]}>
                                                {subject.accuracy}%
                                            </Text>
                                        </View>
                                    </View>
                                    <ProgressBar
                                        progress={subject.accuracy / 100}
                                        color={accuracyColor(subject.accuracy)}
                                        showLabel={false}
                                        height={6}
                                    />
                                    <Text style={styles.subjectMeta}>
                                        {subject.correctAnswers}/{subject.questionsAttempted} correct
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </Pressable>
                ))}

                <Text style={[styles.sectionTitle, styles.improveTitle]}>🎯 Areas to Improve</Text>
                <Card style={styles.weakCard}>
                    <View style={styles.weakRow}>
                        <Text style={styles.weakEmoji}>💡</Text>
                        <View style={styles.weakBody}>
                            <Text style={styles.weakTitle}>Focus Areas</Text>
                            {subjectStats
                                .filter(s => s.accuracy < 60)
                                .slice(0, 3)
                                .map(s => (
                                    <Text key={s.id} style={styles.weakItem}>
                                        • {s.name} ({s.accuracy}% accuracy) - Practice more {s.name} questions
                                    </Text>
                                ))}
                            {subjectStats.filter(s => s.accuracy < 60).length === 0 && (
                                <Text style={styles.weakClear}>
                                    🎉 Great job! All subjects are above 60% accuracy!
                                </Text>
                            )}
                        </View>
                    </View>
                </Card>

                <Card style={styles.examCard}>
                    <Text style={styles.examTitle}>
                        📋 Exam Readiness: {overallAccuracy >= 70 ? "Ready" : overallAccuracy >= 50 ? "Almost There" : "Keep Practicing"}
                    </Text>
                    <ProgressBar
                        progress={overallAccuracy / 100}
                        color={colors.primary}
                        label={`${overallAccuracy}% towards exam readiness`}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
