// Practice Hub — Stitch-aligned subject and practice mode listing screen.
// Per Stitch: page title + subtitle, colored practice mode cards, subject list.
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useAppStore } from "../../store/useAppStore";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, getSubjectsForStandard, normalizeStudentStandard } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";

const PRACTICE_MODES = [
    {
        key: "quick" as const,
        icon: "bolt" as const,
        title: "Quick Practice",
        subtitle: "5-20 questions for daily practice",
    },
    {
        key: "topic" as const,
        icon: "menu_book" as const,
        title: "Topic Practice",
        subtitle: "Master specific topics",
    },
    {
        key: "weak" as const,
        icon: "psychology" as const,
        title: "Weak Areas",
        subtitle: "Focus on topics that need work",
    },
    {
        key: "speed" as const,
        icon: "timer" as const,
        title: "Speed Test",
        subtitle: "Timed challenges",
    },
];

type PracticeModeKey = (typeof PRACTICE_MODES)[number]["key"];

const MODE_CARD = {
    quick: "modeQuick",
    topic: "modeTopic",
    weak: "modeWeak",
    speed: "modeSpeed",
} as const;

const MODE_INK = {
    quick: "inkQuick",
    topic: "inkTopic",
    weak: "inkWeak",
    speed: "inkSpeed",
} as const;

const SUBJECT_EMOJI: Record<string, string> = {
    MAT: "📐",
    LNG: "📖",
    INT: "🧠",
    GK: "🌍",
    ENG: "📝",
    GSC: "🔬",
    SSC: "🏛️",
};

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: SPACING[5],
        },
        pageTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            marginBottom: SPACING[1],
        },
        pageSubtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurfaceVariant,
            marginBottom: SPACING[6],
        },
        sectionTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            marginBottom: SPACING[3],
        },
        modesContainer: {
            gap: SPACING[3],
            marginBottom: SPACING[6],
        },
        modeCard: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            borderRadius: BORDER_RADIUS["2xl"],
            padding: SPACING[4],
            gap: SPACING[4],
        },
        modeQuick: { backgroundColor: colors.primary },
        modeTopic: { backgroundColor: colors.secondary },
        modeWeak: { backgroundColor: colors.tertiary },
        modeSpeed: { backgroundColor: colors.progressOrange },
        modeIconWrap: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            backgroundColor: colors.surfaceContainerLowest,
        },
        modeContent: {
            flex: 1,
        },
        modeTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        modeSubtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            marginTop: 2,
            opacity: 0.8,
        },
        inkQuick: { color: colors.onPrimary },
        inkTopic: { color: colors.onSecondary },
        inkWeak: { color: colors.onTertiary },
        inkSpeed: { color: colors.onPrimary },
        subjectsContainer: {
            gap: SPACING[3],
        },
        subjectCard: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[4],
            gap: SPACING[4],
        },
        subjectCardPressed: {
            backgroundColor: colors.surfaceVariant,
        },
        subjectIcon: {
            width: 52,
            height: 52,
            borderRadius: BORDER_RADIUS.lg,
            backgroundColor: colors.primaryFixed,
            alignItems: "center" as const,
            justifyContent: "center" as const,
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
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        subjectSubtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            marginTop: 2,
        },
        subjectArrow: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.surfaceContainerHigh,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
    };
}

function modeIconColor(colors: ColorPalette, key: PracticeModeKey) {
    if (key === "quick") return colors.primary;
    if (key === "topic") return colors.secondary;
    if (key === "weak") return colors.tertiary;
    return colors.progressOrange;
}

function modeInkColor(colors: ColorPalette, key: PracticeModeKey) {
    if (key === "topic") return colors.onSecondary;
    if (key === "weak") return colors.onTertiary;
    return colors.onPrimary;
}

export default function PracticeScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    const subjects = getSubjectsForStandard(user?.target_class);
    const studentStandard = normalizeStudentStandard(user?.target_class);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>Practice Hub</Text>
                <Text style={styles.pageSubtitle}>
                    Choose your learning path
                </Text>

                <Text style={styles.sectionTitle}>Practice Modes</Text>
                <View style={styles.modesContainer}>
                    {PRACTICE_MODES.map((mode) => (
                        <Pressable
                            key={mode.title}
                            onPress={() => router.push("/(tabs)/practice")}
                            style={({ pressed }) => [
                                styles.modeCard,
                                styles[MODE_CARD[mode.key]],
                                pressed ? layout.pressed : null,
                            ]}
                        >
                            <View style={styles.modeIconWrap}>
                                <MaterialIcon name={mode.icon} size={24} color={modeIconColor(colors, mode.key)} />
                            </View>
                            <View style={styles.modeContent}>
                                <Text style={[styles.modeTitle, styles[MODE_INK[mode.key]]]}>
                                    {mode.title}
                                </Text>
                                <Text style={[styles.modeSubtitle, styles[MODE_INK[mode.key]]]}>
                                    {mode.subtitle}
                                </Text>
                            </View>
                            <MaterialIcon name="chevron_right" size={20} color={modeInkColor(colors, mode.key)} />
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Subjects</Text>
                <View style={styles.subjectsContainer}>
                    {subjects.map((subject) => (
                        <Pressable
                            key={subject.id}
                            onPress={() => router.push(`/practice/${subject.id}`)}
                            style={({ pressed }) => [
                                styles.subjectCard,
                                pressed ? styles.subjectCardPressed : null,
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
                                    {subject.code} • Class {studentStandard}
                                </Text>
                            </View>
                            <View style={styles.subjectArrow}>
                                <MaterialIcon name="chevron_right" size={20} color={colors.primary} />
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
