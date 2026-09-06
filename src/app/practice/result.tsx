// Practice Result — Stitch-aligned screen shown after a practice session completes.
// Per Stitch: mascot + headline celebration, score breakdown, stat cards, CTA stack.
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
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
    const wrongCount = totalCount - correctCount;

    const getMessage = () => {
        if (accuracy >= 80) return { text: "Outstanding work!", emoji: "celebrating" as const, color: COLORS.success };
        if (accuracy >= 60) return { text: "Great job! Keep going!", emoji: "happy" as const, color: COLORS.primary };
        if (accuracy >= 40) return { text: "Good effort! Practice more!", emoji: "encouraging" as const, color: COLORS.warning };
        return { text: "Keep trying! You'll improve!", emoji: "thinking" as const, color: COLORS.error };
    };

    const message = getMessage();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Celebration */}
                <View style={styles.celebration}>
                    <MascotDisplay expression={message.emoji} size={140} />
                    <Text style={[styles.headline, { color: message.color }]}>
                        {message.text}
                    </Text>
                    <Text style={styles.subheadline}>
                        You finished your practice session
                    </Text>
                </View>

                {/* Score Card — Stitch: white surface with rounded 3xl */}
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>Your Score</Text>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreValue}>{correctCount}</Text>
                        <Text style={styles.scoreTotal}>/ {totalCount}</Text>
                    </View>
                    <View style={styles.accuracyPill}>
                        <MaterialIcon name="trending_up" size={14} color={COLORS.primary} filled />
                        <Text style={styles.accuracyText}>{accuracy}% accuracy</Text>
                    </View>
                </View>

                {/* Stats — Stitch: 3 column stat row */}
                <View style={styles.statsRow}>
                    <StatCard
                        icon="check_circle"
                        iconBg={COLORS.successLight}
                        iconColor={COLORS.success}
                        value={correctCount.toString()}
                        label="Correct"
                    />
                    <StatCard
                        icon="cancel"
                        iconBg={COLORS.errorLight}
                        iconColor={COLORS.error}
                        value={wrongCount.toString()}
                        label="Wrong"
                    />
                    <StatCard
                        icon="bolt"
                        iconBg={COLORS.warningLight}
                        iconColor={COLORS.xpGold}
                        value={`+${xpEarned}`}
                        label="XP"
                    />
                </View>

                {/* Time Spent Card */}
                <View style={styles.timeCard}>
                    <View style={styles.timeIcon}>
                        <MaterialIcon name="schedule" size={22} color={COLORS.secondary} />
                    </View>
                    <View style={styles.timeContent}>
                        <Text style={styles.timeLabel}>Time Spent</Text>
                        <Text style={styles.timeValue}>
                            {minutes}m {seconds}s
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Practice Again"
                        onPress={() => router.replace("/(tabs)/practice")}
                        fullWidth
                        size="lg"
                        iconRight="arrow_forward"
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
    icon,
    iconBg,
    iconColor,
    value,
    label,
}: {
    icon: any;
    iconBg: string;
    iconColor: string;
    value: string;
    label: string;
}) {
    return (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: iconBg }]}>
                <MaterialIcon name={icon} size={20} color={iconColor} filled />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING[5],
    },
    celebration: {
        alignItems: "center",
        marginBottom: SPACING[6],
        marginTop: SPACING[2],
    },
    headline: {
        fontFamily: TYPOGRAPHY.fontFamily.extrabold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        fontWeight: "800",
        textAlign: "center",
        marginTop: SPACING[3],
    },
    subheadline: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
        marginTop: SPACING[1],
    },
    scoreCard: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["3xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[6],
        marginBottom: SPACING[4],
        alignItems: "center",
    },
    scoreLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        fontWeight: "700",
        marginBottom: SPACING[3],
    },
    scoreRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: SPACING[2],
    },
    scoreValue: {
        fontFamily: TYPOGRAPHY.fontFamily.extrabold,
        fontSize: 56,
        color: COLORS.primary,
        fontWeight: "800",
        lineHeight: 64,
    },
    scoreTotal: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.onSurfaceVariant,
        fontWeight: "600",
    },
    accuracyPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: COLORS.primaryFixed,
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[1],
        borderRadius: BORDER_RADIUS.full,
    },
    accuracyText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.primary,
        fontWeight: "700",
    },
    statsRow: {
        flexDirection: "row",
        gap: SPACING[3],
        marginBottom: SPACING[4],
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[3],
        alignItems: "center",
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING[2],
    },
    statValue: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.onSurface,
        fontWeight: "800",
    },
    statLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        fontWeight: "600",
        marginTop: 2,
    },
    timeCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[3],
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[4],
        marginBottom: SPACING[6],
    },
    timeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.secondaryContainer,
        alignItems: "center",
        justifyContent: "center",
    },
    timeContent: {
        flex: 1,
    },
    timeLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        fontWeight: "600",
    },
    timeValue: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.onSurface,
        fontWeight: "800",
        marginTop: 2,
    },
    actions: {
        gap: SPACING[3],
    },
});
