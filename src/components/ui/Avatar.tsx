import React from "react";
import { View, Text, Image, ViewStyle } from "react-native";
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from "../../constants";

interface AvatarProps {
    name?: string;
    uri?: string | null;
    size?: number;
    backgroundColor?: string;
    style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
    name = "?",
    uri,
    size = 48,
    backgroundColor = COLORS.primary,
    style,
}) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (uri) {
        return (
            <Image
                source={{ uri }}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                }}
            />
        );
    }

    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                    alignItems: "center",
                    justifyContent: "center",
                },
                style,
            ]}
        >
            <Text
                style={{
                    color: COLORS.textInverse,
                    fontSize: size * 0.4,
                    fontWeight: "700",
                }}
            >
                {initials}
            </Text>
        </View>
    );
};

export default Avatar;
