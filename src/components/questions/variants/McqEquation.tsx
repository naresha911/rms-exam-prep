import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionGrid } from '../OptionGrid';
import { StemText } from '../StemText';
import { LatexText } from '../LatexText';
import { shellFromShared } from '../shellHelpers';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants';
import type { SharedQuestionProps, FractionNode } from '../types';

function FractionView({ node }: { node: FractionNode }) {
    return (
        <View style={styles.fraction}>
            <Text style={styles.fracNum}>{node.numerator}</Text>
            <View style={styles.fracRule} />
            <Text style={styles.fracDen}>{node.denominator}</Text>
        </View>
    );
}

/** Equation / fraction stem focus with 2×2 option cards. */
export const McqEquation: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared(props);
    const eq = props.question.presentationHints?.equation;
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    const stemText = props.question.question_text || 'Solve the given arithmetic equation:';

    return (
        <QuestionCardShell {...shell} stem={<StemText>{stemText}</StemText>}>
            <View style={styles.equationBox}>
                {eq?.left && eq?.right ? (
                    <View style={styles.equationRow}>
                        <FractionView node={eq.left} />
                        <Text style={styles.operator}>{eq.operator || '+'}</Text>
                        <FractionView node={eq.right} />
                        <Text style={styles.operator}>=</Text>
                        <Text style={styles.unknown}>?</Text>
                    </View>
                ) : (
                    <LatexText
                        content={eq?.text || props.question.question_text || ''}
                        color={COLORS.onSurface}
                        fontSize={18}
                        fontFamily={TYPOGRAPHY.fontFamily.bold}
                        fontWeight="700"
                    />
                )}
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
    equationBox: {
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING[4],
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 72,
    },
    equationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[3],
    },
    equationText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.onSurface,
        textAlign: 'center',
    },
    fraction: {
        alignItems: 'center',
        minWidth: 36,
    },
    fracNum: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.onSurface,
    },
    fracDen: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.onSurface,
    },
    fracRule: {
        alignSelf: 'stretch',
        height: 2,
        backgroundColor: COLORS.primary,
        marginVertical: 2,
    },
    operator: {
        fontFamily: TYPOGRAPHY.fontFamily.semibold,
        fontSize: 18,
        color: COLORS.onSurfaceVariant,
    },
    unknown: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.tertiary,
    },
});

export default McqEquation;
