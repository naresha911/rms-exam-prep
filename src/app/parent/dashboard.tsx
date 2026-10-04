// Parent Dashboard — Stitch-aligned parent monitoring screen.
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";

import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { Card } from "@/components/ui/Card";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";

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
    { name: "Mathematics", score: 75, tone: "primary" as const },
    { name: "Intelligence", score: 62, tone: "warning" as const },
    { name: "English", score: 80, tone: "success" as const },
    { name: "GK & Current Affairs", score: 55, tone: "accent" as const },
];
const STRENGTHS = ["Strong in Arithmetic", "Good reasoning skills", "Improving vocabulary"];
const WEAK_AREAS = ["Geometry proofs", "Current affairs", "Logical sequences"];

const FILL = {
    primary: "fillPrimary",
    warning: "fillWarning",
    success: "fillSuccess",
    accent: "fillAccent",
} as const;

const SCORE = {
    primary: "scorePrimary",
    warning: "scoreWarning",
    success: "scoreSuccess",
    accent: "scoreAccent",
} as const;

function createStyles(colors: ColorPalette) {
    return {
        container: {
            backgroundColor: colors.background,
        },
        scrollContent: {
            paddingHorizontal: SPACING[4],
            paddingBottom: SPACING[10],
        },
        profileCard: {
            marginTop: SPACING[4],
            backgroundColor: colors.primary,
            borderRadius: BORDER_RADIUS["2xl"],
            padding: SPACING[4],
            marginBottom: SPACING[4],
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
            color: colors.onPrimary,
            marginBottom: SPACING[1],
        },
        profileClass: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onPrimary,
            opacity: 0.85,
        },
        profileProgress: {
            alignItems: "flex-end" as const,
        },
        progressValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.onPrimary,
        },
        progressLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onPrimary,
            opacity: 0.8,
        },
        statsGrid: {
            flexDirection: "row" as const,
            flexWrap: "wrap" as const,
            gap: SPACING[2],
            marginBottom: SPACING[4],
        },
        statCardWrap: {
            width: "48%" as const,
        },
        statCard: {
            alignItems: "center" as const,
            paddingVertical: SPACING[4],
            borderRadius: BORDER_RADIUS["2xl"],
        },
        statValue: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xl,
            color: colors.onSurface,
            marginTop: SPACING[2],
        },
        statLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
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
            color: colors.onSurface,
            marginBottom: SPACING[4],
        },
        chartContainer: {
            flexDirection: "row" as const,
            justifyContent: "space-between" as const,
            alignItems: "flex-end" as const,
            height: 120,
        },
        barColumn: {
            flex: 1,
            alignItems: "center" as const,
        },
        barValue: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            marginBottom: SPACING[1],
        },
        barTrack: {
            width: 24,
            height: 80,
            backgroundColor: colors.surfaceVariant,
            borderRadius: BORDER_RADIUS.md,
            justifyContent: "flex-end" as const,
            overflow: "hidden" as const,
        },
        barFill: {
            width: "100%" as const,
            backgroundColor: colors.primary,
            borderRadius: BORDER_RADIUS.md,
        },
        barLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
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
            color: colors.onSurface,
            marginBottom: SPACING[2],
        },
        subjectProgressContainer: {
            gap: SPACING[2],
        },
        subjectProgressTrack: {
            flex: 1,
            height: 8,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 4,
            overflow: "hidden" as const,
        },
        subjectProgressFill: {
            height: "100%" as const,
            borderRadius: 4,
        },
        subjectScore: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.sm,
            minWidth: 40,
            textAlign: "right" as const,
        },
        fillPrimary: { backgroundColor: colors.primary },
        fillWarning: { backgroundColor: colors.warning },
        fillSuccess: { backgroundColor: colors.success },
        fillAccent: { backgroundColor: colors.gradientEnd },
        scorePrimary: { color: colors.primary },
        scoreWarning: { color: colors.warning },
        scoreSuccess: { color: colors.success },
        scoreAccent: { color: colors.gradientEnd },
        insightRow: {
            flexDirection: "row" as const,
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
        strengthSurface: {
            backgroundColor: colors.secondaryLight,
        },
        focusSurface: {
            backgroundColor: colors.tertiaryLight,
        },
        insightHeader: {
            gap: SPACING[2],
            marginBottom: SPACING[2],
        },
        insightTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
        },
        insightItem: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
            lineHeight: 20,
        },
    };
}

export default function ParentDashboardScreen() {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const maxHours = Math.max(...WEEKLY_DATA.map((d) => d.hours));
    const barHeights = useMemo(
        () =>
            StyleSheet.create(
                Object.fromEntries(
                    WEEKLY_DATA.map((day) => [
                        day.day,
                        { height: `${(day.hours / maxHours) * 100}%` as `${number}%` },
                    ])
                )
            ),
        [maxHours]
    );
    const subjectWidths = useMemo(
        () =>
            StyleSheet.create(
                Object.fromEntries(
                    SUBJECT_PERFORMANCE.map((subject, index) => [
                        `s${index}`,
                        { width: `${subject.score}%` as `${number}%` },
                    ])
                )
            ),
        []
    );

    if (!mounted) return null;

    return (
        <SafeAreaView style={[layout.fill, styles.container]}>
            <TopAppBar
                title="Parent Dashboard"
                showNotification
                onPressNotification={() => { }}
            />
            <ScrollView
                style={layout.fill}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileCard}>
                    <View style={layout.row}>
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

                <View style={styles.statsGrid}>
                    {STATS.map((stat, index) => (
                        <View key={index} style={styles.statCardWrap}>
                            <Card variant="elevated" style={styles.statCard}>
                                <MaterialIcon name={stat.icon} size={22} color={colors.primary} />
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </Card>
                        </View>
                    ))}
                </View>

                <Card variant="elevated" style={styles.chartCard}>
                    <Text style={styles.sectionTitle}>Weekly Study Time</Text>
                    <View style={styles.chartContainer}>
                        {WEEKLY_DATA.map((day, index) => (
                            <View key={index} style={styles.barColumn}>
                                <Text style={styles.barValue}>{day.hours}h</Text>
                                <View style={styles.barTrack}>
                                    <View style={[styles.barFill, barHeights[day.day]]} />
                                </View>
                                <Text style={styles.barLabel}>{day.day}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                <Card variant="elevated" style={styles.subjectCard}>
                    <Text style={styles.sectionTitle}>Subject Progress</Text>
                    {SUBJECT_PERFORMANCE.map((subject, index) => (
                        <View key={index} style={styles.subjectRow}>
                            <Text style={styles.subjectName}>{subject.name}</Text>
                            <View style={[layout.row, styles.subjectProgressContainer]}>
                                <View style={styles.subjectProgressTrack}>
                                    <View
                                        style={[
                                            styles.subjectProgressFill,
                                            styles[FILL[subject.tone]],
                                            subjectWidths[`s${index}`],
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.subjectScore, styles[SCORE[subject.tone]]]}>
                                    {subject.score}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </Card>

                <View style={styles.insightRow}>
                    <View style={styles.insightCard}>
                        <View style={[styles.insightInner, styles.strengthSurface]}>
                            <View style={[layout.row, styles.insightHeader]}>
                                <MaterialIcon name="thumb_up" size={20} color={colors.secondary} />
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
                        <View style={[styles.insightInner, styles.focusSurface]}>
                            <View style={[layout.row, styles.insightHeader]}>
                                <MaterialIcon name="trending_up" size={20} color={colors.tertiary} />
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
