import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { MaterialIcon, MaterialIconName } from "../../components/ui/MaterialIcon";
import { useAppStore } from "../../store/useAppStore";
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY, normalizeStudentStandard } from "../../constants";

interface StudyCardProps {
  icon: MaterialIconName;
  iconBackground: string;
  iconColor: string;
  iconBorderColor?: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionBackground: string;
  actionColor: string;
  actionBorderColor: string;
  onPress: () => void;
}

function StudyCard({
  icon,
  iconBackground,
  iconColor,
  iconBorderColor,
  title,
  subtitle,
  actionLabel,
  actionBackground,
  actionColor,
  actionBorderColor,
  onPress,
}: StudyCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.studyPressable}
      accessibilityRole="button"
      accessibilityLabel={`${actionLabel} ${title}`}
    >
      {({ pressed }) => (
        <View className="flex-row items-center" style={[styles.studyCard, pressed && styles.pressed]}>
          <View
            style={[
              styles.studyIcon,
              { backgroundColor: iconBackground },
              iconBorderColor ? { borderWidth: 1, borderColor: iconBorderColor } : undefined,
            ]}
          >
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
          <View
            className="flex-row items-center"
            style={[
              styles.studyAction,
              { backgroundColor: actionBackground, borderColor: actionBorderColor },
            ]}
          >
            <Text style={[styles.studyActionText, { color: actionColor }]} maxFontSizeMultiplier={1}>
              {actionLabel}
            </Text>
            <MaterialIcon name="arrow_forward" size={16} color={actionColor} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, onboardingData, lastPracticeActivity } = useAppStore();
  const profileName = user?.full_name?.trim() || "Aarav";
  const firstName = profileName.replace(/^Cadet\s+/i, "").split(" ")[0];
  const displayName = /^Cadet\s/i.test(profileName) ? profileName : `Cadet ${profileName}`;
  const targetClass = normalizeStudentStandard(user?.target_class || onboardingData.targetClass);
  const resumeTitle = lastPracticeActivity?.topicName || "Fractions & Decimals";
  const resumeSubject = lastPracticeActivity?.subjectName || "Mathematics";
  const resumeProgress = lastPracticeActivity?.progress ?? 65;
  const tabBarClearance = 84 + insets.bottom;

  const continueMission = () => {
    if (lastPracticeActivity?.topicId) {
      router.push(`/practice/topic/${lastPracticeActivity.topicId}`);
      return;
    }
    router.push("/(tabs)/practice");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
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
                  <MaterialIcon name="person" size={16} color={COLORS.onSurfaceVariant} />
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
            android_ripple={{ color: COLORS.surfaceContainer, borderless: true, radius: 18 }}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <MaterialIcon name="notifications" size={20} color={COLORS.onSurface} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarClearance }]}
      >
        <View style={styles.hero}>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="heroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#18193A" />
                  <Stop offset="52%" stopColor="#241A5E" />
                  <Stop offset="100%" stopColor="#3C1F8A" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#heroGradient)" />
              <Circle cx="96%" cy="7%" r="78" fill="#A855F7" opacity={0.14} />
              <Circle cx="4%" cy="105%" r="70" fill="#6366F1" opacity={0.2} />
              <Circle cx="72%" cy="62%" r="42" fill="#FBBF24" opacity={0.07} />
            </Svg>
          </View>

          <View className="flex-row items-center" style={styles.missionPill}>
            <MaterialIcon name="military_tech" size={14} color="#FCD34D" filled />
            <Text style={styles.missionPillText}>MISSION CONTROL</Text>
          </View>
          <View className="flex-row items-center" style={styles.heroMain}>
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

        <View style={styles.liveTestCard}>
          <View style={styles.liveCardGlow} />
          <View style={styles.liveTopRow}>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.livePillText}>LIVE ALL-INDIA TEST</Text>
            </View>
            <View style={styles.rankPill}>
              <MaterialIcon name="trending_up" size={13} color="#92400E" />
              <Text style={styles.rankPillText}>Rank Prediction</Text>
            </View>
          </View>
          <Text style={styles.liveTitle}>All-India AISSEE Super Mock #04</Text>
          <Text style={styles.liveDescription}>
            Compete nationwide with 4,800+ cadets taking this test live under real exam rules.
          </Text>
          <View style={styles.metaRow}>
            <MetaPill icon="assignment" color={COLORS.tertiary} label="125 Qs" />
            <MetaPill icon="military_tech" color={COLORS.secondary} label="300 Marks" />
            <MetaPill icon="schedule" color={COLORS.primary} label="150 Mins" />
            <MetaPill icon="stars" color="#B45309" label="+100 XP & Rank" highlighted />
          </View>
          <ActionButton
            label="Enter Live Test"
            variant="amber"
            onPress={() => router.push("/test/full-mock")}
          />
        </View>

        <View style={styles.resumeCard}>
          <View style={styles.resumeAccent} />
          <View style={styles.resumeTopRow}>
            <View style={styles.resumeIcon}>
              <MaterialIcon name="play_circle" size={24} color={COLORS.primary} filled />
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
              <View style={[styles.progressFill, { width: `${resumeProgress}%` }]} />
            </View>
            <ActionButton
              label="Continue Mission"
              variant="primary"
              onPress={continueMission}
            />
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <MaterialIcon name="assignment_turned_in" size={22} color={COLORS.primary} filled />
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.15}>Study & Practice</Text>
        </View>
        <View style={styles.studyList}>
          <StudyCard
            icon="auto_stories"
            iconBackground={COLORS.tertiaryContainer}
            iconColor={COLORS.onTertiaryContainer}
            title="Learn & Chapters"
            subtitle="Syllabus, Chapters & Drills"
            actionLabel="Explore"
            actionBackground={COLORS.surfaceContainer}
            actionColor={COLORS.tertiary}
            actionBorderColor="rgba(153,65,0,0.20)"
            onPress={() => router.push("/(tabs)/practice")}
          />
          <StudyCard
            icon="timer"
            iconBackground={COLORS.primary}
            iconColor={COLORS.onPrimary}
            title="Full Mock Tests"
            subtitle="Timed Exam Simulation"
            actionLabel="Start Test"
            actionBackground={COLORS.primaryFixed}
            actionColor={COLORS.primary}
            actionBorderColor="rgba(70,72,212,0.20)"
            onPress={() => router.push("/test/full-mock")}
          />
          <StudyCard
            icon="history_edu"
            iconBackground={COLORS.secondaryContainer}
            iconColor={COLORS.onSecondaryContainer}
            title="Previous Papers"
            subtitle="2018 - 2024 Solved"
            actionLabel="Solve Now"
            actionBackground={COLORS.secondaryFixed}
            actionColor={COLORS.secondary}
            actionBorderColor="rgba(0,88,190,0.20)"
            onPress={() => router.push("/papers")}
          />
          <StudyCard
            icon="bolt"
            iconBackground="rgba(245,158,11,0.15)"
            iconColor="#B45309"
            iconBorderColor="rgba(245,158,11,0.20)"
            title="Daily Speed Drill"
            subtitle="10 Qs • 5 Mins Rapid Fire"
            actionLabel="Play"
            actionBackground="rgba(245,158,11,0.15)"
            actionColor="#92400E"
            actionBorderColor="rgba(245,158,11,0.30)"
            onPress={() => router.push("/(tabs)/practice")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function MetaPill({
  icon,
  color,
  label,
  highlighted = false,
}: {
  icon: MaterialIconName;
  color: string;
  label: string;
  highlighted?: boolean;
}) {
  return (
    <View style={[styles.metaPill, highlighted && styles.metaPillHighlighted]}>
      <MaterialIcon name={icon} size={13} color={color} filled />
      <Text style={[styles.metaPillText, highlighted && styles.metaPillTextHighlighted]}>{label}</Text>
    </View>
  );
}

function ActionButton({
  label,
  variant,
  onPress,
}: {
  label: string;
  variant: "amber" | "primary";
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.actionPressable}
      android_ripple={{ color: "rgba(255,255,255,0.18)" }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        className="flex-row items-center justify-center"
        style={[
          styles.actionButton,
          variant === "amber" ? styles.actionButtonAmber : styles.actionButtonPrimary,
        ]}
      >
        <Text style={styles.actionButtonText}>{label}</Text>
        <MaterialIcon name="arrow_forward" size={18} color={COLORS.onPrimary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainer,
    zIndex: 20,
  },
  headerInner: {
    height: 56,
    paddingHorizontal: SPACING[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  avatarOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainer,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 2,
    flexGrow: 0,
    flexShrink: 0,
    ...SHADOWS.sm,
  },
  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceContainerLow,
  },
  avatarImage: { width: 28, height: 28, borderRadius: 14 },
  headerTextWrap: { flex: 1, minWidth: 0, marginLeft: 10 },
  headerName: {
    color: COLORS.onSurface,
    fontFamily: TYPOGRAPHY.fontFamily.extrabold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.2,
    includeFontPadding: false,
  },
  headerClass: {
    color: COLORS.onSurfaceVariant,
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
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 0,
    flexShrink: 0,
    ...SHADOWS.sm,
  },
  scrollContent: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    gap: SPACING[5],
  },
  hero: {
    borderRadius: BORDER_RADIUS["3xl"],
    paddingHorizontal: SPACING[5],
    paddingTop: SPACING[6],
    paddingBottom: SPACING[5],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "#241A5E",
  },
  missionPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  missionPillText: {
    color: COLORS.onPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  heroMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  heroCopy: { flex: 1, minWidth: 0, zIndex: 1, paddingRight: 12 },
  heroTitle: {
    color: COLORS.onPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.extrabold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  heroTitleAccent: { color: "#FDE68A" },
  heroSubtitle: {
    color: "#C7D2FE",
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
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 4,
  },
  liveTestCard: {
    position: "relative",
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.30)",
    backgroundColor: "#FFFBEB",
    padding: SPACING[4],
    gap: 12,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  liveCardGlow: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: 56,
    right: -32,
    top: -32,
    backgroundColor: "rgba(245,158,11,0.10)",
  },
  liveTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.18)",
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  livePillText: {
    color: COLORS.error,
    fontFamily: TYPOGRAPHY.fontFamily.extrabold,
    fontSize: 10,
    letterSpacing: 0.7,
  },
  rankPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: "rgba(245,158,11,0.14)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.28)",
  },
  rankPillText: {
    color: "#92400E",
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 10,
  },
  liveTitle: {
    color: COLORS.onSurface,
    fontFamily: TYPOGRAPHY.fontFamily.extrabold,
    fontSize: 17,
    lineHeight: 22,
  },
  liveDescription: {
    color: COLORS.onSurfaceVariant,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainer,
  },
  metaPillHighlighted: {
    backgroundColor: "rgba(245,158,11,0.14)",
    borderColor: "rgba(245,158,11,0.22)",
  },
  metaPillText: {
    color: COLORS.onSurfaceVariant,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: 10,
  },
  metaPillTextHighlighted: { color: "#92400E", fontFamily: TYPOGRAPHY.fontFamily.bold },
  actionPressable: { width: "100%" },
  actionButton: {
    width: "100%",
    height: 44,
    minHeight: 44,
    borderRadius: BORDER_RADIUS.full,
    borderBottomWidth: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING[5],
  },
  actionButtonAmber: {
    backgroundColor: "#92400E",
    borderBottomColor: "#783200",
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderBottomColor: COLORS.onPrimaryFixedVariant,
  },
  actionButtonText: {
    color: COLORS.onPrimary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 15,
  },
  resumeCard: {
    position: "relative",
    padding: SPACING[4],
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainer,
    backgroundColor: COLORS.surfaceContainerLowest,
    gap: 14,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  resumeAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: COLORS.primary,
  },
  resumeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 8,
  },
  resumeIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryFixed,
  },
  resumeCopy: { flex: 1 },
  resumeLabel: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  resumeTitle: {
    color: COLORS.onSurface,
    fontFamily: TYPOGRAPHY.fontFamily.extrabold,
    fontSize: 16,
    marginTop: 2,
  },
  resumeProgress: {
    color: COLORS.onSurfaceVariant,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
  resumeBottom: { paddingLeft: 8, gap: 10 },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: BORDER_RADIUS.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.onSurface,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 19,
  },
  studyList: { width: "100%", paddingBottom: 8 },
  studyPressable: { width: "100%", marginBottom: 12 },
  studyCard: {
    width: "100%",
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING[4],
    borderWidth: 1,
    borderColor: COLORS.surfaceContainer,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.sm,
  },
  studyIcon: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "center",
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
    color: COLORS.onSurface,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
    includeFontPadding: false,
  },
  studySubtitle: {
    color: COLORS.onSurfaceVariant,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    includeFontPadding: false,
  },
  studyAction: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 14,
    paddingRight: 12,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    flexGrow: 0,
    flexShrink: 0,
  },
  studyActionText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
    marginRight: 4,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
});


