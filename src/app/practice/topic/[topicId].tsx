// Practice Topic Screen — configure and start a topic-specific practice session
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { MascotDisplay } from "../../../components/shared/MascotDisplay";
import { supabase } from "../../../lib/supabase";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, PRACTICE_COUNTS } from "../../../constants";
import { layout, useThemedStyles, type ColorPalette } from "../../../theme";

type Difficulty = "any" | "easy" | "medium" | "hard";

interface TopicInfo {
    id: number;
    name: string;
    subject: { id: number; name: string };
    questionCount?: number;
}

const DIFFICULTY_OPTIONS: { label: string; value: Difficulty; emoji: string }[] = [
    { label: "Any", value: "any", emoji: "🎲" },
    { label: "Easy", value: "easy", emoji: "🟢" },
    { label: "Medium", value: "medium", emoji: "🟡" },
    { label: "Hard", value: "hard", emoji: "🔴" },
];

const DIFF_SURFACE = {
    any: "diffAny",
    easy: "diffEasy",
    medium: "diffMedium",
    hard: "diffHard",
} as const;

const DIFF_TEXT = {
    any: "diffTextAny",
    easy: "diffTextEasy",
    medium: "diffTextMedium",
    hard: "diffTextHard",
} as const;

function countHint(count: number) {
    if (count === 5) return "Quick";
    if (count === 10) return "Standard";
    if (count === 20) return "Deep";
    return "Marathon";
}

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
        backBtn: {
            padding: SPACING[2],
        },
        backGlyph: {
            fontSize: 22,
            color: colors.textPrimary,
        },
        headerCopy: {
            flex: 1,
            marginLeft: SPACING[2],
        },
        headerTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.textPrimary,
        },
        headerSubject: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
        },
        scrollContent: {
            padding: SPACING[5],
        },
        mascotBlock: {
            alignItems: "center" as const,
            marginBottom: SPACING[4],
        },
        topicTitle: {
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            color: colors.textPrimary,
            marginTop: SPACING[3],
            textAlign: "center" as const,
        },
        topicSubtitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.textSecondary,
            marginTop: 4,
            textAlign: "center" as const,
        },
        sectionLabel: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.textPrimary,
            marginBottom: SPACING[3],
        },
        countRow: {
            flexDirection: "row" as const,
            gap: SPACING[2],
            marginBottom: SPACING[5],
            flexWrap: "wrap" as const,
        },
        countChip: {
            flex: 1,
            minWidth: 60,
            paddingVertical: SPACING[3],
            paddingHorizontal: SPACING[2],
            borderRadius: BORDER_RADIUS.lg,
            borderWidth: 2,
            alignItems: "center" as const,
        },
        countChipSelected: {
            borderColor: colors.primary,
            backgroundColor: colors.primaryFixed,
        },
        countChipIdle: {
            borderColor: colors.cardBorder,
            backgroundColor: colors.background,
        },
        countValue: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        countValueSelected: { color: colors.primary },
        countValueIdle: { color: colors.textPrimary },
        countHint: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            marginTop: 2,
        },
        countHintSelected: { color: colors.primary },
        countHintIdle: { color: colors.textSecondary },
        diffRow: {
            flexDirection: "row" as const,
            gap: SPACING[2],
            marginBottom: SPACING[5],
        },
        diffChip: {
            flex: 1,
            paddingVertical: SPACING[3],
            borderRadius: BORDER_RADIUS.lg,
            borderWidth: 2,
            alignItems: "center" as const,
        },
        diffIdle: {
            borderColor: colors.cardBorder,
            backgroundColor: colors.background,
        },
        diffAny: {
            borderColor: colors.primary,
            backgroundColor: colors.primaryFixed,
        },
        diffEasy: {
            borderColor: colors.success,
            backgroundColor: colors.successLight,
        },
        diffMedium: {
            borderColor: colors.warning,
            backgroundColor: colors.warningLight,
        },
        diffHard: {
            borderColor: colors.error,
            backgroundColor: colors.errorLight,
        },
        diffEmoji: { fontSize: 18 },
        diffLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            marginTop: 2,
        },
        diffTextIdle: { color: colors.textSecondary },
        diffTextAny: { color: colors.primary },
        diffTextEasy: { color: colors.success },
        diffTextMedium: { color: colors.warning },
        diffTextHard: { color: colors.error },
        summaryCard: {
            marginBottom: SPACING[5],
        },
        summaryTitle: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.textSecondary,
            marginBottom: SPACING[2],
        },
        summaryRow: {
            flexDirection: "row" as const,
            gap: SPACING[4],
        },
        summaryValue: {
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            color: colors.primary,
        },
        summaryXp: {
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            color: colors.xpGold,
        },
        summaryLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
        },
    };
}

export default function TopicPracticeScreen() {
    const router = useRouter();
    const { topicId } = useLocalSearchParams<{ topicId: string }>();
    const styles = useThemedStyles(createStyles);

    const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCount, setSelectedCount] = useState(10);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("any");

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
            <SafeAreaView style={[layout.fill, layout.center, styles.screen]}>
                <LoadingSpinner size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[layout.row, styles.header]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backBtn, pressed ? layout.pressed : null]}
                >
                    <Text style={styles.backGlyph}>←</Text>
                </Pressable>
                <View style={styles.headerCopy}>
                    <Text style={styles.headerTitle}>{topicInfo?.name ?? "Topic Practice"}</Text>
                    {topicInfo?.subject ? (
                        <Text style={styles.headerSubject}>{topicInfo.subject.name}</Text>
                    ) : null}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mascotBlock}>
                    <MascotDisplay expression="studying" size={100} />
                    <Text style={styles.topicTitle}>{topicInfo?.name ?? "Practice Topic"}</Text>
                    <Text style={styles.topicSubtitle}>Configure your practice session</Text>
                </View>

                <Text style={styles.sectionLabel}>How many questions?</Text>
                <View style={styles.countRow}>
                    {PRACTICE_COUNTS.map((count) => {
                        const selected = selectedCount === count;
                        return (
                            <Pressable
                                key={count}
                                onPress={() => setSelectedCount(count)}
                                style={({ pressed }) => [
                                    styles.countChip,
                                    selected ? styles.countChipSelected : styles.countChipIdle,
                                    pressed ? layout.pressed : null,
                                ]}
                            >
                                <Text style={[styles.countValue, selected ? styles.countValueSelected : styles.countValueIdle]}>
                                    {count}
                                </Text>
                                <Text style={[styles.countHint, selected ? styles.countHintSelected : styles.countHintIdle]}>
                                    {countHint(count)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Text style={styles.sectionLabel}>Difficulty</Text>
                <View style={styles.diffRow}>
                    {DIFFICULTY_OPTIONS.map((opt) => {
                        const selected = selectedDifficulty === opt.value;
                        return (
                            <Pressable
                                key={opt.value}
                                onPress={() => setSelectedDifficulty(opt.value)}
                                style={({ pressed }) => [
                                    styles.diffChip,
                                    selected ? styles[DIFF_SURFACE[opt.value]] : styles.diffIdle,
                                    pressed ? layout.pressed : null,
                                ]}
                            >
                                <Text style={styles.diffEmoji}>{opt.emoji}</Text>
                                <Text style={[styles.diffLabel, selected ? styles[DIFF_TEXT[opt.value]] : styles.diffTextIdle]}>
                                    {opt.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Card variant="elevated" style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Session Summary</Text>
                    <View style={styles.summaryRow}>
                        <View>
                            <Text style={styles.summaryValue}>{selectedCount}</Text>
                            <Text style={styles.summaryLabel}>Questions</Text>
                        </View>
                        <View>
                            <Text style={styles.summaryValue}>~{Math.ceil(selectedCount * 1.5)}m</Text>
                            <Text style={styles.summaryLabel}>Est. Time</Text>
                        </View>
                        <View>
                            <Text style={styles.summaryXp}>+{selectedCount * 10}</Text>
                            <Text style={styles.summaryLabel}>Max XP</Text>
                        </View>
                    </View>
                </Card>

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
