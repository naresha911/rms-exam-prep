// Welcome Screen — Entry point for onboarding.
// Mirrors the Stitch HTML design with a 3-slide carousel of Cadet Vijay mascot
// images on a rounded card, floating "Maths!"/"G.K." decorative chips, pagination
// dots, and a tactile 3D "Get Started" button.

import React, { useRef, useState, useCallback, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Image,
    ActivityIndicator,
    Pressable,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";
import { MASCOT_IMAGES, MascotExpression } from "../../assets/images";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PADDING = SPACING["margin-mobile"];
const SLIDE_WIDTH = SCREEN_WIDTH - H_PADDING * 2;

const SLIDES: ReadonlyArray<{
    id: string;
    expression: MascotExpression;
    emoji: string;
    message: string;
    highlight: string;
}> = [
    {
        id: "waving",
        expression: "waving",
        emoji: "👋",
        message: "Meet your guide",
        highlight: "Cadet Vijay",
    },
    {
        id: "studying",
        expression: "studying",
        emoji: "📚",
        message: "Practice every day",
        highlight: "Stay sharp",
    },
    {
        id: "celebrating",
        expression: "celebrating",
        emoji: "🎉",
        message: "Get exam ready",
        highlight: "with confidence",
    },
];

const MASCOT_SIZE = 240;

function createStyles(colors: ColorPalette) {
    return {
        safeArea: {
            backgroundColor: colors.surface,
        },
        patternBg: {
            backgroundColor: "transparent",
            opacity: 0.3,
            borderWidth: 0,
        },
        container: {
            alignItems: "center" as const,
            width: "100%" as const,
            paddingHorizontal: H_PADDING,
            paddingTop: SPACING[8],
            paddingBottom: SPACING[6],
        },
        containerTablet: {
            maxWidth: 448,
            paddingHorizontal: SPACING["margin-desktop"],
            alignSelf: "center" as const,
        },
        header: {
            justifyContent: "center" as const,
            gap: SPACING[2],
            minHeight: SPACING["touch-target"],
            marginBottom: SPACING[4],
        },
        logoBadge: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.primary,
        },
        brandText: {
            fontFamily: TYPOGRAPHY.headlineMd.fontFamily,
            fontSize: TYPOGRAPHY.headlineMd.fontSize,
            lineHeight: TYPOGRAPHY.headlineMd.lineHeight,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.headlineMd.fontWeight,
            letterSpacing: -0.01,
        },
        brandAccent: {
            color: colors.primary,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            fontWeight: "800" as const,
        },
        heroTitle: {
            fontFamily: TYPOGRAPHY.headlineLgMobile.fontFamily,
            fontSize: TYPOGRAPHY.headlineLgMobile.fontSize,
            lineHeight: TYPOGRAPHY.headlineLgMobile.lineHeight,
            fontWeight: TYPOGRAPHY.headlineLgMobile.fontWeight,
            color: colors.onSurface,
            textAlign: "center" as const,
            marginBottom: SPACING[4],
        },
        heroTitleTablet: {
            fontFamily: TYPOGRAPHY.headlineLg.fontFamily,
            fontSize: TYPOGRAPHY.headlineLg.fontSize,
            lineHeight: TYPOGRAPHY.headlineLg.lineHeight,
        },
        heroAccent: {
            color: colors.primary,
        },
        heroSubtitle: {
            fontFamily: TYPOGRAPHY.bodyLg.fontFamily,
            fontSize: TYPOGRAPHY.bodyLg.fontSize,
            lineHeight: TYPOGRAPHY.bodyLg.lineHeight,
            fontWeight: TYPOGRAPHY.bodyLg.fontWeight,
            color: colors.onSurfaceVariant,
            textAlign: "center" as const,
            marginBottom: SPACING[6],
            maxWidth: 280,
        },
        carouselWrapper: {
            width: "100%" as const,
            height: MASCOT_SIZE + SPACING[12],
        },
        slide: {
            width: SLIDE_WIDTH,
        },
        mascotStage: {
            width: MASCOT_SIZE + SPACING[8],
            height: MASCOT_SIZE + SPACING[8],
            position: "relative" as const,
        },
        mascotCard: {
            width: MASCOT_SIZE + SPACING[4],
            height: MASCOT_SIZE + SPACING[4],
            backgroundColor: colors.inverseSurface,
            borderRadius: BORDER_RADIUS["2xl"],
            overflow: "hidden" as const,
            shadowColor: colors.overlay,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
        fallback: {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: BORDER_RADIUS.lg,
        },
        fallbackOverlay: {
            position: "absolute" as const,
        },
        loader: {
            marginTop: 8,
        },
        chip: {
            position: "absolute" as const,
            paddingHorizontal: SPACING[3],
            paddingVertical: SPACING[2],
            borderRadius: BORDER_RADIUS.lg,
            shadowColor: colors.overlay,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            zIndex: 20,
        },
        chipMaths: {
            top: 0,
            left: 0,
            backgroundColor: colors.surfaceContainerHigh,
            transform: [{ rotate: "-12deg" }],
        },
        chipMathsText: {
            fontFamily: TYPOGRAPHY.labelLg.fontFamily,
            fontSize: TYPOGRAPHY.labelLg.fontSize,
            lineHeight: TYPOGRAPHY.labelLg.lineHeight,
            fontWeight: "700" as const,
            color: colors.primary,
        },
        chipGK: {
            top: 48,
            right: 0,
            backgroundColor: colors.tertiaryFixed,
            transform: [{ rotate: "6deg" }],
        },
        chipGKText: {
            fontFamily: TYPOGRAPHY.labelLg.fontFamily,
            fontSize: TYPOGRAPHY.labelLg.fontSize,
            lineHeight: TYPOGRAPHY.labelLg.lineHeight,
            fontWeight: "700" as const,
            color: colors.tertiary,
        },
        slideMessage: {
            marginTop: SPACING[2],
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurface,
            textAlign: "center" as const,
        },
        slideMessageAccent: {
            color: colors.primary,
            fontWeight: "700" as const,
        },
        pagination: {
            justifyContent: "center" as const,
            gap: SPACING[2],
            marginTop: SPACING[4],
            marginBottom: SPACING[4],
        },
        dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
        },
        dotActive: {
            backgroundColor: colors.primary,
        },
        dotInactive: {
            backgroundColor: colors.outlineVariant,
        },
        spacer: {
            flex: 1,
        },
        ctaWrap: {
            width: "100%" as const,
        },
        ctaTablet: {
            maxWidth: 384,
            alignSelf: "center" as const,
        },
        ctaSurface: {
            width: "100%" as const,
            minHeight: SPACING["touch-target"],
            height: 56,
            gap: SPACING[2],
            backgroundColor: colors.primary,
            borderRadius: BORDER_RADIUS.xl,
            borderBottomWidth: 4,
            borderBottomColor: colors.onPrimaryFixedVariant,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: Platform.OS === "android" ? 6 : 0,
        },
        ctaSurfacePressed: {
            backgroundColor: colors.surfaceTint,
            transform: [{ translateY: 4 }],
            borderBottomWidth: 0,
            marginBottom: 4,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            elevation: Platform.OS === "android" ? 2 : 0,
        },
        ctaText: {
            color: colors.onPrimary,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.labelLg.fontSize,
            lineHeight: TYPOGRAPHY.labelLg.lineHeight,
            fontWeight: "700" as const,
            letterSpacing: 0.01,
        },
    };
}

const SlideImage: React.FC<{
    expression: MascotExpression;
    emoji: string;
    size: number;
}> = ({ expression, emoji, size }) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const meta = MASCOT_IMAGES[expression] ?? MASCOT_IMAGES.happy;
    const sized = useMemo(
        () =>
            StyleSheet.create({
                box: { width: size, height: size },
                frame: { width: size, height: size },
                emoji: { fontSize: size * 0.55 },
                image: { width: size, height: size },
            }),
        [size]
    );

    if (failed) {
        return (
            <View style={[layout.center, styles.fallback, sized.box]}>
                <Text style={sized.emoji}>{emoji}</Text>
            </View>
        );
    }

    return (
        <View style={[layout.center, sized.frame]}>
            {loading ? (
                <View style={[layout.center, styles.fallback, styles.fallbackOverlay, sized.box]}>
                    <Text style={sized.emoji}>{emoji}</Text>
                    <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
                </View>
            ) : null}
            <Image
                source={meta.url}
                style={sized.image}
                resizeMode="contain"
                onLoad={() => setLoading(false)}
                onError={() => {
                    setFailed(true);
                    setLoading(false);
                }}
                accessibilityLabel={meta.alt}
            />
        </View>
    );
};

export default function WelcomeScreen() {
    const router = useRouter();
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef<FlatList>(null);

    const onMomentumScrollEnd = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const page = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
            setActiveIndex(Math.min(Math.max(page, 0), SLIDES.length - 1));
        },
        [],
    );

    const goToTarget = useCallback(() => {
        router.push("/(onboarding)/target-class");
    }, [router]);

    const isTablet = SCREEN_WIDTH >= 768;
    const activeSlide = SLIDES[activeIndex];

    return (
        <SafeAreaView style={[layout.fill, styles.safeArea]} edges={["top", "bottom"]}>
            <View style={[layout.fill, styles.container, isTablet ? styles.containerTablet : null]}>
                <View style={[StyleSheet.absoluteFill, styles.patternBg]} pointerEvents="none" />

                <View style={[layout.row, styles.header]}>
                    <View style={[layout.center, styles.logoBadge]}>
                        <MaterialIcon
                            name="stars"
                            size={22}
                            color={colors.onPrimary}
                            filled
                        />
                    </View>
                    <Text style={styles.brandText}>
                        AISSEE <Text style={styles.brandAccent}>Cadet</Text>
                    </Text>
                </View>

                <Text style={[styles.heroTitle, isTablet ? styles.heroTitleTablet : null]}>
                    Your Sainik School{"\n"}
                    journey starts <Text style={styles.heroAccent}>here!</Text>
                </Text>
                <Text style={styles.heroSubtitle}>
                    Learn smarter. Practice every day. Get exam ready.
                </Text>

                <View style={styles.carouselWrapper}>
                    <FlatList
                        ref={carouselRef}
                        data={SLIDES as unknown as (typeof SLIDES)[number][]}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={SLIDE_WIDTH}
                        decelerationRate="fast"
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        getItemLayout={(_, index) => ({
                            length: SLIDE_WIDTH,
                            offset: SLIDE_WIDTH * index,
                            index,
                        })}
                        renderItem={({ item }) => (
                            <View style={[layout.center, styles.slide]}>
                                <View style={[layout.center, styles.mascotStage]}>
                                    <View style={[styles.chip, styles.chipMaths]}>
                                        <Text style={styles.chipMathsText}>Maths!</Text>
                                    </View>
                                    <View style={[styles.chip, styles.chipGK]}>
                                        <Text style={styles.chipGKText}>G.K.</Text>
                                    </View>
                                    <View style={[layout.center, styles.mascotCard]}>
                                        <SlideImage
                                            expression={item.expression}
                                            emoji={item.emoji}
                                            size={MASCOT_SIZE}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>

                <Text style={styles.slideMessage}>
                    {activeSlide.message}
                    <Text style={styles.slideMessageAccent}>
                        {" "}
                        {activeSlide.highlight}
                    </Text>
                </Text>

                <View style={[layout.row, styles.pagination]}>
                    {SLIDES.map((s, i) => (
                        <View
                            key={s.id}
                            style={[
                                styles.dot,
                                i === activeIndex ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.spacer} />

                <Pressable
                    onPress={goToTarget}
                    style={[styles.ctaWrap, isTablet ? styles.ctaTablet : null]}
                    accessibilityLabel="Get Started"
                    accessibilityRole="button"
                >
                    {({ pressed }) => (
                        <View
                            style={[
                                layout.row,
                                layout.center,
                                styles.ctaSurface,
                                pressed ? styles.ctaSurfacePressed : null,
                            ]}
                        >
                            <Text style={styles.ctaText}>Get Started</Text>
                            <MaterialIcon
                                name="arrow_forward"
                                size={20}
                                color={colors.onPrimary}
                                weight={700}
                                filled
                            />
                        </View>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
