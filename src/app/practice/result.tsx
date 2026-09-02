import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, XP_REWARDS } from "../../constants";

export default function PracticeResultScreen() {
    const router = useRouter();
    const { correct, total, time } = useLocalSearchParams<{
        correct: string;
        total: string;
        time: string;
    }>();

    const correctCount = parseInt(correct || "0", 10);
    const totalCount = parseInt(total || "0", 10);
    const timeSpent = parseInt(time || "0", 10);
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const xpEarned = correctCount * XP_REWARDS.correctAnswer;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    const getMessage = () => {
        if (accuracy >= 80) return { text: "Outstanding work! 🏆", emoji: "celebrating" as const };
        if (accuracy >= 60) return { text: "Great job! Keep going! 🌟", emoji: "happy" as const };
        if (accuracy >= 40) return { text: "Good effort! Practice more! 💪", emoji: "encouraging" as const };
        return { text: "Keep trying! You'll improve! 🎯", emoji: "thinking" as const };
    };

    const message = getMessage();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Results",
                    headerStyle: { backgroundColor: COLORS.background },
                    headerShadowVisible: false,
                }}
            />
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Celebration */}
                <View style={{ alignItems: "center", marginBottom: SPACING[6] }}>
                    <MascotDisplay expression={message.emoji} size={140} />
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            textAlign: "center",
                            marginTop: SPACING[3],
                        }}
                    >
                        {message.text}
                    </Text>
                </View>

                {/* Score Card */}
                <Card variant="elevated" style={{ marginBottom: SPACING[4] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            textAlign: "center",
                            marginBottom: SPACING[3],
                        }}
                    >
                        Your Score
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "baseline",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize["5xl"],
                                fontWeight: "800",
                                color: COLORS.primary,
                            }}
                        >
                            {correctCount}
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize["2xl"],
                                color: COLORS.textSecondary,
                                fontWeight: "600",
                            }}
                        >
                            {" "}/ {totalCount}
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginTop: SPACING[1],
                        }}
                    >
                        {accuracy}% accuracy
                    </Text>
                </Card>

                {/* Stats */}
                <View style={{ flexDirection: "row", gap: SPACING[3], marginBottom: SPACING[4] }}>
                    <StatCard
                        label="Correct"
                        value={correctCount.toString()}
                        color={COLORS.success}
                        bgColor={COLORS.successLight}
                    />
                    <StatCard
                        label="Wrong"
                        value={(totalCount - correctCount).toString()}
                        color={COLORS.error}
                        bgColor={COLORS.errorLight}
                    />
                    <StatCard
                        label="XP"
                        value={`+${xpEarned}`}
                        color={COLORS.xpGold}
                        bgColor="#FEF3C7"
                    />
                </View>

                {/* Time Card */}
                <Card style={{ marginBottom: SPACING[6] }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[3] }}>
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: "#DBEAFE",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ fontSize: 24 }}>⏱️</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.base,
                                    fontWeight: "600",
                                    color: COLORS.textPrimary,
                                }}
                            >
                                Time Spent
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xl,
                                    fontWeight: "800",
                                    color: COLORS.textPrimary,
                                    marginTop: 2,
                                }}
                            >
                                {minutes}m {seconds}s
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Actions */}
                <View style={{ gap: SPACING[3] }}>
                    <Button
                        title="Practice Again"
                        onPress={() => router.replace("/(tabs)/practice")}
                        fullWidth
                        size="lg"
                    />
                    <Button
                        title="Back to Home"
                        onPress={() => router.replace("/(tabs)")}
                        fullWidth
                        size="lg"
                        variant="outline"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatCard({
    label,
    value,
    color,
    bgColor,
}: {
    label: string;
    value: string;
    color: string;
    bgColor: string;
}) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: bgColor,
                padding: SPACING[4],
                borderRadius: BORDER_RADIUS.lg,
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    fontSize: TYPOGRAPHY.fontSize.xl,
                    fontWeight: "800",
                    color,
                }}
            >
                {value}
            </Text>
            <Text
                style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.textSecondary,
                    marginTop: 2,
                    fontWeight: "600",
                }}
            >
                {label}
            </Text>
        </View>
    );
}
