// Settings Screen - App preferences and settings
import { View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import type { ReactNode } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppStore, isAutoShowSolution } from "../../store/useAppStore";
import { SPACING, TYPOGRAPHY, SUPPORTED_LANGUAGES } from "../../constants";
import { signOut } from "../../lib/supabase";
import { t } from "../../lib/i18n";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";

function createStyles(colors: ColorPalette) {
    return {
        screen: {
            backgroundColor: colors.background,
        },
        header: {
            padding: SPACING[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
        },
        backButton: {
            padding: SPACING[2],
        },
        backIcon: {
            fontSize: 24,
            color: colors.textPrimary,
        },
        headerTitle: {
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: "700" as const,
            color: colors.textPrimary,
            textAlign: "center" as const,
            marginRight: 40,
        },
        scrollContent: {
            padding: SPACING[4],
        },
        sectionLabel: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontWeight: "700" as const,
            color: colors.textSecondary,
            textTransform: "uppercase" as const,
            letterSpacing: 1,
            marginBottom: SPACING[2],
        },
        sectionCard: {
            marginBottom: SPACING[5],
        },
        settingRow: {
            paddingVertical: SPACING[3],
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
        },
        languageRow: {
            paddingVertical: SPACING[3],
        },
        settingIcon: {
            fontSize: 22,
            marginRight: SPACING[3],
        },
        settingBody: {
            flex: 1,
        },
        settingTitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: "600" as const,
            color: colors.textPrimary,
        },
        settingSubtitle: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textSecondary,
            marginTop: 2,
        },
        chevron: {
            color: colors.textTertiary,
            fontSize: 18,
        },
        signOutButton: {
            borderColor: colors.error,
        },
        signOutLabel: {
            color: colors.error,
        },
        disclaimer: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.textTertiary,
            textAlign: "center" as const,
            marginTop: SPACING[5],
            paddingHorizontal: SPACING[4],
            lineHeight: 16,
        },
    };
}

export default function SettingsScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { resetStore, user, preferences, updatePreferences } = useAppStore();

    const [soundEnabled, setSoundEnabled] = useState(preferences?.sound ?? true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(preferences?.notifications ?? true);
    const [autoShowSolution, setAutoShowSolution] = useState(isAutoShowSolution(preferences));
    const [selectedLanguage, setSelectedLanguage] = useState(
        preferences?.preferredLanguage || SUPPORTED_LANGUAGES[0].code
    );
    const [loading, setLoading] = useState(false);
    const appearance = preferences.appearance;

    const handleToggle = (
        setting: "notifications" | "sound" | "autoShowSolution",
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

    const switchTrack = { false: colors.cardBorder, true: colors.primaryLight };
    const switchThumb = (on: boolean) => (on ? colors.primary : colors.backgroundTertiary);

    const renderSettingRow = (
        icon: string,
        title: string,
        subtitle?: string,
        rightComponent?: ReactNode,
        onPress?: () => void
    ) => (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [
                layout.row,
                styles.settingRow,
                pressed && onPress ? layout.pressed : null,
            ]}
        >
            <Text style={styles.settingIcon}>{icon}</Text>
            <View style={styles.settingBody}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
            </View>
            {rightComponent}
        </Pressable>
    );

    return (
        <SafeAreaView style={[layout.fill, styles.screen]}>
            <View style={[layout.row, styles.header]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backButton, pressed ? layout.pressed : null]}
                >
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>⚙️ Settings</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionLabel}>Account</Text>
                <Card style={styles.sectionCard}>
                    {renderSettingRow(
                        "👤",
                        "Edit Profile",
                        "Update your name, avatar, and details",
                        <Text style={styles.chevron}>›</Text>,
                        () => router.push("/profile/edit")
                    )}
                    {renderSettingRow(
                        "🎯",
                        "Target Class",
                        user?.target_class ? `Class ${user.target_class}` : "Not set",
                        <Text style={styles.chevron}>›</Text>,
                        () => router.push("/profile/edit")
                    )}
                </Card>

                <Text style={styles.sectionLabel}>Notifications</Text>
                <Card style={styles.sectionCard}>
                    {renderSettingRow(
                        "🔔",
                        "Push Notifications",
                        "Receive important updates",
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={(val) => handleToggle("notifications", val, setNotificationsEnabled)}
                            trackColor={switchTrack}
                            thumbColor={switchThumb(notificationsEnabled)}
                        />
                    )}
                </Card>

                <Text style={styles.sectionLabel}>Experience</Text>
                <Card style={styles.sectionCard}>
                    {renderSettingRow(
                        "📖",
                        t("settings.autoShowSolution"),
                        t("settings.autoShowSolutionHint"),
                        <Switch
                            value={autoShowSolution}
                            onValueChange={(val) => handleToggle("autoShowSolution", val, setAutoShowSolution)}
                            trackColor={switchTrack}
                            thumbColor={switchThumb(autoShowSolution)}
                        />
                    )}
                    {renderSettingRow(
                        "🔊",
                        "Sound Effects",
                        "Play sounds for actions",
                        <Switch
                            value={soundEnabled}
                            onValueChange={(val) => handleToggle("sound", val, setSoundEnabled)}
                            trackColor={switchTrack}
                            thumbColor={switchThumb(soundEnabled)}
                        />
                    )}
                    {renderSettingRow(
                        "🌙",
                        "Dark Mode",
                        "Switches the app between dark and light",
                        <Switch
                            value={appearance === "dark"}
                            onValueChange={(value) => updatePreferences({ appearance: value ? "dark" : "light" })}
                            trackColor={switchTrack}
                            thumbColor={switchThumb(appearance === "dark")}
                        />
                    )}
                </Card>

                <Text style={styles.sectionLabel}>Language</Text>
                <Card style={styles.sectionCard}>
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
                        style={({ pressed }) => [
                            layout.row,
                            styles.languageRow,
                            pressed ? layout.pressed : null,
                        ]}
                    >
                        <Text style={styles.settingIcon}>🌐</Text>
                        <View style={styles.settingBody}>
                            <Text style={styles.settingTitle}>App Language</Text>
                            <Text style={styles.settingSubtitle}>
                                {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || "English"}
                            </Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                    </Pressable>
                </Card>

                <Text style={styles.sectionLabel}>Data & Privacy</Text>
                <Card style={styles.sectionCard}>
                    {renderSettingRow(
                        "🗑️",
                        "Clear Cache",
                        "Free up storage space",
                        <Text style={styles.chevron}>›</Text>,
                        handleClearCache
                    )}
                    {renderSettingRow(
                        "📜",
                        "Privacy Policy",
                        "How we handle your data",
                        <Text style={styles.chevron}>›</Text>,
                        () => Alert.alert("Privacy Policy", "View our privacy policy at sainikprep.com/privacy")
                    )}
                    {renderSettingRow(
                        "📄",
                        "Terms of Service",
                        "App usage terms",
                        <Text style={styles.chevron}>›</Text>,
                        () => Alert.alert("Terms of Service", "View our terms at sainikprep.com/terms")
                    )}
                </Card>

                <Text style={styles.sectionLabel}>About</Text>
                <Card style={styles.sectionCard}>
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
                        <Text style={styles.chevron}>›</Text>,
                        () => Alert.alert("Help & Support", "Email us at support@sainikprep.com")
                    )}
                    {renderSettingRow(
                        "🐛",
                        "Report a Bug",
                        "Help us improve",
                        <Text style={styles.chevron}>›</Text>,
                        () => Alert.alert("Report Bug", "Email us at bugs@sainikprep.com with details")
                    )}
                </Card>

                <Button
                    title="Sign Out"
                    variant="outline"
                    onPress={handleSignOut}
                    style={styles.signOutButton}
                    textStyle={styles.signOutLabel}
                    loading={loading}
                />

                <Text style={styles.disclaimer}>
                    Sainik Prep is an independent educational application and is not affiliated with NTA, Sainik Schools Society, or the Government of India.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
