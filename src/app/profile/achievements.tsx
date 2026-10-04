import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, BADGES } from "../../constants";
import { layout, useThemedStyles, type ColorPalette } from "../../theme";

interface BadgeDef {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
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
            marginBottom: SPACING[5],
        },
        title: {
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: "800" as const,
            color: colors.textPrimary,
            marginTop: SPACING[3],
        },
        countRow: {
            marginTop: SPACING[2],
            gap: SPACING[2],
        },
        earnedPill: {
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[1],
            backgroundColor: colors.successLight,
            borderRadius: BORDER_RADIUS.full,
        },
        earnedPillText: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: "700" as const,
            color: colors.success,
        },
        totalText: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
        },
        progressCard: {
            marginBottom: SPACING[5],
        },
        progressInner: {
            alignItems: "center" as const,
        },
        ringOuter: {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 12,
            borderColor: colors.surfaceContainer,
        },
        ringInner: {
            width: 96,
            height: 96,
            borderRadius: 48,
            borderWidth: 12,
            borderColor: colors.primary,
            borderTopColor: "transparent" as const,
            transform: [{ rotate: "45deg" }],
        },
        ringLabel: {
            position: "absolute" as const,
            alignItems: "center" as const,
        },
        ringValue: {
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            fontWeight: "800" as const,
            color: colors.textPrimary,
        },
        progressCaption: {
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.textSecondary,
            marginTop: SPACING[3],
        },
        sectionTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: "700" as const,
            color: colors.textPrimary,
            marginBottom: SPACING[3],
        },
        earnedGrid: {
            flexDirection: "row" as const,
            flexWrap: "wrap" as const,
            gap: SPACING[3],
            marginBottom: SPACING[5],
        },
        earnedTile: {
            width: "31%" as const,
            aspectRatio: 1,
        },
        earnedCard: {
            height: "100%" as const,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            backgroundColor: colors.successLight,
        },
        badgeEmoji: {
            fontSize: 40,
        },
        badgeName: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: "700" as const,
            color: colors.textPrimary,
            marginTop: SPACING[1],
            textAlign: "center" as const,
        },
        badgeDate: {
            fontSize: 10,
            color: colors.textTertiary,
            marginTop: 2,
        },
        lockedCard: {
            marginBottom: SPACING[3],
        },
        lockedIcon: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.surfaceContainer,
            marginRight: SPACING[4],
            opacity: 0.6,
        },
        lockEmoji: {
            fontSize: 28,
        },
        lockedBody: {
            flex: 1,
        },
        lockedName: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "700" as const,
            color: colors.textPrimary,
        },
        lockedDescription: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textSecondary,
            marginTop: 2,
        },
        lockedHint: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.primary,
            marginTop: SPACING[2],
            fontWeight: "500" as const,
        },
    };
}

export default function AchievementsScreen() {
    const styles = useThemedStyles(createStyles);
    const { badges } = useAppStore();

    const allBadges: BadgeDef[] = BADGES.map((def) => {
        const storeBadge = badges.find((b) => b.id === def.id);
        return {
            ...def,
            earned: !!storeBadge,
            earnedDate: storeBadge?.unlockedAt
                ? formatRelativeDate(storeBadge.unlockedAt)
                : undefined,
        };
    });

    const earnedBadges = allBadges.filter((b) => b.earned);
    const unearnedBadges = allBadges.filter((b) => !b.earned);

    return (
        <SafeAreaView style={[layout.fill, styles.screen]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <MascotDisplay expression="victory" size={120} showBackground />
                    <Text style={styles.title}>Badges & Achievements</Text>
                    <View style={[layout.row, styles.countRow]}>
                        <View style={styles.earnedPill}>
                            <Text style={styles.earnedPillText}>{earnedBadges.length} Earned</Text>
                        </View>
                        <Text style={styles.totalText}>of {allBadges.length} total</Text>
                    </View>
                </View>

                <Card variant="elevated" style={styles.progressCard}>
                    <View style={styles.progressInner}>
                        <View style={[layout.center, styles.ringOuter]}>
                            <View style={styles.ringInner} />
                            <View style={styles.ringLabel}>
                                <Text style={styles.ringValue}>
                                    {allBadges.length > 0
                                        ? Math.round((earnedBadges.length / allBadges.length) * 100)
                                        : 0}%
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.progressCaption}>Collection Progress</Text>
                    </View>
                </Card>

                {earnedBadges.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Earned Badges</Text>
                        <View style={styles.earnedGrid}>
                            {earnedBadges.map((badge) => (
                                <Pressable key={badge.id} style={styles.earnedTile}>
                                    <Card variant="elevated" style={styles.earnedCard}>
                                        <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                                        <Text style={styles.badgeName} numberOfLines={2}>
                                            {badge.name}
                                        </Text>
                                        {badge.earnedDate ? (
                                            <Text style={styles.badgeDate}>{badge.earnedDate}</Text>
                                        ) : null}
                                    </Card>
                                </Pressable>
                            ))}
                        </View>
                    </>
                )}

                {unearnedBadges.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Badges in Progress</Text>
                        {unearnedBadges.map((badge) => (
                            <Card key={badge.id} variant="elevated" style={styles.lockedCard}>
                                <View style={layout.row}>
                                    <View style={[layout.center, styles.lockedIcon]}>
                                        <Text style={styles.lockEmoji}>🔒</Text>
                                    </View>
                                    <View style={styles.lockedBody}>
                                        <Text style={styles.lockedName}>{badge.name}</Text>
                                        <Text style={styles.lockedDescription}>{badge.description}</Text>
                                        <Text style={styles.lockedHint}>{getHint(badge.id)}</Text>
                                    </View>
                                </View>
                            </Card>
                        ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getHint(badgeId: string): string {
    switch (badgeId) {
        case "first_mock_test":
            return "→ Complete your first mock test to earn this";
        case "streak_3":
            return "→ Keep your streak alive for 3 days";
        case "streak_7":
            return "→ Practice for 7 days in a row";
        case "streak_30":
            return "→ Master discipline — 30 days of practice";
        case "questions_100":
            return "→ Answer 100 questions total";
        case "questions_500":
            return "→ Answer 500 questions to unlock";
        case "questions_1000":
            return "→ The ultimate milestone — 1000 questions";
        case "accuracy_80":
            return "→ Score 80%+ accuracy in a test";
        case "perfect_score":
            return "→ Score 100% in any test — the hardest badge";
        case "all_subjects":
            return "→ Practice at least one question from every subject";
        case "early_bird":
            return "→ Open the app before 7 AM";
        default:
            return "";
    }
}
