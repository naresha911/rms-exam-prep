// Onboarding Layout — shared progress indicator header for all onboarding steps.
// Per Stitch: sticky header with back arrow + 2-segment progress indicator.

import { Stack } from "expo-router";
import { View, Pressable, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { SPACING } from "../../constants";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";

function createStyles(colors: ColorPalette) {
    return {
        progressHeader: {
            position: "absolute" as const,
            top: Platform.OS === "android" ? 44 : 48,
            left: 0,
            right: 0,
            height: 56,
            justifyContent: "space-between" as const,
            paddingHorizontal: SPACING[4],
            backgroundColor: colors.surface,
            zIndex: 100,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surfaceContainerHigh,
        },
        backButtonPressed: {
            transform: [{ scale: 0.95 }],
        },
        spacer: {
            width: 40,
        },
        progressSegments: {
            gap: SPACING[1],
        },
        segment: {
            width: 32,
            height: 6,
            borderRadius: 3,
        },
        segmentShort: {
            width: 8,
            height: 6,
            borderRadius: 3,
        },
        segmentActive: {
            backgroundColor: colors.primary,
        },
        segmentInactive: {
            backgroundColor: colors.surfaceVariant,
        },
    };
}

export default function OnboardingLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

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
            {activeStep > 0 && (
                <View style={[layout.row, styles.progressHeader]}>
                    <Pressable
                        onPress={handleBack}
                        style={({ pressed }) => [
                            layout.center,
                            styles.backButton,
                            pressed ? layout.pressed : null,
                            pressed ? styles.backButtonPressed : null,
                        ]}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                    >
                        <MaterialIcon name="arrow_back" size={24} color={colors.onSurfaceVariant} />
                    </Pressable>

                    <View style={[layout.row, styles.progressSegments]}>
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
                    animation: "slide_from_right",
                }}
            />
        </>
    );
}
