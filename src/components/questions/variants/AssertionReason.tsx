import React from 'react';
import { Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../../theme';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionStack } from '../OptionStack';
import { StemText } from '../StemText';
import { LatexText } from '../LatexText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps } from '../types';

function parseAssertionReason(stem: string, assertion?: string, reason?: string) {
    if (assertion || reason) {
        return { assertion: assertion || '', reason: reason || '' };
    }
    const assertionMatch = stem.match(/Assertion\s*\(A\)\s*[:.\-]?\s*(.+?)(?=Reason\s*\(R\)|$)/is);
    const reasonMatch = stem.match(/Reason\s*\(R\)\s*[:.\-]?\s*(.+)$/is);
    return {
        assertion: assertionMatch?.[1]?.trim() || stem,
        reason: reasonMatch?.[1]?.trim() || '',
    };
}

function createStyles(colors: ColorPalette) {
    return {
        well: {
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[3],
            gap: SPACING[3],
        },
        block: {
            flexDirection: 'row' as const,
            gap: SPACING[2],
            alignItems: 'flex-start' as const,
        },
        chip: {
            width: 28,
            height: 28,
            borderRadius: BORDER_RADIUS.lg,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        },
        chipA: { backgroundColor: colors.primaryContainer },
        chipR: { backgroundColor: colors.tertiaryContainer },
        chipText: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 12,
            fontWeight: '700' as const,
        },
        chipAText: { color: colors.onPrimaryContainer },
        chipRText: { color: colors.onTertiaryContainer },
        copy: { flex: 1, gap: 4 },
        label: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontWeight: '600' as const,
            fontSize: 12,
            color: colors.onSurfaceVariant,
        },
    };
}

/** Assertion (A) and Reason (R), then full-width choices. */
export const AssertionReason: React.FC<SharedQuestionProps> = (props) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const shell = shellFromShared(props);
    const hints = props.question.presentationHints?.assertionReason;
    const { assertion, reason } = parseAssertionReason(
        props.question.question_text || '',
        hints?.assertion,
        hints?.reason
    );
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    return (
        <QuestionCardShell
            {...shell}
            stem={<StemText>Choose the correct option about Assertion (A) and Reason (R).</StemText>}
            context={
                <View style={styles.well}>
                    <View style={styles.block}>
                        <View style={[styles.chip, styles.chipA]}>
                            <Text style={[styles.chipText, styles.chipAText]}>A</Text>
                        </View>
                        <View style={styles.copy}>
                            <Text style={styles.label}>Assertion (A)</Text>
                            <LatexText
                                content={assertion}
                                color={colors.onSurface}
                                fontSize={15}
                                fontFamily={TYPOGRAPHY.fontFamily.medium}
                                lineHeight={22}
                            />
                        </View>
                    </View>
                    {reason ? (
                        <View style={styles.block}>
                            <View style={[styles.chip, styles.chipR]}>
                                <Text style={[styles.chipText, styles.chipRText]}>R</Text>
                            </View>
                            <View style={styles.copy}>
                                <Text style={styles.label}>Reason (R)</Text>
                                <LatexText
                                    content={reason}
                                    color={colors.onSurface}
                                    fontSize={15}
                                    fontFamily={TYPOGRAPHY.fontFamily.medium}
                                    lineHeight={22}
                                />
                            </View>
                        </View>
                    ) : null}
                </View>
            }
        >
            <OptionStack
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

export default AssertionReason;
