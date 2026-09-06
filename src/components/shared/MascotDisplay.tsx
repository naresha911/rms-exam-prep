// MascotDisplay — renders the Cadet Vijay mascot (Indian Army kid) image.
// Uses local bundled assets from src/assets/images. When loading fails we
// fall back to an emoji so the UI is never broken.

import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../../constants";
import { MASCOT_IMAGES, MascotExpression } from "../../assets/images";

interface MascotDisplayProps {
    expression?: MascotExpression;
    size?: number;
    showBackground?: boolean;
    style?: any;
}

// Aliases for expression → asset
const EXPRESSION_ALIASES: Record<string, MascotExpression> = {
    success: "celebrating",
    error: "sad",
    warning: "thinking",
    loading: "thinking",
    hello: "waving",
};

const MASCOT_EMOJIS: Record<string, string> = {
    waving: "👋",
    happy: "😊",
    studying: "📚",
    thinking: "🤔",
    encouraging: "👍",
    victory: "🏆",
    celebrating: "🎉",
    surprised: "😮",
    sad: "😢",
};

export const MascotDisplay: React.FC<MascotDisplayProps> = ({
    expression = "happy",
    size = 100,
    showBackground = false,
    style,
}) => {
    const [failed, setFailed] = useState(false);
    const resolved: MascotExpression = EXPRESSION_ALIASES[expression] ?? expression;
    const meta = MASCOT_IMAGES[resolved] ?? MASCOT_IMAGES.happy;

    if (failed) {
        const emoji = MASCOT_EMOJIS[resolved] || MASCOT_EMOJIS.happy;
        return (
            <View
                style={[
                    styles.container,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: showBackground ? COLORS.surfaceContainerLow : "transparent",
                    },
                    style,
                ]}
            >
                <Text style={{ fontSize: size * 0.6 }}>{emoji}</Text>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    backgroundColor: showBackground ? COLORS.surfaceContainerLow : "transparent",
                },
                style,
            ]}
        >
            <Image
                source={meta.url}
                style={{ width: size, height: size }}
                resizeMode="contain"
                onError={() => setFailed(true)}
                accessibilityLabel={meta.alt}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});

export default MascotDisplay;
