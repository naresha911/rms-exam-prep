import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Avatar } from "../../components/ui/Avatar";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { StreakDisplay } from "../../components/shared/StreakDisplay";
import { XpDisplay } from "../../components/shared/XpDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, EXAM_STRUCTURE } from "../../constants";

export default function HomeScreen() {
    const router = useRouter();
    const { user, dailyProgress, preferences, streak, xp, level, lastPracticeActivity } = useAppStore();

    const firstName = user?.full_name?.split(" ")[0] || "there";
    const dailyGoal = preferences.dailyGoal;
    const progress = Math.min(dailyProgress.questionsAnswered / dailyGoal, 1);
    const remaining = Math.max(dailyGoal - dailyProgress.questionsAnswered, 0);

    // Get exam structure based on target class
    const examInfo = user?.target_class === "9" ? EXAM_STRUCTURE.class9 : EXAM_STRUCTURE.class6;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: SPACING[5],
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize["2xl"],
                                fontWeight: "800",
                                color: COLORS.textPrimary,
                            }}
                        >
                            Hello, {firstName}! 👋
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.base,
                                color: COLORS.textSecondary,
                                marginTop: 4,
                            }}
                        >
                            Ready for today's mission?
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: SPACING[2] }}>
                        <StreakDisplay streak={streak} size="sm" showLabel={false} />
                        <XpDisplay xp={xp} level={level} size="sm" />
                    </View>
                </View>

                {/* Daily Goal Card */}
                <Card variant="elevated" style={{ marginBottom: SPACING[4] }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[4] }}>
                        <MascotDisplay expression="happy" size={60} />
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.lg,
                                    fontWeight: "700",
                                    color: COLORS.textPrimary,
                                }}
                            >
                                Today's Goal
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize["2xl"],
                                    fontWeight: "800",
                                    color: COLORS.primary,
                                    marginTop: 4,
                                }}
                            >
                                {dailyProgress.questionsAnswered} / {dailyGoal}
                            </Text>
                        </View>
                    </View>

                    <ProgressBar
                        progress={progress}
                        height={10}
                        color={COLORS.primary}
                        style={{ marginTop: SPACING[4] }}
                    />

                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            color: COLORS.textSecondary,
                            marginTop: SPACING[2],
                        }}
                    >
                        {remaining > 0 ? `${remaining} questions remaining` : "Goal achieved! 🎉"}
                    </Text>

                    <Button
                        title="Continue Practice"
                        onPress={() => router.push("/(tabs)/practice")}
                        style={{ marginTop: SPACING[4] }}
                        icon={<Text>→</Text>}
                    />
                </Card>

                {/* Continue Learning Card */}
                {lastPracticeActivity && (
                    <Card
                        variant="elevated"
                        style={{ marginBottom: SPACING[4] }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[3] }}>
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    backgroundColor: COLORS.primaryLight + "30",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ fontSize: 24 }}>📚</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        color: COLORS.textTertiary,
                                        fontWeight: "600",
                                    }}
                                >
                                    Continue Learning
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: "700",
                                        color: COLORS.textPrimary,
                                        marginTop: 2,
                                    }}
                                >
                                    {lastPracticeActivity.subjectName}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.xs,
                                        color: COLORS.textSecondary,
                                        marginTop: 2,
                                    }}
                                >
                                    {lastPracticeActivity.progress}% complete
                                </Text>
                            </View>
                            <Button
                                title="Continue"
                                onPress={() =>
                                    router.push({
                                        pathname: "/practice/[subjectId]" as any,
                                        params: { subjectId: lastPracticeActivity.subjectId.toString() },
                                    })
                                }
                                size="sm"
                            />
                        </View>
                    </Card>
                )}

                {/* Quick Actions */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Quick Actions
                </Text>
                <View style={{ flexDirection: "row", gap: SPACING[3], marginBottom: SPACING[5] }}>
                    <Pressable
                        onPress={() => router.push("/(tabs)/practice")}
                        style={({ pressed }) => ({
                            flex: 1,
                            backgroundColor: "#EDE9FE",
                            padding: SPACING[4],
                            borderRadius: BORDER_RADIUS.xl,
                            alignItems: "center",
                            opacity: pressed ? 0.8 : 1,
                        })}
                    >
                        <Text style={{ fontSize: 28 }}>📖</Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: "600",
                                color: COLORS.primary,
                                marginTop: SPACING[2],
                            }}
                        >
                            Practice
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/(tabs)/tests")}
                        style={({ pressed }) => ({
                            flex: 1,
                            backgroundColor: "#FEF3C7",
                            padding: SPACING[4],
                            borderRadius: BORDER_RADIUS.xl,
                            alignItems: "center",
                            opacity: pressed ? 0.8 : 1,
                        })}
                    >
                        <Text style={{ fontSize: 28 }}>📝</Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: "600",
                                color: "#B45309",
                                marginTop: SPACING[2],
                            }}
                        >
                            Mock Test
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/(tabs)/practice")}
                        style={({ pressed }) => ({
                            flex: 1,
                            backgroundColor: "#D1FAE5",
                            padding: SPACING[4],
                            borderRadius: BORDER_RADIUS.xl,
                            alignItems: "center",
                            opacity: pressed ? 0.8 : 1,
                        })}
                    >
                        <Text style={{ fontSize: 28 }}>📚</Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: "600",
                                color: "#059669",
                                marginTop: SPACING[2],
                            }}
                        >
                            Papers
                        </Text>
                    </Pressable>
                </View>

                {/* Today's Mission */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Today's Mission
                </Text>
                <Card style={{ marginBottom: SPACING[4] }}>
                    <MissionItem
                        emoji="📐"
                        title="Mathematics"
                        subtitle="Practice Fractions"
                        status="not_started"
                        onPress={() => router.push("/(tabs)/practice")}
                    />
                    <MissionItem
                        emoji="🧠"
                        title="Intelligence"
                        subtitle="Number Series"
                        status="not_started"
                        onPress={() => router.push("/(tabs)/practice")}
                    />
                    <MissionItem
                        emoji="🌍"
                        title="General Knowledge"
                        subtitle="India - States & Capitals"
                        status="not_started"
                        onPress={() => router.push("/(tabs)/practice")}
                    />
                </Card>

                {/* Exam Countdown */}
                <Card
                    variant="elevated"
                    style={{
                        backgroundColor: COLORS.primary,
                        marginBottom: SPACING[4],
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[4] }}>
                        <Text style={{ fontSize: 40 }}>🎯</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: TYPOGRAPHY.fontSize.sm }}>
                                AISSEE {user?.target_class === "9" ? "Class 9" : "Class 6"}
                            </Text>
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: TYPOGRAPHY.fontSize.xl,
                                    fontWeight: "800",
                                    marginTop: 4,
                                }}
                            >
                                Full Mock Test
                            </Text>
                            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: TYPOGRAPHY.fontSize.xs, marginTop: 4 }}>
                                {examInfo.totalQuestions} questions • {examInfo.durationMinutes} mins • {examInfo.totalMarks} marks
                            </Text>
                        </View>
                    </View>
                    <Button
                        title="Start Test"
                        onPress={() => router.push("/(tabs)/tests")}
                        variant="secondary"
                        style={{
                            marginTop: SPACING[4],
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderColor: "#fff",
                        }}
                        textStyle={{ color: "#fff" }}
                    />
                </Card>

                {/* Stats Overview */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Your Progress
                </Text>
                <View style={{ flexDirection: "row", gap: SPACING[3] }}>
                    <StatCard
                        label="Questions"
                        value={dailyProgress.questionsAnswered}
                        icon="❓"
                    />
                    <StatCard
                        label="Accuracy"
                        value={`${dailyProgress.questionsAnswered > 0
                            ? Math.round((dailyProgress.correctAnswers / dailyProgress.questionsAnswered) * 100)
                            : 0}%`}
                        icon="🎯"
                    />
                    <StatCard
                        label="Streak"
                        value={`${streak}d`}
                        icon="🔥"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function MissionItem({
    emoji,
    title,
    subtitle,
    status,
    onPress,
}: {
    emoji: string;
    title: string;
    subtitle: string;
    status: "not_started" | "completed" | "in_progress";
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: SPACING[3],
                borderBottomWidth: 1,
                borderBottomColor: COLORS.cardBorder,
                opacity: pressed ? 0.7 : 1,
            })}
        >
            <Text style={{ fontSize: 24, marginRight: SPACING[3] }}>{emoji}</Text>
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        fontWeight: "600",
                        color: COLORS.textPrimary,
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        color: COLORS.textSecondary,
                        marginTop: 2,
                    }}
                >
                    {subtitle}
                </Text>
            </View>
            <View
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: COLORS.primary,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={{ color: COLORS.primary, fontSize: 12 }}>→</Text>
            </View>
        </Pressable>
    );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.backgroundSecondary,
                padding: SPACING[3],
                borderRadius: BORDER_RADIUS.lg,
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 20 }}>{icon}</Text>
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
            <Text
                style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.textSecondary,
                    marginTop: 2,
                }}
            >
                {label}
            </Text>
        </View>
    );
}
