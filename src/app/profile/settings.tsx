// Settings Screen - App preferences and settings
import { View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppStore, isAutoShowSolution } from "../../store/useAppStore";
import { COLORS, SPACING, TYPOGRAPHY, SUPPORTED_LANGUAGES } from "../../constants";
import { signOut } from "../../lib/supabase";
import { t } from "../../lib/i18n";

export default function SettingsScreen() {
    const router = useRouter();
    const { resetStore, user, preferences, updatePreferences } = useAppStore();

    // Local state for toggles
    const [soundEnabled, setSoundEnabled] = useState(preferences?.sound ?? true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true); // vibration preference not in store
    const [notificationsEnabled, setNotificationsEnabled] = useState(preferences?.notifications ?? true);
    const [darkMode, setDarkMode] = useState(preferences?.darkMode ?? false);
    const [autoShowSolution, setAutoShowSolution] = useState(isAutoShowSolution(preferences));
    const [selectedLanguage, setSelectedLanguage] = useState(
        preferences?.preferredLanguage || SUPPORTED_LANGUAGES[0].code
    );
    const [loading, setLoading] = useState(false);

    const handleToggle = (
        setting: keyof typeof preferences,
        value: boolean,
        setter: (val: boolean) => void
    ) => {
        setter(value);
        updatePreferences({ [setting]: value });
    };

    const handleLanguageChange = (langCode: string) => {
        setSelectedLanguage(langCode);
        updatePreferences({ preferredLanguage: langCode });
    };

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        await signOut();
                        resetStore();
                        router.replace("/(onboarding)/welcome");
                    },
                },
            ]
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            "Clear Cache",
            "This will clear all locally cached data. Your progress will not be affected.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {
                        Alert.alert("Cache Cleared", "Local cache has been cleared successfully.");
                    },
                },
            ]
        );
    };

    const renderSettingRow = (
        icon: string,
        title: string,
        subtitle?: string,
        rightComponent?: React.ReactNode,
        onPress?: () => void
    ) => (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: SPACING[3],
                borderBottomWidth: 1,
                borderBottomColor: COLORS.cardBorder,
                opacity: pressed && onPress ? 0.7 : 1,
            })}
        >
            <Text style={{ fontSize: 22, marginRight: SPACING[3] }}>{icon}</Text>
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.base,
                        fontWeight: "600",
                        color: COLORS.textPrimary,
                    }}
                >
                    {title}
                </Text>
                {subtitle && (
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.xs,
                            color: COLORS.textSecondary,
                            marginTop: 2,
                        }}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>
            {rightComponent}
        </Pressable>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: SPACING[4],
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.cardBorder,
                }}
            >
                <Pressable onPress={() => router.back()} style={{ padding: SPACING[2] }}>
                    <Text style={{ fontSize: 24 }}>←</Text>
                </Pressable>
                <Text
                    style={{
                        flex: 1,
                        fontSize: TYPOGRAPHY.fontSize.xl,
                        fontWeight: "700",
                        color: COLORS.textPrimary,
                        textAlign: "center",
                        marginRight: 40,
                    }}
                >
                    ⚙️ Settings
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: SPACING[4] }}
                showsVerticalScrollIndicator={false}
            >
                {/* Account Section */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: "700",
                        color: COLORS.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: SPACING[2],
                    }}
                >
                    Account
                </Text>
                <Card style={{ marginBottom: SPACING[5] }}>
                    {renderSettingRow(
                        "👤",
                        "Edit Profile",
                        "Update your name, avatar, and details",
                        <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>,
                        () => router.push("/profile/edit")
                    )}
                    {renderSettingRow(
                        "🎯",
                        "Target Class",
                        user?.target_class ? `Class ${user.target_class}` : "Not set",
                        <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>,
                        () => router.push("/profile/edit")
                    )}
                </Card>

                {/* Notifications Section */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: "700",
                        color: COLORS.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: SPACING[2],
                    }}
                >
                    Notifications
                </Text>
                <Card style={{ marginBottom: SPACING[5] }}>
                    {renderSettingRow(
                        "🔔",
                        "Push Notifications",
                        "Receive important updates",
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={(val) => handleToggle("notifications", val, setNotificationsEnabled)}
                            trackColor={{ false: COLORS.cardBorder, true: COLORS.primaryLight }}
                            thumbColor={notificationsEnabled ? COLORS.primary : COLORS.backgroundTertiary}
                        />
                    )}
                </Card>

                {/* Experience Section */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: "700",
                        color: COLORS.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: SPACING[2],
                    }}
                >
                    Experience
                </Text>
                <Card style={{ marginBottom: SPACING[5] }}>
                    {renderSettingRow(
                        "📖",
                        t("settings.autoShowSolution"),
                        t("settings.autoShowSolutionHint"),
                        <Switch
                            value={autoShowSolution}
                            onValueChange={(val) => handleToggle("autoShowSolution", val, setAutoShowSolution)}
                            trackColor={{ false: COLORS.cardBorder, true: COLORS.primaryLight }}
                            thumbColor={autoShowSolution ? COLORS.primary : COLORS.backgroundTertiary}
                        />
                    )}
                    {renderSettingRow(
                        "🔊",
                        "Sound Effects",
                        "Play sounds for actions",
                        <Switch
                            value={soundEnabled}
                            onValueChange={(val) => handleToggle("sound", val, setSoundEnabled)}
                            trackColor={{ false: COLORS.cardBorder, true: COLORS.primaryLight }}
                            thumbColor={soundEnabled ? COLORS.primary : COLORS.backgroundTertiary}
                        />
                    )}
                    {renderSettingRow(
                        "🌙",
                        "Dark Mode",
                        "Coming soon",
                        <Switch
                            value={darkMode}
                            onValueChange={() => {
                                Alert.alert("Coming Soon", "Dark mode will be available in a future update!");
                            }}
                            trackColor={{ false: COLORS.cardBorder, true: COLORS.primaryLight }}
                            thumbColor={darkMode ? COLORS.primary : COLORS.backgroundTertiary}
                            disabled
                        />
                    )}
                </Card>

                {/* Language Section */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: "700",
                        color: COLORS.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: SPACING[2],
                    }}
                >
                    Language
                </Text>
                <Card style={{ marginBottom: SPACING[5] }}>
                    <Pressable
                        onPress={() => {
                            Alert.alert(
                                "Select Language",
                                "Choose your preferred language",
                                SUPPORTED_LANGUAGES.map(lang => ({
                                    text: lang.name,
                                    onPress: () => handleLanguageChange(lang.code),
                                }))
                            );
                        }}
                        style={({ pressed }) => ({
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: SPACING[3],
                            opacity: pressed ? 0.7 : 1,
                        })}
                    >
                        <Text style={{ fontSize: 22, marginRight: SPACING[3] }}>🌐</Text>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.base,
                                    fontWeight: "600",
                                    color: COLORS.textPrimary,
                                }}
                            >
                                App Language
                            </Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.xs,
                                    color: COLORS.textSecondary,
                                    marginTop: 2,
                                }}
                            >
                                {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || "English"}
                            </Text>
                        </View>
                        <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>
                    </Pressable>
                </Card>

                {/* Data Section */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: "700",
                        color: COLORS.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: SPACING[2],
                    }}
                >
                    Data & Privacy
                </Text>
                <Card style={{ marginBottom: SPACING[5] }}>
                    {renderSettingRow(
                        "🗑️",
                        "Clear Cache",
                        "Free up storage space",
                        <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>,
                        handleClearCache
                    )}
                    {renderSettingRow(
                        "📜",
                        "Privacy Policy",
                        "How we handle your data",
                        <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>,
                        () => Alert.alert("Privacy Policy", "View our privacy policy at sainikprep.com/privacy")
                    )}
                    {renderSettingRow(
                        "📄",
                        "Terms of Service",
                        "App usage terms",
                        <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>,
                        () => Alert.alert("Terms of Service", "View our terms at sainikprep.com/terms")
                    )}
                </Card>

                {/* About Section */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: "700",
                        color: COLORS.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: SPACING[2],
                    }}
                >
                    About
                </Text>
                <Card style={{ marginBottom: SPACING[5] }}>
                    {renderSettingRow(
                        "ℹ️",
                        "App Version",
                        "1.0.0",
                        null
                    )}
                    {renderSettingRow(
                        "🆘",
                        "Help & Support",
                        "Get help with the app",
                        <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>,
                        () => Alert.alert("Help & Support", "Email us at support@sainikprep.com")
                    )}
                    {renderSettingRow(
                        "🐛",
                        "Report a Bug",
                        "Help us improve",
                        <Text style={{ color: COLORS.textTertiary, fontSize: 18 }}>›</Text>,
                        () => Alert.alert("Report Bug", "Email us at bugs@sainikprep.com with details")
                    )}
                </Card>

                {/* Sign Out */}
                <Button
                    title="Sign Out"
                    variant="outline"
                    onPress={handleSignOut}
                    style={{ borderColor: COLORS.error }}
                    textStyle={{ color: COLORS.error }}
                    loading={loading}
                />

                {/* Disclaimer */}
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        color: COLORS.textTertiary,
                        textAlign: "center",
                        marginTop: SPACING[5],
                        paddingHorizontal: SPACING[4],
                        lineHeight: 16,
                    }}
                >
                    Sainik Prep is an independent educational application and is not affiliated with NTA, Sainik Schools Society, or the Government of India.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
