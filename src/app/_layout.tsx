import '../../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { COLORS, normalizeStudentStandard } from '../constants';
import { useAppStore } from '../store/useAppStore';
import { supabase, fetchProfile, ensureStudentProfile } from '../lib/supabase';
import { initAnalytics, identifyUser, trackScreen } from '../lib/analytics';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import {
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => { });

export default function RootLayout() {
    const { setUser, setAuthenticated, setLoading } = useAppStore();

    const [fontsLoaded] = useFonts({
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
        PlusJakartaSans_800ExtraBold,
    });

    // Fallback: if fonts don't load within 5 seconds, proceed anyway
    // to prevent blank screen on slow networks
    const [fontsTimeout, setFontsTimeout] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!fontsLoaded) {
                setFontsTimeout(true);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [fontsLoaded]);

    const shouldInitialize = fontsLoaded || fontsTimeout;

    useEffect(() => {
        if (!shouldInitialize) return;

        // Initialize analytics
        initAnalytics();

        const prepare = async () => {
            setLoading(true);

            try {
                // Check existing session on mount
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session?.user) {
                    // Fetch user profile from Supabase (create if missing)
                    let { data: profile } = await fetchProfile(session.user.id);
                    if (!profile) {
                        const ensured = await ensureStudentProfile({
                            full_name: session.user.user_metadata?.full_name || null,
                        });
                        profile = ensured.data;
                    }
                    if (profile) {
                        // Read onboarding data from user metadata (persisted during signup)
                        const metadata = session.user.user_metadata || {};
                        const store = useAppStore.getState();
                        const targetClass = normalizeStudentStandard(
                            (metadata.target_class as string) || store.onboardingData.targetClass
                        );
                        setUser({
                            id: profile.id,
                            role: profile.role,
                            full_name: profile.full_name,
                            phone: profile.phone,
                            avatar_url: profile.avatar_url,
                            school_id: profile.school_id,
                            created_at: profile.created_at,
                            updated_at: profile.updated_at,
                            target_class: targetClass,
                            daily_goal: store.preferences.dailyGoal,
                            xp: store.xp,
                            level: store.level,
                            streak: store.streak,
                            preparation_start_date: null,
                            preferred_language: store.preferences.preferredLanguage,
                        });
                        // Sync onboarding data to store
                        store.setOnboardingData({
                            targetClass,
                        });
                    }
                    setAuthenticated(true);
                    // Identify user in analytics
                    identifyUser(session.user.id, {
                        target_class: normalizeStudentStandard(session.user.user_metadata?.target_class),
                    });
                    trackScreen('Home');
                }
            } catch (e) {
                console.warn('Root layout init error:', e);
            } finally {
                setLoading(false);
                await SplashScreen.hideAsync();
            }
        };

        prepare();

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                let { data: profile } = await fetchProfile(session.user.id);
                if (!profile) {
                    const ensured = await ensureStudentProfile({
                        full_name: session.user.user_metadata?.full_name || null,
                    });
                    profile = ensured.data;
                }
                if (profile) {
                    const metadata = session.user.user_metadata || {};
                    const store = useAppStore.getState();
                    const targetClass = normalizeStudentStandard(
                        (metadata.target_class as string) || store.onboardingData.targetClass
                    );
                    setUser({
                        id: profile.id,
                        role: profile.role,
                        full_name: profile.full_name,
                        phone: profile.phone,
                        avatar_url: profile.avatar_url,
                        school_id: profile.school_id,
                        created_at: profile.created_at,
                        updated_at: profile.updated_at,
                        target_class: targetClass,
                        daily_goal: store.preferences.dailyGoal,
                        xp: store.xp,
                        level: store.level,
                        streak: store.streak,
                        preparation_start_date: null,
                        preferred_language: store.preferences.preferredLanguage,
                    });
                    store.setOnboardingData({
                        targetClass,
                    });
                }
                setAuthenticated(true);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setAuthenticated(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [shouldInitialize]);

    return (
        <ErrorBoundary>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaProvider>
                    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: COLORS.background },
                                animation: 'slide_from_right',
                            }}
                        />
                        <StatusBar style="dark" />
                    </View>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </ErrorBoundary>
    );
}
