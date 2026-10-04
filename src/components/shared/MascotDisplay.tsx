// MascotDisplay — renders the Cadet Vijay mascot (Indian Army kid) image.
// Uses local bundled assets from src/assets/images. When loading fails we
// fall back to an emoji so the UI is never broken.

import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MASCOT_IMAGES, MascotExpression } from '../../assets/images';
import { layout, useColors } from '../../theme';

interface MascotDisplayProps {
    expression?: MascotExpression;
    size?: number;
    showBackground?: boolean;
    style?: any;
}

// Aliases for expression → asset
const EXPRESSION_ALIASES: Record<string, MascotExpression> = {
    success: 'celebrating',
    error: 'sad',
    warning: 'thinking',
    loading: 'thinking',
    hello: 'waving',
};

const MASCOT_EMOJIS: Record<string, string> = {
    waving: '👋',
    happy: '😊',
    studying: '📚',
    thinking: '🤔',
    encouraging: '👍',
    victory: '🏆',
    celebrating: '🎉',
    surprised: '😮',
    sad: '😢',
};

export const MascotDisplay: React.FC<MascotDisplayProps> = ({
    expression = 'happy',
    size = 100,
    showBackground = false,
    style,
}) => {
    const colors = useColors();
    const [failed, setFailed] = useState(false);
    const resolved: MascotExpression = EXPRESSION_ALIASES[expression] ?? expression;
    const meta = MASCOT_IMAGES[resolved] ?? MASCOT_IMAGES.happy;
    const plate = showBackground ? colors.surfaceContainerLow : 'transparent';

    const metrics = useMemo(
        () =>
            StyleSheet.create({
                frame: {
                    width: size,
                    height: size,
                    backgroundColor: plate,
                },
                failed: {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: plate,
                },
                image: {
                    width: size,
                    height: size,
                },
                emoji: {
                    fontSize: size * 0.6,
                },
            }),
        [size, plate],
    );

    if (failed) {
        const emoji = MASCOT_EMOJIS[resolved] || MASCOT_EMOJIS.happy;
        return (
            <View style={[layout.center, metrics.failed, style]}>
                <Text style={metrics.emoji}>{emoji}</Text>
            </View>
        );
    }

    return (
        <View style={[layout.center, metrics.frame, style]}>
            <Image
                source={meta.url}
                style={metrics.image}
                resizeMode="contain"
                onError={() => setFailed(true)}
                accessibilityLabel={meta.alt}
            />
        </View>
    );
};

export default MascotDisplay;
