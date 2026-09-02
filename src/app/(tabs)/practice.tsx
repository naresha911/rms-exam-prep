import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SUBJECTS } from "../../constants";

export default function PracticeScreen() {
    const router = useRouter();
    const { user } = useAppStore();

    // Get subjects based on target class
    const subjects = user?.target_class === "9" ? SUBJECTS.class9 : SUBJECTS.class6;

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
                    Practice Hub
                </Text>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        color: COLORS.textSecondary,
                        marginBottom: SPACING[5],
                    }}
                >
                    Choose your learning path
                </Text>

                {/* Practice Modes */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Practice Modes
                </Text>
                <View style={{ gap: SPACING[3], marginBottom: SPACING[6] }}>
                    <PracticeModeCard
                        emoji="⚡"
                        title="Quick Practice"
                        subtitle="5-20 questions for daily practice"
                        color="#EDE9FE"
                        textColor={COLORS.primary}
                        onPress={() => router.push("/(tabs)/practice")}
                    />
                    <PracticeModeCard
                        emoji="📚"
                        title="Topic Practice"
                        subtitle="Master specific topics"
                        color="#FEF3C7"
                        textColor="#B45309"
                        onPress={() => router.push("/(tabs)/practice")}
                    />
                    <PracticeModeCard
                        emoji="🎯"
                        title="Weak Areas"
                        subtitle="Focus on topics that need work"
                        color="#FEE2E2"
                        textColor="#DC2626"
                        onPress={() => router.push("/(tabs)/practice")}
                    />
                    <PracticeModeCard
                        emoji="🏃"
                        title="Speed Test"
                        subtitle="Timed challenges"
                        color="#D1FAE5"
                        textColor="#059669"
                        onPress={() => router.push("/(tabs)/practice")}
                    />
                </View>

                {/* Subjects */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Subjects
                </Text>
                <View style={{ gap: SPACING[3] }}>
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            name={subject.name}
                            code={subject.code}
                            emoji={getSubjectEmoji(subject.code)}
                            onPress={() => router.push(`/practice/${subject.id}`)}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function PracticeModeCard({
    emoji,
    title,
    subtitle,
    color,
    textColor,
    onPress,
}: {
    emoji: string;
    title: string;
    subtitle: string;
    color: string;
    textColor: string;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress}>
            <Card style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: color,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: SPACING[4] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                        }}
                    >
                        {title}
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            color: COLORS.textSecondary,
                            marginTop: 2,
                        }}
                    >
                        {subtitle}
                    </Text>
                </View>
                <Text style={{ color: textColor, fontSize: 18 }}>→</Text>
            </Card>
        </Pressable>
    );
}

function SubjectCard({
    name,
    code,
    emoji,
    onPress,
}: {
    name: string;
    code: string;
    emoji: string;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress}>
            <Card
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.background,
                }}
            >
                <View
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: BORDER_RADIUS.lg,
                        backgroundColor: COLORS.primaryLight + "30",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ fontSize: 28 }}>{emoji}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: SPACING[4] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                        }}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.xs,
                            color: COLORS.textSecondary,
                            marginTop: 2,
                        }}
                    >
                        {code} • AISSEE Class {useAppStore.getState().user?.target_class || "6"}
                    </Text>
                </View>
                <View
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: COLORS.backgroundSecondary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ color: COLORS.primary }}>→</Text>
                </View>
            </Card>
        </Pressable>
    );
}

function getSubjectEmoji(code: string): string {
    const emojiMap: Record<string, string> = {
        MAT: "📐",
        LNG: "📖",
        INT: "🧠",
        GK: "🌍",
        ENG: "📝",
        GSC: "🔬",
        SSC: "🏛️",
    };
    return emojiMap[code] || "📚";
}
