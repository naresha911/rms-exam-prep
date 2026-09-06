// Upgrade Screen — Stitch-aligned pro subscription screen.
import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants";

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

export default function UpgradeScreen() {
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <MascotDisplay expression="celebrating" size={100} showBackground />
                    <Text style={styles.title}>Upgrade to Pro</Text>
                    <Text style={styles.subtitle}>
                        Unlock all features and become a top cadet!
                    </Text>
                </View>

                {/* Features List */}
                <Card variant="elevated" style={styles.featuresCard}>
                    <Text style={styles.sectionTitle}>Pro Features</Text>
                    {PRO_FEATURES.map((feature, index) => (
                        <View
                            key={index}
                            style={[
                                styles.featureRow,
                                index < PRO_FEATURES.length - 1 && styles.featureRowBorder,
                            ]}
                        >
                            <View style={styles.featureIconWrap}>
                                <MaterialIcon name={feature.icon} size={22} color={COLORS.primary} />
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>{feature.description}</Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Pricing Section */}
                <Text style={styles.sectionTitleLg}>Choose Your Plan</Text>

                <View style={styles.pricingList}>
                    {/* Monthly Plan */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.pricingCardWrap,
                            pressed && styles.pricingCardPressed,
                        ]}
                        onPress={() => setSelectedPlan("monthly")}
                    >
                        <View
                            style={[
                                styles.pricingCard,
                                selectedPlan === "monthly" && styles.pricingCardActive,
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
                                    styles.radioOuter,
                                    selectedPlan === "monthly" && styles.radioOuterActive,
                                ]}
                            >
                                {selectedPlan === "monthly" && <View style={styles.radioInner} />}
                            </View>
                        </View>
                    </Pressable>

                    {/* Yearly Plan (Recommended) */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.pricingCardWrap,
                            pressed && styles.pricingCardPressed,
                        ]}
                        onPress={() => setSelectedPlan("yearly")}
                    >
                        <View
                            style={[
                                styles.pricingCard,
                                selectedPlan === "yearly" && styles.pricingCardActive,
                            ]}
                        >
                            <View style={styles.pricingContent}>
                                <View style={styles.pricingNameRow}>
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
                                    styles.radioOuter,
                                    selectedPlan === "yearly" && styles.radioOuterActive,
                                ]}
                            >
                                {selectedPlan === "yearly" && <View style={styles.radioInner} />}
                            </View>
                        </View>
                    </Pressable>
                </View>

                {/* Continue Button */}
                <Button
                    title="Continue to Checkout"
                    onPress={() => { }}
                    fullWidth
                    size="lg"
                    iconRight="arrow_forward"
                    style={styles.continueBtn}
                />

                {/* Trust Badges */}
                <Card variant="outlined" style={styles.trustCard}>
                    <View style={styles.trustRow}>
                        {TRUST_BADGES.map((badge, index) => (
                            <View key={index} style={styles.trustItem}>
                                <MaterialIcon name={badge.icon} size={28} color={COLORS.primary} />
                                <Text style={styles.trustLabel}>{badge.label}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* FAQ */}
                <Text style={styles.sectionTitleLg}>Common Questions</Text>
                {FAQ.map((question, index) => (
                    <Pressable key={index} style={({ pressed }) => [pressed && styles.faqPressed]}>
                        <Card variant="outlined" style={styles.faqCard}>
                            <View style={styles.faqRow}>
                                <Text style={styles.faqQuestion}>{question}</Text>
                                <MaterialIcon name="chevron_right" size={20} color={COLORS.onSurfaceVariant} />
                            </View>
                        </Card>
                    </Pressable>
                ))}

                {/* Bottom Spacer */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING[5],
    },
    header: {
        alignItems: "center",
        marginBottom: SPACING[6],
    },
    title: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.onSurface,
        marginTop: SPACING[3],
        textAlign: "center",
    },
    subtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurfaceVariant,
        marginTop: SPACING[2],
        textAlign: "center",
    },
    featuresCard: {
        marginBottom: SPACING[5],
        borderRadius: BORDER_RADIUS["2xl"],
        padding: SPACING[4],
    },
    sectionTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        marginBottom: SPACING[4],
    },
    sectionTitleLg: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        marginBottom: SPACING[3],
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING[3],
    },
    featureRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outlineVariant,
    },
    featureIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryContainer,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING[3],
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
    },
    featureDescription: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        marginTop: 2,
    },
    pricingList: {
        gap: SPACING[3],
        marginBottom: SPACING[5],
    },
    pricingCardWrap: {
        marginBottom: SPACING[3],
    },
    pricingCardPressed: {
        opacity: 0.8,
    },
    pricingCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: BORDER_RADIUS["2xl"],
        padding: SPACING[4],
        backgroundColor: COLORS.surface,
        borderWidth: 2,
        borderColor: COLORS.outlineVariant,
    },
    pricingCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.surfaceContainerLowest,
    },
    pricingContent: {
        flex: 1,
    },
    pricingName: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
    },
    pricingNameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
    },
    savePill: {
        paddingHorizontal: SPACING[2],
        paddingVertical: 2,
        backgroundColor: COLORS.success,
        borderRadius: BORDER_RADIUS.full,
    },
    savePillText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.success,
    },
    pricingRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: SPACING[1],
    },
    pricingAmount: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.onSurface,
    },
    pricingUnit: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
        marginLeft: SPACING[1],
    },
    pricingSubtext: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        marginTop: SPACING[1],
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.outlineVariant,
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterActive: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
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
        flexDirection: "row",
        justifyContent: "space-around",
    },
    trustItem: {
        alignItems: "center",
    },
    trustLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        marginTop: SPACING[1],
        textAlign: "center",
    },
    faqPressed: {
        opacity: 0.7,
    },
    faqCard: {
        marginBottom: SPACING[2],
        borderRadius: BORDER_RADIUS["2xl"],
    },
    faqRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    faqQuestion: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        flex: 1,
    },
    bottomSpacer: {
        height: SPACING[6],
    },
});
