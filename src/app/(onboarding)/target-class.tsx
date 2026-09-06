// Target Class Selection Screen — Step 1 of 3.
// Per Stitch: progress header, mascot, BentoSelectCard options, sticky CTA.

import { View, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { BentoSelectCard } from "../../components/ui/BentoSelectCard";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";

export default function TargetClassScreen() {
    const router = useRouter();
    const { onboardingData, setOnboardingData } = useAppStore();

    const handleSelect = (targetClass: "6" | "9") => {
        setOnboardingData({ targetClass });
    };

    const handleContinue = () => {
        if (onboardingData.targetClass) {
            router.push("/(onboarding)/current-class");
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Mascot + hint speech bubble (desktop-visible only) */}
            <View style={styles.mascotSection}>
                <View style={styles.mascotWrapper}>
                    <MascotDisplay expression="thinking" size={160} />
                    {/* Speech bubble — hidden on mobile */}
                    <View style={styles.speechBubble}>
                        <Text style={styles.speechText}>Let's set your mission parameters!</Text>
                    </View>
                </View>
            </View>

            {/* Main content */}
            <View style={styles.content}>
                {/* Question */}
                <View style={styles.questionSection}>
                    <Text style={styles.questionTitle}>
                        Which class are you preparing for?
                    </Text>
                    <Text style={styles.questionSubtitle}>
                        Choose your target admission class.
                    </Text>
                </View>

                {/* Selection cards */}
                <View style={styles.cardsContainer}>
                    <BentoSelectCard
                        icon="school"
                        iconColor={COLORS.primary}
                        title="Class 6"
                        subtitle="Admission to VI"
                        selected={onboardingData.targetClass === "6"}
                        onPress={() => handleSelect("6")}
                    />
                    <BentoSelectCard
                        icon="menu_book"
                        iconColor={COLORS.secondary}
                        title="Class 9"
                        subtitle="Admission to IX"
                        selected={onboardingData.targetClass === "9"}
                        onPress={() => handleSelect("9")}
                    />
                </View>
            </View>

            {/* Sticky CTA footer */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === "android" ? 60 : 70, // Below progress header
    },
    mascotSection: {
        alignItems: "center",
        paddingTop: SPACING[4],
    },
    mascotWrapper: {
        position: "relative",
        alignItems: "center",
    },
    speechBubble: {
        position: "absolute",
        top: -8,
        right: -16,
        backgroundColor: COLORS.surfaceContainerLowest,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxWidth: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    speechText: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurfaceVariant,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING[4],
        paddingTop: SPACING[4],
        maxWidth: 448,
        width: "100%",
        alignSelf: "center",
    },
    questionSection: {
        textAlign: "center",
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
        gap: SPACING[4],
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
