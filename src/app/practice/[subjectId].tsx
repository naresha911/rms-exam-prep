import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useEffect, useState } from "react";
import { fetchTopics, fetchSubjects } from "../../lib/supabase";
import { Topic, Subject } from "../../types";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SUBJECTS } from "../../constants";

export default function SubjectTopicsScreen() {
    const router = useRouter();
    const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
    const subjectIdNum = parseInt(subjectId || "0", 10);

    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subject, setSubject] = useState<Subject | null>(null);

    useEffect(() => {
        loadTopics();
    }, [subjectIdNum]);

    const loadTopics = async () => {
        setLoading(true);
        try {
            // Get subject info from constants
            const allSubjects = [
                ...SUBJECTS.class6,
                ...SUBJECTS.class9,
            ];
            const subj = allSubjects.find((s) => s.id === subjectIdNum);
            if (subj) {
                setSubject({
                    id: subj.id,
                    name: subj.name,
                    code: subj.code,
                });
            }

            // Fetch topics from Supabase
            const { data, error } = await fetchTopics(subjectIdNum);
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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: subject?.name || "Topics",
                    headerStyle: { backgroundColor: COLORS.background },
                    headerShadowVisible: false,
                    headerTitleStyle: { fontWeight: "700" },
                }}
            />
            {loading ? (
                <LoadingSpinner message="Loading topics..." />
            ) : (
                <ScrollView
                    contentContainerStyle={{ padding: SPACING[5] }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Quick Practice Card */}
                    <Pressable
                        onPress={() => router.push(`/practice/session?subjectId=${subjectIdNum}&count=10`)}
                    >
                        <View
                            style={{
                                backgroundColor: COLORS.primary,
                                borderRadius: BORDER_RADIUS["2xl"],
                                padding: SPACING[5],
                                marginBottom: SPACING[5],
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[3] }}>
                                <Text style={{ fontSize: 36 }}>⚡</Text>
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: TYPOGRAPHY.fontSize.lg,
                                            fontWeight: "800",
                                        }}
                                    >
                                        Quick Practice
                                    </Text>
                                    <Text
                                        style={{
                                            color: "rgba(255,255,255,0.9)",
                                            fontSize: TYPOGRAPHY.fontSize.sm,
                                            marginTop: 2,
                                        }}
                                    >
                                        10 random questions from {subject?.name || "this subject"}
                                    </Text>
                                </View>
                                <Text style={{ color: "#fff", fontSize: 20 }}>→</Text>
                            </View>
                        </View>
                    </Pressable>

                    {/* Topics List */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[3],
                        }}
                    >
                        Topics
                    </Text>
                    {topics.length === 0 ? (
                        <Card>
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: COLORS.textSecondary,
                                    paddingVertical: SPACING[4],
                                }}
                            >
                                No topics available yet. Check back soon!
                            </Text>
                        </Card>
                    ) : (
                        <View style={{ gap: SPACING[2] }}>
                            {topics.map((topic) => (
                                <Pressable
                                    key={topic.id}
                                    onPress={() =>
                                        router.push(
                                            `/practice/session?subjectId=${subjectIdNum}&topicId=${topic.id}&count=10`
                                        )
                                    }
                                >
                                    <Card style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                backgroundColor: COLORS.primaryLight + "30",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Text style={{ fontSize: 18 }}>📚</Text>
                                        </View>
                                        <Text
                                            style={{
                                                flex: 1,
                                                marginLeft: SPACING[3],
                                                fontSize: TYPOGRAPHY.fontSize.base,
                                                fontWeight: "600",
                                                color: COLORS.textPrimary,
                                            }}
                                        >
                                            {topic.name}
                                        </Text>
                                        <Text style={{ color: COLORS.primary, fontSize: 18 }}>→</Text>
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
