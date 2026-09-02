import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, BADGES } from "../../constants";

interface BadgeDef {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
}

export default function AchievementsScreen() {
    const { badges, dailyProgress, streak } = useAppStore();

    // Merge badge definitions with store-earned badges
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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ alignItems: "center", marginBottom: SPACING[5] }}>
                    <MascotDisplay expression="victory" size={120} showBackground />
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            marginTop: SPACING[3],
                        }}
                    >
                        Badges & Achievements
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: SPACING[2],
                            gap: SPACING[2],
                        }}
                    >
                        <View
                            style={{
                                paddingHorizontal: SPACING[4],
                                paddingVertical: SPACING[1],
                                backgroundColor: COLORS.successLight,
                                borderRadius: BORDER_RADIUS.full,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    fontWeight: "700",
                                    color: COLORS.success,
                                }}
                            >
                                {earnedBadges.length} Earned
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.textSecondary,
                            }}
                        >
                            of {allBadges.length} total
                        </Text>
                    </View>
                </View>

                {/* Progress Ring */}
                <Card variant="elevated" style={{ marginBottom: SPACING[5] }}>
                    <View style={{ alignItems: "center" }}>
                        <View
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                borderWidth: 12,
                                borderColor: COLORS.surfaceContainer,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <View
                                style={{
                                    width: 96,
                                    height: 96,
                                    borderRadius: 48,
                                    borderWidth: 12,
                                    borderColor: COLORS.primary,
                                    borderTopColor: "transparent",
                                    transform: [{ rotate: "45deg" }],
                                }}
                            />
                            <View
                                style={{
                                    position: "absolute",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize["2xl"],
                                        fontWeight: "800",
                                        color: COLORS.textPrimary,
                                    }}
                                >
                                    {allBadges.length > 0
                                        ? Math.round((earnedBadges.length / allBadges.length) * 100)
                                        : 0}%
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.base,
                                color: COLORS.textSecondary,
                                marginTop: SPACING[3],
                            }}
                        >
                            Collection Progress
                        </Text>
                    </View>
                </Card>

                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                    <>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.lg,
                                fontWeight: "700",
                                color: COLORS.textPrimary,
                                marginBottom: SPACING[3],
                            }}
                        >
                            Earned Badges
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: SPACING[3],
                                marginBottom: SPACING[5],
                            }}
                        >
                            {earnedBadges.map((badge) => (
                                <Pressable
                                    key={badge.id}
                                    style={{
                                        width: "31%",
                                        aspectRatio: 1,
                                    }}
                                >
                                    <Card
                                        variant="elevated"
                                        style={{
                                            height: "100%",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: COLORS.successLight,
                                        }}
                                    >
                                        <Text style={{ fontSize: 40 }}>{badge.icon}</Text>
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.xs,
                                                fontWeight: "700",
                                                color: COLORS.textPrimary,
                                                marginTop: SPACING[1],
                                                textAlign: "center",
                                            }}
                                            numberOfLines={2}
                                        >
                                            {badge.name}
                                        </Text>
                                        {badge.earnedDate && (
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    color: COLORS.textTertiary,
                                                    marginTop: 2,
                                                }}
                                            >
                                                {badge.earnedDate}
                                            </Text>
                                        )}
                                    </Card>
                                </Pressable>
                            ))}
                        </View>
                    </>
                )}

                {/* Locked Badges */}
                {unearnedBadges.length > 0 && (
                    <>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.lg,
                                fontWeight: "700",
                                color: COLORS.textPrimary,
                                marginBottom: SPACING[3],
                            }}
                        >
                            Badges in Progress
                        </Text>
                        {unearnedBadges.map((badge) => (
                            <Card key={badge.id} variant="elevated" style={{ marginBottom: SPACING[3] }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {/* Badge Icon */}
                                    <View
                                        style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 28,
                                            backgroundColor: COLORS.surfaceContainer,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: SPACING[4],
                                            opacity: 0.6,
                                        }}
                                    >
                                        <Text style={{ fontSize: 28 }}>🔒</Text>
                                    </View>

                                    {/* Badge Info */}
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[2] }}>
                                            <Text
                                                style={{
                                                    fontSize: TYPOGRAPHY.fontSize.base,
                                                    fontWeight: "700",
                                                    color: COLORS.textPrimary,
                                                }}
                                            >
                                                {badge.name}
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.sm,
                                                color: COLORS.textSecondary,
                                                marginTop: 2,
                                            }}
                                        >
                                            {badge.description}
                                        </Text>

                                        {/* Hint text */}
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.xs,
                                                color: COLORS.primary,
                                                marginTop: SPACING[2],
                                                fontWeight: "500",
                                            }}
                                        >
                                            {getHint(badge.id)}
                                        </Text>
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
