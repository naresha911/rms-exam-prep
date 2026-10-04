import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';

interface AvatarProps {
    name?: string;
    uri?: string | null;
    size?: number;
    backgroundColor?: string;
    style?: ViewStyle;
}

function createStyles(colors: ColorPalette) {
    return {
        initials: {
            color: colors.textInverse,
            fontWeight: '700' as const,
        },
    };
}

export const Avatar: React.FC<AvatarProps> = ({
    name = '?',
    uri,
    size = 48,
    backgroundColor,
    style,
}) => {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const fill = backgroundColor ?? colors.primary;
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const metrics = useMemo(
        () =>
            StyleSheet.create({
                image: {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                },
                fallback: {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: fill,
                },
                initials: {
                    fontSize: size * 0.4,
                },
            }),
        [size, fill],
    );

    if (uri) {
        return <Image source={{ uri }} style={metrics.image} />;
    }

    return (
        <View style={[layout.center, metrics.fallback, style]}>
            <Text style={[styles.initials, metrics.initials]}>{initials}</Text>
        </View>
    );
};

export default Avatar;
