import '../../global.css';

import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useMemo, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { View } from 'react-native';
import { normalizeStudentStandard } from '../constants';
import {
    createNavigationTheme,
    layout,
    useAppearance,
    useColors,
    useThemedStyles,
    type ColorPalette,
} from '../theme';
import { useAppStore } from '../store/useAppStore';
import { supabase, fetchProfile, ensureStudentProfile } from '../lib/supabase';
import { initAnalytics, identifyUser, trackScreen } from '../lib/analytics';
import { initMathJax } from '../lib/mathjax';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import {
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => { });
initMathJax();

function createRootStyles(colors: ColorPalette) {
    return {
        root: {
            flex: 1,
            backgroundColor: colors.background,
        },
    };
}

export default function RootLayout() {
    const { setUser, setAuthenticated, setLoading } = useAppStore();
    const colors = useColors();
    const appearance = useAppearance();
    const styles = useThemedStyles(createRootStyles);
    const navigationTheme = useMemo(
        () => createNavigationTheme(colors, appearance),
        [colors, appearance]
    );

    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
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
        SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
    }, [colors.background]);

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
            <GestureHandlerRootView style={layout.fill}>
                <SafeAreaProvider>
                    <ThemeProvider value={navigationTheme}>
                        <View style={styles.root}>
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    animation: 'slide_from_right',
                                }}
                            />
                            <StatusBar style={appearance === 'dark' ? 'light' : 'dark'} />
                        </View>
                    </ThemeProvider>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </ErrorBoundary>
    );
}
