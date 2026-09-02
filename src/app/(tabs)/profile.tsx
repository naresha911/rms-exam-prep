import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { StreakDisplay } from "../../components/shared/StreakDisplay";
import { XpDisplay } from "../../components/shared/XpDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { signOut } from "../../lib/supabase";

export default function ProfileScreen() {
    const router = useRouter();
    const { user, streak, xp, level, levelName, dailyProgress, resetStore } = useAppStore();

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        resetStore();
                        router.replace("/(onboarding)/welcome");
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={{ alignItems: "center", marginBottom: SPACING[5] }}>
                    <Avatar
                        name={user?.full_name || "Student"}
                        uri={user?.avatar_url}
                        size={100}
                        backgroundColor={COLORS.primary}
                    />
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.xl,
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            marginTop: SPACING[3],
                        }}
                    >
                        {user?.full_name || "Student"}
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            color: COLORS.textSecondary,
                            marginTop: 2,
                        }}
                    >
                        {user?.target_class ? `AISSEE Class ${user.target_class}` : "AISSEE Prep"}
                    </Text>

                    <View style={{ flexDirection: "row", gap: SPACING[2], marginTop: SPACING[3] }}>
                        <StreakDisplay streak={streak} size="sm" />
                        <XpDisplay xp={xp} level={level} levelName={levelName} size="sm" />
                    </View>
                </View>

                {/* Stats Grid */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    My Progress
                </Text>
                <View style={{ flexDirection: "row", gap: SPACING[3], marginBottom: SPACING[5] }}>
                    <StatBox
                        label="Questions"
                        value={dailyProgress.questionsAnswered.toString()}
                        emoji="❓"
                    />
                    <StatBox
                        label="Accuracy"
                        value={`${dailyProgress.questionsAnswered > 0
                            ? Math.round((dailyProgress.correctAnswers / dailyProgress.questionsAnswered) * 100)
                            : 0
                            }%`}
                        emoji="🎯"
                    />
                    <StatBox
                        label="Level"
                        value={level.toString()}
                        emoji="⭐"
                    />
                </View>

                {/* My Learning */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    My Learning
                </Text>
                <Card style={{ marginBottom: SPACING[4] }}>
                    <MenuItem
                        emoji="🔖"
                        title="Bookmarks"
                        subtitle="Your saved questions"
                        onPress={() => router.push("/profile/bookmarks")}
                    />
                    <MenuItem
                        emoji="❌"
                        title="My Mistakes"
                        subtitle="Review incorrect answers"
                        onPress={() => router.push("/profile/mistakes")}
                    />
                    <MenuItem
                        emoji="📊"
                        title="Performance"
                        subtitle="Track your progress and stats"
                        onPress={() => router.push("/profile/performance")}
                    />
                    <MenuItem
                        emoji="🏆"
                        title="Achievements"
                        subtitle="Badges and milestones"
                        onPress={() => router.push("/profile/achievements")}
                    />
                </Card>

                {/* Settings */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Settings
                </Text>
                <Card style={{ marginBottom: SPACING[4] }}>
                    <MenuItem
                        emoji="⚙️"
                        title="Settings"
                        subtitle="Preferences, notifications, privacy"
                        onPress={() => router.push("/profile/settings")}
                    />
                    <MenuItem
                        emoji="👤"
                        title="Edit Profile"
                        subtitle="Update your information"
                        onPress={() => router.push("/profile/edit")}
                    />
                    <MenuItem
                        emoji="❓"
                        title="Help & Support"
                        subtitle="Get help and report issues"
                        onPress={() => Alert.alert("Help", "Email us at support@sainikprep.com")}
                    />
                </Card>

                {/* Sign Out */}
                <Pressable onPress={handleSignOut} style={{ marginTop: SPACING[2] }}>
                    <Card
                        style={{
                            alignItems: "center",
                            borderColor: COLORS.error,
                            borderWidth: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: COLORS.error,
                                fontSize: TYPOGRAPHY.fontSize.base,
                                fontWeight: "700",
                            }}
                        >
                            Sign Out
                        </Text>
                    </Card>
                </Pressable>

                {/* Disclaimer */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        color: COLORS.textTertiary,
                        textAlign: "center",
                        marginTop: SPACING[5],
                        paddingHorizontal: SPACING[4],
                        lineHeight: 16,
                    }}
                >
                    This is an independent educational application and is not affiliated with NTA, Sainik Schools Society, or the Government of India.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatBox({ label, value, emoji }: { label: string; value: string; emoji: string }) {
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
            <Text style={{ fontSize: 18 }}>{emoji}</Text>
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
                }}
            >
                {label}
            </Text>
        </View>
    );
}

function MenuItem({
    emoji,
    title,
    subtitle,
    onPress,
}: {
    emoji: string;
    title: string;
    subtitle: string;
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
            <Text style={{ fontSize: 22, marginRight: SPACING[3] }}>{emoji}</Text>
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
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        color: COLORS.textSecondary,
                        marginTop: 2,
                    }}
                >
                    {subtitle}
                </Text>
            </View>
            <Text style={{ color: COLORS.textTertiary, fontSize: 16 }}>›</Text>
        </Pressable>
    );
}
