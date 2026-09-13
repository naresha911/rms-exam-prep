// Onboarding Layout — shared progress indicator header for all onboarding steps.
// Per Stitch: sticky header with back arrow + 2-segment progress indicator.

import { Stack } from "expo-router";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { COLORS, SPACING } from "../../constants";
import { MaterialIcon } from "../../components/ui/MaterialIcon";

export default function OnboardingLayout() {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active step (1=target-class, 2=goal)
    const getActiveStep = (): number => {
        if (pathname.includes("target-class")) return 1;
        if (pathname.includes("goal")) return 2;
        return 0;
    };

    const activeStep = getActiveStep();

    const handleBack = () => {
        if (activeStep === 1) {
            router.push("/(onboarding)/welcome");
        } else if (activeStep === 2) {
            router.push("/(onboarding)/target-class");
        }
    };

    return (
        <>
            {/* Progress header is for steps 1–2 only — welcome has no stepper */}
            {activeStep > 0 && (
                <View style={styles.progressHeader}>
                    <Pressable
                        onPress={handleBack}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.backButtonPressed,
                        ]}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                    >
                        <MaterialIcon name="arrow_back" size={24} color={COLORS.onSurfaceVariant} />
                    </Pressable>

                    <View style={styles.progressSegments}>
                        <View
                            style={[
                                styles.segment,
                                activeStep >= 1 ? styles.segmentActive : styles.segmentInactive,
                            ]}
                        />
                        <View
                            style={[
                                styles.segmentShort,
                                activeStep >= 2 ? styles.segmentActive : styles.segmentInactive,
                            ]}
                        />
                    </View>

                    <View style={styles.spacer} />
                </View>
            )}

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                    animation: "slide_from_right",
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    progressHeader: {
        position: "absolute",
        top: Platform.OS === "android" ? 44 : 48,
        left: 0,
        right: 0,
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SPACING[4],
        backgroundColor: COLORS.surface,
        zIndex: 100,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.surfaceContainerHigh,
    },
    backButtonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    spacer: {
        width: 40,
    },
    progressSegments: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[1],
    },
    segment: {
        width: 32,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.surfaceVariant,
    },
    segmentShort: {
        width: 8,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.surfaceVariant,
    },
    segmentActive: {
        backgroundColor: COLORS.primary,
    },
    segmentInactive: {
        backgroundColor: COLORS.surfaceVariant,
    },
});
