import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, getExamStructureForStandard, normalizeStudentStandard } from "../../constants";

export default function TestsScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const examInfo = getExamStructureForStandard(user?.target_class);
    const targetClass = normalizeStudentStandard(user?.target_class);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize["2xl"],
                        fontWeight: "800",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[1],
                    }}
                >
                    Mock Tests
                </Text>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        color: COLORS.textSecondary,
                        marginBottom: SPACING[5],
                    }}
                >
                    Simulate the real AISSEE exam
                </Text>

                {/* Full Mock Test Banner */}
                <Pressable onPress={() => router.push("/test/full-mock")}>
                    <View
                        style={{
                            backgroundColor: COLORS.primary,
                            borderRadius: BORDER_RADIUS["2xl"],
                            padding: SPACING[5],
                            marginBottom: SPACING[4],
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[3] }}>
                            <Text style={{ fontSize: 40 }}>🎖️</Text>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        color: "#fff",
                                        fontSize: TYPOGRAPHY.fontSize.xl,
                                        fontWeight: "800",
                                    }}
                                >
                                    Full Mock Test
                                </Text>
                                <Text
                                    style={{
                                        color: "rgba(255,255,255,0.9)",
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        marginTop: 2,
                                    }}
                                >
                                    Complete AISSEE pattern • Class {targetClass}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: SPACING[4],
                                gap: SPACING[4],
                            }}
                        >
                            <TestStat label="Questions" value={`${examInfo.totalQuestions}`} />
                            <TestStat label="Marks" value={`${examInfo.totalMarks}`} />
                            <TestStat label="Time" value={`${examInfo.durationMinutes}m`} />
                        </View>
                    </View>
                </Pressable>

                {/* Sectional Tests */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Sectional Tests
                </Text>
                <View style={{ gap: SPACING[3], marginBottom: SPACING[6] }}>
                    {examInfo.sections.map((section, idx) => (
                        <SectionalTestCard
                            key={idx}
                            name={section.name}
                            questions={section.questions}
                            marks={section.marks}
                        />
                    ))}
                </View>

                {/* Previous Papers */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Previous Year Papers
                </Text>
                <Pressable onPress={() => router.push("/papers")}>
                    <Card>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[3] }}>
                            <Text style={{ fontSize: 32 }}>📜</Text>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: "600",
                                        color: COLORS.textPrimary,
                                    }}
                                >
                                    Past Year Papers
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        color: COLORS.textSecondary,
                                        marginTop: 2,
                                    }}
                                >
                                    Practice with real AISSEE papers
                                </Text>
                            </View>
                            <Text style={{ color: COLORS.primary, fontSize: 18 }}>→</Text>
                        </View>
                    </Card>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

function TestStat({ label, value }: { label: string; value: string }) {
    return (
        <View>
            <Text
                style={{
                    color: "#fff",
                    fontSize: TYPOGRAPHY.fontSize.xl,
                    fontWeight: "800",
                }}
            >
                {value}
            </Text>
            <Text
                style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: TYPOGRAPHY.fontSize.xs,
                }}
            >
                {label}
            </Text>
        </View>
    );
}

function SectionalTestCard({
    name,
    questions,
    marks,
}: {
    name: string;
    questions: number;
    marks: number;
}) {
    const router = useRouter();
    return (
        <Pressable onPress={() => router.push("/test/sectional")}>
            <Card style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: BORDER_RADIUS.lg,
                        backgroundColor: COLORS.backgroundSecondary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ fontSize: 22 }}>📝</Text>
                </View>
                <View style={{ flex: 1, marginLeft: SPACING[3] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            fontWeight: "600",
                            color: COLORS.textPrimary,
                        }}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            color: COLORS.textSecondary,
                            marginTop: 2,
                        }}
                    >
                        {questions} questions • {marks} marks
                    </Text>
                </View>
                <Text style={{ color: COLORS.primary, fontSize: 18 }}>→</Text>
            </Card>
        </Pressable>
    );
}
