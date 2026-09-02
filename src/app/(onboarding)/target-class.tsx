import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

export default function TargetClassScreen() {
    const router = useRouter();
    const { onboardingData, setOnboardingData } = useAppStore();

    const handleSelect = (targetClass: "6" | "9") => {
        setOnboardingData({ targetClass });
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
                    <View style={{ alignItems: "center", marginTop: SPACING[8], marginBottom: SPACING[6] }}>
                        <MascotDisplay expression="thinking" size={120} />
                    </View>

                    {/* Question */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize["2xl"],
                            fontWeight: "800",
                            color: COLORS.textPrimary,
                            textAlign: "center",
                            marginBottom: SPACING[2],
                        }}
                    >
                        Which class are you{"\n"}preparing for?
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginBottom: SPACING[8],
                        }}
                    >
                        Choose your target admission class.
                    </Text>

                    {/* Options */}
                    <View style={{ gap: SPACING[4] }}>
                        <ClassOption
                            title="Class 6"
                            subtitle="For students in Class 5"
                            emoji="🎒"
                            selected={onboardingData.targetClass === "6"}
                            onPress={() => handleSelect("6")}
                        />
                        <ClassOption
                            title="Class 9"
                            subtitle="For students in Class 8"
                            emoji="📚"
                            selected={onboardingData.targetClass === "9"}
                            onPress={() => handleSelect("9")}
                        />
                    </View>

                    {/* CTA */}
                    <View style={{ paddingTop: SPACING[8], paddingBottom: SPACING[4], marginTop: 'auto' }}>
                        <Button
                            title="Continue →"
                            onPress={() => router.push("/(onboarding)/current-class")}
                            fullWidth
                            size="lg"
                            disabled={!onboardingData.targetClass}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

interface ClassOptionProps {
    title: string;
    subtitle: string;
    emoji: string;
    selected: boolean;
    onPress: () => void;
}

const ClassOption: React.FC<ClassOptionProps> = ({
    title,
    subtitle,
    emoji,
    selected,
    onPress,
}) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                backgroundColor: selected ? COLORS.primary : COLORS.background,
                borderWidth: 2,
                borderColor: selected ? COLORS.primary : COLORS.cardBorder,
                borderRadius: BORDER_RADIUS["2xl"],
                padding: SPACING[5],
                flexDirection: "row",
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: selected ? 0.15 : 0.05,
                shadowRadius: 8,
                elevation: selected ? 4 : 1,
                zIndex: 1,
            })}
        >
            <Text style={{ fontSize: 40, marginRight: SPACING[4] }}>{emoji}</Text>
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.xl,
                        fontWeight: "700",
                        color: selected ? COLORS.textInverse : COLORS.textPrimary,
                        marginBottom: 4,
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        color: selected ? "#E9D5FF" : COLORS.textSecondary,
                    }}
                >
                    {subtitle}
                </Text>
            </View>
            {selected && (
                <View
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: COLORS.textInverse,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ color: COLORS.primary, fontWeight: "900" }}>✓</Text>
                </View>
            )}
        </Pressable>
    );
};
