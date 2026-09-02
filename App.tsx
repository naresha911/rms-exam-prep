import "react-native-url-polyfill/auto";
import "./global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might trigger this */
});

export default function App() {
    useEffect(() => {
        // Hide splash screen after app is ready
        const prepare = async () => {
            try {
                // Add any initialization logic here
                await new Promise((resolve) => setTimeout(resolve, 500));
            } catch (e) {
                console.warn("App initialization error:", e);
            } finally {
                await SplashScreen.hideAsync();
            }
        };

        prepare();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: "#FFFFFF" },
                        }}
                    />
                    <StatusBar style="dark" />
                </View>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
