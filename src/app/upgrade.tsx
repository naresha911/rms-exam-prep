import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { MascotDisplay } from "../components/shared/MascotDisplay";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../constants";

const PRO_FEATURES = [
    { icon: "📝", title: "Unlimited Mock Tests", description: "Practice with unlimited full-length mock tests" },
    { icon: "📋", title: "Previous Year Papers", description: "Access all AISSEE papers from 2018-2024" },
    { icon: "📊", title: "Detailed Analytics", description: "In-depth performance analysis and insights" },
    { icon: "🤖", title: "AI Tutor 24/7", description: "Get instant help from our AI study buddy" },
    { icon: "🏆", title: "All Badges", description: "Unlock all achievements and exclusive rewards" },
    { icon: "👨‍👩‍👧", title: "Parent Dashboard", description: "Track progress with detailed reports" },
];

const MONTHLY_PRICE = "₹299";
const YEARLY_PRICE = "₹1,999";
const YEARLY_SAVING = "44%";

export default function UpgradeScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <ScrollView
                contentContainerStyle={{ padding: SPACING[5] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ alignItems: "center", marginBottom: SPACING[6] }}>
                    <MascotDisplay expression="celebrating" size={100} showBackground />
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            marginTop: SPACING[3],
                            textAlign: "center",
                        }}
                    >
                        Upgrade to Pro
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            marginTop: SPACING[2],
                            textAlign: "center",
                        }}
                    >
                        Unlock all features and become a top cadet!
                    </Text>
                </View>

                {/* Features List */}
                <Card variant="elevated" style={{ marginBottom: SPACING[5] }}>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[4],
                        }}
                    >
                        Pro Features
                    </Text>
                    {PRO_FEATURES.map((feature, index) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: SPACING[3],
                                borderBottomWidth: index < PRO_FEATURES.length - 1 ? 1 : 0,
                                borderBottomColor: COLORS.cardBorder,
                            }}
                        >
                            <View
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    backgroundColor: COLORS.primaryLight,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: SPACING[3],
                                }}
                            >
                                <Text style={{ fontSize: 22 }}>{feature.icon}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        fontWeight: "700",
                                        color: COLORS.textPrimary,
                                    }}
                                >
                                    {feature.title}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        color: COLORS.textSecondary,
                                    }}
                                >
                                    {feature.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Pricing Cards */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginBottom: SPACING[3],
                    }}
                >
                    Choose Your Plan
                </Text>

                <View style={{ gap: SPACING[3], marginBottom: SPACING[5] }}>
                    {/* Monthly Plan */}
                    <Card
                        variant="outlined"
                        style={{
                            borderWidth: 2,
                            borderColor: COLORS.cardBorder,
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.lg,
                                        fontWeight: "700",
                                        color: COLORS.textPrimary,
                                    }}
                                >
                                    Monthly
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: SPACING[1] }}>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                                            fontWeight: "800",
                                            color: COLORS.textPrimary,
                                        }}
                                    >
                                        {MONTHLY_PRICE}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.sm,
                                            color: COLORS.textSecondary,
                                            marginLeft: SPACING[1],
                                        }}
                                    >
                                        /month
                                    </Text>
                                </View>
                            </View>
                            <Button
                                title="Select"
                                variant="outline"
                                onPress={() => { }}
                                style={{ minWidth: 100 }}
                            />
                        </View>
                    </Card>

                    {/* Yearly Plan (Recommended) */}
                    <Card
                        variant="elevated"
                        style={{
                            borderWidth: 2,
                            borderColor: COLORS.primary,
                            backgroundColor: COLORS.primary,
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING[2] }}>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.lg,
                                            fontWeight: "700",
                                            color: COLORS.onPrimary,
                                        }}
                                    >
                                        Yearly
                                    </Text>
                                    <View
                                        style={{
                                            paddingHorizontal: SPACING[2],
                                            paddingVertical: 2,
                                            backgroundColor: COLORS.success,
                                            borderRadius: BORDER_RADIUS.full,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: TYPOGRAPHY.fontSize.xs,
                                                fontWeight: "700",
                                                color: COLORS.onPrimary,
                                            }}
                                        >
                                            Save {YEARLY_SAVING}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: SPACING[1] }}>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                                            fontWeight: "800",
                                            color: COLORS.onPrimary,
                                        }}
                                    >
                                        {YEARLY_PRICE}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.sm,
                                            color: "rgba(255,255,255,0.8)",
                                            marginLeft: SPACING[1],
                                        }}
                                    >
                                        /year
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.xs,
                                        color: "rgba(255,255,255,0.7)",
                                        marginTop: SPACING[1],
                                    }}
                                >
                                    That's just ₹167/month!
                                </Text>
                            </View>
                            <Button
                                title="Select"
                                variant="secondary"
                                onPress={() => { }}
                                style={{
                                    minWidth: 100,
                                    backgroundColor: COLORS.onPrimary,
                                }}
                                textStyle={{ color: COLORS.primary }}
                            />
                        </View>
                    </Card>
                </View>

                {/* Trust Badges */}
                <Card
                    variant="outlined"
                    style={{
                        backgroundColor: COLORS.surfaceMuted,
                        alignItems: "center",
                    }}
                >
                    <View style={{ flexDirection: "row", gap: SPACING[6] }}>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 28 }}>🔒</Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: COLORS.textSecondary,
                                    marginTop: SPACING[1],
                                }}
                            >
                                Secure Payment
                            </Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 28 }}>↩️</Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: COLORS.textSecondary,
                                    marginTop: SPACING[1],
                                }}
                            >
                                7-Day Refund
                            </Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 28 }}>📱</Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: COLORS.textSecondary,
                                    marginTop: SPACING[1],
                                }}
                            >
                                All Devices
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* FAQ */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        marginTop: SPACING[5],
                        marginBottom: SPACING[3],
                    }}
                >
                    Common Questions
                </Text>
                {[
                    "Can I cancel anytime?",
                    "What payment methods are accepted?",
                    "Is my data secure?",
                ].map((question, index) => (
                    <Pressable key={index}>
                        <Card variant="outlined" style={{ marginBottom: SPACING[2] }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.base,
                                        color: COLORS.textPrimary,
                                    }}
                                >
                                    {question}
                                </Text>
                                <Text style={{ fontSize: 18, color: COLORS.textSecondary }}>›</Text>
                            </View>
                        </Card>
                    </Pressable>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
