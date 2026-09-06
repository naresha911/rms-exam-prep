// ProTipCard — compact tip banner reused across feature screens.

import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MaterialIcon, MaterialIconName } from "../ui/MaterialIcon";

interface ProTipCardProps {
    title: string;
    body: string;
    icon?: MaterialIconName;
    style?: ViewStyle;
}

export const ProTipCard: React.FC<ProTipCardProps> = ({
    title,
    body,
    icon = "verified",
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconWrap}>
                <MaterialIcon name={icon} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.copy}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{body}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING[3],
        backgroundColor: COLORS.surfaceContainerLow,
        borderWidth: 1,
        borderColor: "rgba(70, 72, 212, 0.15)",
        borderRadius: 16,
        padding: SPACING[3],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(70, 72, 212, 0.10)",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    copy: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: "700",
        color: COLORS.primary,
    },
    body: {
        marginTop: 2,
        fontFamily: "PlusJakartaSans_400Regular",
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.onSurfaceVariant,
        lineHeight: 16,
    },
});

export default ProTipCard;
