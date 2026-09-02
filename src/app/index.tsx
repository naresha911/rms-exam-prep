import { useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAppStore } from "../store/useAppStore";
import { COLORS } from "../constants";

export default function Index() {
    const router = useRouter();
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
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.background,
            }}
        >
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
}
