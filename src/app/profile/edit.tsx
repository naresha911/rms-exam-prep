// Edit Profile Screen - Update user information
import { View, Text, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Avatar } from "../../components/ui/Avatar";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useAppStore } from "../../store/useAppStore";
import { updateProfile } from "../../lib/supabase";
import { COLORS, SPACING, TYPOGRAPHY, DAILY_GOALS } from "../../constants";

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, setUser, preferences, updatePreferences } = useAppStore();

    // Form state
    const [fullName, setFullName] = useState(user?.full_name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [targetClass, setTargetClass] = useState<'6' | '9' | ''>(
        (user?.target_class as '6' | '9') || ""
    );
    const [dailyGoal, setDailyGoal] = useState(
        typeof user?.daily_goal === 'number' ? user.daily_goal : (preferences?.dailyGoal || 10)
    );
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!fullName.trim()) {
            newErrors.fullName = "Name is required";
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = "Name must be at least 2 characters";
        }

        if (phone && !/^\+?[0-9]{10}$/.test(phone.replace(/\s/g, ''))) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (!targetClass) {
            newErrors.targetClass = "Please select a target class";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm() || !user?.id) return;

        setLoading(true);

        try {
            // Update profile in Supabase
            const { data, error } = await updateProfile(user.id, {
                full_name: fullName.trim(),
                phone: phone.trim() || undefined,
            });

            if (error) {
                throw error;
            }

            // Update local store preferences for daily goal
            updatePreferences({ dailyGoal });

            // Update local user state
            if (data) {
                setUser({
                    ...user,
                    full_name: fullName.trim(),
                    phone: phone.trim() || null,
                    target_class: targetClass as '6' | '9',
                    daily_goal: dailyGoal,
                });
            }

            Alert.alert("Success", "Profile updated successfully!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTargetClass = (selected: '6' | '9') => {
        setTargetClass(selected);
        if (errors.targetClass) {
            setErrors(prev => ({ ...prev, targetClass: "" }));
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
                <LoadingSpinner message="Saving changes..." />
            </SafeAreaView>
        );
    }

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
                    👤 Edit Profile
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ padding: SPACING[4] }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Avatar Section */}
                    <View style={{ alignItems: "center", marginBottom: SPACING[6] }}>
                        <Avatar
                            name={fullName || "Student"}
                            uri={user?.avatar_url}
                            size={100}
                            backgroundColor={COLORS.primary}
                        />
                        <Pressable
                            style={{
                                marginTop: SPACING[2],
                                paddingVertical: SPACING[1],
                                paddingHorizontal: SPACING[3],
                                backgroundColor: COLORS.primaryLight + "30",
                                borderRadius: 20,
                            }}
                        >
                            <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: TYPOGRAPHY.fontSize.sm }}>
                                Change Photo
                            </Text>
                        </Pressable>
                    </View>

                    {/* Personal Information */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[3],
                        }}
                    >
                        Personal Information
                    </Text>
                    <Card style={{ marginBottom: SPACING[5] }}>
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChangeText={(text) => {
                                setFullName(text);
                                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: "" }));
                            }}
                            error={errors.fullName}
                            leftIcon="👤"
                        />
                        <View style={{ marginTop: SPACING[3] }}>
                            <Input
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChangeText={(text) => {
                                    setPhone(text);
                                    if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                                }}
                                error={errors.phone}
                                leftIcon="📱"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </Card>

                    {/* Target Class */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[3],
                        }}
                    >
                        Target Class
                    </Text>
                    <Card style={{ marginBottom: SPACING[5] }}>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.textSecondary,
                                marginBottom: SPACING[3],
                            }}
                        >
                            Which class are you preparing for in AISSEE?
                        </Text>
                        <View style={{ flexDirection: "row", gap: SPACING[3] }}>
                            <Pressable
                                onPress={() => handleSelectTargetClass('6')}
                                style={({ pressed }) => ({
                                    flex: 1,
                                    padding: SPACING[4],
                                    borderRadius: 12,
                                    backgroundColor: targetClass === '6' ? COLORS.primary : COLORS.backgroundSecondary,
                                    borderWidth: 2,
                                    borderColor: targetClass === '6' ? COLORS.primary : COLORS.cardBorder,
                                    alignItems: "center",
                                    opacity: pressed ? 0.8 : 1,
                                })}
                            >
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize["3xl"],
                                        fontWeight: "800",
                                        color: targetClass === '6' ? COLORS.textInverse : COLORS.textPrimary,
                                    }}
                                >
                                    6
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        color: targetClass === '6' ? COLORS.textInverse : COLORS.textSecondary,
                                        marginTop: 4,
                                    }}
                                >
                                    Class VI
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.xs,
                                        color: targetClass === '6' ? COLORS.textInverse : COLORS.textTertiary,
                                        marginTop: 2,
                                    }}
                                >
                                    Age 10-12
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => handleSelectTargetClass('9')}
                                style={({ pressed }) => ({
                                    flex: 1,
                                    padding: SPACING[4],
                                    borderRadius: 12,
                                    backgroundColor: targetClass === '9' ? COLORS.primary : COLORS.backgroundSecondary,
                                    borderWidth: 2,
                                    borderColor: targetClass === '9' ? COLORS.primary : COLORS.cardBorder,
                                    alignItems: "center",
                                    opacity: pressed ? 0.8 : 1,
                                })}
                            >
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize["3xl"],
                                        fontWeight: "800",
                                        color: targetClass === '9' ? COLORS.textInverse : COLORS.textPrimary,
                                    }}
                                >
                                    9
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.sm,
                                        color: targetClass === '9' ? COLORS.textInverse : COLORS.textSecondary,
                                        marginTop: 4,
                                    }}
                                >
                                    Class IX
                                </Text>
                                <Text
                                    style={{
                                        fontSize: TYPOGRAPHY.fontSize.xs,
                                        color: targetClass === '9' ? COLORS.textInverse : COLORS.textTertiary,
                                        marginTop: 2,
                                    }}
                                >
                                    Age 13-15
                                </Text>
                            </Pressable>
                        </View>
                        {errors.targetClass && (
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    color: COLORS.error,
                                    marginTop: SPACING[2],
                                }}
                            >
                                {errors.targetClass}
                            </Text>
                        )}
                    </Card>

                    {/* Daily Goal */}
                    <Text
                        style={{
                            fontSize: TYPOGRAPHY.fontSize.lg,
                            fontWeight: "700",
                            color: COLORS.textPrimary,
                            marginBottom: SPACING[3],
                        }}
                    >
                        Daily Goal
                    </Text>
                    <Card style={{ marginBottom: SPACING[6] }}>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.textSecondary,
                                marginBottom: SPACING[3],
                            }}
                        >
                            How many questions do you want to answer each day?
                        </Text>
                        <View style={{ flexDirection: "row", gap: SPACING[2], flexWrap: "wrap" }}>
                            {DAILY_GOALS.map((goal) => (
                                <Pressable
                                    key={goal}
                                    onPress={() => setDailyGoal(goal)}
                                    style={({ pressed }) => ({
                                        flex: 1,
                                        minWidth: 70,
                                        paddingVertical: SPACING[3],
                                        paddingHorizontal: SPACING[2],
                                        borderRadius: 8,
                                        backgroundColor: dailyGoal === goal ? COLORS.primary : COLORS.backgroundSecondary,
                                        alignItems: "center",
                                        opacity: pressed ? 0.8 : 1,
                                    })}
                                >
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.lg,
                                            fontWeight: "700",
                                            color: dailyGoal === goal ? COLORS.textInverse : COLORS.textPrimary,
                                        }}
                                    >
                                        {goal}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: TYPOGRAPHY.fontSize.xs,
                                            color: dailyGoal === goal ? COLORS.textInverse : COLORS.textSecondary,
                                        }}
                                    >
                                        Q/day
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                        <View
                            style={{
                                marginTop: SPACING[3],
                                padding: SPACING[2],
                                backgroundColor: COLORS.primaryLight + "20",
                                borderRadius: 8,
                            }}
                        >
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.primary }}>
                                💡 Tip: Starting with 10 questions daily is a great way to build a consistent practice habit!
                            </Text>
                        </View>
                    </Card>

                    {/* Save Button */}
                    <Button
                        title="Save Changes"
                        onPress={handleSave}
                        loading={loading}
                        style={{ marginBottom: SPACING[4] }}
                    />

                    <Button
                        title="Cancel"
                        variant="outline"
                        onPress={() => router.back()}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
