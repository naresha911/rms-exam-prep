// ExplanationCard — shows explanation after an answer is submitted
import React from 'react';
import { View, Text, Image } from 'react-native';
import { MascotDisplay } from '../shared/MascotDisplay';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface ExplanationCardProps {
    isCorrect: boolean;
    correctOptionKey: string;
    explanation?: string | null;
    explanationDiagramPath?: string | null;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
    isCorrect,
    correctOptionKey,
    explanation,
    explanationDiagramPath,
}) => {
    const config = isCorrect
        ? {
              mascot: 'celebrating' as const,
              headline: 'Excellent! 🎉',
              subtext: "That's the right answer!",
              bg: '#D1FAE5',
              border: COLORS.success,
              headlineColor: '#065F46',
          }
        : {
              mascot: 'encouraging' as const,
              headline: 'Almost there! 💪',
              subtext: `The correct answer is ${correctOptionKey}`,
              bg: '#FEF3C7',
              border: COLORS.warning,
              headlineColor: '#92400E',
          };

    return (
        <View
            style={{
                backgroundColor: config.bg,
                borderRadius: BORDER_RADIUS['2xl'],
                borderWidth: 2,
                borderColor: config.border,
                padding: SPACING[4],
                marginTop: SPACING[3],
            }}
        >
            {/* Mascot + headline */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING[3], marginBottom: SPACING[3] }}>
                <MascotDisplay expression={config.mascot} size={56} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.xl, fontWeight: '800', color: config.headlineColor }}>
                        {config.headline}
                    </Text>
                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, marginTop: 2 }}>
                        {config.subtext}
                    </Text>
                </View>
            </View>

            {/* Explanation text */}
            {explanation ? (
                <>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: config.border,
                            opacity: 0.4,
                            marginBottom: SPACING[3],
                        }}
                    />
                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING[1] }}>
                        📖 Explanation
                    </Text>
                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.textPrimary, lineHeight: 24 }}>
                        {explanation}
                    </Text>
                </>
            ) : (
                <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, fontStyle: 'italic' }}>
                    No explanation available for this question.
                </Text>
            )}

            {/* Explanation diagram */}
            {explanationDiagramPath && (
                <Image
                    source={{ uri: explanationDiagramPath }}
                    style={{
                        width: '100%',
                        height: 200,
                        borderRadius: BORDER_RADIUS.lg,
                        marginTop: SPACING[3],
                        resizeMode: 'contain',
                        backgroundColor: '#fff',
                    }}
                />
            )}
        </View>
    );
};

export default ExplanationCard;
