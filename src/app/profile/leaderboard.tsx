import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { SPACING, TYPOGRAPHY } from "../../constants";
import { layout, useThemedStyles, type ColorPalette } from "../../theme";

interface LeaderboardEntry {
    rank: number;
    name: string;
    xp: number;
    streak: number;
    avatar: string;
    isCurrentUser?: boolean;
}

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
            marginBottom: SPACING[1],
        },
        subtitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.textSecondary,
        },
        podium: {
            flexDirection: "row" as const,
            justifyContent: "flex-end" as const,
            alignItems: "flex-end" as const,
            marginBottom: SPACING[6],
            paddingHorizontal: SPACING[4],
        },
        place: {
            alignItems: "center" as const,
        },
        placeSecond: {
            marginRight: SPACING[2],
        },
        placeThird: {
            marginLeft: SPACING[2],
        },
        medalSecond: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.surfaceContainer,
            borderWidth: 3,
            borderColor: colors.silver,
        },
        medalThird: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.surfaceContainer,
            borderWidth: 3,
            borderColor: colors.bronze,
        },
        medalEmojiSecond: {
            fontSize: 28,
        },
        medalEmojiThird: {
            fontSize: 22,
        },
        placeName: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: "700" as const,
            color: colors.textPrimary,
            marginTop: SPACING[1],
        },
        placeXp: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
        },
        placeXpGold: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.warning,
        },
        barSecond: {
            width: 70,
            height: 50,
            backgroundColor: colors.silver,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            marginTop: SPACING[2],
        },
        barFirst: {
            width: 90,
            height: 80,
            backgroundColor: colors.gold,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            marginTop: SPACING[2],
        },
        barThird: {
            width: 60,
            height: 35,
            backgroundColor: colors.bronze,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            marginTop: SPACING[2],
        },
        listCard: {
            padding: 0,
            overflow: "hidden" as const,
        },
        entry: {
            padding: SPACING[4],
        },
        entryBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
        },
        entryCurrent: {
            backgroundColor: colors.primaryFixed,
        },
        rankBadge: {
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: SPACING[3],
        },
        rankGold: {
            backgroundColor: colors.gold,
        },
        rankSilver: {
            backgroundColor: colors.silver,
        },
        rankBronze: {
            backgroundColor: colors.bronze,
        },
        rankDefault: {
            backgroundColor: colors.surfaceContainer,
        },
        rankText: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: "700" as const,
            color: colors.textSecondary,
        },
        rankTextTop: {
            color: colors.textPrimary,
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            marginRight: SPACING[3],
        },
        avatarCurrent: {
            backgroundColor: colors.primary,
        },
        avatarDefault: {
            backgroundColor: colors.surfaceContainer,
        },
        avatarEmoji: {
            fontSize: 20,
        },
        nameBlock: {
            flex: 1,
        },
        name: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "600" as const,
            color: colors.textPrimary,
        },
        nameCurrent: {
            fontWeight: "700" as const,
        },
        youTag: {
            color: colors.primary,
        },
        streakRow: {
            gap: SPACING[2],
        },
        streakEmoji: {
            fontSize: 12,
        },
        streakText: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
        },
        xpBlock: {
            alignItems: "flex-end" as const,
        },
        xpValue: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: "700" as const,
            color: colors.warning,
        },
        xpLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
        },
        rankCard: {
            marginTop: SPACING[4],
            backgroundColor: colors.primary,
        },
        rankIcon: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.overlayLight,
            marginRight: SPACING[4],
        },
        rankEmoji: {
            fontSize: 24,
        },
        rankCopy: {
            flex: 1,
        },
        rankTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: "700" as const,
            color: colors.onPrimary,
        },
        rankHint: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onPrimary,
            opacity: 0.8,
        },
        practiceButton: {
            marginTop: SPACING[4],
        },
    };
}

export default function LeaderboardScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const currentUserRank = 7;

    const rankBadgeStyle = (rank: number) => {
        if (rank === 1) return styles.rankGold;
        if (rank === 2) return styles.rankSilver;
        if (rank === 3) return styles.rankBronze;
        return styles.rankDefault;
    };

    return (
        <SafeAreaView style={[layout.fill, styles.screen]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Weekly Leaderboard</Text>
                    <Text style={styles.subtitle}>Top cadets this week</Text>
                </View>

                <View style={styles.podium}>
                    <View style={[styles.place, styles.placeSecond]}>
                        <View style={[layout.center, styles.medalSecond]}>
                            <Text style={styles.medalEmojiSecond}>🥈</Text>
                        </View>
                        <Text style={styles.placeName} numberOfLines={1}>
                            {MOCK_LEADERBOARD[1].name}
                        </Text>
                        <Text style={styles.placeXp}>{MOCK_LEADERBOARD[1].xp} XP</Text>
                        <View style={styles.barSecond} />
                    </View>

                    <View style={styles.place}>
                        <MascotDisplay expression="victory" size={80} showBackground />
                        <Text style={styles.placeName}>{MOCK_LEADERBOARD[0].name}</Text>
                        <Text style={styles.placeXpGold}>{MOCK_LEADERBOARD[0].xp} XP</Text>
                        <View style={styles.barFirst} />
                    </View>

                    <View style={[styles.place, styles.placeThird]}>
                        <View style={[layout.center, styles.medalThird]}>
                            <Text style={styles.medalEmojiThird}>🥉</Text>
                        </View>
                        <Text style={styles.placeName} numberOfLines={1}>
                            {MOCK_LEADERBOARD[2].name}
                        </Text>
                        <Text style={styles.placeXp}>{MOCK_LEADERBOARD[2].xp} XP</Text>
                        <View style={styles.barThird} />
                    </View>
                </View>

                <Card variant="elevated" style={styles.listCard}>
                    {MOCK_LEADERBOARD.slice(3).map((entry, index) => (
                        <View
                            key={entry.rank}
                            style={[
                                layout.row,
                                styles.entry,
                                index < MOCK_LEADERBOARD.length - 4 ? styles.entryBorder : null,
                                entry.isCurrentUser ? styles.entryCurrent : null,
                            ]}
                        >
                            <View style={[layout.center, styles.rankBadge, rankBadgeStyle(entry.rank)]}>
                                <Text style={[styles.rankText, entry.rank <= 3 ? styles.rankTextTop : null]}>
                                    {entry.rank}
                                </Text>
                            </View>

                            <View style={[layout.center, styles.avatar, entry.isCurrentUser ? styles.avatarCurrent : styles.avatarDefault]}>
                                <Text style={styles.avatarEmoji}>
                                    {entry.isCurrentUser ? "👤" : entry.avatar}
                                </Text>
                            </View>

                            <View style={styles.nameBlock}>
                                <Text style={[styles.name, entry.isCurrentUser ? styles.nameCurrent : null]}>
                                    {entry.name}
                                    {entry.isCurrentUser ? <Text style={styles.youTag}> (You)</Text> : null}
                                </Text>
                                <View style={[layout.row, styles.streakRow]}>
                                    <Text style={styles.streakEmoji}>🔥</Text>
                                    <Text style={styles.streakText}>{entry.streak} day streak</Text>
                                </View>
                            </View>

                            <View style={styles.xpBlock}>
                                <Text style={styles.xpValue}>{entry.xp}</Text>
                                <Text style={styles.xpLabel}>XP</Text>
                            </View>
                        </View>
                    ))}
                </Card>

                <Card variant="elevated" style={styles.rankCard}>
                    <View style={layout.row}>
                        <View style={[layout.center, styles.rankIcon]}>
                            <Text style={styles.rankEmoji}>🏆</Text>
                        </View>
                        <View style={styles.rankCopy}>
                            <Text style={styles.rankTitle}>Your Rank: #{currentUserRank}</Text>
                            <Text style={styles.rankHint}>
                                Keep solving questions to climb the leaderboard!
                            </Text>
                        </View>
                    </View>
                </Card>

                <Button
                    title="Practice Now"
                    onPress={() => router.push("/(tabs)/practice")}
                    variant="primary"
                    style={styles.practiceButton}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
