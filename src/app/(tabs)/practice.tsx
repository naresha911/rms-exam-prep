// Practice Hub — Stitch-aligned subject and practice mode listing screen.
// Per Stitch: page title + subtitle, colored practice mode cards, subject list.
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SUBJECTS } from "../../constants";

const PRACTICE_MODES = [
    {
        icon: "bolt" as const,
        title: "Quick Practice",
        subtitle: "5-20 questions for daily practice",
        bg: COLORS.primary,
        textColor: COLORS.onPrimary,
    },
    {
        icon: "menu_book" as const,
        title: "Topic Practice",
        subtitle: "Master specific topics",
        bg: COLORS.secondary,
        textColor: COLORS.onSecondary,
    },
    {
        icon: "psychology" as const,
        title: "Weak Areas",
        subtitle: "Focus on topics that need work",
        bg: COLORS.tertiary,
        textColor: COLORS.onTertiary,
    },
    {
        icon: "timer" as const,
        title: "Speed Test",
        subtitle: "Timed challenges",
        bg: "rgba(249, 115, 22, 1)",
        textColor: "#fff",
    },
];

const SUBJECT_EMOJI: Record<string, string> = {
    MAT: "📐",
    LNG: "📖",
    INT: "🧠",
    GK: "🌍",
    ENG: "📝",
    GSC: "🔬",
    SSC: "🏛️",
};

export default function PracticeScreen() {
    const router = useRouter();
    const { user } = useAppStore();

    const subjects = user?.target_class === "9" ? SUBJECTS.class9 : SUBJECTS.class6;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text style={styles.pageTitle}>Practice Hub</Text>
                <Text style={styles.pageSubtitle}>
                    Choose your learning path
                </Text>

                {/* Practice Modes — Stitch: colored cards */}
                <Text style={styles.sectionTitle}>Practice Modes</Text>
                <View style={styles.modesContainer}>
                    {PRACTICE_MODES.map((mode, idx) => (
                        <Pressable
                            key={mode.title}
                            onPress={() => router.push("/(tabs)/practice")}
                            style={({ pressed }) => [
                                styles.modeCard,
                                pressed && styles.modeCardPressed,
                            ]}
                        >
                            <View style={[styles.modeIconWrap, { backgroundColor: mode.textColor + "20" }]}>
                                <MaterialIcon name={mode.icon} size={24} color={mode.textColor} />
                            </View>
                            <View style={styles.modeContent}>
                                <Text style={[styles.modeTitle, { color: mode.textColor }]}>
                                    {mode.title}
                                </Text>
                                <Text style={[styles.modeSubtitle, { color: mode.textColor, opacity: 0.8 }]}>
                                    {mode.subtitle}
                                </Text>
                            </View>
                            <MaterialIcon name="chevron_right" size={20} color={mode.textColor} />
                        </Pressable>
                    ))}
                </View>

                {/* Subjects */}
                <Text style={styles.sectionTitle}>Subjects</Text>
                <View style={styles.subjectsContainer}>
                    {subjects.map((subject) => (
                        <Pressable
                            key={subject.id}
                            onPress={() => router.push(`/practice/${subject.id}`)}
                            style={({ pressed }) => [
                                styles.subjectCard,
                                pressed && styles.subjectCardPressed,
                            ]}
                        >
                            <View style={styles.subjectIcon}>
                                <Text style={styles.subjectEmoji}>
                                    {SUBJECT_EMOJI[subject.code] || "📚"}
                                </Text>
                            </View>
                            <View style={styles.subjectContent}>
                                <Text style={styles.subjectName}>{subject.name}</Text>
                                <Text style={styles.subjectSubtitle}>
                                    {subject.code} • AISSEE Class {user?.target_class || "6"}
                                </Text>
                            </View>
                            <View style={styles.subjectArrow}>
                                <MaterialIcon name="chevron_right" size={20} color={COLORS.primary} />
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
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
    pageTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.extrabold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.onSurface,
        fontWeight: "800",
        marginBottom: SPACING[1],
    },
    pageSubtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurfaceVariant,
        marginBottom: SPACING[6],
    },
    sectionTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        fontWeight: "700",
        marginBottom: SPACING[3],
    },
    modesContainer: {
        gap: SPACING[3],
        marginBottom: SPACING[6],
    },
    modeCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: BORDER_RADIUS["2xl"],
        padding: SPACING[4],
        gap: SPACING[4],
    },
    modeCardPressed: {
        opacity: 0.85,
    },
    modeIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    modeContent: {
        flex: 1,
    },
    modeTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: "700",
    },
    modeSubtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.xs,
        marginTop: 2,
    },
    subjectsContainer: {
        gap: SPACING[3],
    },
    subjectCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[4],
        gap: SPACING[4],
    },
    subjectCardPressed: {
        backgroundColor: COLORS.surfaceVariant,
    },
    subjectIcon: {
        width: 52,
        height: 52,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.primaryFixed,
        alignItems: "center",
        justifyContent: "center",
    },
    subjectEmoji: {
        fontSize: 26,
    },
    subjectContent: {
        flex: 1,
    },
    subjectName: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurface,
        fontWeight: "700",
    },
    subjectSubtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        marginTop: 2,
    },
    subjectArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceContainerHigh,
        alignItems: "center",
        justifyContent: "center",
    },
});
