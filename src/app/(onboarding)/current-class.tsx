// Current Class Selection Screen — Step 2 of 3.
// Per Stitch: progress header, BentoSelectCard options, sticky CTA.

import { View, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { BentoSelectCard } from "../../components/ui/BentoSelectCard";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";

export default function CurrentClassScreen() {
    const router = useRouter();
    const { onboardingData, setOnboardingData } = useAppStore();

    const handleSelect = (currentClass: "5" | "8" | "other") => {
        setOnboardingData({ currentClass });
    };

    const handleContinue = () => {
        if (onboardingData.currentClass) {
            router.push("/(onboarding)/goal");
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Mascot */}
            <View style={styles.mascotSection}>
                <MascotDisplay expression="happy" size={140} />
            </View>

            {/* Main content */}
            <View style={styles.content}>
                {/* Question */}
                <View style={styles.questionSection}>
                    <Text style={styles.questionTitle}>
                        Which class are you studying in?
                    </Text>
                    <Text style={styles.questionSubtitle}>
                        This helps us customize your practice.
                    </Text>
                </View>

                {/* Selection cards */}
                <View style={styles.cardsContainer}>
                    <BentoSelectCard
                        icon="book"
                        iconColor={COLORS.primary}
                        title="Class 5"
                        subtitle="Preparing for Class 6"
                        selected={onboardingData.currentClass === "5"}
                        onPress={() => handleSelect("5")}
                    />
                    <BentoSelectCard
                        icon="library_books"
                        iconColor={COLORS.secondary}
                        title="Class 8"
                        subtitle="Preparing for Class 9"
                        selected={onboardingData.currentClass === "8"}
                        onPress={() => handleSelect("8")}
                    />
                    <BentoSelectCard
                        icon="school"
                        iconColor={COLORS.tertiary}
                        title="Other"
                        subtitle="Different grade"
                        selected={onboardingData.currentClass === "other"}
                        onPress={() => handleSelect("other")}
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
                        disabled={!onboardingData.currentClass}
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
        paddingTop: SPACING[4],
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
