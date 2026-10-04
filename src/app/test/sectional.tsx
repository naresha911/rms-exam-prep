// Sectional Tests Screen - List of section-based tests
import { Pressable, ScrollView, Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { useAppStore } from "../../store/useAppStore";
import { SPACING, TYPOGRAPHY, getExamStructureForStandard, normalizeStudentStandard } from "../../constants";
import { layout, useThemedStyles, type ColorPalette } from "../../theme";

const SECTION_ICONS: Record<string, string> = {
    'Language': '📖',
    'Mathematics': '🔢',
    'Intelligence': '🧠',
    'General Knowledge': '🌍',
    'English': '📝',
    'General Science': '🔬',
    'Social Science': '🏛️',
};

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            padding: SPACING[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
        },
        backBtn: { padding: SPACING[2] },
        backIcon: { fontSize: 24, color: colors.textPrimary },
        headerTitle: {
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.textPrimary,
            textAlign: "center" as const,
            marginRight: 40,
        },
        scroll: { padding: SPACING[5] },
        intro: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
            marginBottom: SPACING[5],
        },
        cardPress: { marginBottom: SPACING[3] },
        iconTile: {
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: colors.primaryFixed,
        },
        iconTileWarning: {
            backgroundColor: colors.warningLight,
        },
        iconGlyph: { fontSize: 28 },
        sectionCopy: { flex: 1, marginLeft: SPACING[3] },
        sectionName: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.textPrimary,
        },
        sectionMeta: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
            marginTop: 4,
        },
        marksValue: {
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            color: colors.primary,
        },
        marksLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textTertiary,
        },
        startRow: {
            marginTop: SPACING[3],
            paddingTop: SPACING[3],
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
            justifyContent: "flex-end" as const,
        },
        startChip: {
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[2],
            backgroundColor: colors.primary,
            borderRadius: 20,
        },
        startChipText: {
            color: colors.textInverse,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.sm,
        },
        speedTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.textPrimary,
            marginTop: SPACING[4],
            marginBottom: SPACING[3],
        },
        speedArrow: { color: colors.primary, fontSize: 20 },
    };
}

export default function SectionalTestsScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const styles = useThemedStyles(createStyles);
    const examInfo = getExamStructureForStandard(user?.target_class);
    const targetClass = normalizeStudentStandard(user?.target_class);

    const handleStartSection = (sectionName: string, questions: number, marks: number) => {
        Alert.alert(
            `Start ${sectionName} Test`,
            `${questions} questions • ${marks} marks\n\nAre you ready to begin?`,
            [
                { text: "Not Yet", style: "cancel" },
                {
                    text: "Start",
                    onPress: () => {
                        router.push({
                            pathname: "/test/session",
                            params: { type: "sectional", section: sectionName, class: targetClass }
                        });
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[layout.row, styles.header]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backBtn, pressed && layout.pressed]}
                >
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>📝 Sectional Tests</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.intro}>
                    Practice individual subjects to strengthen your weak areas.
                </Text>

                {examInfo.sections.map((section, idx) => (
                    <Pressable
                        key={idx}
                        onPress={() => handleStartSection(section.name, section.questions, section.marks)}
                        style={({ pressed }) => [styles.cardPress, pressed && layout.pressed]}
                    >
                        <Card>
                            <View style={layout.row}>
                                <View style={[layout.center, styles.iconTile]}>
                                    <Text style={styles.iconGlyph}>
                                        {SECTION_ICONS[section.name] || "📚"}
                                    </Text>
                                </View>
                                <View style={styles.sectionCopy}>
                                    <Text style={styles.sectionName}>{section.name}</Text>
                                    <Text style={styles.sectionMeta}>
                                        {section.questions} questions • {marksToTime(section.marks)} min
                                    </Text>
                                </View>
                                <View style={layout.center}>
                                    <Text style={styles.marksValue}>{section.marks}</Text>
                                    <Text style={styles.marksLabel}>marks</Text>
                                </View>
                            </View>
                            <View style={[layout.row, styles.startRow]}>
                                <View style={styles.startChip}>
                                    <Text style={styles.startChipText}>Start Test →</Text>
                                </View>
                            </View>
                        </Card>
                    </Pressable>
                ))}

                <Text style={styles.speedTitle}>⚡ Speed Tests</Text>
                <Pressable
                    onPress={() => {
                        Alert.alert(
                            "Speed Test",
                            "10 questions in 5 minutes. Test your speed and accuracy!",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Start",
                                    onPress: () => {
                                        router.push({
                                            pathname: "/test/session",
                                            params: { type: "speed", class: targetClass }
                                        });
                                    },
                                },
                            ]
                        );
                    }}
                    style={({ pressed }) => [styles.cardPress, pressed && layout.pressed]}
                >
                    <Card>
                        <View style={layout.row}>
                            <View style={[layout.center, styles.iconTile, styles.iconTileWarning]}>
                                <Text style={styles.iconGlyph}>⚡</Text>
                            </View>
                            <View style={styles.sectionCopy}>
                                <Text style={styles.sectionName}>Quick Speed Test</Text>
                                <Text style={styles.sectionMeta}>10 questions • 5 minutes</Text>
                            </View>
                            <Text style={styles.speedArrow}>→</Text>
                        </View>
                    </Card>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

function marksToTime(marks: number): string {
    // Rough estimation: 2 marks per minute
    const minutes = Math.round(marks / 2);
    return `${minutes}`;
}
