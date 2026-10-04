// Profile Screen — Stitch-aligned user profile hub.
// Tab route is `me` (not `profile`) to avoid clashing with `/profile/*` stack screens.
// Per Stitch: avatar header with streak/XP, stats row, My Learning list,
// Settings list, sign-out button.
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../components/ui/Avatar";
import { StreakDisplay } from "../../components/shared/StreakDisplay";
import { XpDisplay } from "../../components/shared/XpDisplay";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useAppStore } from "../../store/useAppStore";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
import { signOut } from "../../lib/supabase";

type StatVariant = "questions" | "accuracy" | "level";

const STAT_ICON = {
    questions: "statIconQuestions",
    accuracy: "statIconAccuracy",
    level: "statIconLevel",
} as const;

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: SPACING[5],
        },
        header: {
            alignItems: "center" as const,
            marginBottom: SPACING[6],
            paddingTop: SPACING[3],
        },
        userName: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            marginTop: SPACING[3],
        },
        userSubtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            marginTop: 2,
        },
        badges: {
            flexDirection: "row" as const,
            gap: SPACING[2],
            marginTop: SPACING[3],
        },
        section: {
            marginBottom: SPACING[5],
        },
        sectionTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            marginBottom: SPACING[3],
        },
        statsRow: {
            flexDirection: "row" as const,
            gap: SPACING[3],
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
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            marginBottom: SPACING[2],
        },
        statIconQuestions: { backgroundColor: colors.primaryContainer },
        statIconAccuracy: { backgroundColor: colors.secondaryContainer },
        statIconLevel: { backgroundColor: colors.primaryFixed },
        statValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
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
        menuCard: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            overflow: "hidden" as const,
        },
        menuItem: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            paddingVertical: SPACING[4],
            paddingHorizontal: SPACING[4],
        },
        menuItemBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineVariant,
        },
        menuItemPressed: {
            backgroundColor: colors.surfaceVariant,
        },
        menuIconWrap: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primaryFixed,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            marginRight: SPACING[3],
        },
        menuContent: {
            flex: 1,
        },
        menuTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        menuSubtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            marginTop: 2,
        },
        signOutBtn: {
            marginTop: SPACING[2],
            marginBottom: SPACING[4],
        },
        signOutCard: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.error,
            paddingVertical: SPACING[4],
            gap: SPACING[2],
        },
        signOutText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.error,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        disclaimer: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            textAlign: "center" as const,
            lineHeight: 18,
        },
    };
}

function statIconColor(colors: ColorPalette, variant: StatVariant) {
    if (variant === "questions") return colors.primary;
    if (variant === "accuracy") return colors.secondary;
    return colors.gradientEnd;
}

function StatCard({
    icon,
    value,
    label,
    variant,
}: {
    icon: "quiz" | "trending_up" | "workspace_premium";
    value: string;
    label: string;
    variant: StatVariant;
}) {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    return (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, styles[STAT_ICON[variant]]]}>
                <MaterialIcon name={icon} size={18} color={statIconColor(colors, variant)} filled />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function MenuItem({
    icon,
    title,
    subtitle,
    onPress,
    isLast = false,
}: {
    icon: "bookmark" | "cancel" | "analytics" | "emoji_events" | "leaderboard" | "history" | "settings" | "edit" | "support_agent";
    title: string;
    subtitle: string;
    onPress: () => void;
    isLast?: boolean;
}) {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.menuItem,
                !isLast ? styles.menuItemBorder : null,
                pressed ? styles.menuItemPressed : null,
            ]}
        >
            <View style={styles.menuIconWrap}>
                <MaterialIcon name={icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <MaterialIcon name="chevron_right" size={22} color={colors.onSurfaceVariant} />
        </Pressable>
    );
}

export default function ProfileScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
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

    const accuracy = dailyProgress.questionsAnswered > 0
        ? Math.round((dailyProgress.correctAnswers / dailyProgress.questionsAnswered) * 100)
        : 0;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Avatar
                        name={user?.full_name || "Student"}
                        uri={user?.avatar_url}
                        size={100}
                        backgroundColor={colors.primary}
                    />
                    <Text style={styles.userName}>
                        {user?.full_name || "Student"}
                    </Text>
                    <Text style={styles.userSubtitle}>
                        {user?.target_class ? `Class ${user.target_class}` : "AISSEE Prep"}
                    </Text>
                    <View style={styles.badges}>
                        <StreakDisplay streak={streak} size="sm" />
                        <XpDisplay xp={xp} level={level} levelName={levelName} size="sm" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Progress</Text>
                    <View style={styles.statsRow}>
                        <StatCard
                            icon="quiz"
                            variant="questions"
                            value={dailyProgress.questionsAnswered.toString()}
                            label="Questions"
                        />
                        <StatCard
                            icon="trending_up"
                            variant="accuracy"
                            value={`${accuracy}%`}
                            label="Accuracy"
                        />
                        <StatCard
                            icon="workspace_premium"
                            variant="level"
                            value={level.toString()}
                            label="Level"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Learning</Text>
                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="bookmark"
                            title="Bookmarks"
                            subtitle="Your saved questions"
                            onPress={() => router.push("/profile/bookmarks")}
                        />
                        <MenuItem
                            icon="cancel"
                            title="My Mistakes"
                            subtitle="Review incorrect answers"
                            onPress={() => router.push("/profile/mistakes")}
                        />
                        <MenuItem
                            icon="analytics"
                            title="Performance"
                            subtitle="Track your progress and stats"
                            onPress={() => router.push("/profile/performance")}
                        />
                        <MenuItem
                            icon="emoji_events"
                            title="Achievements"
                            subtitle="Badges and milestones"
                            onPress={() => router.push("/profile/achievements")}
                        />
                        <MenuItem
                            icon="leaderboard"
                            title="Leaderboard"
                            subtitle="See how you rank"
                            onPress={() => router.push("/profile/leaderboard")}
                        />
                        <MenuItem
                            icon="history"
                            title="Revision"
                            subtitle="Review your mistakes"
                            onPress={() => router.push("/profile/revision")}
                            isLast
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="settings"
                            title="Settings"
                            subtitle="Preferences, notifications, privacy"
                            onPress={() => router.push("/profile/settings")}
                        />
                        <MenuItem
                            icon="edit"
                            title="Edit Profile"
                            subtitle="Update your information"
                            onPress={() => router.push("/profile/edit")}
                        />
                        <MenuItem
                            icon="support_agent"
                            title="Help & Support"
                            subtitle="Get help and report issues"
                            onPress={() => Alert.alert("Help", "Email us at support@sainikprep.com")}
                            isLast
                        />
                    </View>
                </View>

                <Pressable
                    onPress={handleSignOut}
                    style={({ pressed }) => [styles.signOutBtn, pressed ? layout.pressed : null]}
                >
                    <View style={styles.signOutCard}>
                        <MaterialIcon name="logout" size={20} color={colors.error} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </View>
                </Pressable>

                <Text style={styles.disclaimer}>
                    This is an independent educational application and is not affiliated with NTA, Sainik Schools Society, or the Government of India.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
