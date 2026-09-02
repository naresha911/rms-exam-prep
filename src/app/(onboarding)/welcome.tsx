import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";

export default function WelcomeScreen() {
    const router = useRouter();

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
                    <View style={{ flex: 1, paddingTop: SPACING[16] }}>
                        {/* Top decorative gradient */}
                        <View
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 300,
                                backgroundColor: COLORS.primaryLight,
                                opacity: 0.15,
                                borderBottomLeftRadius: 100,
                                borderBottomRightRadius: 100,
                                zIndex: 0,
                            }}
                        />

                        {/* Mascot */}
                        <View style={{ alignItems: "center", marginTop: SPACING[8], zIndex: 1 }}>
                            <MascotDisplay expression="happy" size={200} />
                        </View>

                        {/* Content */}
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: SPACING[8],
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize["3xl"],
                                    fontWeight: "800",
                                    color: COLORS.textPrimary,
                                    textAlign: "center",
                                    marginBottom: SPACING[4],
                                }}
                            >
                                Your Sainik School{"\n"}journey starts here! 🎖️
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.lg,
                                    color: COLORS.textSecondary,
                                    textAlign: "center",
                                    lineHeight: 26,
                                    paddingHorizontal: SPACING[4],
                                }}
                            >
                                Learn smarter. Practice every day. Get exam ready.
                            </Text>
                        </View>

                        {/* CTA */}
                        <View style={{ paddingTop: SPACING[8], paddingBottom: SPACING[4], zIndex: 1 }}>
                            <Button
                                title="Get Started →"
                                onPress={() => router.push("/(onboarding)/target-class")}
                                fullWidth
                                size="lg"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
