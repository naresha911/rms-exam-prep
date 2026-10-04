// Goal Selection Screen — Step 2 of 2.
// Per Stitch: progress header, BentoSelectCard options with icons, sticky CTA.

import { View, Text, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { BentoSelectCard } from "../../components/ui/BentoSelectCard";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { SPACING, TYPOGRAPHY } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";

type GoalType = "crack_aissee" | "improve_score" | "practice_daily" | "prepare_mock";

const GOALS: Array<{
    value: GoalType;
    title: string;
    subtitle: string;
    icon: "emoji_events" | "trending_up" | "calendar_month" | "assignment";
    tone: "primary" | "secondary" | "success" | "warning";
}> = [
        {
            value: "crack_aissee",
            title: "Crack AISSEE",
            subtitle: "Get into Sainik School",
            icon: "emoji_events",
            tone: "primary",
        },
        {
            value: "improve_score",
            title: "Improve my score",
            subtitle: "Boost my performance",
            icon: "trending_up",
            tone: "secondary",
        },
        {
            value: "practice_daily",
            title: "Practice every day",
            subtitle: "Build a study habit",
            icon: "calendar_month",
            tone: "success",
        },
        {
            value: "prepare_mock",
            title: "Prepare for my first mock test",
            subtitle: "Get exam-ready",
            icon: "assignment",
            tone: "warning",
        },
    ];

function createStyles(colors: ColorPalette) {
    return {
        container: {
            backgroundColor: colors.background,
            paddingTop: Platform.OS === "android" ? 60 : 70,
        },
        mascotSection: {
            alignItems: "center" as const,
            paddingTop: SPACING[3],
            marginBottom: SPACING[2],
        },
        content: {
            paddingHorizontal: SPACING[4],
            maxWidth: 448,
            width: "100%" as const,
            alignSelf: "center" as const,
        },
        questionSection: {
            marginBottom: SPACING[6],
        },
        questionTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.primary,
            textAlign: "center" as const,
            lineHeight: 32,
            marginBottom: SPACING[1],
        },
        questionSubtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurfaceVariant,
            textAlign: "center" as const,
        },
        cardsContainer: {
            gap: SPACING[3],
        },
        ctaFooter: {
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[4],
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
        },
        ctaInner: {
            maxWidth: 448,
            width: "100%" as const,
            alignSelf: "center" as const,
        },
    };
}

export default function GoalScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { onboardingData, setOnboardingData, setOnboardingComplete } = useAppStore();

    const iconColor = {
        primary: colors.primary,
        secondary: colors.secondary,
        success: colors.success,
        warning: colors.warning,
    };

    const handleSelect = (goal: GoalType) => {
        setOnboardingData({ goal });
    };

    const handleContinue = () => {
        setOnboardingComplete(true);
        router.replace("/(auth)/sign-up");
    };

    return (
        <SafeAreaView style={[layout.fill, styles.container]} edges={['top', 'bottom']}>
            <View style={styles.mascotSection}>
                <MascotDisplay expression="celebrating" size={120} />
            </View>

            <View style={[layout.fill, styles.content]}>
                <View style={styles.questionSection}>
                    <Text style={styles.questionTitle}>
                        What's your goal?
                    </Text>
                    <Text style={styles.questionSubtitle}>
                        We'll personalize your journey.
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    {GOALS.map((goal) => (
                        <BentoSelectCard
                            key={goal.value}
                            icon={goal.icon}
                            iconColor={iconColor[goal.tone]}
                            title={goal.title}
                            subtitle={goal.subtitle}
                            selected={onboardingData.goal === goal.value}
                            onPress={() => handleSelect(goal.value)}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.ctaFooter}>
                <View style={styles.ctaInner}>
                    <Button
                        title="Create Account"
                        onPress={handleContinue}
                        fullWidth
                        size="lg"
                        disabled={!onboardingData.goal}
                        iconRight="arrow_forward"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
