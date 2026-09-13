import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useAppStore } from "@/store/useAppStore";
import { signUp, saveOnboardingData, ensureStudentProfile } from "@/lib/supabase";
import { trackEvent, identifyUser, EVENTS } from "@/lib/analytics";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants";

type FormErrors = { name?: string; email?: string; password?: string };

export default function SignUpScreen() {
    const router = useRouter();
    const { setAuthenticated, setUser, onboardingData } = useAppStore();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = () => {
        const next: FormErrors = {};
        if (!name.trim()) next.name = "Full name is required";
        if (!email.trim()) next.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email";
        if (!password) next.password = "Password is required";
        else if (password.length < 6) next.password = "Use at least 6 characters";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSignUp = async () => {
        if (!validate()) return;
        const fullName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const metadata = {
            target_class: onboardingData.targetClass || "5",
            goal: onboardingData.goal || "crack_aissee",
        };
        setLoading(true);
        try {
            const { data, error } = await signUp(normalizedEmail, password, fullName, metadata);
            if (error) {
                Alert.alert("Sign Up Failed", error.message);
                return;
            }
            if (!data?.user) {
                Alert.alert("Sign Up Failed", "We could not create your account. Please try again.");
                return;
            }
            trackEvent(EVENTS.SIGN_UP, { target_class: metadata.target_class });
            if (!data.session) {
                Alert.alert("Check your email", "Your account is ready. Confirm your email address, then sign in to continue.", [
                    { text: "Go to sign in", onPress: () => router.replace("/(auth)/sign-in") },
                ]);
                return;
            }
            await ensureStudentProfile({ full_name: fullName });
            setUser({
                id: data.user.id, role: "student", full_name: fullName, phone: null,
                avatar_url: null, school_id: null, created_at: data.user.created_at,
                updated_at: new Date().toISOString(), target_class: (metadata.target_class as "5" | "8"),
                daily_goal: 20,
                xp: 0, level: 1, streak: 0, preparation_start_date: new Date().toISOString(), preferred_language: "en",
            });
            setAuthenticated(true);
            identifyUser(data.user.id, { target_class: metadata.target_class });
            await saveOnboardingData(metadata);
            router.replace("/(tabs)");
        } catch (error: unknown) {
            Alert.alert("Error", error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const leadingIcon = (name: "person_outline" | "email" | "lock_outline") => (
        <MaterialIcon name={name} size={20} color={COLORS.textTertiary} />
    );

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.mascotBadge}><MascotDisplay expression="celebrating" size={72} /></View>
                        <View style={styles.headerCopy}>
                            <Text style={styles.eyebrow}>CADET QUEST</Text>
                            <Text style={styles.title}>Your journey starts here</Text>
                            <Text style={styles.subtitle}>Build better habits. Prepare with confidence.</Text>
                        </View>
                    </View>
                    <View style={styles.formCard}>
                        <Text style={styles.cardTitle}>Create your account</Text>
                        <Text style={styles.cardSubtitle}>Join thousands of Sainik School aspirants</Text>
                        <View style={styles.form}>
                            <Input label="Full name" placeholder="Your name" value={name} onChangeText={setName} autoCapitalize="words" leftIcon={leadingIcon("person_outline")} error={errors.name} />
                            <Input label="Email address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} leftIcon={leadingIcon("email")} error={errors.email} />
                            <Input label="Password" placeholder="At least 6 characters" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} leftIcon={leadingIcon("lock_outline")} rightIcon={<MaterialIcon name={showPassword ? "visibility_off" : "visibility"} size={20} color={COLORS.textTertiary} />} onRightIconPress={() => setShowPassword((visible) => !visible)} error={errors.password} />
                        </View>
                        <Button title="Create Account" onPress={handleSignUp} loading={loading} fullWidth size="lg" iconRight="arrow_forward" style={styles.cta} />
                        <View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.dividerText}>or continue with</Text><View style={styles.dividerLine} /></View>
                        <View style={styles.socialRow}>
                            <Pressable accessibilityRole="button" accessibilityLabel="Continue with Google" style={styles.socialButton} onPress={() => Alert.alert("Coming Soon", "Google sign in will be available soon.")}><MaterialIcon name="email" size={21} color={COLORS.primary} /></Pressable>
                            <Pressable accessibilityRole="button" accessibilityLabel="Continue with Apple" style={styles.socialButton} onPress={() => Alert.alert("Coming Soon", "Apple sign in will be available soon.")}><MaterialIcon name="smart_toy" size={21} color={COLORS.onSurface} /></Pressable>
                        </View>
                    </View>
                    <Text style={styles.legal}>By signing up, you agree to our Terms of Service and Privacy Policy.</Text>
                    <View style={styles.loginRow}><Text style={styles.loginLabel}>Already have an account? </Text><Pressable onPress={() => router.replace("/(auth)/sign-in")}><Text style={styles.loginLink}>Log in</Text></Pressable></View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    flex: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: SPACING[5], paddingTop: SPACING[4], paddingBottom: SPACING[6] },
    header: { flexDirection: "row", alignItems: "center", marginBottom: SPACING[5] },
    mascotBadge: { width: 88, height: 88, borderRadius: BORDER_RADIUS["2xl"], alignItems: "center", justifyContent: "center", backgroundColor: COLORS.tertiaryLight, marginRight: SPACING[4] },
    headerCopy: { flex: 1 },
    eyebrow: { color: COLORS.primary, fontFamily: TYPOGRAPHY.fontFamily.bold, fontSize: TYPOGRAPHY.fontSize.xs, letterSpacing: 1.2, marginBottom: SPACING[1] },
    title: { color: COLORS.onSurface, fontFamily: TYPOGRAPHY.fontFamily.bold, fontSize: TYPOGRAPHY.fontSize.xl, lineHeight: 27 },
    subtitle: { color: COLORS.onSurfaceVariant, fontFamily: TYPOGRAPHY.fontFamily.regular, fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 20, marginTop: SPACING[1] },
    formCard: { backgroundColor: COLORS.cardBackground, borderRadius: BORDER_RADIUS["2xl"], padding: SPACING[5], shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 5 },
    cardTitle: { color: COLORS.onSurface, fontFamily: TYPOGRAPHY.fontFamily.bold, fontSize: TYPOGRAPHY.fontSize["2xl"], marginBottom: SPACING[1] },
    cardSubtitle: { color: COLORS.onSurfaceVariant, fontFamily: TYPOGRAPHY.fontFamily.regular, fontSize: TYPOGRAPHY.fontSize.sm, lineHeight: 20, marginBottom: SPACING[5] },
    form: { gap: SPACING[3] },
    cta: { marginTop: SPACING[5] },
    divider: { flexDirection: "row", alignItems: "center", marginVertical: SPACING[5] },
    dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.outlineVariant },
    dividerText: { color: COLORS.onSurfaceVariant, fontFamily: TYPOGRAPHY.fontFamily.regular, fontSize: TYPOGRAPHY.fontSize.xs, paddingHorizontal: SPACING[3] },
    socialRow: { flexDirection: "row", justifyContent: "center", gap: SPACING[3] },
    socialButton: { width: 52, height: 48, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.outlineVariant, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center" },
    legal: { color: COLORS.textTertiary, fontFamily: TYPOGRAPHY.fontFamily.regular, fontSize: TYPOGRAPHY.fontSize.xs, lineHeight: 17, textAlign: "center", marginTop: SPACING[4], paddingHorizontal: SPACING[4] },
    loginRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: SPACING[5] },
    loginLabel: { color: COLORS.onSurfaceVariant, fontFamily: TYPOGRAPHY.fontFamily.regular, fontSize: TYPOGRAPHY.fontSize.sm },
    loginLink: { color: COLORS.primary, fontFamily: TYPOGRAPHY.fontFamily.bold, fontSize: TYPOGRAPHY.fontSize.sm },
});