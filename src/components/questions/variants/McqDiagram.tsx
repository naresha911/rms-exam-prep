import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionGrid } from '../OptionGrid';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants';
import type { SharedQuestionProps } from '../types';

/** Geometry / figure question with diagram well + 2×2 options. */
export const McqDiagram: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared(props);
    const path = props.question.diagram_path;
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            <View style={styles.diagramWell}>
                {path ? (
                    <Image source={{ uri: path }} style={styles.diagram} resizeMode="contain" />
                ) : (
                    <View style={styles.diagramPlaceholder}>
                        <Text style={styles.caption}>Diagram unavailable</Text>
                    </View>
                )}
                <Text style={styles.caption}>Figure</Text>
            </View>
            <OptionGrid
                options={props.question.options}
                selectedValue={props.selectedValue}
                selectionMode={props.selectionMode}
                mode={props.mode}
                revealed={props.revealed}
                browseRevealed={browseRevealed}
                onSelect={props.onSelect}
            />
        </QuestionCardShell>
    );
};

const styles = StyleSheet.create({
    diagramWell: {
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING[3],
        alignItems: 'center',
        gap: SPACING[2],
    },
    diagram: {
        width: '100%',
        height: 160,
    },
    diagramPlaceholder: {
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceContainer,
        borderRadius: BORDER_RADIUS.lg,
    },
    caption: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: 12,
        color: COLORS.onSurfaceVariant,
    },
});

export default McqDiagram;
