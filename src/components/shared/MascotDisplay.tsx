import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../../constants";
import { MASCOT_IMAGES, MascotExpression } from "../../assets/images";

interface MascotDisplayProps {
    expression?: MascotExpression;
    size?: number;
    showBackground?: boolean;
}

// Emoji fallbacks for mascot expressions
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
    // Aliases
    success: "🎉",
    error: "😢",
    warning: "🤔",
    loading: "🤔",
};

export const MascotDisplay: React.FC<MascotDisplayProps> = ({
    expression = "happy",
    size = 100,
    showBackground = false,
}) => {
    // Get emoji for the expression
    const emoji = MASCOT_EMOJIS[expression] || MASCOT_EMOJIS.happy;

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: showBackground
                        ? COLORS.surfaceContainerLow
                        : "transparent",
                },
            ]}
        >
            <Text style={{ fontSize: size * 0.6 }}>{emoji}</Text>
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
