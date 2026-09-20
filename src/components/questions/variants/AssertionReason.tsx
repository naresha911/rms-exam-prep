import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionStack } from '../OptionStack';
import { StemText } from '../StemText';
import { LatexText } from '../LatexText';
import { shellFromShared } from '../shellHelpers';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants';
import type { SharedQuestionProps } from '../types';

/** Parse "Assertion (A): ... Reason (R): ..." from stem when structured props missing. */
function parseAssertionReason(stem: string, assertion?: string, reason?: string) {
    if (assertion || reason) {
        return { assertion: assertion || '', reason: reason || '' };
    }
    const aMatch = stem.match(/Assertion\s*\(A\)\s*[:.\-]?\s*(.+?)(?=Reason\s*\(R\)|$)/is);
    const rMatch = stem.match(/Reason\s*\(R\)\s*[:.\-]?\s*(.+)$/is);
    return {
        assertion: aMatch?.[1]?.trim() || stem,
        reason: rMatch?.[1]?.trim() || '',
    };
}

/** Assertion (A) + Reason (R) with stacked long options. */
export const AssertionReason: React.FC<SharedQuestionProps> = (props) => {
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
        >
            <View style={styles.promptWell}>
                <View style={styles.block}>
                    <View style={[styles.chip, styles.chipA]}>
                        <Text style={styles.chipAText}>A</Text>
                    </View>
                    <View style={styles.blockCopy}>
                        <Text style={styles.blockLabel}>Assertion (A)</Text>
                        <LatexText
                            content={assertion}
                            color={COLORS.onSurface}
                            fontSize={14}
                            fontFamily={TYPOGRAPHY.fontFamily.medium}
                            lineHeight={20}
                        />
                    </View>
                </View>
                {!!reason && (
                    <View style={styles.block}>
                        <View style={[styles.chip, styles.chipR]}>
                            <Text style={styles.chipRText}>R</Text>
                        </View>
                    <View style={styles.blockCopy}>
                        <Text style={styles.blockLabel}>Reason (R)</Text>
                        <LatexText
                            content={reason}
                            color={COLORS.onSurface}
                            fontSize={14}
                            fontFamily={TYPOGRAPHY.fontFamily.medium}
                            lineHeight={20}
                        />
                    </View>
                    </View>
                )}
            </View>
            <OptionStack
                options={props.question.options}
                selectedValue={props.selectedValue}
                selectionMode={props.selectionMode}
                mode={props.mode}
                revealed={props.revealed}
                browseRevealed={browseRevealed}
                onSelect={props.onSelect}
                showRadio={false}
            />
        </QuestionCardShell>
    );
};

const styles = StyleSheet.create({
    promptWell: {
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING[3],
        gap: SPACING[3],
    },
    block: {
        flexDirection: 'row',
        gap: SPACING[2],
        alignItems: 'flex-start',
    },
    chip: {
        width: 28,
        height: 28,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    chipA: {
        backgroundColor: COLORS.primaryContainer,
    },
    chipR: {
        backgroundColor: COLORS.tertiaryContainer,
    },
    chipAText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.onPrimary,
    },
    chipRText: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.onTertiary,
    },
    blockCopy: {
        flex: 1,
        gap: 4,
    },
    blockLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontWeight: '700',
        fontSize: 12,
        color: COLORS.onSurfaceVariant,
    },
});

export default AssertionReason;
