import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { COLORS } from '@/constants';

function getHashParams(url: string) {
    const hash = url.split('#')[1];
    return hash ? new URLSearchParams(hash) : null;
}

export default function AuthCallbackScreen() {
    const handledUrl = useRef<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) throw exchangeError;
                } else if (accessToken && refreshToken) {
                    const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
                    if (sessionError) throw sessionError;
                } else {
                    throw new Error('The confirmation link is invalid or has expired.');
                }
                router.replace('/(tabs)');
            } catch (callbackError: unknown) {
                setError(callbackError instanceof Error ? callbackError.message : 'Unable to complete sign in.');
            }
        };
        const subscription = Linking.addEventListener('url', ({ url }) => { void handleUrl(url); });
        Linking.getInitialURL().then((url) => { if (url) void handleUrl(url); });
        return () => subscription.remove();
    }, []);

    if (error) {
        return <View style={styles.container}><Text style={styles.title}>Email confirmation failed</Text><Text style={styles.message}>{error}</Text><Text style={styles.link} onPress={() => router.replace('/(auth)/sign-in')}>Return to sign in</Text></View>;
    }
    return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.message}>Completing your sign in...</Text></View>;
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: COLORS.background },
    title: { color: COLORS.onSurface, fontSize: 20, fontWeight: '700', textAlign: 'center' },
    message: { color: COLORS.onSurfaceVariant, marginTop: 12, textAlign: 'center' },
    link: { color: COLORS.primary, fontWeight: '600', marginTop: 20 },
});
