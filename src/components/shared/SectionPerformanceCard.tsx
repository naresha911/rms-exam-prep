// SectionPerformanceCard — mock test result "Section Performance" row.
// Colored circle icon + subject name + bold percentage.
// Matches stitch_screens/mock_test_result_analysis/code.html lines 238–266.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants";
import { MaterialIcon, MaterialIconName } from "../ui/MaterialIcon";

interface SectionPerformanceCardProps {
    icon: MaterialIconName;
    iconBg: string;
    iconColor: string;
    subject: string;
    percentage: number; // 0–100
    style?: any;
}

export const SectionPerformanceCard: React.FC<SectionPerformanceCardProps> = ({
    icon,
    iconBg,
    iconColor,
    subject,
    percentage,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                <MaterialIcon name={icon} size={20} color={iconColor} />
            </View>
            <Text style={styles.subject}>{subject}</Text>
            <Text style={[styles.percentage, { color: iconColor }]}>
                {Math.round(percentage)}%
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: SPACING[4],
        backgroundColor: COLORS.surfaceContainerLowest,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        borderRadius: SPACING[3],
        gap: SPACING[3],
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    subject: {
        flex: 1,
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurface,
        fontWeight: "600",
    },
    percentage: {
        fontFamily: "PlusJakartaSans_700Bold",
        fontSize: TYPOGRAPHY.fontSize["2xl"],
        fontWeight: "700",
    },
});

export default SectionPerformanceCard;
