// Goal Selection Screen — Step 3 of 3.
// Per Stitch: progress header, BentoSelectCard options with icons, sticky CTA.

import { View, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { BentoSelectCard } from "../../components/ui/BentoSelectCard";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";

type GoalType = "crack_aissee" | "improve_score" | "practice_daily" | "prepare_mock";

const GOALS: Array<{
    value: GoalType;
    title: string;
    subtitle: string;
    icon: "emoji_events" | "trending_up" | "calendar_month" | "assignment";
    iconColor: string;
}> = [
        {
            value: "crack_aissee",
            title: "Crack AISSEE",
            subtitle: "Get into Sainik School",
            icon: "emoji_events",
            iconColor: COLORS.primary,
        },
        {
            value: "improve_score",
            title: "Improve my score",
            subtitle: "Boost my performance",
            icon: "trending_up",
            iconColor: COLORS.secondary,
        },
        {
            value: "practice_daily",
            title: "Practice every day",
            subtitle: "Build a study habit",
            icon: "calendar_month",
            iconColor: COLORS.success,
        },
        {
            value: "prepare_mock",
            title: "Prepare for my first mock test",
            subtitle: "Get exam-ready",
            icon: "assignment",
            iconColor: COLORS.warning,
        },
    ];

export default function GoalScreen() {
    const router = useRouter();
    const { onboardingData, setOnboardingData, setOnboardingComplete } = useAppStore();

    const handleSelect = (goal: GoalType) => {
        setOnboardingData({ goal });
    };

    const handleContinue = () => {
        setOnboardingComplete(true);
        router.replace("/(auth)/sign-up");
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Mascot */}
            <View style={styles.mascotSection}>
                <MascotDisplay expression="celebrating" size={120} />
            </View>

            {/* Main content */}
            <View style={styles.content}>
                {/* Question */}
                <View style={styles.questionSection}>
                    <Text style={styles.questionTitle}>
                        What's your goal?
                    </Text>
                    <Text style={styles.questionSubtitle}>
                        We'll personalize your journey.
                    </Text>
                </View>

                {/* Selection cards */}
                <View style={styles.cardsContainer}>
                    {GOALS.map((goal) => (
                        <BentoSelectCard
                            key={goal.value}
                            icon={goal.icon}
                            iconColor={goal.iconColor}
                            title={goal.title}
                            subtitle={goal.subtitle}
                            selected={onboardingData.goal === goal.value}
                            onPress={() => handleSelect(goal.value)}
                        />
                    ))}
                </View>
            </View>

            {/* Sticky CTA footer */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === "android" ? 60 : 70,
    },
    mascotSection: {
        alignItems: "center",
        paddingTop: SPACING[3],
        marginBottom: SPACING[2],
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING[4],
        maxWidth: 448,
        width: "100%",
        alignSelf: "center",
    },
    questionSection: {
        marginBottom: SPACING[6],
    },
    questionTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.primary,
        textAlign: "center",
        lineHeight: 32,
        marginBottom: SPACING[1],
    },
    questionSubtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
    },
    cardsContainer: {
        gap: SPACING[3],
    },
    ctaFooter: {
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[4],
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
    },
    ctaInner: {
        maxWidth: 448,
        width: "100%",
        alignSelf: "center",
    },
});
