// Setup Cadet Profile — immersive profile setup / edit screen (Stitch mock).
import { useCallback, useEffect, useState } from "react";
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
    COLORS,
    SPACING,
    TYPOGRAPHY,
    BORDER_RADIUS,
    DREAM_SAINIK_SCHOOLS,
} from "@/constants";

type TargetClass = "6" | "9";
type ExamMedium = "en" | "hi";

const TARGET_CLASS_OPTIONS: { value: TargetClass; label: string }[] = [
    { value: "6", label: "Class 6 (VI)" },
    { value: "9", label: "Class 9 (IX)" },
];

export default function ProfileSetupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, setUser, preferences, updatePreferences, setOnboardingData, onboardingData } =
        useAppStore();

    const [fullName, setFullName] = useState(user?.full_name || "");
    const [targetClass, setTargetClass] = useState<TargetClass | "">(
        (user?.target_class as TargetClass) ||
            (onboardingData.targetClass as TargetClass) ||
            ""
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
                if (meta.target_class === "6" || meta.target_class === "9") {
                    setTargetClass(meta.target_class);
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
            <SafeAreaView style={styles.loadingRoot} edges={["top", "bottom"]}>
                <LoadingSpinner message="Loading cadet profile..." />
            </SafeAreaView>
        );
    }

    const selectedClassLabel =
        TARGET_CLASS_OPTIONS.find((o) => o.value === targetClass)?.label || "Select target class";

    return (
        <View style={styles.root}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: 112 + insets.bottom },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Immersive header */}
                    <View style={[styles.header, { paddingTop: insets.top + SPACING[6] }]}>
                        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                            <Svg width="100%" height="100%">
                                <Defs>
                                    <LinearGradient id="profileSetupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor="#2e1065" />
                                        <Stop offset="45%" stopColor="#4338ca" />
                                        <Stop offset="100%" stopColor="#4f46e5" />
                                    </LinearGradient>
                                </Defs>
                                <Rect width="100%" height="100%" fill="url(#profileSetupGrad)" />
                                <Circle cx="92%" cy="8%" r="72" fill="#A78BFA" opacity={0.22} />
                                <Circle cx="18%" cy="18%" r="3" fill="#FDE68A" opacity={0.85} />
                                <Circle cx="72%" cy="28%" r="2" fill="#FFFFFF" opacity={0.55} />
                                <Circle cx="38%" cy="78%" r="3" fill="#DDD6FE" opacity={0.35} />
                            </Svg>
                        </View>

                        <View style={styles.headerRow}>
                            <View style={styles.headerCopy}>
                                <View style={styles.academyPill}>
                                    <MaterialIcon name="shield" size={14} color="#FCD34D" filled />
                                    <Text style={styles.academyPillText}>AISSEE Cadet Academy</Text>
                                </View>
                                <Text style={styles.headerTitle}>
                                    Setup Cadet{"\n"}Profile
                                </Text>
                                <Text style={styles.headerSubtitle}>
                                    Configure your credentials to begin training with Vijay!
                                </Text>
                            </View>
                            <View style={styles.mascotHalo}>
                                <View style={styles.mascotRing}>
                                    <MascotDisplay expression="waving" size={88} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Overlapping form */}
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
                                    <MaterialIcon name="badge" size={22} color={COLORS.textTertiary} />
                                }
                            />
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>
                                Target Class <Text style={styles.required}>*</Text>
                            </Text>
                            <Pressable
                                onPress={() => setClassPickerOpen(true)}
                                style={[
                                    styles.selectField,
                                    errors.targetClass ? styles.selectFieldError : null,
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel="Select target class"
                            >
                                <Text
                                    style={[
                                        styles.selectText,
                                        !targetClass && styles.selectPlaceholder,
                                    ]}
                                >
                                    {selectedClassLabel}
                                </Text>
                                <MaterialIcon name="expand_more" size={22} color={COLORS.textTertiary} />
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
                                    <MaterialIcon name="school" size={22} color={COLORS.textTertiary} />
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
                                style={styles.selectField}
                                accessibilityRole="button"
                                accessibilityLabel="Select dream Sainik School"
                            >
                                <View style={styles.selectWithIcon}>
                                    <MaterialIcon
                                        name="account_balance"
                                        size={22}
                                        color={COLORS.textTertiary}
                                    />
                                    <Text
                                        style={[
                                            styles.selectText,
                                            styles.selectTextFlex,
                                            !dreamSchool && styles.selectPlaceholder,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {dreamSchool || "Select a school"}
                                    </Text>
                                </View>
                                <MaterialIcon name="expand_more" size={22} color={COLORS.textTertiary} />
                            </Pressable>
                            {!!dreamSchool && (
                                <Pressable
                                    onPress={() => setDreamSchool("")}
                                    hitSlop={8}
                                    style={styles.clearDream}
                                >
                                    <Text style={styles.clearDreamText}>Clear selection</Text>
                                </Pressable>
                            )}
                        </View>

                        <View style={styles.fieldBlock}>
                            <Text style={styles.label}>Exam Medium Language</Text>
                            <View style={styles.langRow}>
                                <Pressable
                                    onPress={() => setExamMedium("en")}
                                    style={[
                                        styles.langCard,
                                        examMedium === "en" && styles.langCardSelected,
                                    ]}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: examMedium === "en" }}
                                >
                                    <View
                                        style={[
                                            styles.radioOuter,
                                            examMedium === "en" && styles.radioOuterSelected,
                                        ]}
                                    >
                                        {examMedium === "en" ? <View style={styles.radioInner} /> : null}
                                    </View>
                                    <View style={styles.langCopy}>
                                        <Text
                                            style={[
                                                styles.langTitle,
                                                examMedium === "en" && styles.langTitleSelected,
                                            ]}
                                        >
                                            English Medium
                                        </Text>
                                        <Text style={styles.langSub}>AISSEE standard</Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    onPress={() => setExamMedium("hi")}
                                    style={[
                                        styles.langCard,
                                        examMedium === "hi" && styles.langCardSelected,
                                    ]}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: examMedium === "hi" }}
                                >
                                    <View
                                        style={[
                                            styles.radioOuter,
                                            examMedium === "hi" && styles.radioOuterSelected,
                                        ]}
                                    >
                                        {examMedium === "hi" ? <View style={styles.radioInner} /> : null}
                                    </View>
                                    <View style={styles.langCopy}>
                                        <Text
                                            style={[
                                                styles.langTitle,
                                                examMedium === "hi" && styles.langTitleSelected,
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

                {/* Sticky CTA */}
                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, SPACING[4]) }]}>
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
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalBackdrop} onPress={onClose}>
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
                                    style={[styles.modalOption, selected && styles.modalOptionSelected]}
                                >
                                    <Text
                                        style={[
                                            styles.modalOptionText,
                                            selected && styles.modalOptionTextSelected,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {selected ? (
                                        <MaterialIcon name="check" size={20} color={COLORS.primary} />
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

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#f8f9ff",
    },
    flex: { flex: 1 },
    loadingRoot: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: SPACING[6],
        paddingBottom: SPACING[16],
        overflow: "hidden",
        minHeight: 220,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        zIndex: 1,
    },
    headerCopy: {
        flex: 1,
        paddingBottom: SPACING[2],
        paddingRight: SPACING[2],
    },
    academyPill: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(49, 46, 129, 0.6)",
        borderWidth: 1,
        borderColor: "rgba(129, 140, 248, 0.35)",
        marginBottom: SPACING[2],
    },
    academyPillText: {
        color: "#C7D2FE",
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 10,
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    headerTitle: {
        color: COLORS.textInverse,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        lineHeight: 30,
        letterSpacing: -0.3,
    },
    headerSubtitle: {
        marginTop: SPACING[2],
        color: "rgba(224, 231, 255, 0.92)",
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.xs,
        lineHeight: 18,
        maxWidth: 190,
    },
    mascotHalo: {
        width: 112,
        height: 112,
        alignItems: "center",
        justifyContent: "center",
        marginRight: -4,
        marginBottom: -8,
    },
    mascotRing: {
        width: 104,
        height: 104,
        borderRadius: 52,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.22)",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.45)",
        overflow: "hidden",
    },
    formSheet: {
        flex: 1,
        backgroundColor: COLORS.cardBackground,
        marginTop: -32,
        borderTopLeftRadius: BORDER_RADIUS["3xl"],
        borderTopRightRadius: BORDER_RADIUS["3xl"],
        paddingHorizontal: SPACING[6],
        paddingTop: SPACING[6],
        paddingBottom: SPACING[6],
        gap: SPACING[5],
        shadowColor: "#000",
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
        color: COLORS.textTertiary,
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    required: {
        color: COLORS.error,
    },
    optionalHint: {
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        textTransform: "none",
        letterSpacing: 0,
    },
    selectField: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 52,
        paddingHorizontal: SPACING[4],
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        backgroundColor: COLORS.surfaceMuted,
    },
    selectFieldError: {
        borderColor: COLORS.error,
    },
    selectWithIcon: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[2],
        marginRight: SPACING[2],
    },
    selectText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurface,
    },
    selectTextFlex: {
        flex: 1,
    },
    selectPlaceholder: {
        color: COLORS.textTertiary,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
    },
    errorText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.error,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
    },
    clearDream: {
        alignSelf: "flex-start",
        marginTop: 2,
    },
    clearDreamText: {
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: TYPOGRAPHY.fontSize.xs,
    },
    langRow: {
        flexDirection: "row",
        gap: 10,
    },
    langCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: SPACING[3],
        borderRadius: BORDER_RADIUS["2xl"],
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        backgroundColor: COLORS.cardBackground,
    },
    langCardSelected: {
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: "rgba(70, 72, 212, 0.08)",
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: COLORS.outlineVariant,
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterSelected: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    langCopy: {
        flex: 1,
    },
    langTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurface,
    },
    langTitleSelected: {
        color: COLORS.onPrimaryFixed,
    },
    langSub: {
        marginTop: 2,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: 10,
        color: COLORS.textTertiary,
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: SPACING[6],
        paddingTop: SPACING[4],
        backgroundColor: "rgba(255,255,255,0.96)",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.cardBorder,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 12,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: "flex-end",
    },
    modalSheet: {
        maxHeight: "55%",
        backgroundColor: COLORS.cardBackground,
        borderTopLeftRadius: BORDER_RADIUS["3xl"],
        borderTopRightRadius: BORDER_RADIUS["3xl"],
        paddingHorizontal: SPACING[5],
        paddingTop: SPACING[5],
        paddingBottom: SPACING[8],
    },
    modalTitle: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        marginBottom: SPACING[3],
    },
    modalOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: SPACING[4],
        paddingHorizontal: SPACING[3],
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING[1],
    },
    modalOptionSelected: {
        backgroundColor: COLORS.primaryFixed,
    },
    modalOptionText: {
        flex: 1,
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.onSurface,
        paddingRight: SPACING[2],
    },
    modalOptionTextSelected: {
        color: COLORS.onPrimaryFixed,
        fontFamily: TYPOGRAPHY.fontFamily.bold,
    },
});
