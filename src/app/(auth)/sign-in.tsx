// Sign In Screen — Stitch-aligned authentication screen.
import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useAppStore } from "@/store/useAppStore";
import { signIn } from "@/lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants";

export default function SignInScreen() {
    const router = useRouter();
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
                setUser({
                    id: data.user.id,
                    role: "student",
                    full_name: data.user.user_metadata?.full_name || null,
                    phone: null,
                    avatar_url: null,
                    school_id: null,
                    created_at: data.user.created_at,
                    updated_at: data.user.updated_at || new Date().toISOString(),
                    target_class: "6",
                    current_class: "5",
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
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Mascot */}
                    <View style={styles.mascotWrap}>
                        <MascotDisplay expression="happy" size={100} />
                    </View>

                    {/* Header */}
                    <Text style={styles.title}>Welcome back!</Text>
                    <Text style={styles.subtitle}>
                        Continue your Sainik School prep
                    </Text>

                    {/* Form */}
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

                    {/* Forgot Password */}
                    <Pressable
                        onPress={() => router.push("/(auth)/forgot-password")}
                        style={styles.forgotBtn}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </Pressable>

                    {/* Sign In Button */}
                    <View style={styles.signInBtnWrap}>
                        <Button
                            title="Sign In"
                            onPress={handleSignIn}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialRow}>
                        <Pressable
                            style={({ pressed }) => [styles.socialBtn, pressed && styles.socialBtnPressed]}
                            onPress={() => handleSocialLogin("Google")}
                        >
                            <MaterialIcon name="email" size={20} color={COLORS.onSurface} />
                            <Text style={styles.socialBtnText}>Google</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [styles.socialBtn, pressed && styles.socialBtnPressed]}
                            onPress={() => handleSocialLogin("Apple")}
                        >
                            <MaterialIcon name="smart_toy" size={20} color={COLORS.onSurface} />
                            <Text style={styles.socialBtnText}>Apple</Text>
                        </Pressable>
                    </View>

                    {/* Spacer */}
                    <View style={styles.spacer} />

                    {/* Sign Up Link */}
                    <View style={styles.signupRow}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING[6],
    },
    mascotWrap: {
        alignItems: "center",
        marginTop: SPACING[4],
        marginBottom: SPACING[4],
    },
    title: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.onSurface,
        textAlign: "center",
        marginBottom: SPACING[1],
    },
    subtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
        marginBottom: SPACING[6],
    },
    form: {
        gap: SPACING[4],
    },
    forgotBtn: {
        alignSelf: "flex-end",
        marginTop: SPACING[2],
    },
    forgotText: {
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.sm,
    },
    signInBtnWrap: {
        marginTop: SPACING[6],
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: SPACING[6],
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.outlineVariant,
    },
    dividerText: {
        color: COLORS.onSurfaceVariant,
        paddingHorizontal: SPACING[3],
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontFamily: TYPOGRAPHY.fontFamily.regular,
    },
    socialRow: {
        flexDirection: "row",
        gap: SPACING[3],
    },
    socialBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING[2],
        paddingVertical: SPACING[3],
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        borderRadius: BORDER_RADIUS["2xl"],
        backgroundColor: COLORS.surface,
    },
    socialBtnPressed: {
        opacity: 0.7,
    },
    socialBtnText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        color: COLORS.onSurface,
    },
    spacer: {
        height: SPACING[6],
    },
    signupRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: SPACING[4],
        paddingBottom: SPACING[6],
    },
    signupLabel: {
        color: COLORS.onSurfaceVariant,
        fontFamily: TYPOGRAPHY.fontFamily.regular,
    },
    signupLink: {
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
    },
});
