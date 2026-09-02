// Full Mock Test Start Screen
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, EXAM_STRUCTURE } from "../../constants";

export default function FullMockTestScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const examInfo = user?.target_class === "9" ? EXAM_STRUCTURE.class9 : EXAM_STRUCTURE.class6;
    const targetClass = user?.target_class || "6";
    const [loading, setLoading] = useState(false);

    const handleStartTest = () => {
        Alert.alert(
            "Start Full Mock Test",
            `This test has ${examInfo.totalQuestions} questions and a ${examInfo.durationMinutes} minute time limit. You cannot pause once started. Are you ready?`,
            [
                { text: "Not Yet", style: "cancel" },
                {
                    text: "Start Test",
                    onPress: () => {
                        setLoading(true);
                        router.push({
                            pathname: "/test/session",
                            params: { type: "full", class: targetClass }
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
                    🎖️ Full Mock Test
                </Text>
            </View>

            <View style={{ flex: 1, padding: SPACING[5] }}>
                {/* Mascot */}
                <View style={{ alignItems: "center", marginVertical: SPACING[4] }}>
                    <MascotDisplay expression="encouraging" size={140} />
                </View>

                {/* Title */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize["2xl"],
                        fontWeight: "800",
                        color: COLORS.textPrimary,
                        textAlign: "center",
                        marginBottom: SPACING[2],
                    }}
                >
                    AISSEE Class {targetClass}
                </Text>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        color: COLORS.textSecondary,
                        textAlign: "center",
                        marginBottom: SPACING[6],
                    }}
                >
                    Full Length Practice Test
                </Text>

                {/* Exam Details */}
                <Card style={{ marginBottom: SPACING[5] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[4],
                        }}
                    >
                        📋 Exam Details
                    </Text>

                    <View style={{ gap: SPACING[3] }}>
                        <InfoRow icon="❓" label="Total Questions" value={`${examInfo.totalQuestions}`} />
                        <InfoRow icon="🏆" label="Total Marks" value={`${examInfo.totalMarks}`} />
                        <InfoRow icon="⏱️" label="Duration" value={`${examInfo.durationMinutes} minutes`} />
                        <InfoRow icon="📉" label="Negative Marking" value="0.33 per wrong answer" />
                    </View>
                </Card>

                {/* Sections */}
                <Card style={{ marginBottom: SPACING[5] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[4],
                        }}
                    >
                        📚 Sections
                    </Text>

                    <View style={{ gap: SPACING[2] }}>
                        {examInfo.sections.map((section, idx) => (
                            <View
                                key={idx}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: SPACING[2],
                                    borderBottomWidth: idx < examInfo.sections.length - 1 ? 1 : 0,
                                    borderBottomColor: COLORS.cardBorder,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        color: COLORS.textPrimary,
                                        fontWeight: "500",
                                    }}
                                >
                                    {section.name}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        color: COLORS.textSecondary,
                                    }}
                                >
                                    {section.questions} Q • {section.marks} marks
                                </Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Instructions */}
                <Card style={{ marginBottom: SPACING[5] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[2],
                        }}
                    >
                        ⚠️ Instructions
                    </Text>
                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, lineHeight: 20 }}>
                        • Answer all questions to the best of your ability{'\n'}
                        • You can flag questions to review later{'\n'}
                        • The test cannot be paused once started{'\n'}
                        • Results will be shown immediately after submission
                    </Text>
                </Card>

                <View style={{ flex: 1 }} />

                {/* Start Button */}
                <Button
                    title="🚀 Start Full Mock Test"
                    onPress={handleStartTest}
                    loading={loading}
                    style={{ marginTop: SPACING[4] }}
                />
            </View>
        </SafeAreaView>
    );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 20, marginRight: SPACING[3] }}>{icon}</Text>
            <Text
                style={{
                    flex: 1,
                    fontSize: TYPOGRAPHY.fontSize.base,
                    color: COLORS.textSecondary,
                }}
            >
                {label}
            </Text>
            <Text
                style={{
                    fontSize: TYPOGRAPHY.fontSize.base,
                    fontWeight: "600",
                    color: COLORS.textPrimary,
                }}
            >
                {value}
            </Text>
        </View>
    );
}
