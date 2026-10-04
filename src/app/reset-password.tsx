// Reset Password Screen — reached from the auth/callback deep link when the
// recovery session type is 'recovery'. Requires an active Supabase session.
import { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { getSession, updatePassword } from "@/lib/supabase";
import { SPACING, TYPOGRAPHY } from "@/constants";
import { layout, useThemedStyles, type ColorPalette } from "@/theme";

const MIN_PASSWORD_LENGTH = 8;

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
        submitBtnWrap: {
            marginTop: SPACING[6],
        },
        fieldWrap: {
            marginTop: SPACING[4],
        },
    };
}

export default function ResetPasswordScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string>("");
    const [confirmError, setConfirmError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await getSession();
            if (!data?.session) {
                Alert.alert(
                    "Link expired",
                    "This reset link is invalid or has expired. Request a new one.",
                    [{ text: "OK", onPress: () => router.replace("/(auth)/forgot-password") }]
                );
                return;
            }
            setReady(true);
        };
        void checkSession();
    }, [router]);

    const handleReset = async () => {
        const nextError = validate();
        if (nextError) return;

        setLoading(true);
        try {
            const { error: updateError } = await updatePassword(password);
            if (updateError) {
                Alert.alert("Error", updateError.message);
            } else {
                Alert.alert("Password updated", "You can now use your new password to sign in.", [
                    { text: "OK", onPress: () => router.replace("/(tabs)") },
                ]);
            }
        } catch (e: any) {
            Alert.alert("Error", e?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const validate = (): string => {
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Use at least ${MIN_PASSWORD_LENGTH} characters`);
            return "invalid";
        }
        if (password !== confirmPassword) {
            setConfirmError("Passwords do not match");
            return "mismatch";
        }
        return "";
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

                    <Text style={styles.title}>Choose a New Password</Text>
                    <Text style={styles.subtitle}>
                        Pick something you can remember. You'll use it every time you sign in.
                    </Text>

                    <Input
                        label="New Password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setError("");
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="new-password"
                        error={error}
                    />

                    <View style={styles.fieldWrap}>
                        <Input
                            label="Confirm Password"
                            placeholder="Type it again"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setConfirmError("");
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            autoComplete="new-password"
                            error={confirmError}
                        />
                    </View>

                    <View style={styles.submitBtnWrap}>
                        <Button
                            title="Update Password"
                            onPress={handleReset}
                            loading={loading}
                            disabled={!ready}
                            fullWidth
                            size="lg"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}