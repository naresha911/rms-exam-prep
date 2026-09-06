// Practice Topic Screen — configure and start a topic-specific practice session
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { MascotDisplay } from "../../../components/shared/MascotDisplay";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../store/useAppStore";
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    BORDER_RADIUS,
    PRACTICE_COUNTS,
} from "../../../constants";

type Difficulty = "any" | "easy" | "medium" | "hard";

interface TopicInfo {
    id: number;
    name: string;
    subject: { id: number; name: string };
    questionCount?: number;
}

export default function TopicPracticeScreen() {
    const router = useRouter();
    const { topicId } = useLocalSearchParams<{ topicId: string }>();
    const { user } = useAppStore();

    const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCount, setSelectedCount] = useState(10);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("any");

    const DIFFICULTY_OPTIONS: { label: string; value: Difficulty; emoji: string; color: string }[] = [
        { label: "Any", value: "any", emoji: "🎲", color: COLORS.primary },
        { label: "Easy", value: "easy", emoji: "🟢", color: COLORS.success },
        { label: "Medium", value: "medium", emoji: "🟡", color: COLORS.warning },
        { label: "Hard", value: "hard", emoji: "🔴", color: COLORS.error },
    ];

    useEffect(() => {
        loadTopicInfo();
    }, [topicId]);

    const loadTopicInfo = async () => {
        if (!topicId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("topics")
                .select("id, name, subjects(id, name)")
                .eq("id", parseInt(topicId, 10))
                .single();

            if (!error && data) {
                setTopicInfo({
                    id: data.id,
                    name: data.name,
                    subject: (data as any).subjects ?? { id: 0, name: "Unknown" },
                });
            }
        } catch (e) {
            console.warn("TopicPractice: failed to load topic", e);
        } finally {
            setLoading(false);
        }
    };

    const handleStartPractice = () => {
        if (!topicInfo) return;

        router.push({
            pathname: "/practice/session",
            params: {
                subjectId: topicInfo.subject.id.toString(),
                topicId: topicInfo.id.toString(),
                count: selectedCount.toString(),
                ...(selectedDifficulty !== "any" && { difficulty: selectedDifficulty }),
            },
        } as any);
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" }}>
                <LoadingSpinner size="large" />
            </SafeAreaView>
        );
    }

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
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => ({ padding: SPACING[2], opacity: pressed ? 0.7 : 1 })}
                >
                    <Text style={{ fontSize: 22 }}>←</Text>
                </Pressable>
                <View style={{ flex: 1, marginLeft: SPACING[2] }}>
                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: "700", color: COLORS.textPrimary }}>
                        {topicInfo?.name ?? "Topic Practice"}
                    </Text>
                    {topicInfo?.subject && (
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                            {topicInfo.subject.name}
                        </Text>
                    )}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Mascot */}
                <View style={{ alignItems: "center", marginBottom: SPACING[4] }}>
                    <MascotDisplay expression="studying" size={100} />
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.xl,
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            marginTop: SPACING[3],
                            textAlign: "center",
                        }}
                    >
                        {topicInfo?.name ?? "Practice Topic"}
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            marginTop: 4,
                            textAlign: "center",
                        }}
                    >
                        Configure your practice session
                    </Text>
                </View>

                {/* Question Count */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    How many questions?
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        gap: SPACING[2],
                        marginBottom: SPACING[5],
                        flexWrap: "wrap",
                    }}
                >
                    {PRACTICE_COUNTS.map((count) => (
                        <Pressable
                            key={count}
                            onPress={() => setSelectedCount(count)}
                            style={({ pressed }) => ({
                                flex: 1,
                                minWidth: 60,
                                paddingVertical: SPACING[3],
                                paddingHorizontal: SPACING[2],
                                borderRadius: BORDER_RADIUS.lg,
                                borderWidth: 2,
                                borderColor: selectedCount === count ? COLORS.primary : COLORS.cardBorder,
                                backgroundColor: selectedCount === count ? COLORS.primaryFixed : COLORS.background,
                                alignItems: "center",
                                opacity: pressed ? 0.8 : 1,
                            })}
                        >
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.lg,
                                    fontWeight: "800",
                                    color: selectedCount === count ? COLORS.primary : COLORS.textPrimary,
                                }}
                            >
                                {count}
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: selectedCount === count ? COLORS.primary : COLORS.textSecondary,
                                    marginTop: 2,
                                }}
                            >
                                {count === 5 ? "Quick" : count === 10 ? "Standard" : count === 20 ? "Deep" : "Marathon"}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Difficulty */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Difficulty
                </Text>
                <View style={{ flexDirection: "row", gap: SPACING[2], marginBottom: SPACING[5] }}>
                    {DIFFICULTY_OPTIONS.map((opt) => (
                        <Pressable
                            key={opt.value}
                            onPress={() => setSelectedDifficulty(opt.value)}
                            style={({ pressed }) => ({
                                flex: 1,
                                paddingVertical: SPACING[3],
                                borderRadius: BORDER_RADIUS.lg,
                                borderWidth: 2,
                                borderColor: selectedDifficulty === opt.value ? opt.color : COLORS.cardBorder,
                                backgroundColor: selectedDifficulty === opt.value
                                    ? opt.color + "20"
                                    : COLORS.background,
                                alignItems: "center",
                                opacity: pressed ? 0.8 : 1,
                            })}
                        >
                            <Text style={{ fontSize: 18 }}>{opt.emoji}</Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    fontWeight: "700",
                                    color: selectedDifficulty === opt.value ? opt.color : COLORS.textSecondary,
                                    marginTop: 2,
                                }}
                            >
                                {opt.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Summary card */}
                <Card variant="elevated" style={{ marginBottom: SPACING[5] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            fontWeight: "700",
                            color: COLORS.textSecondary,
                            marginBottom: SPACING[2],
                        }}
                    >
                        Session Summary
                    </Text>
                    <View style={{ flexDirection: "row", gap: SPACING[4] }}>
                        <View>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: "800", color: COLORS.primary }}>
                                {selectedCount}
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>Questions</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: "800", color: COLORS.primary }}>
                                ~{Math.ceil(selectedCount * 1.5)}m
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>Est. Time</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: "800", color: COLORS.xpGold }}>
                                +{selectedCount * 10}
                            </Text>
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>Max XP</Text>
                        </View>
                    </View>
                </Card>

                {/* Start button */}
                <Button
                    title="🚀 Start Practice"
                    onPress={handleStartPractice}
                    fullWidth
                    size="lg"
                />
            </ScrollView>
        </SafeAreaView>
    );
}
