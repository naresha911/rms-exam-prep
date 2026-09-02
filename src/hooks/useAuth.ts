// useAuth — Supabase auth session management with Zustand sync
import { useEffect, useCallback } from 'react';
import { supabase, fetchProfile } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import type { StudentProfile } from '../types';

/**
 * Manages auth state: listens for Supabase session changes, 
 * fetches the user's profile and syncs to Zustand store.
 */
export const useAuth = () => {
    const { setUser, setAuthenticated, setLoading } = useAppStore();

    const syncUser = useCallback(async (userId: string) => {
        try {
            const { data: profile, error } = await fetchProfile(userId);
            if (profile && !error) {
                // Cast profile to StudentProfile (may include extended fields)
                setUser(profile as unknown as StudentProfile);
                setAuthenticated(true);
            } else {
                setAuthenticated(true); // Auth'd but no profile yet
            }
        } catch (e) {
            console.warn('useAuth: failed to fetch profile', e);
        }
    }, [setUser, setAuthenticated]);

    useEffect(() => {
        setLoading(true);

        // Check existing session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                syncUser(session.user.id);
            } else {
                setAuthenticated(false);
            }
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    await syncUser(session.user.id);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setAuthenticated(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [syncUser, setLoading, setAuthenticated, setUser]);

    const { user, isAuthenticated, isLoading } = useAppStore();
    return { user, isAuthenticated, isLoading };
};

export default useAuth;
