import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { useAppStore } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

type GoalType = "crack_aissee" | "improve_score" | "practice_daily" | "prepare_mock";

export default function GoalScreen() {
    const router = useRouter();
    const { onboardingData, setOnboardingData, setOnboardingComplete } = useAppStore();

    const handleSelect = (goal: GoalType) => {
        setOnboardingData({ goal });
    };

    const handleContinue = () => {
        setOnboardingComplete(true);
        router.replace("/(auth)/sign-up");
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
                        <MascotDisplay expression="celebrating" size={120} />
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
                        What's your goal?
                    </Text>
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.base,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginBottom: SPACING[6],
                        }}
                    >
                        We'll personalize your journey.
                    </Text>

                    {/* Options */}
                    <View style={{ gap: SPACING[3] }}>
                        <GoalOption
                            title="Crack AISSEE"
                            subtitle="Get into Sainik School"
                            emoji="🏆"
                            selected={onboardingData.goal === "crack_aissee"}
                            onPress={() => handleSelect("crack_aissee")}
                        />
                        <GoalOption
                            title="Improve my score"
                            subtitle="Boost my performance"
                            emoji="📈"
                            selected={onboardingData.goal === "improve_score"}
                            onPress={() => handleSelect("improve_score")}
                        />
                        <GoalOption
                            title="Practice every day"
                            subtitle="Build a study habit"
                            emoji="📅"
                            selected={onboardingData.goal === "practice_daily"}
                            onPress={() => handleSelect("practice_daily")}
                        />
                        <GoalOption
                            title="Prepare for my first mock test"
                            subtitle="Get exam-ready"
                            emoji="📝"
                            selected={onboardingData.goal === "prepare_mock"}
                            onPress={() => handleSelect("prepare_mock")}
                        />
                    </View>

                    {/* CTA */}
                    <View style={{ paddingTop: SPACING[8], paddingBottom: SPACING[4], marginTop: 'auto' }}>
                        <Button
                            title="Create Account →"
                            onPress={handleContinue}
                            fullWidth
                            size="lg"
                            disabled={!onboardingData.goal}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

interface GoalOptionProps {
    title: string;
    subtitle: string;
    emoji: string;
    selected: boolean;
    onPress: () => void;
}

const GoalOption: React.FC<GoalOptionProps> = ({
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
                borderRadius: BORDER_RADIUS.xl,
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
            <Text style={{ fontSize: 28, marginRight: SPACING[3] }}>{emoji}</Text>
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        fontWeight: "700",
                        color: selected ? COLORS.textInverse : COLORS.textPrimary,
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        color: selected ? "#E9D5FF" : COLORS.textSecondary,
                        marginTop: 2,
                    }}
                >
                    {subtitle}
                </Text>
            </View>
            {selected && (
                <View
                    style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
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
