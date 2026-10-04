// Setup Cadet Profile — immersive profile setup / edit screen (Stitch mock).
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Modal,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { MascotDisplay } from "@/components/shared/MascotDisplay";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppStore } from "@/store/useAppStore";
import { updateProfile, saveOnboardingData, supabase } from "@/lib/supabase";
import {
    SPACING,
    TYPOGRAPHY,
    BORDER_RADIUS,
    DREAM_SAINIK_SCHOOLS,
    normalizeStudentStandard,
} from "@/constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "@/theme";

type TargetClass = "5" | "8";
type ExamMedium = "en" | "hi";

const TARGET_CLASS_OPTIONS: { value: TargetClass; label: string }[] = [
    { value: "5", label: "Class 5 (V)" },
    { value: "8", label: "Class 8 (VIII)" },
];

function createStyles(colors: ColorPalette) {
    return {
        root: {
            backgroundColor: colors.background,
        },
        loadingRoot: {
            backgroundColor: colors.background,
        },
        scrollContent: {
            flexGrow: 1,
        },
        header: {
            paddingHorizontal: SPACING[6],
            paddingBottom: SPACING[16],
            overflow: "hidden" as const,
            minHeight: 220,
        },
        headerRow: {
            alignItems: "flex-end" as const,
            justifyContent: "space-between" as const,
            zIndex: 1,
        },
        headerCopy: {
            flex: 1,
            paddingBottom: SPACING[2],
            paddingRight: SPACING[2],
        },
        academyPill: {
            alignSelf: "flex-start" as const,
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: BORDER_RADIUS.full,
            backgroundColor: colors.overlay,
            borderWidth: 1,
            borderColor: colors.primaryLight,
            marginBottom: SPACING[2],
        },
        academyPillText: {
            color: colors.primaryLight,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 10,
            letterSpacing: 0.8,
            textTransform: "uppercase" as const,
        },
        headerTitle: {
            color: colors.onPrimary,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize["2xl"],
            lineHeight: 30,
            letterSpacing: -0.3,
        },
        headerSubtitle: {
            marginTop: SPACING[2],
            color: colors.onPrimary,
            opacity: 0.92,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            lineHeight: 18,
            maxWidth: 190,
        },
        mascotHalo: {
            width: 112,
            height: 112,
            marginRight: -4,
            marginBottom: -8,
        },
        mascotRing: {
            width: 104,
            height: 104,
            borderRadius: 52,
            backgroundColor: colors.overlayLight,
            borderWidth: 2,
            borderColor: colors.onPrimary,
            overflow: "hidden" as const,
        },
        formSheet: {
            flex: 1,
            backgroundColor: colors.cardBackground,
            marginTop: -32,
            borderTopLeftRadius: BORDER_RADIUS["3xl"],
            borderTopRightRadius: BORDER_RADIUS["3xl"],
            paddingHorizontal: SPACING[6],
            paddingTop: SPACING[6],
            paddingBottom: SPACING[6],
            gap: SPACING[5],
            shadowColor: colors.overlay,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 8,
        },
        fieldBlock: {
            gap: SPACING[2],
        },
        label: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.textTertiary,
            letterSpacing: 0.8,
            textTransform: "uppercase" as const,
        },
        required: {
            color: colors.error,
        },
        optionalHint: {
            color: colors.primary,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            textTransform: "none" as const,
            letterSpacing: 0,
        },
        selectField: {
            justifyContent: "space-between" as const,
            minHeight: 52,
            paddingHorizontal: SPACING[4],
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.cardBorder,
            backgroundColor: colors.surfaceMuted,
        },
        selectFieldError: {
            borderColor: colors.error,
        },
        selectWithIcon: {
            flex: 1,
            gap: SPACING[2],
            marginRight: SPACING[2],
        },
        selectText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurface,
        },
        selectTextFlex: {
            flex: 1,
        },
        selectPlaceholder: {
            color: colors.textTertiary,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
        },
        errorText: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.error,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
        },
        clearDream: {
            alignSelf: "flex-start" as const,
            marginTop: 2,
        },
        clearDreamText: {
            color: colors.primary,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.xs,
        },
        langRow: {
            gap: 10,
        },
        langCard: {
            flex: 1,
            gap: 10,
            padding: SPACING[3],
            borderRadius: BORDER_RADIUS["2xl"],
            borderWidth: 1,
            borderColor: colors.cardBorder,
            backgroundColor: colors.cardBackground,
        },
        langCardSelected: {
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: colors.primaryFixed,
        },
        radioOuter: {
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: colors.outlineVariant,
        },
        radioOuterSelected: {
            borderColor: colors.primary,
        },
        radioInner: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.primary,
        },
        langCopy: {
            flex: 1,
        },
        langTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.onSurface,
        },
        langTitleSelected: {
            color: colors.onPrimaryFixed,
        },
        langSub: {
            marginTop: 2,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: 10,
            color: colors.textTertiary,
        },
        footer: {
            position: "absolute" as const,
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: SPACING[6],
            paddingTop: SPACING[4],
            backgroundColor: colors.cardBackground,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.cardBorder,
            shadowColor: colors.overlay,
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.06,
            shadowRadius: 20,
            elevation: 12,
        },
        modalBackdrop: {
            backgroundColor: colors.overlay,
            justifyContent: "flex-end" as const,
        },
        modalSheet: {
            maxHeight: "55%" as const,
            backgroundColor: colors.cardBackground,
            borderTopLeftRadius: BORDER_RADIUS["3xl"],
            borderTopRightRadius: BORDER_RADIUS["3xl"],
            paddingHorizontal: SPACING[5],
            paddingTop: SPACING[5],
            paddingBottom: SPACING[8],
        },
        modalTitle: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            marginBottom: SPACING[3],
        },
        modalOption: {
            justifyContent: "space-between" as const,
            paddingVertical: SPACING[4],
            paddingHorizontal: SPACING[3],
            borderRadius: BORDER_RADIUS.xl,
            marginBottom: SPACING[1],
        },
        modalOptionSelected: {
            backgroundColor: colors.primaryFixed,
        },
        modalOptionText: {
            flex: 1,
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.onSurface,
            paddingRight: SPACING[2],
        },
        modalOptionTextSelected: {
            color: colors.onPrimaryFixed,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
        },
    };
}

export default function ProfileSetupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const { user, setUser, preferences, updatePreferences, setOnboardingData, onboardingData } =
        useAppStore();

    const [fullName, setFullName] = useState(user?.full_name || "");
    const [targetClass, setTargetClass] = useState<TargetClass | "">(
        user?.target_class || onboardingData.targetClass
            ? normalizeStudentStandard(user?.target_class || onboardingData.targetClass)
            : ""
    );
    const [currentSchool, setCurrentSchool] = useState("");
    const [dreamSchool, setDreamSchool] = useState("");
    const [examMedium, setExamMedium] = useState<ExamMedium>(
        preferences?.preferredLanguage === "hi" ? "hi" : "en"
    );
    const [loading, setLoading] = useState(false);
    const [hydrating, setHydrating] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [classPickerOpen, setClassPickerOpen] = useState(false);
    const [dreamPickerOpen, setDreamPickerOpen] = useState(false);

    const insetStyles = useMemo(
        () =>
            StyleSheet.create({
                scroll: { paddingBottom: 112 + insets.bottom },
                headerPad: { paddingTop: insets.top + SPACING[6] },
                footerPad: { paddingBottom: Math.max(insets.bottom, SPACING[4]) },
            }),
        [insets.bottom, insets.top]
    );

    useEffect(() => {
        let cancelled = false;
        const hydrate = async () => {
            try {
                const {
                    data: { user: authUser },
                } = await supabase.auth.getUser();
                if (cancelled || !authUser) return;
                const meta = authUser.user_metadata || {};
                if (typeof meta.current_school === "string" && meta.current_school) {
                    setCurrentSchool(meta.current_school);
                }
                if (typeof meta.dream_school === "string" && meta.dream_school) {
                    setDreamSchool(meta.dream_school);
                }
                if (meta.target_class) {
                    setTargetClass(normalizeStudentStandard(String(meta.target_class)));
                }
                if (meta.preferred_language === "hi" || meta.preferred_language === "en") {
                    setExamMedium(meta.preferred_language);
                }
                if (!fullName && typeof meta.full_name === "string") {
                    setFullName(meta.full_name);
                }
            } catch {
                // Prefill is best-effort
            } finally {
                if (!cancelled) setHydrating(false);
            }
        };
        hydrate();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once on mount
    }, []);

    const validate = useCallback((): boolean => {
        const next: Record<string, string> = {};
        if (!fullName.trim()) next.fullName = "Cadet full name is required";
        else if (fullName.trim().length < 2) next.fullName = "Name must be at least 2 characters";
        if (!targetClass) next.targetClass = "Please select a target class";
        if (!currentSchool.trim()) next.currentSchool = "Current school name is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    }, [fullName, targetClass, currentSchool]);

    const handleSave = async () => {
        if (!validate() || !user?.id) return;
        setLoading(true);
        try {
            const name = fullName.trim();
            const school = currentSchool.trim();
            const dream = dreamSchool.trim();

            const { data, error } = await updateProfile(user.id, { full_name: name });
            if (error) throw error;

            await saveOnboardingData({
                target_class: targetClass as TargetClass,
                current_school: school,
                dream_school: dream || undefined,
                preferred_language: examMedium,
            });

            updatePreferences({ preferredLanguage: examMedium });
            setOnboardingData({ targetClass: targetClass as TargetClass });

            setUser({
                ...user,
                full_name: data?.full_name ?? name,
                target_class: targetClass as TargetClass,
                preferred_language: examMedium,
                updated_at: data?.updated_at || new Date().toISOString(),
            });

            Alert.alert("Mission briefing complete", "Your cadet profile is ready.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (cause: unknown) {
            const message =
                cause instanceof Error ? cause.message : "Failed to save profile. Please try again.";
            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    if (hydrating) {
        return (
            <SafeAreaView style={[layout.fill, styles.loadingRoot]} edges={["top", "bottom"]}>
                <LoadingSpinner message="Loading cadet profile..." />
            </SafeAreaView>
        );
    }

    const selectedClassLabel =
        TARGET_CLASS_OPTIONS.find((o) => o.value === targetClass)?.label || "Select target class";

    return (
        <View style={[layout.fill, styles.root]}>
            <KeyboardAvoidingView
                style={layout.fill}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={layout.fill}
                    contentContainerStyle={[styles.scrollContent, insetStyles.scroll]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[styles.header, insetStyles.headerPad]}>
                        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                            <Svg width="100%" height="100%">
                                <Defs>
                                    <LinearGradient id="profileSetupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor={colors.gradientEnd} />
                                        <Stop offset="45%" stopColor={colors.primary} />
                                        <Stop offset="100%" stopColor={colors.gradientStart} />
                                    </LinearGradient>
                                </Defs>
                                <Rect width="100%" height="100%" fill="url(#profileSetupGrad)" />
                                <Circle cx="92%" cy="8%" r="72" fill={colors.primaryLight} opacity={0.22} />
                                <Circle cx="18%" cy="18%" r="3" fill={colors.xpGold} opacity={0.85} />
                                <Circle cx="72%" cy="28%" r="2" fill={colors.onPrimary} opacity={0.55} />
                                <Circle cx="38%" cy="78%" r="3" fill={colors.primaryFixedDim} opacity={0.35} />
                            </Svg>
                        </View>

                        <View style={[layout.row, styles.headerRow]}>
                            <View style={styles.headerCopy}>
                                <View style={[layout.row, styles.academyPill]}>
                                    <MaterialIcon name="shield" size={14} color={colors.xpGold} filled />
                                    <Text style={styles.academyPillText}>AISSEE Cadet Academy</Text>
                                </View>
                                <Text style={styles.headerTitle}>
                                    Setup Cadet{"\n"}Profile
                                </Text>
                                <Text style={styles.headerSubtitle}>
                                    Configure your credentials to begin training with Vijay!
                                </Text>
                            </View>
                            <View style={[layout.center, styles.mascotHalo]}>
                                <View style={[layout.center, styles.mascotRing]}>
                                    <MascotDisplay expression="waving" size={88} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.formSheet}>
                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>
                                Cadet Full Name <Text style={styles.required}>*</Text>
                            </Text>
                            <Input
                                placeholder="Enter student full name"
                                value={fullName}
                                onChangeText={(text) => {
                                    setFullName(text);
                                    if (errors.fullName) setErrors((e) => ({ ...e, fullName: "" }));
                                }}
                                error={errors.fullName}
                                autoCapitalize="words"
                                leftIcon={
                                    <MaterialIcon name="badge" size={22} color={colors.textTertiary} />
                                }
                            />
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>
                                Target Class <Text style={styles.required}>*</Text>
                            </Text>
                            <Pressable
                                onPress={() => setClassPickerOpen(true)}
                                style={({ pressed }) => [
                                    layout.row,
                                    styles.selectField,
                                    errors.targetClass ? styles.selectFieldError : null,
                                    pressed ? layout.pressed : null,
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel="Select target class"
                            >
                                <Text
                                    style={[
                                        styles.selectText,
                                        !targetClass ? styles.selectPlaceholder : null,
                                    ]}
                                >
                                    {selectedClassLabel}
                                </Text>
                                <MaterialIcon name="expand_more" size={22} color={colors.textTertiary} />
                            </Pressable>
                            {!!errors.targetClass && (
                                <Text style={styles.errorText}>{errors.targetClass}</Text>
                            )}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>
                                Current School Name <Text style={styles.required}>*</Text>
                            </Text>
                            <Input
                                placeholder="e.g., Kendriya Vidyalaya, Army Public School"
                                value={currentSchool}
                                onChangeText={(text) => {
                                    setCurrentSchool(text);
                                    if (errors.currentSchool)
                                        setErrors((e) => ({ ...e, currentSchool: "" }));
                                }}
                                error={errors.currentSchool}
                                autoCapitalize="words"
                                leftIcon={
                                    <MaterialIcon name="school" size={22} color={colors.textTertiary} />
                                }
                            />
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>
                                Dream Sainik School{" "}
                                <Text style={styles.optionalHint}>(Optional)</Text>
                            </Text>
                            <Pressable
                                onPress={() => setDreamPickerOpen(true)}
                                style={({ pressed }) => [
                                    layout.row,
                                    styles.selectField,
                                    pressed ? layout.pressed : null,
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel="Select dream Sainik School"
                            >
                                <View style={[layout.row, styles.selectWithIcon]}>
                                    <MaterialIcon
                                        name="account_balance"
                                        size={22}
                                        color={colors.textTertiary}
                                    />
                                    <Text
                                        style={[
                                            styles.selectText,
                                            styles.selectTextFlex,
                                            !dreamSchool ? styles.selectPlaceholder : null,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {dreamSchool || "Select a school"}
                                    </Text>
                                </View>
                                <MaterialIcon name="expand_more" size={22} color={colors.textTertiary} />
                            </Pressable>
                            {!!dreamSchool && (
                                <Pressable
                                    onPress={() => setDreamSchool("")}
                                    hitSlop={8}
                                    style={({ pressed }) => [styles.clearDream, pressed ? layout.pressed : null]}
                                >
                                    <Text style={styles.clearDreamText}>Clear selection</Text>
                                </Pressable>
                            )}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>Exam Medium Language</Text>
                            <View style={[layout.row, styles.langRow]}>
                                <Pressable
                                    onPress={() => setExamMedium("en")}
                                    style={({ pressed }) => [
                                        layout.row,
                                        styles.langCard,
                                        examMedium === "en" ? styles.langCardSelected : null,
                                        pressed ? layout.pressed : null,
                                    ]}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: examMedium === "en" }}
                                >
                                    <View
                                        style={[
                                            layout.center,
                                            styles.radioOuter,
                                            examMedium === "en" ? styles.radioOuterSelected : null,
                                        ]}
                                    >
                                        {examMedium === "en" ? <View style={styles.radioInner} /> : null}
                                    </View>
                                    <View style={styles.langCopy}>
                                        <Text
                                            style={[
                                                styles.langTitle,
                                                examMedium === "en" ? styles.langTitleSelected : null,
                                            ]}
                                        >
                                            English Medium
                                        </Text>
                                        <Text style={styles.langSub}>AISSEE standard</Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    onPress={() => setExamMedium("hi")}
                                    style={({ pressed }) => [
                                        layout.row,
                                        styles.langCard,
                                        examMedium === "hi" ? styles.langCardSelected : null,
                                        pressed ? layout.pressed : null,
                                    ]}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: examMedium === "hi" }}
                                >
                                    <View
                                        style={[
                                            layout.center,
                                            styles.radioOuter,
                                            examMedium === "hi" ? styles.radioOuterSelected : null,
                                        ]}
                                    >
                                        {examMedium === "hi" ? <View style={styles.radioInner} /> : null}
                                    </View>
                                    <View style={styles.langCopy}>
                                        <Text
                                            style={[
                                                styles.langTitle,
                                                examMedium === "hi" ? styles.langTitleSelected : null,
                                            ]}
                                        >
                                            हिन्दी (Hindi)
                                        </Text>
                                        <Text style={styles.langSub}>Regional support</Text>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.footer, insetStyles.footerPad]}>
                    <Button
                        title="Complete Mission Briefing"
                        onPress={handleSave}
                        loading={loading}
                        fullWidth
                        size="lg"
                    />
                </View>
            </KeyboardAvoidingView>

            <PickerModal
                visible={classPickerOpen}
                title="Target Class"
                onClose={() => setClassPickerOpen(false)}
                options={TARGET_CLASS_OPTIONS.map((o) => ({
                    key: o.value,
                    label: o.label,
                }))}
                selectedKey={targetClass || undefined}
                onSelect={(key) => {
                    setTargetClass(key as TargetClass);
                    if (errors.targetClass) setErrors((e) => ({ ...e, targetClass: "" }));
                    setClassPickerOpen(false);
                }}
            />

            <PickerModal
                visible={dreamPickerOpen}
                title="Dream Sainik School"
                onClose={() => setDreamPickerOpen(false)}
                options={DREAM_SAINIK_SCHOOLS.map((name) => ({
                    key: name,
                    label: name,
                }))}
                selectedKey={dreamSchool || undefined}
                onSelect={(key) => {
                    setDreamSchool(key);
                    setDreamPickerOpen(false);
                }}
            />
        </View>
    );
}

function PickerModal({
    visible,
    title,
    options,
    selectedKey,
    onSelect,
    onClose,
}: {
    visible: boolean;
    title: string;
    options: { key: string; label: string }[];
    selectedKey?: string;
    onSelect: (key: string) => void;
    onClose: () => void;
}) {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={[layout.fill, styles.modalBackdrop]} onPress={onClose}>
                <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) => {
                            const selected = item.key === selectedKey;
                            return (
                                <Pressable
                                    onPress={() => onSelect(item.key)}
                                    style={({ pressed }) => [
                                        layout.row,
                                        styles.modalOption,
                                        selected ? styles.modalOptionSelected : null,
                                        pressed ? layout.pressed : null,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.modalOptionText,
                                            selected ? styles.modalOptionTextSelected : null,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {selected ? (
                                        <MaterialIcon name="check" size={20} color={colors.primary} />
                                    ) : null}
                                </Pressable>
                            );
                        }}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
}
