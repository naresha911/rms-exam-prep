import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

export default function CurrentClassScreen() {
    const router = useRouter();
    const { onboardingData, setOnboardingData } = useAppStore();

    const handleSelect = (currentClass: "5" | "8" | "other") => {
        setOnboardingData({ currentClass });
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
                        <MascotDisplay expression="happy" size={120} />
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
                        Which class are you{"\n"}studying in?
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginBottom: SPACING[8],
                        }}
                    >
                        This helps us customize your practice.
                    </Text>

                    {/* Options */}
                    <View style={{ gap: SPACING[4] }}>
                        <ClassOption
                            title="Class 5"
                            subtitle="Preparing for Class 6"
                            emoji="📖"
                            selected={onboardingData.currentClass === "5"}
                            onPress={() => handleSelect("5")}
                        />
                        <ClassOption
                            title="Class 8"
                            subtitle="Preparing for Class 9"
                            emoji="📚"
                            selected={onboardingData.currentClass === "8"}
                            onPress={() => handleSelect("8")}
                        />
                        <ClassOption
                            title="Other"
                            subtitle="Different grade"
                            emoji="🎓"
                            selected={onboardingData.currentClass === "other"}
                            onPress={() => handleSelect("other")}
                        />
                    </View>

                    {/* CTA */}
                    <View style={{ paddingTop: SPACING[8], paddingBottom: SPACING[4], marginTop: 'auto' }}>
                        <Button
                            title="Continue →"
                            onPress={() => router.push("/(onboarding)/goal")}
                            fullWidth
                            size="lg"
                            disabled={!onboardingData.currentClass}
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
                padding: SPACING[4],
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
            <Text style={{ fontSize: 32, marginRight: SPACING[3] }}>{emoji}</Text>
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.lg,
                        fontWeight: "700",
                        color: selected ? COLORS.textInverse : COLORS.textPrimary,
                        marginBottom: 2,
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
