// Sectional Tests Screen - List of section-based tests
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, EXAM_STRUCTURE } from "../../constants";

const SECTION_ICONS: Record<string, string> = {
    'Language': '📖',
    'Mathematics': '🔢',
    'Intelligence': '🧠',
    'General Knowledge': '🌍',
    'English': '📝',
    'General Science': '🔬',
    'Social Science': '🏛️',
};

export default function SectionalTestsScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const examInfo = user?.target_class === "9" ? EXAM_STRUCTURE.class9 : EXAM_STRUCTURE.class6;

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
                            params: { type: "sectional", section: sectionName, class: user?.target_class || "6" }
                        });
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: SPACING[4],
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.cardBorder,
                }}
            >
                <Pressable onPress={() => router.back()} style={{ padding: SPACING[2] }}>
                    <Text style={{ fontSize: 24 }}>←</Text>
                </Pressable>
                <Text
                    style={{
                        flex: 1,
                        fontSize: TYPOGRAPHY.fontSize.xl,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        textAlign: "center",
                        marginRight: 40,
                    }}
                >
                    📝 Sectional Tests
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        color: COLORS.textSecondary,
                        marginBottom: SPACING[5],
                    }}
                >
                    Practice individual subjects to strengthen your weak areas.
                </Text>

                {examInfo.sections.map((section, idx) => (
                    <Pressable
                        key={idx}
                        onPress={() => handleStartSection(section.name, section.questions, section.marks)}
                        style={{ marginBottom: SPACING[3] }}
                    >
                        <Card>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 12,
                                        backgroundColor: COLORS.primaryLight + "30",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>
                                        {SECTION_ICONS[section.name] || "📚"}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: SPACING[3] }}>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.lg,
                                            fontWeight: "700",
                                            color: COLORS.textPrimary,
                                        }}
                                    >
                                        {section.name}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.sm,
                                            color: COLORS.textSecondary,
                                            marginTop: 4,
                                        }}
                                    >
                                        {section.questions} questions • {marksToTime(section.marks)} min
                                    </Text>
                                </View>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: "800", color: COLORS.primary }}>
                                        {section.marks}
                                    </Text>
                                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textTertiary }}>
                                        marks
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginTop: SPACING[3],
                                    paddingTop: SPACING[3],
                                    borderTopWidth: 1,
                                    borderTopColor: COLORS.cardBorder,
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <View
                                    style={{
                                        paddingHorizontal: SPACING[4],
                                        paddingVertical: SPACING[2],
                                        backgroundColor: COLORS.primary,
                                        borderRadius: 20,
                                    }}
                                >
                                    <Text style={{ color: COLORS.textInverse, fontWeight: "700", fontSize: TYPOGRAPHY.fontSize.sm }}>
                                        Start Test →
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </Pressable>
                ))}

                {/* Speed Test Option */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginTop: SPACING[4],
                        marginBottom: SPACING[3],
                    }}
                >
                    ⚡ Speed Tests
                </Text>
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
                                            params: { type: "speed", class: user?.target_class || "6" }
                                        });
                                    },
                                },
                            ]
                        );
                    }}
                    style={{ marginBottom: SPACING[3] }}
                >
                    <Card>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 12,
                                    backgroundColor: COLORS.warningLight,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ fontSize: 28 }}>⚡</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: SPACING[3] }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.lg,
                                        fontWeight: "700",
                                        color: COLORS.textPrimary,
                                    }}
                                >
                                    Quick Speed Test
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        color: COLORS.textSecondary,
                                        marginTop: 4,
                                    }}
                                >
                                    10 questions • 5 minutes
                                </Text>
                            </View>
                            <Text style={{ color: COLORS.primary, fontSize: 20 }}>→</Text>
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
