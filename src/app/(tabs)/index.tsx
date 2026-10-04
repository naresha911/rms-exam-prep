import { useMemo } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { MaterialIcon, MaterialIconName } from "../../components/ui/MaterialIcon";
import { useAppStore } from "../../store/useAppStore";
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { BORDER_RADIUS, SHADOWS, SPACING, TYPOGRAPHY, normalizeStudentStandard } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";

type StudyVariant = "mocks" | "papers" | "drill";

const STUDY_ICON = {
  mocks: "studyIconMocks",
  papers: "studyIconPapers",
  drill: "studyIconDrill",
} as const;

const STUDY_ACTION = {
  mocks: "studyActionMocks",
  papers: "studyActionPapers",
  drill: "studyActionDrill",
} as const;

const STUDY_ACTION_TEXT = {
  mocks: "studyActionTextMocks",
  papers: "studyActionTextPapers",
  drill: "studyActionTextDrill",
} as const;

const STUDY_ICON_COLOR = {
  mocks: "onPrimary",
  papers: "onSecondaryContainer",
  drill: "amberText",
} as const;

const STUDY_ACTION_COLOR = {
  mocks: "primary",
  papers: "secondary",
  drill: "warningText",
} as const;

interface StudyCardProps {
  variant: StudyVariant;
  icon: MaterialIconName;
  title: string;
  subtitle: string;
  actionLabel: string;
  onPress: () => void;
}

function createStyles(colors: ColorPalette) {
  return {
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainer,
      zIndex: 20,
    },
    headerInner: {
      height: 56,
      paddingHorizontal: SPACING[4],
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    profileButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      flex: 1,
      minWidth: 0,
      marginRight: 12,
    },
    avatarOuter: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.surfaceContainer,
      backgroundColor: colors.surfaceContainerLow,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      overflow: "hidden" as const,
      padding: 2,
      flexGrow: 0,
      flexShrink: 0,
      ...SHADOWS.sm,
    },
    avatarFallback: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: colors.surfaceContainerLow,
    },
    avatarImage: { width: 28, height: 28, borderRadius: 14 },
    headerTextWrap: { flex: 1, minWidth: 0, marginLeft: 10 },
    headerName: {
      color: colors.onSurface,
      fontFamily: TYPOGRAPHY.fontFamily.extrabold,
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: -0.2,
      includeFontPadding: false,
    },
    headerClass: {
      color: colors.onSurfaceVariant,
      fontFamily: TYPOGRAPHY.fontFamily.medium,
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 0.3,
      includeFontPadding: false,
    },
    notificationButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: colors.surfaceContainer,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexGrow: 0,
      flexShrink: 0,
      ...SHADOWS.sm,
    },
    scrollContent: {
      width: "100%" as const,
      maxWidth: 720,
      alignSelf: "center" as const,
      paddingHorizontal: SPACING[4],
      paddingTop: SPACING[2],
      gap: SPACING[5],
    },
    hero: {
      borderRadius: BORDER_RADIUS["3xl"],
      paddingHorizontal: SPACING[5],
      paddingTop: SPACING[6],
      paddingBottom: SPACING[5],
      overflow: "hidden" as const,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      backgroundColor: colors.onPrimaryFixedVariant,
    },
    missionPill: {
      alignSelf: "flex-start" as const,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.primaryLight,
    },
    missionPillText: {
      color: colors.onPrimary,
      fontFamily: TYPOGRAPHY.fontFamily.bold,
      fontSize: 11,
      letterSpacing: 0.8,
    },
    heroMain: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      paddingTop: 12,
    },
    heroCopy: { flex: 1, minWidth: 0, zIndex: 1, paddingRight: 12 },
    heroTitle: {
      color: colors.onPrimaryContainer,
      fontFamily: TYPOGRAPHY.fontFamily.extrabold,
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.4,
    },
    heroTitleAccent: { color: colors.xpGold },
    heroSubtitle: {
      color: colors.primaryLight,
      fontFamily: TYPOGRAPHY.fontFamily.medium,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 8,
    },
    mascotFrame: {
      width: 88,
      height: 88,
      flexGrow: 0,
      flexShrink: 0,
      borderRadius: BORDER_RADIUS.xl,
      backgroundColor: colors.primaryFixed,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      overflow: "hidden" as const,
      padding: 4,
    },
    actionPressable: { width: "100%" as const },
    actionButton: {
      width: "100%" as const,
      height: 44,
      minHeight: 44,
      borderRadius: BORDER_RADIUS.full,
      borderBottomWidth: 3,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: SPACING[5],
    },
    actionButtonPrimary: {
      backgroundColor: colors.primary,
      borderBottomColor: colors.onPrimaryFixedVariant,
    },
    actionButtonText: {
      color: colors.onPrimary,
      fontFamily: TYPOGRAPHY.fontFamily.bold,
      fontSize: 15,
    },
    resumeCard: {
      position: "relative" as const,
      padding: SPACING[4],
      borderRadius: BORDER_RADIUS.xl,
      borderWidth: 1,
      borderColor: colors.surfaceContainer,
      backgroundColor: colors.surfaceContainerLowest,
      gap: 14,
      overflow: "hidden" as const,
      ...SHADOWS.sm,
    },
    resumeAccent: {
      position: "absolute" as const,
      left: 0,
      top: 0,
      bottom: 0,
      width: 6,
      backgroundColor: colors.primary,
    },
    resumeTopRow: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
      paddingLeft: 8,
    },
    resumeIcon: {
      width: 44,
      height: 44,
      borderRadius: BORDER_RADIUS.lg,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      backgroundColor: colors.primaryFixed,
    },
    resumeCopy: { flex: 1 },
    resumeLabel: {
      color: colors.primary,
      fontFamily: TYPOGRAPHY.fontFamily.bold,
      fontSize: 10,
      letterSpacing: 0.8,
    },
    resumeTitle: {
      color: colors.onSurface,
      fontFamily: TYPOGRAPHY.fontFamily.extrabold,
      fontSize: 16,
      marginTop: 2,
    },
    resumeProgress: {
      color: colors.onSurfaceVariant,
      fontFamily: TYPOGRAPHY.fontFamily.regular,
      fontSize: 12,
      marginTop: 2,
    },
    resumeBottom: { paddingLeft: 8, gap: 10 },
    progressTrack: {
      height: 6,
      backgroundColor: colors.surfaceContainer,
      borderRadius: BORDER_RADIUS.full,
      overflow: "hidden" as const,
    },
    progressFill: {
      height: "100%" as const,
      backgroundColor: colors.primary,
      borderRadius: BORDER_RADIUS.full,
    },
    sectionHeading: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 8,
    },
    sectionTitle: {
      color: colors.onSurface,
      fontFamily: TYPOGRAPHY.fontFamily.bold,
      fontSize: 19,
    },
    studyList: { width: "100%" as const, paddingBottom: 8 },
    studyPressable: { width: "100%" as const, marginBottom: 12 },
    studyCard: {
      width: "100%" as const,
      backgroundColor: colors.surfaceContainerLowest,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING[4],
      borderWidth: 1,
      borderColor: colors.surfaceContainer,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      ...SHADOWS.sm,
    },
    studyIcon: {
      width: 52,
      height: 52,
      borderRadius: BORDER_RADIUS.xl,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: "center" as const,
    },
    studyIconMocks: { backgroundColor: colors.primary },
    studyIconPapers: { backgroundColor: colors.secondaryContainer },
    studyIconDrill: {
      backgroundColor: colors.warningLight,
      borderWidth: 1,
      borderColor: colors.warning,
    },
    studyCopy: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 0,
      marginLeft: 14,
      marginRight: 12,
    },
    studyTitle: {
      color: colors.onSurface,
      fontFamily: TYPOGRAPHY.fontFamily.bold,
      fontSize: 15,
      lineHeight: 20,
      includeFontPadding: false,
    },
    studySubtitle: {
      color: colors.onSurfaceVariant,
      fontFamily: TYPOGRAPHY.fontFamily.regular,
      fontSize: 12,
      lineHeight: 16,
      marginTop: 2,
      includeFontPadding: false,
    },
    studyAction: {
      height: 36,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingLeft: 14,
      paddingRight: 12,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1,
      flexGrow: 0,
      flexShrink: 0,
    },
    studyActionMocks: {
      backgroundColor: colors.primaryFixed,
      borderColor: colors.primaryFixedDim,
    },
    studyActionPapers: {
      backgroundColor: colors.secondaryFixed,
      borderColor: colors.secondaryFixedDim,
    },
    studyActionDrill: {
      backgroundColor: colors.warningLight,
      borderColor: colors.warning,
    },
    studyActionText: {
      fontFamily: TYPOGRAPHY.fontFamily.bold,
      fontSize: 12,
      lineHeight: 16,
      includeFontPadding: false,
      marginRight: 4,
    },
    studyActionTextMocks: { color: colors.primary },
    studyActionTextPapers: { color: colors.secondary },
    studyActionTextDrill: { color: colors.warningText },
  };
}

function StudyCard({
  variant,
  icon,
  title,
  subtitle,
  actionLabel,
  onPress,
}: StudyCardProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const iconColor = colors[STUDY_ICON_COLOR[variant]];
  const actionColor = colors[STUDY_ACTION_COLOR[variant]];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.studyPressable, pressed ? layout.pressed : null]}
      accessibilityRole="button"
      accessibilityLabel={`${actionLabel} ${title}`}
    >
      <View style={styles.studyCard}>
        <View style={[styles.studyIcon, styles[STUDY_ICON[variant]]]}>
          <MaterialIcon name={icon} size={26} color={iconColor} filled />
        </View>
        <View style={styles.studyCopy}>
          <Text style={styles.studyTitle} numberOfLines={1} maxFontSizeMultiplier={1.15}>
            {title}
          </Text>
          <Text style={styles.studySubtitle} numberOfLines={1} maxFontSizeMultiplier={1.15}>
            {subtitle}
          </Text>
        </View>
        <View style={[styles.studyAction, styles[STUDY_ACTION[variant]]]}>
          <Text style={[styles.studyActionText, styles[STUDY_ACTION_TEXT[variant]]]} maxFontSizeMultiplier={1}>
            {actionLabel}
          </Text>
          <MaterialIcon name="arrow_forward" size={16} color={actionColor} />
        </View>
      </View>
    </Pressable>
  );
}

function ActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={styles.actionPressable}
      android_ripple={{ color: colors.onPrimary }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.actionButton, styles.actionButtonPrimary]}>
        <Text style={styles.actionButtonText}>{label}</Text>
        <MaterialIcon name="arrow_forward" size={18} color={colors.onPrimary} />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const { user, onboardingData, lastPracticeActivity } = useAppStore();
  const profileName = user?.full_name?.trim() || "Aarav";
  const firstName = profileName.replace(/^Cadet\s+/i, "").split(" ")[0];
  const displayName = /^Cadet\s/i.test(profileName) ? profileName : `Cadet ${profileName}`;
  const targetClass = normalizeStudentStandard(user?.target_class || onboardingData.targetClass);
  const resumeTitle = lastPracticeActivity?.topicName || "Fractions & Decimals";
  const resumeSubject = lastPracticeActivity?.subjectName || "Mathematics";
  const resumeProgress = lastPracticeActivity?.progress ?? 65;
  const tabBarClearance = 84 + insets.bottom;
  const progressWidth = useMemo(
    () => StyleSheet.create({ fill: { width: `${resumeProgress}%` } }).fill,
    [resumeProgress],
  );
  const headerOffset = useMemo(
    () => StyleSheet.create({ pad: { paddingTop: insets.top } }).pad,
    [insets.top],
  );
  const scrollOffset = useMemo(
    () => StyleSheet.create({ pad: { paddingBottom: tabBarClearance } }).pad,
    [tabBarClearance],
  );

  const continueMission = () => {
    if (lastPracticeActivity?.topicId) {
      router.push(`/practice/topic/${lastPracticeActivity.topicId}`);
      return;
    }
    router.push("/(tabs)/practice");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, headerOffset]}>
        <View style={styles.headerInner}>
          <Pressable
            onPress={() => router.push("/(tabs)/me")}
            style={styles.profileButton}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <View style={styles.avatarOuter}>
              {user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <MaterialIcon name="person" size={16} color={colors.onSurfaceVariant} />
                </View>
              )}
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerName} numberOfLines={1} maxFontSizeMultiplier={1.15}>
                {displayName}
              </Text>
              <Text style={styles.headerClass} numberOfLines={1} maxFontSizeMultiplier={1.15}>
                Class {targetClass}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={styles.notificationButton}
            android_ripple={{ color: colors.surfaceContainer, borderless: true, radius: 18 }}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <MaterialIcon name="notifications" size={20} color={colors.onSurface} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, scrollOffset]}
      >
        <View style={styles.hero}>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="heroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={colors.onPrimaryFixedVariant} />
                  <Stop offset="52%" stopColor={colors.primaryContainer} />
                  <Stop offset="100%" stopColor={colors.gradientEnd} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#heroGradient)" />
              <Circle cx="96%" cy="7%" r="78" fill={colors.gradientEnd} opacity={0.14} />
              <Circle cx="4%" cy="105%" r="70" fill={colors.gradientStart} opacity={0.2} />
              <Circle cx="72%" cy="62%" r="42" fill={colors.xpGold} opacity={0.07} />
            </Svg>
          </View>

          <View style={styles.missionPill}>
            <MaterialIcon name="military_tech" size={14} color={colors.xpGold} filled />
            <Text style={styles.missionPillText}>MISSION CONTROL</Text>
          </View>
          <View style={styles.heroMain}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>
                Welcome back,{"\n"}
                <Text style={styles.heroTitleAccent}>Cadet {firstName}!</Text> 🇮🇳
              </Text>
              <Text style={styles.heroSubtitle}>
                Your Sainik School journey continues today. Stay focused!
              </Text>
            </View>
            <View style={styles.mascotFrame}>
              <MascotDisplay expression="studying" size={80} />
            </View>
          </View>
        </View>

        <View style={styles.resumeCard}>
          <View style={styles.resumeAccent} />
          <View style={styles.resumeTopRow}>
            <View style={styles.resumeIcon}>
              <MaterialIcon name="play_circle" size={24} color={colors.primary} filled />
            </View>
            <View style={styles.resumeCopy}>
              <Text style={styles.resumeLabel}>CONTINUE YOUR MISSION</Text>
              <Text style={styles.resumeTitle} numberOfLines={1}>{resumeTitle}</Text>
              <Text style={styles.resumeProgress} numberOfLines={1}>
                {resumeSubject} • Unit 3 Practice ({resumeProgress}% Complete)
              </Text>
            </View>
          </View>
          <View style={styles.resumeBottom}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, progressWidth]} />
            </View>
            <ActionButton
              label="Continue Mission"
              onPress={continueMission}
            />
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <MaterialIcon name="assignment_turned_in" size={22} color={colors.primary} filled />
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.15}>Study & Practice</Text>
        </View>
        <View style={styles.studyList}>
          <StudyCard
            variant="mocks"
            icon="timer"
            title="Full Mock Tests"
            subtitle="Timed Exam Simulation"
            actionLabel="Start Test"
            onPress={() => router.push("/test" as Href)}
          />
          <StudyCard
            variant="papers"
            icon="history_edu"
            title="Previous Papers"
            subtitle="2018 - 2024 Solved"
            actionLabel="Solve Now"
            onPress={() => router.push("/papers")}
          />
          <StudyCard
            variant="drill"
            icon="bolt"
            title="Daily Speed Drill"
            subtitle="10 Qs • 5 Mins Rapid Fire"
            actionLabel="Play"
            onPress={() => router.push("/(tabs)/practice")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
