// Upgrade Screen — Stitch-aligned pro subscription screen.
import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";

type Feature = {
    icon: "quiz" | "assignment" | "bar_chart" | "psychology" | "emoji_events" | "family_restroom";
    title: string;
    description: string;
};

const PRO_FEATURES: Feature[] = [
    { icon: "quiz", title: "Unlimited Mock Tests", description: "Practice with unlimited full-length mock tests" },
    { icon: "assignment", title: "Previous Year Papers", description: "Access all AISSEE papers from 2018-2024" },
    { icon: "bar_chart", title: "Detailed Analytics", description: "In-depth performance analysis and insights" },
    { icon: "psychology", title: "AI Tutor 24/7", description: "Get instant help from our AI study buddy" },
    { icon: "emoji_events", title: "All Badges", description: "Unlock all achievements and exclusive rewards" },
    { icon: "family_restroom", title: "Parent Dashboard", description: "Track progress with detailed reports" },
];

const MONTHLY_PRICE = "₹299";
const YEARLY_PRICE = "₹1,999";
const YEARLY_SAVING = "44%";

const TRUST_BADGES: { icon: "lock" | "refresh" | "smart_toy"; label: string }[] = [
    { icon: "lock", label: "Secure Payment" },
    { icon: "refresh", label: "7-Day Refund" },
    { icon: "smart_toy", label: "All Devices" },
];

const FAQ = [
    "Can I cancel anytime?",
    "What payment methods are accepted?",
    "Is my data secure?",
];

function createStyles(colors: ColorPalette) {
    return {
        container: {
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: SPACING[5],
        },
        header: {
            alignItems: "center" as const,
            marginBottom: SPACING[6],
        },
        title: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.onSurface,
            marginTop: SPACING[3],
            textAlign: "center" as const,
        },
        subtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurfaceVariant,
            marginTop: SPACING[2],
            textAlign: "center" as const,
        },
        featuresCard: {
            marginBottom: SPACING[5],
            borderRadius: BORDER_RADIUS["2xl"],
            padding: SPACING[4],
        },
        sectionTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            marginBottom: SPACING[4],
        },
        sectionTitleLg: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            marginBottom: SPACING[3],
        },
        featureRow: {
            paddingVertical: SPACING[3],
        },
        featureRowBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineVariant,
        },
        featureIconWrap: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primaryContainer,
            marginRight: SPACING[3],
        },
        featureContent: {
            flex: 1,
        },
        featureTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
        },
        featureDescription: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
            marginTop: 2,
        },
        pricingList: {
            gap: SPACING[3],
            marginBottom: SPACING[5],
        },
        pricingCardWrap: {
            marginBottom: SPACING[3],
        },
        pricingCard: {
            borderRadius: BORDER_RADIUS["2xl"],
            padding: SPACING[4],
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: colors.outlineVariant,
        },
        pricingCardActive: {
            borderColor: colors.primary,
            backgroundColor: colors.surfaceContainerLowest,
        },
        pricingContent: {
            flex: 1,
        },
        pricingName: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
        },
        pricingNameRow: {
            gap: SPACING[2],
        },
        savePill: {
            paddingHorizontal: SPACING[2],
            paddingVertical: 2,
            backgroundColor: colors.success,
            borderRadius: BORDER_RADIUS.full,
        },
        savePillText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.success,
        },
        pricingRow: {
            flexDirection: "row" as const,
            alignItems: "baseline" as const,
            marginTop: SPACING[1],
        },
        pricingAmount: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.onSurface,
        },
        pricingUnit: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
            marginLeft: SPACING[1],
        },
        pricingSubtext: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            marginTop: SPACING[1],
        },
        radioOuter: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.outlineVariant,
        },
        radioOuterActive: {
            borderColor: colors.primary,
        },
        radioInner: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.primary,
        },
        continueBtn: {
            marginBottom: SPACING[5],
        },
        trustCard: {
            marginBottom: SPACING[5],
            borderRadius: BORDER_RADIUS["2xl"],
            padding: SPACING[4],
        },
        trustRow: {
            justifyContent: "space-around" as const,
        },
        trustItem: {
            alignItems: "center" as const,
        },
        trustLabel: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurfaceVariant,
            marginTop: SPACING[1],
            textAlign: "center" as const,
        },
        faqCard: {
            marginBottom: SPACING[2],
            borderRadius: BORDER_RADIUS["2xl"],
        },
        faqQuestion: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            flex: 1,
        },
        bottomSpacer: {
            height: SPACING[6],
        },
    };
}

export default function UpgradeScreen() {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

    return (
        <SafeAreaView style={[layout.fill, styles.container]} edges={["top"]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <MascotDisplay expression="celebrating" size={100} showBackground />
                    <Text style={styles.title}>Upgrade to Pro</Text>
                    <Text style={styles.subtitle}>
                        Unlock all features and become a top cadet!
                    </Text>
                </View>

                <Card variant="elevated" style={styles.featuresCard}>
                    <Text style={styles.sectionTitle}>Pro Features</Text>
                    {PRO_FEATURES.map((feature, index) => (
                        <View
                            key={index}
                            style={[
                                layout.row,
                                styles.featureRow,
                                index < PRO_FEATURES.length - 1 ? styles.featureRowBorder : null,
                            ]}
                        >
                            <View style={[layout.center, styles.featureIconWrap]}>
                                <MaterialIcon name={feature.icon} size={22} color={colors.primary} />
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>{feature.description}</Text>
                            </View>
                        </View>
                    ))}
                </Card>

                <Text style={styles.sectionTitleLg}>Choose Your Plan</Text>

                <View style={styles.pricingList}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.pricingCardWrap,
                            pressed ? layout.pressed : null,
                        ]}
                        onPress={() => setSelectedPlan("monthly")}
                    >
                        <View
                            style={[
                                layout.row,
                                styles.pricingCard,
                                selectedPlan === "monthly" ? styles.pricingCardActive : null,
                            ]}
                        >
                            <View style={styles.pricingContent}>
                                <Text style={styles.pricingName}>Monthly</Text>
                                <View style={styles.pricingRow}>
                                    <Text style={styles.pricingAmount}>{MONTHLY_PRICE}</Text>
                                    <Text style={styles.pricingUnit}>/month</Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    layout.center,
                                    styles.radioOuter,
                                    selectedPlan === "monthly" ? styles.radioOuterActive : null,
                                ]}
                            >
                                {selectedPlan === "monthly" ? <View style={styles.radioInner} /> : null}
                            </View>
                        </View>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.pricingCardWrap,
                            pressed ? layout.pressed : null,
                        ]}
                        onPress={() => setSelectedPlan("yearly")}
                    >
                        <View
                            style={[
                                layout.row,
                                styles.pricingCard,
                                selectedPlan === "yearly" ? styles.pricingCardActive : null,
                            ]}
                        >
                            <View style={styles.pricingContent}>
                                <View style={[layout.row, styles.pricingNameRow]}>
                                    <Text style={styles.pricingName}>Yearly</Text>
                                    <View style={styles.savePill}>
                                        <Text style={styles.savePillText}>Save {YEARLY_SAVING}</Text>
                                    </View>
                                </View>
                                <View style={styles.pricingRow}>
                                    <Text style={styles.pricingAmount}>{YEARLY_PRICE}</Text>
                                    <Text style={styles.pricingUnit}>/year</Text>
                                </View>
                                <Text style={styles.pricingSubtext}>That's just ₹167/month!</Text>
                            </View>
                            <View
                                style={[
                                    layout.center,
                                    styles.radioOuter,
                                    selectedPlan === "yearly" ? styles.radioOuterActive : null,
                                ]}
                            >
                                {selectedPlan === "yearly" ? <View style={styles.radioInner} /> : null}
                            </View>
                        </View>
                    </Pressable>
                </View>

                <Button
                    title="Continue to Checkout"
                    onPress={() => { }}
                    fullWidth
                    size="lg"
                    iconRight="arrow_forward"
                    style={styles.continueBtn}
                />

                <Card variant="outlined" style={styles.trustCard}>
                    <View style={[layout.row, styles.trustRow]}>
                        {TRUST_BADGES.map((badge, index) => (
                            <View key={index} style={styles.trustItem}>
                                <MaterialIcon name={badge.icon} size={28} color={colors.primary} />
                                <Text style={styles.trustLabel}>{badge.label}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                <Text style={styles.sectionTitleLg}>Common Questions</Text>
                {FAQ.map((question, index) => (
                    <Pressable key={index} style={({ pressed }) => [pressed ? layout.pressed : null]}>
                        <Card variant="outlined" style={styles.faqCard}>
                            <View style={layout.rowBetween}>
                                <Text style={styles.faqQuestion}>{question}</Text>
                                <MaterialIcon name="chevron_right" size={20} color={colors.onSurfaceVariant} />
                            </View>
                        </Card>
                    </Pressable>
                ))}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}
