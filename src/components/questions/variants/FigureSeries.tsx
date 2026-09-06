import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { QuestionCardShell } from '../QuestionCardShell';
import { FigureOptionTile } from '../FigureOptionTile';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import { MaterialIcon } from '../../ui/MaterialIcon';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants';
import type { SharedQuestionProps } from '../types';

/** Non-verbal intelligence — problem figures + figure option grid. */
export const FigureSeries: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared(props);
    const problemUris = props.question.presentationHints?.problemFigureUris ?? [];
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    // Pad to 4 cells; last often (?)
    const cells = [...problemUris];
    while (cells.length < 4) cells.push('');

    const sortedOptions = [...props.question.options].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            <View style={styles.problemPanel}>
                <Text style={styles.panelLabel}>Problem Figures</Text>
                <View style={styles.problemGrid}>
                    {cells.slice(0, 4).map((uri, i) => (
                        <View key={i} style={styles.problemCell}>
                            {uri ? (
                                <Image source={{ uri }} style={styles.problemImage} resizeMode="contain" />
                            ) : i === cells.length - 1 || i === 3 ? (
                                <MaterialIcon name="help" size={28} color={COLORS.primary} />
                            ) : (
                                <View style={styles.emptyCell} />
                            )}
                        </View>
                    ))}
                </View>
            </View>

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

const styles = StyleSheet.create({
    problemPanel: {
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING[3],
        gap: SPACING[2],
    },
    panelLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.onSurfaceVariant,
    },
    problemGrid: {
        flexDirection: 'row',
        gap: SPACING[2],
    },
    problemCell: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING[1],
    },
    problemImage: {
        width: '100%',
        height: '100%',
    },
    emptyCell: {
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: COLORS.surfaceContainer,
    },
    optionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING[2],
    },
    optionCell: {
        width: '48%',
        flexGrow: 1,
        flexBasis: '46%',
    },
});

export default FigureSeries;
