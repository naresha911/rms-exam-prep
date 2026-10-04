import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import { fetchTopics } from "../../lib/supabase";
import { Topic, Subject } from "../../types";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SUBJECTS } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: SPACING[5],
        },
        quickCard: {
            backgroundColor: colors.primary,
            borderRadius: BORDER_RADIUS["2xl"],
            padding: SPACING[5],
            marginBottom: SPACING[5],
        },
        quickRow: {
            gap: SPACING[3],
        },
        quickEmoji: {
            fontSize: 36,
        },
        quickCopy: {
            flex: 1,
        },
        quickTitle: {
            color: colors.onPrimary,
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
        },
        quickSubtitle: {
            color: colors.onPrimary,
            fontSize: TYPOGRAPHY.fontSize.sm,
            marginTop: 2,
            opacity: 0.9,
        },
        quickArrow: {
            color: colors.onPrimary,
            fontSize: 20,
        },
        sectionTitle: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            color: colors.textPrimary,
            marginBottom: SPACING[3],
        },
        emptyText: {
            textAlign: "center" as const,
            color: colors.textSecondary,
            paddingVertical: SPACING[4],
        },
        topicList: {
            gap: SPACING[2],
        },
        topicCard: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
        },
        topicIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primaryFixed,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
        topicEmoji: {
            fontSize: 18,
        },
        topicName: {
            flex: 1,
            marginLeft: SPACING[3],
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: colors.textPrimary,
        },
        topicArrow: {
            color: colors.primary,
            fontSize: 18,
        },
    };
}

export default function SubjectTopicsScreen() {
    const router = useRouter();
    const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
    const subjectIdNum = parseInt(subjectId || "0", 10);
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subject, setSubject] = useState<Subject | null>(null);

    useEffect(() => {
        loadTopics();
    }, [subjectIdNum]);

    const loadTopics = async () => {
        setLoading(true);
        try {
            const allSubjects = [
                ...SUBJECTS.class5,
                ...SUBJECTS.class8,
            ];
            const subj = allSubjects.find((s) => s.id === subjectIdNum);
            if (subj) {
                setSubject({
                    id: subj.id,
                    name: subj.name,
                    code: subj.code,
                });
            }

            const { data } = await fetchTopics(subjectIdNum);
            if (data) {
                setTopics(data);
            }
        } catch (e) {
            console.error("Error loading topics:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: subject?.name || "Topics",
                    headerShadowVisible: false,
                }}
            />
            {loading ? (
                <LoadingSpinner message="Loading topics..." />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Pressable
                        onPress={() => router.push(`/practice/session?subjectId=${subjectIdNum}&count=10`)}
                        style={({ pressed }) => [pressed ? layout.pressed : null]}
                    >
                        <View style={styles.quickCard}>
                            <View style={[layout.row, styles.quickRow]}>
                                <Text style={styles.quickEmoji}>⚡</Text>
                                <View style={styles.quickCopy}>
                                    <Text style={styles.quickTitle}>Quick Practice</Text>
                                    <Text style={styles.quickSubtitle}>
                                        10 random questions from {subject?.name || "this subject"}
                                    </Text>
                                </View>
                                <Text style={styles.quickArrow}>→</Text>
                            </View>
                        </View>
                    </Pressable>

                    <Text style={styles.sectionTitle}>Topics</Text>
                    {topics.length === 0 ? (
                        <Card>
                            <Text style={styles.emptyText}>
                                No topics available yet. Check back soon!
                            </Text>
                        </Card>
                    ) : (
                        <View style={styles.topicList}>
                            {topics.map((topic) => (
                                <Pressable
                                    key={topic.id}
                                    onPress={() =>
                                        router.push(
                                            `/practice/session?subjectId=${subjectIdNum}&topicId=${topic.id}&count=10`
                                        )
                                    }
                                    style={({ pressed }) => [pressed ? layout.pressed : null]}
                                >
                                    <Card style={styles.topicCard}>
                                        <View style={styles.topicIcon}>
                                            <Text style={styles.topicEmoji}>📚</Text>
                                        </View>
                                        <Text style={styles.topicName}>{topic.name}</Text>
                                        <Text style={styles.topicArrow}>→</Text>
                                    </Card>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
