import React from 'react';
import { Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../../theme';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionGrid } from '../OptionGrid';
import { StemText } from '../StemText';
import { LatexText } from '../LatexText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps, FractionNode } from '../types';

function FractionView({ node }: { node: FractionNode }) {
    const styles = useThemedStyles(createStyles);
    return (
        <View style={styles.fraction}>
            <Text style={styles.fracPart}>{node.numerator}</Text>
            <View style={styles.fracRule} />
            <Text style={styles.fracPart}>{node.denominator}</Text>
        </View>
    );
}

/** Equation or fraction as the focus, with centered 2×2 answers. */
export const McqEquation: React.FC<SharedQuestionProps> = (props) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const shell = shellFromShared(props);
    const equation = props.question.presentationHints?.equation;
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');
    const stemText = props.question.question_text || 'Solve the given arithmetic equation:';

    return (
        <QuestionCardShell {...shell} stem={<StemText>{stemText}</StemText>}>
            <View style={styles.equationBox}>
                {equation?.left && equation?.right ? (
                    <View style={styles.equationRow}>
                        <FractionView node={equation.left} />
                        <Text style={styles.operator}>{equation.operator || '+'}</Text>
                        <FractionView node={equation.right} />
                        <Text style={styles.operator}>=</Text>
                        <Text style={styles.unknown}>?</Text>
                    </View>
                ) : (
                    <LatexText
                        content={equation?.text || props.question.question_text || ''}
                        color={colors.onSurface}
                        fontSize={20}
                        fontFamily={TYPOGRAPHY.fontFamily.bold}
                        fontWeight="700"
                        align="center"
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
                layoutMode="equation"
            />
        </QuestionCardShell>
    );
};

function createStyles(colors: ColorPalette) {
    return {
        equationBox: {
            backgroundColor: colors.surfaceContainerLow,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[4],
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            minHeight: 88,
        },
        equationRow: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: SPACING[3],
        },
        fraction: {
            alignItems: 'center' as const,
            minWidth: 40,
        },
        fracPart: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 18,
            fontWeight: '700' as const,
            color: colors.onSurface,
        },
        fracRule: {
            alignSelf: 'stretch' as const,
            height: 2,
            backgroundColor: colors.primary,
            marginVertical: 3,
        },
        operator: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: 20,
            color: colors.onSurfaceVariant,
        },
        unknown: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 24,
            fontWeight: '700' as const,
            color: colors.tertiary,
        },
    };
}

export default McqEquation;
