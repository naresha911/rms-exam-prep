import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { MascotDisplay } from "../shared/MascotDisplay";
import { Button } from "./Button";
import { MascotExpression } from "../../assets/images";

interface EmptyStateProps {
    title: string;
    description?: string;
    mascot?: MascotExpression;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "compact";
}

// Extended mascot expressions from Stitch design
const MASCOT_MAP: Record<string, MascotExpression> = {
    happy: "happy",
    thinking: "thinking",
    encouraging: "encouraging",
    celebrating: "celebrating",
    studying: "studying",
    victory: "victory",
    surprised: "surprised",
    sad: "sad",
    // Aliases for backward compatibility
    success: "celebrating",
    error: "sad",
    warning: "thinking",
    loading: "thinking",
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    mascot = "thinking",
    actionLabel,
    onAction,
    icon,
    variant = "default",
}) => {
    const mappedMascot = MASCOT_MAP[mascot] || mascot;

    return (
        <View
            style={[
                styles.container,
                variant === "compact" && styles.containerCompact,
            ]}
        >
            {icon || (
                <MascotDisplay
                    expression={mappedMascot}
                    size={variant === "compact" ? 80 : 120}
                    showBackground={true}
                />
            )}
            <Text
                style={[
                    styles.title,
                    variant === "compact" && styles.titleCompact,
                ]}
            >
                {title}
            </Text>
            {description && (
                <Text
                    style={[
                        styles.description,
                        variant === "compact" && styles.descriptionCompact,
                    ]}
                >
                    {description}
                </Text>
            )}
            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    variant="primary"
                    style={styles.button}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING[6],
    },
    containerCompact: {
        padding: SPACING[4],
    },
    title: {
        fontSize: TYPOGRAPHY.headlineMd.fontSize,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textPrimary,
        marginTop: SPACING[4],
        textAlign: "center",
    },
    titleCompact: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        marginTop: SPACING[3],
    },
    description: {
        fontSize: TYPOGRAPHY.bodyMd.fontSize,
        color: COLORS.textSecondary,
        marginTop: SPACING[2],
        textAlign: "center",
        maxWidth: 280,
        lineHeight: TYPOGRAPHY.bodyMd.lineHeight,
    },
    descriptionCompact: {
        fontSize: TYPOGRAPHY.fontSize.base,
        marginTop: SPACING[1],
        maxWidth: 240,
    },
    button: {
        marginTop: SPACING[6],
        minWidth: 160,
    },
});

export default EmptyState;
