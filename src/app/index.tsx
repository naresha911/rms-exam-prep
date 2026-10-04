import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAppStore } from "../store/useAppStore";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../theme";

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            backgroundColor: colors.background,
        },
    };
}

export default function Index() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const onboardingComplete = useAppStore((s) => s.onboardingComplete);
    const isAuthenticated = useAppStore((s) => s.isAuthenticated);
    const isLoading = useAppStore((s) => s.isLoading);

    useEffect(() => {
        // Wait for loading to complete before redirecting
        if (isLoading) {
            return;
        }

        const timer = setTimeout(() => {
            if (!onboardingComplete) {
                router.replace("/(onboarding)/welcome");
            } else if (!isAuthenticated) {
                router.replace("/(auth)/sign-in");
            } else {
                router.replace("/(tabs)");
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [onboardingComplete, isAuthenticated, isLoading, router]);

    return (
        <View style={[layout.fill, layout.center, styles.screen]}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}
