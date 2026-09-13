// Parent Dashboard — Stitch-aligned parent monitoring screen.
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { router } from "expo-router";

import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { Card } from "@/components/ui/Card";
import { MascotDisplay } from "@/components/shared/MascotDisplay";

// Mock data — replace with Supabase fetch
const STUDENT = { name: "Rahul Kumar", class: "Class 5", overallProgress: 68 };
const STATS = [
    { label: "Questions", value: "847", icon: "quiz" as const },
    { label: "Accuracy", value: "72%", icon: "trending_up" as const },
    { label: "Study Time", value: "12h", icon: "schedule" as const },
    { label: "Streak", value: "7 days", icon: "local_fire_department" as const },
];
const WEEKLY_DATA = [
    { day: "Mon", hours: 1.5 },
    { day: "Tue", hours: 2.0 },
    { day: "Wed", hours: 0.5 },
    { day: "Thu", hours: 1.5 },
    { day: "Fri", hours: 2.5 },
    { day: "Sat", hours: 3.0 },
    { day: "Sun", hours: 1.0 },
];
const SUBJECT_PERFORMANCE = [
    { name: "Mathematics", score: 75, color: COLORS.primary },
    { name: "Intelligence", score: 62, color: "#F59E0B" },
    { name: "English", score: 80, color: "#10B981" },
    { name: "GK & Current Affairs", score: 55, color: "#8B5CF6" },
];
const STRENGTHS = ["Strong in Arithmetic", "Good reasoning skills", "Improving vocabulary"];
const WEAK_AREAS = ["Geometry proofs", "Current affairs", "Logical sequences"];

export default function ParentDashboardScreen() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const maxHours = Math.max(...WEEKLY_DATA.map((d) => d.hours));

    return (
        <SafeAreaView style={styles.container}>
            <TopAppBar
                title="Parent Dashboard"
                showNotification
                onPressNotification={() => { }}
            />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Student Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileRow}>
                        <View style={styles.profileMascot}>
                            <MascotDisplay expression="celebrating" size={64} />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{STUDENT.name}</Text>
                            <Text style={styles.profileClass}>{STUDENT.class}</Text>
                        </View>
                        <View style={styles.profileProgress}>
                            <Text style={styles.progressValue}>{STUDENT.overallProgress}%</Text>
                            <Text style={styles.progressLabel}>Overall</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {STATS.map((stat, index) => (
                        <View key={index} style={styles.statCardWrap}>
                            <Card variant="elevated" style={styles.statCard}>
                                <MaterialIcon name={stat.icon} size={22} color={COLORS.primary} />
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </Card>
                        </View>
                    ))}
                </View>

                {/* Weekly Study Chart */}
                <Card variant="elevated" style={styles.chartCard}>
                    <Text style={styles.sectionTitle}>Weekly Study Time</Text>
                    <View style={styles.chartContainer}>
                        {WEEKLY_DATA.map((day, index) => (
                            <View key={index} style={styles.barColumn}>
                                <Text style={styles.barValue}>{day.hours}h</Text>
                                <View style={styles.barTrack}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            {
                                                height: `${(day.hours / maxHours) * 100}%`,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barLabel}>{day.day}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Subject Performance */}
                <Card variant="elevated" style={styles.subjectCard}>
                    <Text style={styles.sectionTitle}>Subject Progress</Text>
                    {SUBJECT_PERFORMANCE.map((subject, index) => (
                        <View key={index} style={styles.subjectRow}>
                            <Text style={styles.subjectName}>{subject.name}</Text>
                            <View style={styles.subjectProgressContainer}>
                                <View style={styles.subjectProgressTrack}>
                                    <View
                                        style={[
                                            styles.subjectProgressFill,
                                            { width: `${subject.score}%`, backgroundColor: subject.color },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.subjectScore, { color: subject.color }]}>
                                    {subject.score}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Strengths & Weak Areas */}
                <View style={styles.insightRow}>
                    <View style={styles.insightCard}>
                        <View style={[styles.insightInner, { backgroundColor: COLORS.secondaryLight }]}>
                            <View style={styles.insightHeader}>
                                <MaterialIcon name="thumb_up" size={20} color={COLORS.secondary} />
                                <Text style={styles.insightTitle}>Strengths</Text>
                            </View>
                            {STRENGTHS.map((item, index) => (
                                <Text key={index} style={styles.insightItem}>
                                    • {item}
                                </Text>
                            ))}
                        </View>
                    </View>
                    <View style={styles.insightCard}>
                        <View style={[styles.insightInner, { backgroundColor: COLORS.tertiaryLight }]}>
                            <View style={styles.insightHeader}>
                                <MaterialIcon name="trending_up" size={20} color={COLORS.tertiary} />
                                <Text style={styles.insightTitle}>Focus Areas</Text>
                            </View>
                            {WEAK_AREAS.map((item, index) => (
                                <Text key={index} style={styles.insightItem}>
                                    • {item}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING[4],
        paddingBottom: SPACING[10],
    },
    profileCard: {
        marginTop: SPACING[4],
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS["2xl"],
        padding: SPACING[4],
        marginBottom: SPACING[4],
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileMascot: {
        marginRight: SPACING[3],
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.onPrimary,
        marginBottom: SPACING[1],
    },
    profileClass: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onPrimary,
        opacity: 0.85,
    },
    profileProgress: {
        alignItems: "flex-end",
    },
    progressValue: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.onPrimary,
    },
    progressLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onPrimary,
        opacity: 0.8,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SPACING[2],
        marginBottom: SPACING[4],
    },
    statCardWrap: {
        width: "48%",
    },
    statCard: {
        alignItems: "center",
        paddingVertical: SPACING[4],
        borderRadius: BORDER_RADIUS["2xl"],
    },
    statValue: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.onSurface,
        marginTop: SPACING[2],
    },
    statLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        marginTop: SPACING[1],
    },
    chartCard: {
        marginBottom: SPACING[4],
        borderRadius: BORDER_RADIUS["2xl"],
        padding: SPACING[4],
    },
    sectionTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        marginBottom: SPACING[4],
    },
    chartContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: 120,
    },
    barColumn: {
        flex: 1,
        alignItems: "center",
    },
    barValue: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        marginBottom: SPACING[1],
    },
    barTrack: {
        width: 24,
        height: 80,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: "flex-end",
        overflow: "hidden",
    },
    barFill: {
        width: "100%",
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
    },
    barLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        marginTop: SPACING[2],
    },
    subjectCard: {
        marginBottom: SPACING[4],
        borderRadius: BORDER_RADIUS["2xl"],
        padding: SPACING[4],
    },
    subjectRow: {
        marginBottom: SPACING[3],
    },
    subjectName: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        marginBottom: SPACING[2],
    },
    subjectProgressContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
    },
    subjectProgressTrack: {
        flex: 1,
        height: 8,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: 4,
        overflow: "hidden",
    },
    subjectProgressFill: {
        height: "100%",
        borderRadius: 4,
    },
    subjectScore: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.sm,
        minWidth: 40,
        textAlign: "right",
    },
    insightRow: {
        flexDirection: "row",
        gap: SPACING[3],
        marginBottom: SPACING[4],
    },
    insightCard: {
        flex: 1,
    },
    insightInner: {
        borderRadius: BORDER_RADIUS["2xl"],
        padding: SPACING[4],
    },
    insightHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
        marginBottom: SPACING[2],
    },
    insightTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
    },
    insightItem: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        lineHeight: 20,
    },
});
