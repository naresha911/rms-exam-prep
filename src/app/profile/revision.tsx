import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/ui/Card";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAppStore } from "../../store/useAppStore";
import { fetchTopicStats } from "../../lib/supabase";
import { SPACING, TYPOGRAPHY } from "../../constants";
import { layout, useThemedStyles, type ColorPalette } from "../../theme";

interface RevisionItem {
    id: string;
    topic: string;
    subject: string;
    subjectId: string;
    accuracy: number;
    lastAttempt: string;
    questions: number;
    icon: string;
}

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: SPACING[5],
        },
        header: {
            alignItems: "center" as const,
            marginBottom: SPACING[6],
        },
        title: {
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: "800" as const,
            color: colors.textPrimary,
            marginTop: SPACING[3],
        },
        subtitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.textSecondary,
            textAlign: "center" as const,
            marginTop: SPACING[1],
        },
        summaryCard: {
            backgroundColor: colors.primary,
            marginBottom: SPACING[4],
        },
        summaryRow: {
            flexDirection: "row" as const,
            justifyContent: "space-around" as const,
        },
        summaryStat: {
            alignItems: "center" as const,
        },
        summaryValue: {
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: "800" as const,
            color: colors.onPrimary,
        },
        summaryAccuracy: {
            color: colors.warning,
        },
        summaryLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onPrimary,
            opacity: 0.8,
        },
        summaryDivider: {
            width: 1,
            backgroundColor: colors.onPrimary,
            opacity: 0.3,
        },
        listHeader: {
            marginBottom: SPACING[3],
        },
        listTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: "700" as const,
            color: colors.textPrimary,
        },
        sortLabel: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.primary,
            fontWeight: "600" as const,
        },
        topicCardGood: {
            marginBottom: SPACING[3],
            borderLeftWidth: 4,
            borderLeftColor: colors.success,
        },
        topicCardMid: {
            marginBottom: SPACING[3],
            borderLeftWidth: 4,
            borderLeftColor: colors.warning,
        },
        topicCardLow: {
            marginBottom: SPACING[3],
            borderLeftWidth: 4,
            borderLeftColor: colors.error,
        },
        topicIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.surfaceContainer,
            marginRight: SPACING[3],
        },
        topicEmoji: {
            fontSize: 24,
        },
        topicBody: {
            flex: 1,
        },
        topicName: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "700" as const,
            color: colors.textPrimary,
        },
        topicMeta: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
        },
        topicScore: {
            alignItems: "flex-end" as const,
        },
        accuracyValue: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: "700" as const,
        },
        accuracyGood: {
            color: colors.success,
        },
        accuracyMid: {
            color: colors.warning,
        },
        accuracyLow: {
            color: colors.error,
        },
        accuracyCaption: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textTertiary,
        },
        tipCard: {
            marginTop: SPACING[4],
            backgroundColor: colors.surfaceMuted,
            alignItems: "center" as const,
        },
        tipEmoji: {
            fontSize: 32,
            marginBottom: SPACING[2],
        },
        tipTitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.textPrimary,
            textAlign: "center" as const,
            fontWeight: "600" as const,
        },
        tipBody: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            textAlign: "center" as const,
            marginTop: SPACING[1],
            lineHeight: 20,
        },
    };
}

export default function RevisionCentreScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const { user } = useAppStore();
    const [revisions, setRevisions] = useState<RevisionItem[]>([]);
    const [loading, setLoading] = useState(true);

    const formatLastAttempt = (dateStr: string): string => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? "s" : ""} ago`;
        return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? "s" : ""} ago`;
    };

    const getSubjectIcon = (subjectName: string): string => {
        const name = subjectName.toLowerCase();
        if (name.includes("math")) return "🔢";
        if (name.includes("english") || name.includes("language")) return "📖";
        if (name.includes("gk") || name.includes("general")) return "🌍";
        if (name.includes("science")) return "🔬";
        if (name.includes("intelligence") || name.includes("intel")) return "🧩";
        if (name.includes("social")) return "🏛️";
        return "📚";
    };

    const loadRevisions = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data, error } = await fetchTopicStats(user.id);

        if (!error && data && data.length > 0) {
            const transformed: RevisionItem[] = data
                .filter((stat: any) => {
                    const accuracy = stat.total_attempts > 0
                        ? (stat.correct_answers / stat.total_attempts) * 100
                        : 0;
                    return accuracy < 70 && stat.total_attempts > 0;
                })
                .map((stat: any) => {
                    const accuracy = stat.total_attempts > 0
                        ? Math.round((stat.correct_answers / stat.total_attempts) * 100)
                        : 0;
                    return {
                        id: stat.topic_id?.toString() || stat.topics?.id?.toString() || "0",
                        topic: stat.topics?.name || "Unknown Topic",
                        subject: stat.topics?.subjects?.name || "General",
                        subjectId: stat.topics?.subjects?.id?.toString() || "1",
                        accuracy,
                        lastAttempt: stat.updated_at ? formatLastAttempt(stat.updated_at) : "Recently",
                        questions: stat.total_attempts || 0,
                        icon: getSubjectIcon(stat.topics?.subjects?.name || ""),
                    };
                })
                .sort((a: RevisionItem, b: RevisionItem) => a.accuracy - b.accuracy);

            setRevisions(transformed);
        } else {
            setRevisions([]);
        }
        setLoading(false);
    }, [user?.id]);

    useEffect(() => {
        loadRevisions();
    }, [loadRevisions]);

    const topicsToRevise = revisions.length;
    const questionsPending = revisions.reduce((sum, r) => sum + r.questions, 0);
    const avgAccuracy = topicsToRevise > 0
        ? Math.round(revisions.reduce((sum, r) => sum + r.accuracy, 0) / topicsToRevise)
        : 0;

    const accuracyTone = (accuracy: number) => {
        if (accuracy >= 80) return { text: styles.accuracyGood, card: styles.topicCardGood };
        if (accuracy >= 60) return { text: styles.accuracyMid, card: styles.topicCardMid };
        return { text: styles.accuracyLow, card: styles.topicCardLow };
    };

    const getAccuracyLabel = (accuracy: number) => {
        if (accuracy >= 80) return "Mastered";
        if (accuracy >= 60) return "Improving";
        return "Needs Work";
    };

    if (loading) {
        return (
            <SafeAreaView style={[layout.fill, styles.screen]}>
                <LoadingSpinner message="Loading revision topics..." />
            </SafeAreaView>
        );
    }

    if (revisions.length === 0) {
        return (
            <SafeAreaView style={[layout.fill, styles.screen]}>
                <EmptyState
                    title="No Revision Topics Yet!"
                    description="Great work! You don't have any weak topics right now. Start practising to track your progress and find areas to improve."
                    mascot="encouraging"
                    actionLabel="Start Practising"
                    onAction={() => router.push("/(tabs)/practice")}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[layout.fill, styles.screen]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <MascotDisplay expression="thinking" size={100} showBackground />
                    <Text style={styles.title}>Revision Centre</Text>
                    <Text style={styles.subtitle}>Topics that need more practice</Text>
                </View>

                <Card variant="elevated" style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryStat}>
                            <Text style={styles.summaryValue}>{topicsToRevise}</Text>
                            <Text style={styles.summaryLabel}>Topics to Revise</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryStat}>
                            <Text style={styles.summaryValue}>{questionsPending}</Text>
                            <Text style={styles.summaryLabel}>Questions Pending</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryStat}>
                            <Text style={[styles.summaryValue, styles.summaryAccuracy]}>{avgAccuracy}%</Text>
                            <Text style={styles.summaryLabel}>Avg. Accuracy</Text>
                        </View>
                    </View>
                </Card>

                <View style={[layout.rowBetween, styles.listHeader]}>
                    <Text style={styles.listTitle}>Topics to Revisit</Text>
                    <Pressable>
                        <Text style={styles.sortLabel}>Sort by ▼</Text>
                    </Pressable>
                </View>

                {revisions.map((item) => {
                    const tone = accuracyTone(item.accuracy);
                    return (
                        <Pressable
                            key={item.id}
                            onPress={() => router.push({
                                pathname: "/practice/session",
                                params: { subjectId: item.subjectId, topicId: item.id, count: "10" }
                            })}
                        >
                            <Card variant="elevated" style={tone.card}>
                                <View style={layout.row}>
                                    <View style={[layout.center, styles.topicIcon]}>
                                        <Text style={styles.topicEmoji}>{item.icon}</Text>
                                    </View>
                                    <View style={styles.topicBody}>
                                        <Text style={styles.topicName}>{item.topic}</Text>
                                        <Text style={styles.topicMeta}>
                                            {item.subject} • {item.questions} questions • {item.lastAttempt}
                                        </Text>
                                    </View>
                                    <View style={styles.topicScore}>
                                        <Text style={[styles.accuracyValue, tone.text]}>{item.accuracy}%</Text>
                                        <Text style={styles.accuracyCaption}>{getAccuracyLabel(item.accuracy)}</Text>
                                    </View>
                                </View>
                            </Card>
                        </Pressable>
                    );
                })}

                <Card variant="outlined" style={styles.tipCard}>
                    <Text style={styles.tipEmoji}>💡</Text>
                    <Text style={styles.tipTitle}>Tip</Text>
                    <Text style={styles.tipBody}>
                        Revising weak topics for 10 minutes daily can boost your score by 25%!
                    </Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
