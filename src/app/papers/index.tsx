// Papers Screen - Previous year papers fetched from Supabase
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAppStore } from "../../store/useAppStore";
import { fetchPapers } from "../../lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import type { Paper } from "../../types";

export default function PapersScreen() {
    const router = useRouter();
    const { user } = useAppStore();
    const targetClass = user?.target_class || "6";
    const standardId = targetClass === "9" ? 2 : 1;

    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState("All");

    const loadPapers = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await fetchPapers(standardId);
            if (!error && data) {
                setPapers(data);
            } else {
                setPapers([]);
            }
        } catch (e) {
            console.error("Failed to load papers:", e);
            setPapers([]);
        } finally {
            setLoading(false);
        }
    }, [standardId]);

    useEffect(() => {
        loadPapers();
    }, [loadPapers]);

    const filters = ["All", "Class 6", "Class 9", "Recent"];
    const filteredPapers = papers.filter((paper) => {
        if (selectedFilter === "All") return true;
        if (selectedFilter === "Class 6") return paper.standard_id === 1;
        if (selectedFilter === "Class 9") return paper.standard_id === 2;
        if (selectedFilter === "Recent") return paper.year >= 2023;
        return true;
    });

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
                <LoadingSpinner message="Loading papers..." />
            </SafeAreaView>
        );
    }

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
                        Previous Year Papers
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            marginTop: SPACING[1],
                        }}
                    >
                        Practice with real AISSEE papers
                    </Text>
                </View>

                {/* Pro Feature Banner */}
                <Card
                    variant="elevated"
                    style={{
                        backgroundColor: COLORS.primaryLight,
                        marginBottom: SPACING[4],
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 32, marginRight: SPACING[3] }}>📋</Text>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.base,
                                    fontWeight: "700",
                                    color: COLORS.onPrimaryFixed,
                                }}
                            >
                                Pro Feature
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    color: COLORS.textSecondary,
                                    marginTop: SPACING[1],
                                }}
                            >
                                Access all previous year papers with detailed solutions
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Filter Tabs */}
                <View style={{ flexDirection: "row", gap: SPACING[2], marginBottom: SPACING[4] }}>
                    {filters.map((filter) => (
                        <Pressable
                            key={filter}
                            onPress={() => setSelectedFilter(filter)}
                            style={{
                                paddingHorizontal: SPACING[4],
                                paddingVertical: SPACING[2],
                                borderRadius: BORDER_RADIUS.full,
                                backgroundColor:
                                    selectedFilter === filter ? COLORS.primary : COLORS.surfaceContainer,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    fontWeight: "600",
                                    color: selectedFilter === filter ? COLORS.onPrimary : COLORS.textPrimary,
                                }}
                            >
                                {filter}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Papers List */}
                {filteredPapers.length === 0 ? (
                    <EmptyState
                        title="No Papers Available"
                        description="We're working on adding previous year papers. Check back soon!"
                        mascot="thinking"
                    />
                ) : (
                    filteredPapers.map((paper) => (
                        <Pressable
                            key={paper.id}
                            onPress={() =>
                                router.push({
                                    pathname: "/papers/[paperId]" as any,
                                    params: {
                                        paperId: paper.id,
                                        year: paper.year.toString(),
                                        title: paper.title,
                                        totalMarks: (paper.total_marks || 0).toString(),
                                        duration: (paper.duration_minutes || 0).toString(),
                                    },
                                })
                            }
                        >
                            <Card variant="elevated" style={{ marginBottom: SPACING[3] }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {/* Year Badge */}
                                    <View
                                        style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 12,
                                            backgroundColor: COLORS.surfaceContainer,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: SPACING[4],
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.sm,
                                                fontWeight: "700",
                                                color: COLORS.textPrimary,
                                            }}
                                        >
                                            {paper.year}
                                        </Text>
                                    </View>

                                    {/* Paper Info */}
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.base,
                                                fontWeight: "700",
                                                color: COLORS.textPrimary,
                                            }}
                                        >
                                            {paper.title}
                                        </Text>
                                        <View style={{ flexDirection: "row", gap: SPACING[3], marginTop: SPACING[2] }}>
                                            {paper.total_marks && (
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontSize: 12 }}>🏆</Text>
                                                    <Text
                                                        style={{
                                                            fontSize: TYPOGRAPHY.fontSize.xs,
                                                            color: COLORS.textSecondary,
                                                            marginLeft: 4,
                                                        }}
                                                    >
                                                        {paper.total_marks} marks
                                                    </Text>
                                                </View>
                                            )}
                                            {paper.duration_minutes && (
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontSize: 12 }}>⏱️</Text>
                                                    <Text
                                                        style={{
                                                            fontSize: TYPOGRAPHY.fontSize.xs,
                                                            color: COLORS.textSecondary,
                                                            marginLeft: 4,
                                                        }}
                                                    >
                                                        {paper.duration_minutes}m
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    {/* Arrow */}
                                    <Text style={{ color: COLORS.primary, fontSize: 18 }}>→</Text>
                                </View>
                            </Card>
                        </Pressable>
                    ))
                )}

                {/* Info Card */}
                <Card
                    style={{
                        marginTop: SPACING[4],
                        backgroundColor: COLORS.surfaceMuted,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 32, marginBottom: SPACING[2] }}>💡</Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textPrimary,
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        Tip
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginTop: SPACING[1],
                            lineHeight: 20,
                        }}
                    >
                        Solving previous year papers helps you understand the actual exam pattern and difficulty level.
                    </Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
