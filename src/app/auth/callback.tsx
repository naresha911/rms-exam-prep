import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { layout, useColors, useThemedStyles, type ColorPalette } from '@/theme';

function getHashParams(url: string) {
    const hash = url.split('#')[1];
    return hash ? new URLSearchParams(hash) : null;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            padding: 24,
            backgroundColor: colors.background,
        },
        title: {
            color: colors.onSurface,
            fontSize: 20,
            fontWeight: '700' as const,
            textAlign: 'center' as const,
        },
        message: {
            color: colors.onSurfaceVariant,
            marginTop: 12,
            textAlign: 'center' as const,
        },
        link: {
            color: colors.primary,
            fontWeight: '600' as const,
            marginTop: 20,
        },
    };
}

export default function AuthCallbackScreen() {
    const handledUrl = useRef<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    useEffect(() => {
        const handleUrl = async (url: string) => {
            if (handledUrl.current === url) return;
            handledUrl.current = url;
            try {
                const parsed = Linking.parse(url);
                const queryParams = parsed.queryParams ?? {};
                const hashParams = getHashParams(url);
                const code = typeof queryParams.code === 'string' ? queryParams.code : undefined;
                const accessToken = hashParams?.get('access_token');
                const refreshToken = hashParams?.get('refresh_token');
                const isRecovery =
                    hashParams?.get('type') === 'recovery' || queryParams.type === 'recovery';
                if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw exchangeError;
                } else if (accessToken && refreshToken) {
                    const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
                    if (sessionError) throw sessionError;
                } else {
                    throw new Error('The confirmation link is invalid or has expired.');
                }
                router.replace(isRecovery ? '/reset-password' : '/(tabs)');
            } catch (callbackError: unknown) {
                setError(callbackError instanceof Error ? callbackError.message : 'Unable to complete sign in.');
            }
        };
        const subscription = Linking.addEventListener('url', ({ url }) => { void handleUrl(url); });
        Linking.getInitialURL().then((url) => { if (url) void handleUrl(url); });
        return () => subscription.remove();
    }, []);

    if (error) {
        return (
            <View style={[layout.fill, styles.container]}>
                <Text style={styles.title}>Link could not be verified</Text>
                <Text style={styles.message}>{error}</Text>
                <Text style={styles.link} onPress={() => router.replace('/(auth)/sign-in')}>Return to sign in</Text>
            </View>
        );
    }
    return (
        <View style={[layout.fill, styles.container]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.message}>Completing your sign in...</Text>
        </View>
    );
}
