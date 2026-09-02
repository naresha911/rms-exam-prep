// Paper Detail / Start Screen
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, EXAM_STRUCTURE } from "../../constants";

export default function PaperDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const paperId = params.paperId as string;
    const year = params.year as string;
    const title = (params.title as string) || `AISSEE ${year}`;
    const totalMarks = parseInt((params.total_marks as string) || (params.totalMarks as string) || "0", 10);
    const duration = parseInt((params.duration as string) || "0", 10);
    const { user } = useAppStore();
    const targetClass = user?.target_class || "6";
    const examInfo = targetClass === "9" ? EXAM_STRUCTURE.class9 : EXAM_STRUCTURE.class6;

    const displayMarks = totalMarks || examInfo.totalMarks;
    const displayDuration = duration || examInfo.durationMinutes;

    const handleStartPaper = () => {
        Alert.alert(
            title,
            `This is a previous year AISSEE paper for Class ${targetClass}.\n\n${examInfo.totalQuestions} questions • ${displayDuration} minutes • ${displayMarks} marks\n\nAre you ready to attempt?`,
            [
                { text: "Not Yet", style: "cancel" },
                {
                    text: "Start",
                    onPress: () => {
                        router.push({
                            pathname: "/test/session",
                            params: { type: "paper", paperId, year, class: targetClass }
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
                    📜 {title}
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
                    {title}
                </Text>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        color: COLORS.textSecondary,
                        textAlign: "center",
                        marginBottom: SPACING[6],
                    }}
                >
                    Previous Year Question Paper • Class {targetClass}
                </Text>

                {/* Info Card */}
                <Card style={{ marginBottom: SPACING[5] }}>
                    <View style={{ gap: SPACING[3] }}>
                        <InfoRow icon="📅" label="Year" value={year} />
                        <InfoRow icon="📚" label="Class" value={`Class ${targetClass}`} />
                        <InfoRow icon="❓" label="Questions" value={`${examInfo.totalQuestions}`} />
                        <InfoRow icon="🏆" label="Total Marks" value={`${displayMarks}`} />
                        <InfoRow icon="⏱️" label="Duration" value={`${displayDuration} minutes`} />
                    </View>
                </Card>

                {/* Notice */}
                <Card style={{ marginBottom: SPACING[5], backgroundColor: COLORS.warningLight }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                        <Text style={{ fontSize: 24, marginRight: SPACING[2] }}>⚠️</Text>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.base,
                                    fontWeight: "700",
                                    color: COLORS.warning,
                                    marginBottom: 4,
                                }}
                            >
                                Important Notice
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, lineHeight: 20 }}>
                                This paper is for practice purposes. The actual AISSEE exam may have different patterns and marking schemes. Always refer to the latest official notification.
                            </Text>
                        </View>
                    </View>
                </Card>

                <View style={{ flex: 1 }} />

                {/* Start Button */}
                <Button
                    title="📝 Attempt Paper"
                    onPress={handleStartPaper}
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
