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
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

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

export default function RevisionCentreScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const [revisions, setRevisions] = useState<RevisionItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Format relative time from ISO date string
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

    // Get icon based on subject name
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
            // Transform and filter weak topics (accuracy < 70)
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
                // Sort by accuracy (lowest first = most urgent)
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

    // Calculate stats from real data
    const topicsToRevise = revisions.length;
    const questionsPending = revisions.reduce((sum, r) => sum + r.questions, 0);
    const avgAccuracy = topicsToRevise > 0
        ? Math.round(revisions.reduce((sum, r) => sum + r.accuracy, 0) / topicsToRevise)
        : 0;

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 80) return COLORS.success;
        if (accuracy >= 60) return COLORS.warning;
        return COLORS.error;
    };

    const getAccuracyLabel = (accuracy: number) => {
        if (accuracy >= 80) return "Mastered";
        if (accuracy >= 60) return "Improving";
        return "Needs Work";
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
                <LoadingSpinner message="Loading revision topics..." />
            </SafeAreaView>
        );
    }

    if (revisions.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View
                    style={{
                        alignItems: "center",
                        marginBottom: SPACING[6],
                    }}
                >
                    <MascotDisplay expression="thinking" size={100} showBackground />
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            marginTop: SPACING[3],
                        }}
                    >
                        Revision Centre
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginTop: SPACING[1],
                        }}
                    >
                        Topics that need more practice
                    </Text>
                </View>

                {/* Stats Summary */}
                <Card
                    variant="elevated"
                    style={{
                        backgroundColor: COLORS.primary,
                        marginBottom: SPACING[4],
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize["2xl"],
                                    fontWeight: "800",
                                    color: COLORS.onPrimary,
                                }}
                            >
                                {topicsToRevise}
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: "rgba(255,255,255,0.8)",
                                }}
                            >
                                Topics to Revise
                            </Text>
                        </View>
                        <View
                            style={{
                                width: 1,
                                backgroundColor: "rgba(255,255,255,0.3)",
                            }}
                        />
                        <View style={{ alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize["2xl"],
                                    fontWeight: "800",
                                    color: COLORS.onPrimary,
                                }}
                            >
                                {questionsPending}
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: "rgba(255,255,255,0.8)",
                                }}
                            >
                                Questions Pending
                            </Text>
                        </View>
                        <View
                            style={{
                                width: 1,
                                backgroundColor: "rgba(255,255,255,0.3)",
                            }}
                        />
                        <View style={{ alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize["2xl"],
                                    fontWeight: "800",
                                    color: COLORS.warning,
                                }}
                            >
                                {avgAccuracy}%
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: "rgba(255,255,255,0.8)",
                                }}
                            >
                                Avg. Accuracy
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Topics List */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING[3] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                        }}
                    >
                        Topics to Revisit
                    </Text>
                    <Pressable>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.primary,
                                fontWeight: "600",
                            }}
                        >
                            Sort by ▼
                        </Text>
                    </Pressable>
                </View>

                {revisions.map((item) => (
                    <Pressable
                        key={item.id}
                        onPress={() => router.push({
                            pathname: "/practice/session",
                            params: { subjectId: item.subjectId, topicId: item.id, count: "10" }
                        })}
                    >
                        <Card
                            variant="elevated"
                            style={{
                                marginBottom: SPACING[3],
                                borderLeftWidth: 4,
                                borderLeftColor: getAccuracyColor(item.accuracy),
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: COLORS.surfaceContainer,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: SPACING[3],
                                    }}
                                >
                                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.base,
                                            fontWeight: "700",
                                            color: COLORS.textPrimary,
                                        }}
                                    >
                                        {item.topic}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.sm,
                                            color: COLORS.textSecondary,
                                        }}
                                    >
                                        {item.subject} • {item.questions} questions • {item.lastAttempt}
                                    </Text>
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.lg,
                                            fontWeight: "700",
                                            color: getAccuracyColor(item.accuracy),
                                        }}
                                    >
                                        {item.accuracy}%
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.xs,
                                            color: COLORS.textTertiary,
                                        }}
                                    >
                                        {getAccuracyLabel(item.accuracy)}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </Pressable>
                ))}

                {/* Empty State Hint */}
                <Card
                    variant="outlined"
                    style={{
                        marginTop: SPACING[4],
                        backgroundColor: COLORS.surfaceMuted,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 32, marginBottom: SPACING[2] }}>💡</Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textPrimary,
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        Tip
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginTop: SPACING[1],
                            lineHeight: 20,
                        }}
                    >
                        Revising weak topics for 10 minutes daily can boost your score by 25%!
                    </Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
