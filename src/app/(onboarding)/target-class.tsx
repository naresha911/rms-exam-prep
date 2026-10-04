// Target Class Selection Screen — Step 1 of 2.
// Per Stitch: progress header, mascot, BentoSelectCard options, sticky CTA.

import { View, Text, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { BentoSelectCard } from "../../components/ui/BentoSelectCard";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { SPACING, TYPOGRAPHY } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
import type { StudentStandard } from "../../types";

function createStyles(colors: ColorPalette) {
    return {
        container: {
            backgroundColor: colors.background,
            paddingTop: Platform.OS === "android" ? 60 : 70,
        },
        mascotSection: {
            alignItems: "center" as const,
            paddingTop: SPACING[4],
        },
        mascotWrapper: {
            position: "relative" as const,
            alignItems: "center" as const,
        },
        speechBubble: {
            position: "absolute" as const,
            top: -8,
            right: -16,
            backgroundColor: colors.surfaceContainerLowest,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            maxWidth: 180,
            shadowColor: colors.overlay,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        speechText: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurfaceVariant,
        },
        content: {
            paddingHorizontal: SPACING[4],
            paddingTop: SPACING[4],
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
            gap: SPACING[4],
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

export default function TargetClassScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { onboardingData, setOnboardingData } = useAppStore();

    const handleSelect = (targetClass: StudentStandard) => {
        setOnboardingData({ targetClass });
    };

    const handleContinue = () => {
        if (onboardingData.targetClass) {
            router.push("/(onboarding)/goal");
        }
    };

    return (
        <SafeAreaView style={[layout.fill, styles.container]} edges={['top', 'bottom']}>
            <View style={styles.mascotSection}>
                <View style={styles.mascotWrapper}>
                    <MascotDisplay expression="thinking" size={160} />
                    <View style={styles.speechBubble}>
                        <Text style={styles.speechText}>Let's set your mission parameters!</Text>
                    </View>
                </View>
            </View>

            <View style={[layout.fill, styles.content]}>
                <View style={styles.questionSection}>
                    <Text style={styles.questionTitle}>
                        Which class are you preparing for?
                    </Text>
                    <Text style={styles.questionSubtitle}>
                        Choose the class you are studying in.
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    <BentoSelectCard
                        icon="school"
                        iconColor={colors.primary}
                        title="Class 5"
                        subtitle="Preparing for AISSEE Class 6"
                        selected={onboardingData.targetClass === "5"}
                        onPress={() => handleSelect("5")}
                    />
                    <BentoSelectCard
                        icon="menu_book"
                        iconColor={colors.secondary}
                        title="Class 8"
                        subtitle="Preparing for AISSEE Class 9"
                        selected={onboardingData.targetClass === "8"}
                        onPress={() => handleSelect("8")}
                    />
                </View>
            </View>

            <View style={styles.ctaFooter}>
                <View style={styles.ctaInner}>
                    <Button
                        title="Continue"
                        onPress={handleContinue}
                        fullWidth
                        size="lg"
                        disabled={!onboardingData.targetClass}
                        iconRight="arrow_forward"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
