// StatBlock — small colored card used in home dashboard and parent dashboard.
// Icon + big number + label. Per Stitch: bg-surface-container-lowest, colored icon tile.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";
import { MaterialIcon, MaterialIconName } from "../ui/MaterialIcon";

interface StatBlockProps {
    icon: MaterialIconName;
    iconColor?: string;
    iconBg?: string;
    value: string | number;
    label: string;
    style?: any;
}

export const StatBlock: React.FC<StatBlockProps> = ({
    icon,
    iconColor = COLORS.primary,
    iconBg = COLORS.primaryContainer,
    value,
    label,
    style,
}) => {
    return (
        <View
            style={[
                styles.container,
                { backgroundColor: COLORS.surfaceContainerLowest },
                style,
            ]}
        >
            <View
                style={[
                    styles.iconWrap,
                    { backgroundColor: iconBg },
                ]}
            >
                <MaterialIcon name={icon} size={20} color={iconColor} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: SPACING[4],
        borderRadius: SPACING[3],
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING[2],
    },
    value: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.onSurface,
        fontWeight: "700",
    },
    label: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        marginTop: 2,
        textAlign: "center",
    },
});

export default StatBlock;
