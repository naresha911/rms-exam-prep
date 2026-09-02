import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

// Mock student data
const STUDENT_DATA = {
    name: "Rohit Kumar",
    class: "Class 5",
    targetClass: "Class 6",
    overallProgress: 68,
    questionsAttempted: 487,
    averageAccuracy: 78,
    studyTime: "23h 45m",
    currentStreak: 12,
    xp: 2450,
    rank: 42,
};

const WEEKLY_DATA = [
    { day: "Mon", questions: 18, accuracy: 80 },
    { day: "Tue", questions: 25, accuracy: 75 },
    { day: "Wed", questions: 15, accuracy: 85 },
    { day: "Thu", questions: 30, accuracy: 70 },
    { day: "Fri", questions: 22, accuracy: 82 },
    { day: "Sat", questions: 35, accuracy: 78 },
    { day: "Sun", questions: 28, accuracy: 90 },
];

const SUBJECT_PERFORMANCE = [
    { subject: "Mathematics", progress: 75, color: "#6366F1" },
    { subject: "English", progress: 68, color: "#22C55E" },
    { subject: "Intelligence", progress: 82, color: "#F59E0B" },
    { subject: "GK", progress: 60, color: "#EF4444" },
];

const WEAK_AREAS = [
    "Indian Geography (40%)",
    "Algebraic Equations (55%)",
    "Verbal Analogies (58%)",
];

const STRENGTHS = [
    "Pattern Recognition (92%)",
    "Reading Comprehension (88%)",
    "Number Series (85%)",
];

export default function ParentDashboardScreen() {
    const maxQuestions = Math.max(...WEEKLY_DATA.map((d) => d.questions));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ marginBottom: SPACING[5] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                        }}
                    >
                        Parent Dashboard
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            marginTop: SPACING[1],
                        }}
                    >
                        Track your child's progress
                    </Text>
                </View>

                {/* Student Profile Card */}
                <Card
                    variant="elevated"
                    style={{
                        backgroundColor: COLORS.primary,
                        marginBottom: SPACING[4],
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: "rgba(255,255,255,0.2)",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: SPACING[4],
                            }}
                        >
                            <MascotDisplay expression="happy" size={56} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xl,
                                    fontWeight: "800",
                                    color: COLORS.onPrimary,
                                }}
                            >
                                {STUDENT_DATA.name}
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    color: "rgba(255,255,255,0.8)",
                                }}
                            >
                                {STUDENT_DATA.class} → {STUDENT_DATA.targetClass}
                            </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize["2xl"],
                                    fontWeight: "800",
                                    color: COLORS.warning,
                                }}
                            >
                                {STUDENT_DATA.overallProgress}%
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: "rgba(255,255,255,0.8)",
                                }}
                            >
                                Overall
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Key Stats Grid */}
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: SPACING[3],
                        marginBottom: SPACING[4],
                    }}
                >
                    {[
                        { label: "Questions", value: STUDENT_DATA.questionsAttempted, icon: "📝", color: COLORS.primary },
                        { label: "Accuracy", value: `${STUDENT_DATA.averageAccuracy}%`, icon: "🎯", color: COLORS.success },
                        { label: "Study Time", value: STUDENT_DATA.studyTime, icon: "⏱️", color: COLORS.warning },
                        { label: "Streak", value: `${STUDENT_DATA.currentStreak} days`, icon: "🔥", color: COLORS.error },
                    ].map((stat, index) => (
                        <View
                            key={index}
                            style={{
                                flex: 1,
                                minWidth: "47%",
                            }}
                        >
                            <Card variant="elevated" style={{ alignItems: "center" }}>
                                <Text style={{ fontSize: 28 }}>{stat.icon}</Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.lg,
                                        fontWeight: "800",
                                        color: stat.color,
                                        marginTop: SPACING[1],
                                    }}
                                >
                                    {stat.value}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.xs,
                                        color: COLORS.textSecondary,
                                    }}
                                >
                                    {stat.label}
                                </Text>
                            </Card>
                        </View>
                    ))}
                </View>

                {/* Weekly Performance Chart */}
                <Card variant="elevated" style={{ marginBottom: SPACING[4] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[4],
                        }}
                    >
                        This Week's Activity
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "flex-end",
                            height: 120,
                        }}
                    >
                        {WEEKLY_DATA.map((day, index) => (
                            <View key={index} style={{ alignItems: "center" }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.xs,
                                        color: COLORS.textSecondary,
                                        marginBottom: SPACING[1],
                                    }}
                                >
                                    {day.questions}
                                </Text>
                                <View
                                    style={{
                                        width: 24,
                                        height: (day.questions / maxQuestions) * 80,
                                        backgroundColor: COLORS.primary,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.xs,
                                        color: COLORS.textSecondary,
                                        marginTop: SPACING[1],
                                    }}
                                >
                                    {day.day}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Subject Performance */}
                <Card variant="elevated" style={{ marginBottom: SPACING[4] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[4],
                        }}
                    >
                        Subject-wise Progress
                    </Text>
                    {SUBJECT_PERFORMANCE.map((subject, index) => (
                        <View key={index} style={{ marginBottom: SPACING[3] }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: SPACING[1],
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: "600",
                                        color: COLORS.textPrimary,
                                    }}
                                >
                                    {subject.subject}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        fontWeight: "700",
                                        color: subject.color,
                                    }}
                                >
                                    {subject.progress}%
                                </Text>
                            </View>
                            <View
                                style={{
                                    height: 8,
                                    backgroundColor: COLORS.surfaceContainer,
                                    borderRadius: 4,
                                    overflow: "hidden",
                                }}
                            >
                                <View
                                    style={{
                                        width: `${subject.progress}%`,
                                        height: "100%",
                                        backgroundColor: subject.color,
                                    }}
                                />
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Strengths & Weaknesses */}
                <View style={{ flexDirection: "row", gap: SPACING[3], marginBottom: SPACING[4] }}>
                    <View style={{ flex: 1 }}>
                        <Card variant="elevated" style={{ backgroundColor: COLORS.successLight }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING[2] }}>
                                <Text style={{ fontSize: 20 }}>💪</Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: "700",
                                        color: COLORS.success,
                                        marginLeft: SPACING[2],
                                    }}
                                >
                                    Strengths
                                </Text>
                            </View>
                            {STRENGTHS.map((item, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        color: COLORS.textPrimary,
                                        marginBottom: SPACING[1],
                                    }}
                                >
                                    • {item}
                                </Text>
                            ))}
                        </Card>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Card variant="elevated" style={{ backgroundColor: COLORS.errorLight }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING[2] }}>
                                <Text style={{ fontSize: 20 }}>📚</Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: "700",
                                        color: COLORS.error,
                                        marginLeft: SPACING[2],
                                    }}
                                >
                                    Focus Areas
                                </Text>
                            </View>
                            {WEAK_AREAS.map((item, index) => (
                                <Text
                                    key={index}
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        color: COLORS.textPrimary,
                                        marginBottom: SPACING[1],
                                    }}
                                >
                                    • {item}
                                </Text>
                            ))}
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
