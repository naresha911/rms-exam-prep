import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { signUp, saveOnboardingData } from "../../lib/supabase";
import { trackEvent, identifyUser, EVENTS } from "../../lib/analytics";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";

export default function SignUpScreen() {
    const router = useRouter();
    const { setAuthenticated, setUser, onboardingData } = useAppStore();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { name?: string; email?: string; password?: string } = {};
        if (!name) newErrors.name = "Name is required";
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be 6+ characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const { data, error } = await signUp(email, password);
            if (error) {
                Alert.alert("Sign Up Failed", error.message);
            } else if (data?.user) {
                setUser({
                    id: data.user.id,
                    role: "student",
                    full_name: name,
                    phone: null,
                    avatar_url: null,
                    school_id: null,
                    created_at: data.user.created_at,
                    updated_at: new Date().toISOString(),
                    target_class: onboardingData.targetClass || "6",
                    current_class: onboardingData.currentClass || "5",
                    daily_goal: 20,
                    xp: 0,
                    level: 1,
                    streak: 0,
                    preparation_start_date: new Date().toISOString(),
                    preferred_language: "en",
                });
                setAuthenticated(true);
                identifyUser(data.user.id, { target_class: onboardingData.targetClass });
                trackEvent(EVENTS.SIGN_UP, { target_class: onboardingData.targetClass });
                // Persist onboarding choices to Supabase user metadata
                await saveOnboardingData({
                    target_class: onboardingData.targetClass || "6",
                    current_class: onboardingData.currentClass || "5",
                    goal: onboardingData.goal || "crack_aissee",
                });
                router.replace("/(tabs)");
            }
        } catch (e: any) {
            Alert.alert("Error", e?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: SPACING[6],
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Mascot */}
                    <View style={{ alignItems: "center", marginTop: SPACING[4], marginBottom: SPACING[3] }}>
                        <MascotDisplay expression="celebrating" size={90} />
                    </View>

                    {/* Header */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            textAlign: "center",
                            marginBottom: SPACING[1],
                        }}
                    >
                        Create your account
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.sm,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginBottom: SPACING[5],
                        }}
                    >
                        Join thousands of Sainik School aspirants
                    </Text>

                    {/* Form */}
                    <View style={{ gap: SPACING[3] }}>
                        <Input
                            label="Full Name"
                            placeholder="Your name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            error={errors.name}
                        />
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
                            placeholder="At least 6 characters"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={errors.password}
                        />
                    </View>

                    {/* Sign Up Button */}
                    <View style={{ marginTop: SPACING[5] }}>
                        <Button
                            title="Create Account"
                            onPress={handleSignUp}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    {/* Disclaimer */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.xs,
                            color: COLORS.textTertiary,
                            textAlign: "center",
                            marginTop: SPACING[3],
                            paddingHorizontal: SPACING[4],
                            lineHeight: 16,
                        }}
                    >
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                        Parental consent is recommended for users under 13.
                    </Text>

                    {/* Spacer */}
                    <View style={{ height: SPACING[6] }} />

                    {/* Sign In Link */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: SPACING[3],
                            paddingBottom: SPACING[6],
                        }}
                    >
                        <Text style={{ color: COLORS.textSecondary }}>
                            Already have an account?{" "}
                        </Text>
                        <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
                            <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
                                Sign In
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
