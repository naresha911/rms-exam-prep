// StatusBadge — compact status pill for catalogue cards (papers, mocks, missions).

import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS, BORDER_RADIUS } from "../../constants";
import { MaterialIcon } from "../ui/MaterialIcon";
import type { PaperListStatus } from "../../types";

interface StatusBadgeProps {
    status: PaperListStatus;
    label?: string;
    style?: ViewStyle;
}

const STATUS_LABELS: Record<PaperListStatus, string> = {
    unattempted: "Unattempted",
    in_progress: "In progress",
    completed: "Completed",
    attempted: "Attempted",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, style }) => {
    const text = label ?? STATUS_LABELS[status];

    if (status === "completed") {
        return (
            <View style={[styles.base, styles.completed, style]}>
                <MaterialIcon name="check_circle" size={12} color="#047857" />
                <Text style={[styles.text, styles.completedText]}>{text}</Text>
            </View>
        );
    }

    if (status === "attempted") {
        return (
            <View style={[styles.base, styles.attempted, style]}>
                <MaterialIcon name="check" size={12} color="#B45309" />
                <Text style={[styles.text, styles.attemptedText]}>{text}</Text>
            </View>
        );
    }

    if (status === "in_progress") {
        return (
            <View style={[styles.base, styles.inProgress, style]}>
                <View style={styles.dotWarn} />
                <Text style={[styles.text, styles.inProgressText]}>{text}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.base, styles.unattempted, style]}>
            <View style={styles.dotAmber} />
            <Text style={[styles.text, styles.unattemptedText]}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
    },
    text: {
        fontFamily: "PlusJakartaSans_600SemiBold",
        fontSize: 10,
        fontWeight: "600",
    },
    unattempted: {
        backgroundColor: "#FFFBEB",
        borderColor: "rgba(251, 191, 36, 0.6)",
    },
    unattemptedText: {
        color: "#D97706",
    },
    inProgress: {
        backgroundColor: COLORS.warningLight,
        borderColor: "rgba(245, 158, 11, 0.5)",
    },
    inProgressText: {
        color: "#B45309",
    },
    completed: {
        backgroundColor: "#ECFDF5",
        borderColor: "rgba(167, 243, 208, 0.8)",
    },
    completedText: {
        color: "#047857",
    },
    attempted: {
        backgroundColor: "#FFFBEB",
        borderColor: "rgba(251, 191, 36, 0.6)",
    },
    attemptedText: {
        color: "#B45309",
    },
    dotAmber: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#F59E0B",
    },
    dotWarn: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.warning,
    },
});

export default StatusBadge;
