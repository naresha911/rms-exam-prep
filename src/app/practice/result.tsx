// Practice Result — Stitch-aligned screen shown after a practice session completes.
// Per Stitch: mascot + headline celebration, score breakdown, stat cards, CTA stack.
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, XP_REWARDS } from "../../constants";
import { useColors, useThemedStyles, type ColorPalette } from "../../theme";

type ResultTone = "success" | "primary" | "warning" | "error";
type ResultStat = "correct" | "wrong" | "xp";

const HEADLINE = {
    success: "headlineSuccess",
    primary: "headlinePrimary",
    warning: "headlineWarning",
    error: "headlineError",
} as const;

const STAT_ICON = {
    correct: "statIconCorrect",
    wrong: "statIconWrong",
    xp: "statIconXp",
} as const;

function resultMessage(accuracy: number) {
    if (accuracy >= 80) return { text: "Outstanding work!", emoji: "celebrating" as const, tone: "success" as const };
    if (accuracy >= 60) return { text: "Great job! Keep going!", emoji: "happy" as const, tone: "primary" as const };
    if (accuracy >= 40) return { text: "Good effort! Practice more!", emoji: "encouraging" as const, tone: "warning" as const };
    return { text: "Keep trying! You'll improve!", emoji: "thinking" as const, tone: "error" as const };
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: SPACING[5],
        },
        celebration: {
            alignItems: "center" as const,
            marginBottom: SPACING[6],
            marginTop: SPACING[2],
        },
        headline: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            textAlign: "center" as const,
            marginTop: SPACING[3],
        },
        headlineSuccess: { color: colors.success },
        headlinePrimary: { color: colors.primary },
        headlineWarning: { color: colors.warning },
        headlineError: { color: colors.error },
        subheadline: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurfaceVariant,
            textAlign: "center" as const,
            marginTop: SPACING[1],
        },
        scoreCard: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["3xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[6],
            marginBottom: SPACING[4],
            alignItems: "center" as const,
        },
        scoreLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            marginBottom: SPACING[3],
        },
        scoreRow: {
            flexDirection: "row" as const,
            alignItems: "baseline" as const,
            marginBottom: SPACING[2],
        },
        scoreValue: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: 56,
            color: colors.primary,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            lineHeight: 64,
        },
        scoreTotal: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        accuracyPill: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 4,
            backgroundColor: colors.primaryFixed,
            paddingHorizontal: SPACING[3],
            paddingVertical: SPACING[1],
            borderRadius: BORDER_RADIUS.full,
        },
        accuracyText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.primary,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        statsRow: {
            flexDirection: "row" as const,
            gap: SPACING[3],
            marginBottom: SPACING[4],
        },
        statCard: {
            flex: 1,
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[3],
            alignItems: "center" as const,
        },
        statIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            marginBottom: SPACING[2],
        },
        statIconCorrect: { backgroundColor: colors.successLight },
        statIconWrong: { backgroundColor: colors.errorLight },
        statIconXp: { backgroundColor: colors.warningLight },
        statValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        statLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            marginTop: 2,
        },
        timeCard: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: SPACING[3],
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[4],
            marginBottom: SPACING[6],
        },
        timeIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.secondaryContainer,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
        timeContent: {
            flex: 1,
        },
        timeLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        timeValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            marginTop: 2,
        },
        actions: {
            gap: SPACING[3],
        },
    };
}

function statIconColor(colors: ColorPalette, tone: ResultStat) {
    if (tone === "correct") return colors.success;
    if (tone === "wrong") return colors.error;
    return colors.xpGold;
}

function StatCard({
    icon,
    tone,
    value,
    label,
}: {
    icon: "check_circle" | "cancel" | "bolt";
    tone: ResultStat;
    value: string;
    label: string;
}) {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    return (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, styles[STAT_ICON[tone]]]}>
                <MaterialIcon name={icon} size={20} color={statIconColor(colors, tone)} filled />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

export default function PracticeResultScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
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
    const message = resultMessage(accuracy);
    const tone: ResultTone = message.tone;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.celebration}>
                    <MascotDisplay expression={message.emoji} size={140} />
                    <Text style={[styles.headline, styles[HEADLINE[tone]]]}>
                        {message.text}
                    </Text>
                    <Text style={styles.subheadline}>
                        You finished your practice session
                    </Text>
                </View>

                <View style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>Your Score</Text>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreValue}>{correctCount}</Text>
                        <Text style={styles.scoreTotal}>/ {totalCount}</Text>
                    </View>
                    <View style={styles.accuracyPill}>
                        <MaterialIcon name="trending_up" size={14} color={colors.primary} filled />
                        <Text style={styles.accuracyText}>{accuracy}% accuracy</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <StatCard
                        icon="check_circle"
                        tone="correct"
                        value={correctCount.toString()}
                        label="Correct"
                    />
                    <StatCard
                        icon="cancel"
                        tone="wrong"
                        value={wrongCount.toString()}
                        label="Wrong"
                    />
                    <StatCard
                        icon="bolt"
                        tone="xp"
                        value={`+${xpEarned}`}
                        label="XP"
                    />
                </View>

                <View style={styles.timeCard}>
                    <View style={styles.timeIcon}>
                        <MaterialIcon name="schedule" size={22} color={colors.secondary} />
                    </View>
                    <View style={styles.timeContent}>
                        <Text style={styles.timeLabel}>Time Spent</Text>
                        <Text style={styles.timeValue}>
                            {minutes}m {seconds}s
                        </Text>
                    </View>
                </View>

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
