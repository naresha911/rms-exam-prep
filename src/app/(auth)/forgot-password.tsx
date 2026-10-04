// Forgot Password Screen — Stitch-aligned password reset screen.
import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { resetPassword } from "@/lib/supabase";
import { SPACING, TYPOGRAPHY } from "@/constants";
import { layout, useThemedStyles, type ColorPalette } from "@/theme";

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
            marginTop: SPACING[8],
            marginBottom: SPACING[4],
        },
        title: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            color: colors.onSurface,
            textAlign: "center" as const,
            marginBottom: SPACING[2],
        },
        subtitle: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurfaceVariant,
            textAlign: "center" as const,
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
            justifyContent: "center" as const,
            paddingBottom: SPACING[6],
        },
        backLabel: {
            color: colors.onSurfaceVariant,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
        },
        backLink: {
            color: colors.primary,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
        },
    };
}

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
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
                        <MascotDisplay expression="thinking" size={100} />
                    </View>

                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subtitle}>
                        Enter your email and we'll send you reset instructions.
                    </Text>

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

                    <View style={styles.resetBtnWrap}>
                        <Button
                            title="Send Reset Link"
                            onPress={handleReset}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    <View style={styles.spacer} />

                    <View style={[layout.row, styles.backRow]}>
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
