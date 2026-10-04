// Sign In Screen — Stitch-aligned authentication screen.
import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useAppStore } from "@/store/useAppStore";
import { signIn, ensureStudentProfile, fetchProfile } from "@/lib/supabase";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, normalizeStudentStandard } from "@/constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";

function createStyles(colors: ColorPalette) {
    return {
        container: {
            backgroundColor: colors.background,
        },
        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: SPACING[6],
        },
        mascotWrap: {
            alignItems: "center" as const,
            marginTop: SPACING[4],
            marginBottom: SPACING[4],
        },
        title: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.onSurface,
            textAlign: "center" as const,
            marginBottom: SPACING[1],
        },
        subtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurfaceVariant,
            textAlign: "center" as const,
            marginBottom: SPACING[6],
        },
        form: {
            gap: SPACING[4],
        },
        forgotBtn: {
            alignSelf: "flex-end" as const,
            marginTop: SPACING[2],
        },
        forgotText: {
            color: colors.primary,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.sm,
        },
        signInBtnWrap: {
            marginTop: SPACING[6],
        },
        divider: {
            marginVertical: SPACING[6],
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: colors.outlineVariant,
        },
        dividerText: {
            color: colors.onSurfaceVariant,
            paddingHorizontal: SPACING[3],
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
        },
        socialRow: {
            gap: SPACING[3],
        },
        socialBtn: {
            flex: 1,
            gap: SPACING[2],
            paddingVertical: SPACING[3],
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            borderRadius: BORDER_RADIUS["2xl"],
            backgroundColor: colors.surface,
        },
        socialBtnText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.onSurface,
        },
        spacer: {
            height: SPACING[6],
        },
        signupRow: {
            justifyContent: "center" as const,
            marginTop: SPACING[4],
            paddingBottom: SPACING[6],
        },
        signupLabel: {
            color: colors.onSurfaceVariant,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
        },
        signupLink: {
            color: colors.primary,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
        },
    };
}

export default function SignInScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { setAuthenticated, setUser } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
        if (!password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const { data, error } = await signIn(email, password);
            if (error) {
                Alert.alert("Sign In Failed", error.message);
            } else if (data?.user) {
                await ensureStudentProfile({
                    full_name: data.user.user_metadata?.full_name || null,
                });
                const { data: profile } = await fetchProfile(data.user.id);
                const metadata = data.user.user_metadata || {};
                setUser({
                    id: data.user.id,
                    role: (profile?.role as "student") || "student",
                    full_name: profile?.full_name || metadata.full_name || null,
                    phone: profile?.phone || null,
                    avatar_url: profile?.avatar_url || null,
                    school_id: profile?.school_id || null,
                    created_at: profile?.created_at || data.user.created_at,
                    updated_at: profile?.updated_at || data.user.updated_at || new Date().toISOString(),
                    target_class: normalizeStudentStandard(metadata.target_class as string),
                    daily_goal: 20,
                    xp: 0,
                    level: 1,
                    streak: 0,
                    preparation_start_date: null,
                    preferred_language: "en",
                });
                setAuthenticated(true);
                router.replace("/(tabs)");
            }
        } catch (e: any) {
            Alert.alert("Error", e?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        Alert.alert("Coming Soon", `${provider} login will be available soon.`);
    };

    return (
        <SafeAreaView style={[layout.fill, styles.container]} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                style={layout.fill}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.mascotWrap}>
                        <MascotDisplay expression="happy" size={100} />
                    </View>

                    <Text style={styles.title}>Welcome back!</Text>
                    <Text style={styles.subtitle}>
                        Continue your Sainik School prep
                    </Text>

                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />
                        <Input
                            label="Password"
                            placeholder="Your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={errors.password}
                        />
                    </View>

                    <Pressable
                        onPress={() => router.push("/(auth)/forgot-password")}
                        style={styles.forgotBtn}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </Pressable>

                    <View style={styles.signInBtnWrap}>
                        <Button
                            title="Sign In"
                            onPress={handleSignIn}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    <View style={[layout.row, styles.divider]}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={[layout.row, styles.socialRow]}>
                        <Pressable
                            style={({ pressed }) => [layout.row, layout.center, styles.socialBtn, pressed ? layout.pressed : null]}
                            onPress={() => handleSocialLogin("Google")}
                        >
                            <MaterialIcon name="email" size={20} color={colors.onSurface} />
                            <Text style={styles.socialBtnText}>Google</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [layout.row, layout.center, styles.socialBtn, pressed ? layout.pressed : null]}
                            onPress={() => handleSocialLogin("Apple")}
                        >
                            <MaterialIcon name="smart_toy" size={20} color={colors.onSurface} />
                            <Text style={styles.socialBtnText}>Apple</Text>
                        </Pressable>
                    </View>

                    <View style={styles.spacer} />

                    <View style={[layout.row, styles.signupRow]}>
                        <Text style={styles.signupLabel}>New here? </Text>
                        <Pressable onPress={() => router.push("/(auth)/sign-up")}>
                            <Text style={styles.signupLink}>Create an account</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
