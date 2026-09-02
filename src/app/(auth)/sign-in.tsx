import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { signIn } from "../../lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";

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
                    <View style={{ alignItems: "center", marginTop: SPACING[4], marginBottom: SPACING[4] }}>
                        <MascotDisplay expression="happy" size={100} />
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
                        Welcome back!
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginBottom: SPACING[6],
                        }}
                    >
                        Continue your Sainik School prep
                    </Text>

                    {/* Form */}
                    <View style={{ gap: SPACING[4] }}>
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
                        style={{ alignSelf: "flex-end", marginTop: SPACING[2] }}
                    >
                        <Text
                            style={{
                                color: COLORS.primary,
                                fontWeight: "600",
                                fontSize: TYPOGRAPHY.fontSize.sm,
                            }}
                        >
                            Forgot Password?
                        </Text>
                    </Pressable>

                    {/* Sign In Button */}
                    <View style={{ marginTop: SPACING[6] }}>
                        <Button
                            title="Sign In"
                            onPress={handleSignIn}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    {/* Divider */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: SPACING[6],
                        }}
                    >
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.cardBorder }} />
                        <Text
                            style={{
                                color: COLORS.textSecondary,
                                paddingHorizontal: SPACING[3],
                                fontSize: TYPOGRAPHY.fontSize.sm,
                            }}
                        >
                            or continue with
                        </Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.cardBorder }} />
                    </View>

                    {/* Social Login */}
                    <View style={{ flexDirection: "row", gap: SPACING[3] }}>
                        <Pressable
                            onPress={() => handleSocialLogin("Google")}
                            style={{
                                flex: 1,
                                paddingVertical: SPACING[3],
                                borderWidth: 2,
                                borderColor: COLORS.cardBorder,
                                borderRadius: 16,
                                alignItems: "center",
                                backgroundColor: COLORS.background,
                            }}
                        >
                            <Text style={{ fontWeight: "700", color: COLORS.textPrimary }}>
                                🔍 Google
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handleSocialLogin("Apple")}
                            style={{
                                flex: 1,
                                paddingVertical: SPACING[3],
                                borderWidth: 2,
                                borderColor: COLORS.cardBorder,
                                borderRadius: 16,
                                alignItems: "center",
                                backgroundColor: COLORS.background,
                            }}
                        >
                            <Text style={{ fontWeight: "700", color: COLORS.textPrimary }}>
                                🍎 Apple
                            </Text>
                        </Pressable>
                    </View>

                    {/* Spacer */}
                    <View style={{ height: SPACING[6] }} />

                    {/* Sign Up Link */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: SPACING[4],
                            paddingBottom: SPACING[6],
                        }}
                    >
                        <Text style={{ color: COLORS.textSecondary }}>
                            New here?{" "}
                        </Text>
                        <Pressable onPress={() => router.push("/(auth)/sign-up")}>
                            <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
                                Create an account
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
