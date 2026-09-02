import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

interface LeaderboardEntry {
    rank: number;
    name: string;
    xp: number;
    streak: number;
    avatar: string;
    isCurrentUser?: boolean;
}

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: "Priya S.", xp: 2450, streak: 28, avatar: "🥇", isCurrentUser: false },
    { rank: 2, name: "Rahul K.", xp: 2180, streak: 21, avatar: "🥈", isCurrentUser: false },
    { rank: 3, name: "Ananya M.", xp: 1950, streak: 15, avatar: "🥉", isCurrentUser: false },
    { rank: 4, name: "Vikram R.", xp: 1720, streak: 18, avatar: "👤", isCurrentUser: false },
    { rank: 5, name: "Sneha P.", xp: 1580, streak: 12, avatar: "👤", isCurrentUser: false },
    { rank: 6, name: "Arjun T.", xp: 1340, streak: 9, avatar: "👤", isCurrentUser: false },
    { rank: 7, name: "You", xp: 1250, streak: 7, avatar: "👤", isCurrentUser: true },
    { rank: 8, name: "Kavya N.", xp: 1100, streak: 5, avatar: "👤", isCurrentUser: false },
    { rank: 9, name: "Rohan D.", xp: 980, streak: 4, avatar: "👤", isCurrentUser: false },
    { rank: 10, name: "Ishita G.", xp: 850, streak: 3, avatar: "👤", isCurrentUser: false },
];

export default function LeaderboardScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const currentUserRank = 7;

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return "#FFD700"; // Gold
            case 2:
                return "#C0C0C0"; // Silver
            case 3:
                return "#CD7F32"; // Bronze
            default:
                return COLORS.textSecondary;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ alignItems: "center", marginBottom: SPACING[6] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[1],
                        }}
                    >
                        Weekly Leaderboard
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                        }}
                    >
                        Top cadets this week
                    </Text>
                </View>

                {/* Top 3 Podium */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: SPACING[6],
                        paddingHorizontal: SPACING[4],
                    }}
                >
                    {/* 2nd Place */}
                    <View style={{ alignItems: "center", marginRight: SPACING[2] }}>
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: COLORS.surfaceContainer,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 3,
                                borderColor: "#C0C0C0",
                            }}
                        >
                            <Text style={{ fontSize: 28 }}>🥈</Text>
                        </View>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: "700",
                                color: COLORS.textPrimary,
                                marginTop: SPACING[1],
                            }}
                            numberOfLines={1}
                        >
                            {MOCK_LEADERBOARD[1].name}
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.xs,
                                color: COLORS.textSecondary,
                            }}
                        >
                            {MOCK_LEADERBOARD[1].xp} XP
                        </Text>
                        <View
                            style={{
                                width: 70,
                                height: 50,
                                backgroundColor: "#C0C0C0",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                marginTop: SPACING[2],
                            }}
                        />
                    </View>

                    {/* 1st Place */}
                    <View style={{ alignItems: "center" }}>
                        <MascotDisplay expression="victory" size={80} showBackground />
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: "700",
                                color: COLORS.textPrimary,
                                marginTop: SPACING[1],
                            }}
                        >
                            {MOCK_LEADERBOARD[0].name}
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.xs,
                                color: COLORS.warning,
                            }}
                        >
                            {MOCK_LEADERBOARD[0].xp} XP
                        </Text>
                        <View
                            style={{
                                width: 90,
                                height: 80,
                                backgroundColor: "#FFD700",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                marginTop: SPACING[2],
                            }}
                        />
                    </View>

                    {/* 3rd Place */}
                    <View style={{ alignItems: "center", marginLeft: SPACING[2] }}>
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: COLORS.surfaceContainer,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 3,
                                borderColor: "#CD7F32",
                            }}
                        >
                            <Text style={{ fontSize: 22 }}>🥉</Text>
                        </View>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                fontWeight: "700",
                                color: COLORS.textPrimary,
                                marginTop: SPACING[1],
                            }}
                            numberOfLines={1}
                        >
                            {MOCK_LEADERBOARD[2].name}
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.xs,
                                color: COLORS.textSecondary,
                            }}
                        >
                            {MOCK_LEADERBOARD[2].xp} XP
                        </Text>
                        <View
                            style={{
                                width: 60,
                                height: 35,
                                backgroundColor: "#CD7F32",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                marginTop: SPACING[2],
                            }}
                        />
                    </View>
                </View>

                {/* Rest of Leaderboard */}
                <Card variant="elevated" style={{ padding: 0, overflow: "hidden" }}>
                    {MOCK_LEADERBOARD.slice(3).map((entry, index) => (
                        <View
                            key={entry.rank}
                            style={[
                                {
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: SPACING[4],
                                    borderBottomWidth: index < MOCK_LEADERBOARD.length - 4 ? 1 : 0,
                                    borderBottomColor: COLORS.cardBorder,
                                    backgroundColor: entry.isCurrentUser
                                        ? COLORS.primaryFixed
                                        : "transparent",
                                },
                            ]}
                        >
                            {/* Rank */}
                            <View
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor:
                                        entry.rank <= 3
                                            ? getRankColor(entry.rank)
                                            : COLORS.surfaceContainer,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: SPACING[3],
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        fontWeight: "700",
                                        color:
                                            entry.rank <= 3
                                                ? COLORS.textPrimary
                                                : COLORS.textSecondary,
                                    }}
                                >
                                    {entry.rank}
                                </Text>
                            </View>

                            {/* Avatar */}
                            <View
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    backgroundColor: entry.isCurrentUser
                                        ? COLORS.primary
                                        : COLORS.surfaceContainer,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: SPACING[3],
                                }}
                            >
                                <Text style={{ fontSize: 20 }}>
                                    {entry.isCurrentUser ? "👤" : entry.avatar}
                                </Text>
                            </View>

                            {/* Name and Stats */}
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: entry.isCurrentUser ? "700" : "600",
                                        color: COLORS.textPrimary,
                                    }}
                                >
                                    {entry.name}
                                    {entry.isCurrentUser && (
                                        <Text style={{ color: COLORS.primary }}> (You)</Text>
                                    )}
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[2] }}>
                                    <Text style={{ fontSize: 12 }}>🔥</Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.xs,
                                            color: COLORS.textSecondary,
                                        }}
                                    >
                                        {entry.streak} day streak
                                    </Text>
                                </View>
                            </View>

                            {/* XP */}
                            <View style={{ alignItems: "flex-end" }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.lg,
                                        fontWeight: "700",
                                        color: COLORS.warning,
                                    }}
                                >
                                    {entry.xp}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.xs,
                                        color: COLORS.textSecondary,
                                    }}
                                >
                                    XP
                                </Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Your Rank Summary */}
                <Card
                    variant="elevated"
                    style={{
                        marginTop: SPACING[4],
                        backgroundColor: COLORS.primary,
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: "rgba(255,255,255,0.2)",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: SPACING[4],
                            }}
                        >
                            <Text style={{ fontSize: 24 }}>🏆</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: "700", color: COLORS.onPrimary }}>
                                Your Rank: #{currentUserRank}
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: "rgba(255,255,255,0.8)" }}>
                                Keep solving questions to climb the leaderboard!
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Action Button */}
                <Button
                    title="Practice Now"
                    onPress={() => router.push("/(tabs)/practice")}
                    variant="primary"
                    style={{ marginTop: SPACING[4] }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
