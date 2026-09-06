// Profile Screen — Stitch-aligned user profile hub.
// Tab route is `me` (not `profile`) to avoid clashing with `/profile/*` stack screens.
// Per Stitch: avatar header with streak/XP, stats row, My Learning list,
// Settings list, sign-out button.
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../components/ui/Avatar";
import { StreakDisplay } from "../../components/shared/StreakDisplay";
import { XpDisplay } from "../../components/shared/XpDisplay";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
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

    const accuracy = dailyProgress.questionsAnswered > 0
        ? Math.round((dailyProgress.correctAnswers / dailyProgress.questionsAnswered) * 100)
        : 0;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header — Stitch: centered avatar, name, streak/XP pills */}
                <View style={styles.header}>
                    <Avatar
                        name={user?.full_name || "Student"}
                        uri={user?.avatar_url}
                        size={100}
                        backgroundColor={COLORS.primary}
                    />
                    <Text style={styles.userName}>
                        {user?.full_name || "Student"}
                    </Text>
                    <Text style={styles.userSubtitle}>
                        {user?.target_class ? `AISSEE Class ${user.target_class}` : "AISSEE Prep"}
                    </Text>
                    <View style={styles.badges}>
                        <StreakDisplay streak={streak} size="sm" />
                        <XpDisplay xp={xp} level={level} levelName={levelName} size="sm" />
                    </View>
                </View>

                {/* Stats Row — Stitch: surface-container cards */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Progress</Text>
                    <View style={styles.statsRow}>
                        <StatCard
                            icon="quiz"
                            value={dailyProgress.questionsAnswered.toString()}
                            label="Questions"
                            iconBg={COLORS.primaryContainer}
                            iconColor={COLORS.primary}
                        />
                        <StatCard
                            icon="trending_up"
                            value={`${accuracy}%`}
                            label="Accuracy"
                            iconBg={COLORS.secondaryContainer}
                            iconColor={COLORS.secondary}
                        />
                        <StatCard
                            icon="workspace_premium"
                            value={level.toString()}
                            label="Level"
                            iconBg="rgba(168,85,247,0.12)"
                            iconColor="#A855F7"
                        />
                    </View>
                </View>

                {/* My Learning — Stitch: surface cards with icon rows */}
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

                {/* Settings */}
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

                {/* Sign Out */}
                <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
                    <View style={styles.signOutCard}>
                        <MaterialIcon name="logout" size={20} color={COLORS.error} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </View>
                </Pressable>

                {/* Disclaimer */}
                <Text style={styles.disclaimer}>
                    This is an independent educational application and is not affiliated with NTA, Sainik Schools Society, or the Government of India.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatCard({
    icon,
    value,
    label,
    iconBg,
    iconColor,
}: {
    icon: any;
    value: string;
    label: string;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: iconBg }]}>
                <MaterialIcon name={icon} size={18} color={iconColor} filled />
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
    icon: any;
    title: string;
    subtitle: string;
    onPress: () => void;
    isLast?: boolean;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.menuItem,
                !isLast && styles.menuItemBorder,
                pressed && styles.menuItemPressed,
            ]}
        >
            <View style={styles.menuIconWrap}>
                <MaterialIcon name={icon} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <MaterialIcon name="chevron_right" size={22} color={COLORS.onSurfaceVariant} />
        </Pressable>
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
    header: {
        alignItems: "center",
        marginBottom: SPACING[6],
        paddingTop: SPACING[3],
    },
    userName: {
        fontFamily: TYPOGRAPHY.fontFamily.extrabold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.onSurface,
        fontWeight: "800",
        marginTop: SPACING[3],
    },
    userSubtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        fontWeight: "500",
        marginTop: 2,
    },
    badges: {
        flexDirection: "row",
        gap: SPACING[2],
        marginTop: SPACING[3],
    },
    section: {
        marginBottom: SPACING[5],
    },
    sectionTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        fontWeight: "700",
        marginBottom: SPACING[3],
    },
    statsRow: {
        flexDirection: "row",
        gap: SPACING[3],
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
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING[2],
    },
    statValue: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
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
    menuCard: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING[4],
        paddingHorizontal: SPACING[4],
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outlineVariant,
    },
    menuItemPressed: {
        backgroundColor: COLORS.surfaceVariant,
    },
    menuIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryFixed,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING[3],
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurface,
        fontWeight: "600",
    },
    menuSubtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        marginTop: 2,
    },
    signOutBtn: {
        marginTop: SPACING[2],
        marginBottom: SPACING[4],
    },
    signOutCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.error,
        paddingVertical: SPACING[4],
        gap: SPACING[2],
    },
    signOutText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.error,
        fontWeight: "700",
    },
    disclaimer: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
        lineHeight: 18,
    },
});
