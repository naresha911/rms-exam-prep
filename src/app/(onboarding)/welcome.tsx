// Welcome Screen — Entry point for onboarding.
// Mirrors the Stitch HTML design with a 3-slide carousel of Cadet Vijay mascot
// images on a rounded card, floating "Maths!"/"G.K." decorative chips, pagination
// dots, and a tactile 3D "Get Started" button.

import React, { useRef, useState, useCallback } from "react";
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
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
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

export default function WelcomeScreen() {
    const router = useRouter();
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
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            <View style={[styles.container, isTablet && styles.containerTablet]}>
                <View style={styles.patternBg} pointerEvents="none" />

                <View style={styles.header}>
                    <View style={styles.logoBadge}>
                        <MaterialIcon
                            name="stars"
                            size={22}
                            color={COLORS.onPrimary}
                            filled
                        />
                    </View>
                    <Text style={styles.brandText}>
                        AISSEE <Text style={styles.brandAccent}>Cadet</Text>
                    </Text>
                </View>

                <Text style={[styles.heroTitle, isTablet && styles.heroTitleTablet]}>
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
                            <View style={styles.slide}>
                                <View style={styles.mascotStage}>
                                    <View style={[styles.chip, styles.chipMaths]}>
                                        <Text style={styles.chipMathsText}>Maths!</Text>
                                    </View>
                                    <View style={[styles.chip, styles.chipGK]}>
                                        <Text style={styles.chipGKText}>G.K.</Text>
                                    </View>
                                    <View style={styles.mascotCard}>
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

                <View style={styles.pagination}>
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

                {/* Explicit CTA — View carries fill so NativeWind can't strip Pressable bg */}
                <Pressable
                    onPress={goToTarget}
                    style={[styles.ctaWrap, isTablet && styles.ctaTablet]}
                    accessibilityLabel="Get Started"
                    accessibilityRole="button"
                >
                    {({ pressed }) => (
                        <View
                            style={[
                                styles.ctaSurface,
                                pressed && styles.ctaSurfacePressed,
                            ]}
                        >
                            <Text style={styles.ctaText}>Get Started</Text>
                            <MaterialIcon
                                name="arrow_forward"
                                size={20}
                                color="#ffffff"
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

const SlideImage: React.FC<{
    expression: MascotExpression;
    emoji: string;
    size: number;
}> = ({ expression, emoji, size }) => {
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const meta = MASCOT_IMAGES[expression] ?? MASCOT_IMAGES.happy;

    if (failed) {
        return (
            <View style={[styles.fallback, { width: size, height: size }]}>
                <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
            </View>
        );
    }

    return (
        <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
            {loading && (
                <View style={[styles.fallback, { width: size, height: size, position: "absolute" }]}>
                    <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 8 }} />
                </View>
            )}
            <Image
                source={meta.url}
                style={{ width: size, height: size }}
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    patternBg: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "transparent",
        opacity: 0.3,
        // Dotted grid via repeating radial dots (approximated with a light wash)
        borderWidth: 0,
    },
    container: {
        flex: 1,
        alignItems: "center",
        width: "100%",
        paddingHorizontal: H_PADDING,
        paddingTop: SPACING[8],
        paddingBottom: SPACING[6],
    },
    containerTablet: {
        maxWidth: 448,
        paddingHorizontal: SPACING["margin-desktop"],
        alignSelf: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING[2],
        minHeight: SPACING["touch-target"],
        marginBottom: SPACING[4],
    },
    logoBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    brandText: {
        fontFamily: TYPOGRAPHY.headlineMd.fontFamily,
        fontSize: TYPOGRAPHY.headlineMd.fontSize,
        lineHeight: TYPOGRAPHY.headlineMd.lineHeight,
        color: COLORS.onSurface,
        fontWeight: TYPOGRAPHY.headlineMd.fontWeight,
        letterSpacing: -0.01,
    },
    brandAccent: {
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fontFamily.extrabold,
        fontWeight: "800",
    },
    heroTitle: {
        fontFamily: TYPOGRAPHY.headlineLgMobile.fontFamily,
        fontSize: TYPOGRAPHY.headlineLgMobile.fontSize,
        lineHeight: TYPOGRAPHY.headlineLgMobile.lineHeight,
        fontWeight: TYPOGRAPHY.headlineLgMobile.fontWeight,
        color: COLORS.onSurface,
        textAlign: "center",
        marginBottom: SPACING[4],
    },
    heroTitleTablet: {
        fontFamily: TYPOGRAPHY.headlineLg.fontFamily,
        fontSize: TYPOGRAPHY.headlineLg.fontSize,
        lineHeight: TYPOGRAPHY.headlineLg.lineHeight,
    },
    heroAccent: {
        color: COLORS.primary,
    },
    heroSubtitle: {
        fontFamily: TYPOGRAPHY.bodyLg.fontFamily,
        fontSize: TYPOGRAPHY.bodyLg.fontSize,
        lineHeight: TYPOGRAPHY.bodyLg.lineHeight,
        fontWeight: TYPOGRAPHY.bodyLg.fontWeight,
        color: COLORS.onSurfaceVariant,
        textAlign: "center",
        marginBottom: SPACING[6],
        maxWidth: 280,
    },
    carouselWrapper: {
        width: "100%",
        height: MASCOT_SIZE + SPACING[12],
    },
    slide: {
        width: SLIDE_WIDTH,
        alignItems: "center",
        justifyContent: "center",
    },
    mascotStage: {
        width: MASCOT_SIZE + SPACING[8],
        height: MASCOT_SIZE + SPACING[8],
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    mascotCard: {
        width: MASCOT_SIZE + SPACING[4],
        height: MASCOT_SIZE + SPACING[4],
        backgroundColor: COLORS.inverseSurface,
        borderRadius: BORDER_RADIUS["2xl"],
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    fallback: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: BORDER_RADIUS.lg,
    },
    chip: {
        position: "absolute",
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[2],
        borderRadius: BORDER_RADIUS.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        zIndex: 20,
    },
    chipMaths: {
        top: 0,
        left: 0,
        backgroundColor: COLORS.surfaceContainerHigh,
        transform: [{ rotate: "-12deg" }],
    },
    chipMathsText: {
        fontFamily: TYPOGRAPHY.labelLg.fontFamily,
        fontSize: TYPOGRAPHY.labelLg.fontSize,
        lineHeight: TYPOGRAPHY.labelLg.lineHeight,
        fontWeight: "700",
        color: COLORS.primary,
    },
    chipGK: {
        top: 48,
        right: 0,
        backgroundColor: COLORS.tertiaryFixed,
        transform: [{ rotate: "6deg" }],
    },
    chipGKText: {
        fontFamily: TYPOGRAPHY.labelLg.fontFamily,
        fontSize: TYPOGRAPHY.labelLg.fontSize,
        lineHeight: TYPOGRAPHY.labelLg.lineHeight,
        fontWeight: "700",
        color: COLORS.tertiary,
    },
    slideMessage: {
        marginTop: SPACING[2],
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurface,
        textAlign: "center",
    },
    slideMessageAccent: {
        color: COLORS.primary,
        fontWeight: "700",
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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
        backgroundColor: COLORS.primary,
    },
    dotInactive: {
        backgroundColor: COLORS.outlineVariant,
    },
    spacer: {
        flex: 1,
    },
    ctaWrap: {
        width: "100%",
    },
    ctaTablet: {
        maxWidth: 384,
        alignSelf: "center",
    },
    // Hardcoded Stitch primary + on-primary so theme always matches design
    ctaSurface: {
        width: "100%",
        minHeight: SPACING["touch-target"],
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING[2],
        backgroundColor: "#4648d4",
        borderRadius: BORDER_RADIUS.xl,
        borderBottomWidth: 4,
        borderBottomColor: "#2f2ebe",
        shadowColor: "#4648d4",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: Platform.OS === "android" ? 6 : 0,
    },
    ctaSurfacePressed: {
        backgroundColor: "#494bd6",
        transform: [{ translateY: 4 }],
        borderBottomWidth: 0,
        marginBottom: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        elevation: Platform.OS === "android" ? 2 : 0,
    },
    ctaText: {
        color: "#ffffff",
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.labelLg.fontSize,
        lineHeight: TYPOGRAPHY.labelLg.lineHeight,
        fontWeight: "700",
        letterSpacing: 0.01,
    },
});
