// Forgot Password Screen — Stitch-aligned password reset screen.
import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { resetPassword } from "@/lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY } from "@/constants";

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
                        <MascotDisplay expression="thinking" size={100} />
                    </View>

                    {/* Header */}
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
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
                    <View style={styles.resetBtnWrap}>
                        <Button
                            title="Send Reset Link"
                            onPress={handleReset}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    {/* Spacer */}
                    <View style={styles.spacer} />

                    {/* Back to Sign In */}
                    <View style={styles.backRow}>
                        <Text style={styles.backLabel}>Remember your password? </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={styles.backLink}>Sign In</Text>
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
        marginTop: SPACING[8],
        marginBottom: SPACING[4],
    },
    title: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        color: COLORS.onSurface,
        textAlign: "center",
        marginBottom: SPACING[2],
    },
    subtitle: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
        marginBottom: SPACING[6],
        paddingHorizontal: SPACING[4],
    },
    resetBtnWrap: {
        marginTop: SPACING[6],
    },
    spacer: {
        height: SPACING[6],
    },
    backRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: SPACING[6],
    },
    backLabel: {
        color: COLORS.onSurfaceVariant,
        fontFamily: TYPOGRAPHY.fontFamily.regular,
    },
    backLink: {
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
    },
});
