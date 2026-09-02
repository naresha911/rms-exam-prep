import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { resetPassword } from "../../lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleReset = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Invalid email");
            return;
        }

        setLoading(true);
        try {
            const { error: resetError } = await resetPassword(email);
            if (resetError) {
                Alert.alert("Error", resetError.message);
            } else {
                Alert.alert(
                    "Check your email",
                    "We've sent password reset instructions to your email.",
                    [{ text: "OK", onPress: () => router.back() }]
                );
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
                    <View style={{ alignItems: "center", marginTop: SPACING[8], marginBottom: SPACING[4] }}>
                        <MascotDisplay expression="thinking" size={100} />
                    </View>

                    {/* Header */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            textAlign: "center",
                            marginBottom: SPACING[2],
                        }}
                    >
                        Forgot Password?
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginBottom: SPACING[6],
                            paddingHorizontal: SPACING[4],
                        }}
                    >
                        Enter your email and we'll send you reset instructions.
                    </Text>

                    {/* Form */}
                    <Input
                        label="Email"
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setError("");
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={error}
                    />

                    {/* Reset Button */}
                    <View style={{ marginTop: SPACING[6] }}>
                        <Button
                            title="Send Reset Link"
                            onPress={handleReset}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    {/* Spacer */}
                    <View style={{ height: SPACING[6] }} />

                    {/* Back to Sign In */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingBottom: SPACING[6],
                        }}
                    >
                        <Text style={{ color: COLORS.textSecondary }}>
                            Remember your password?{" "}
                        </Text>
                        <Pressable onPress={() => router.back()}>
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
