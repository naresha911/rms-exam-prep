import React from 'react';
import { Image, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../../theme';
import { QuestionCardShell } from '../QuestionCardShell';
import { FigureOptionTile } from '../FigureOptionTile';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import { MaterialIcon } from '../../ui/MaterialIcon';
import type { SharedQuestionProps } from '../types';

function createStyles(colors: ColorPalette) {
    return {
        panel: {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[3],
            gap: SPACING[2],
        },
        label: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 12,
            fontWeight: '700' as const,
            color: colors.onSurfaceVariant,
        },
        row: {
            flexDirection: 'row' as const,
            gap: SPACING[2],
        },
        cell: {
            flex: 1,
            aspectRatio: 1,
            backgroundColor: colors.figurePlate,
            borderRadius: BORDER_RADIUS.lg,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            padding: SPACING[1],
        },
        image: {
            width: '100%' as const,
            height: '100%' as const,
        },
        optionGrid: {
            flexDirection: 'row' as const,
            flexWrap: 'wrap' as const,
            marginHorizontal: -SPACING[1],
        },
        optionCell: {
            width: '50%' as const,
            padding: SPACING[1],
        },
    };
}

/** Non-verbal series: problem figures, then square option tiles. */
export const FigureSeries: React.FC<SharedQuestionProps> = (props) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const shell = shellFromShared(props);
    const problemUris = (props.question.presentationHints?.problemFigureUris ?? []).filter(Boolean);
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');
    const cells = problemUris.length > 0 && problemUris.length < 4
        ? [...problemUris, '']
        : problemUris.slice(0, 4);
    const sortedOptions = [...props.question.options].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            {cells.length > 0 ? (
                <View style={styles.panel}>
                    <Text style={styles.label}>Problem Figures</Text>
                    <View style={styles.row}>
                        {cells.map((uri, index) => (
                            <View key={`${uri}-${index}`} style={styles.cell}>
                                {uri ? (
                                    <Image source={{ uri }} style={styles.image} resizeMode="contain" />
                                ) : (
                                    <MaterialIcon name="help" size={28} color={colors.primary} />
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            ) : null}
            <View style={styles.optionGrid}>
                {sortedOptions.map((option) => (
                    <View key={option.id} style={styles.optionCell}>
                        <FigureOptionTile
                            option={option}
                            selectedValue={props.selectedValue}
                            selectionMode={props.selectionMode}
                            mode={props.mode}
                            revealed={props.revealed}
                            browseRevealed={browseRevealed}
                            onSelect={props.onSelect}
                        />
                    </View>
                ))}
            </View>
        </QuestionCardShell>
    );
};

export default FigureSeries;
