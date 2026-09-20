import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionStack } from '../OptionStack';
import { StemText } from '../StemText';
import { LatexText } from '../LatexText';
import { shellFromShared } from '../shellHelpers';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants';
import type { SharedQuestionProps, MatchingListItem } from '../types';

const DEFAULT_LIST_I: MatchingListItem[] = [
    { key: '(i)', text: 'Item i' },
    { key: '(ii)', text: 'Item ii' },
    { key: '(iii)', text: 'Item iii' },
];

const DEFAULT_LIST_II: MatchingListItem[] = [
    { key: '(P)', text: 'Item P' },
    { key: '(Q)', text: 'Item Q' },
    { key: '(R)', text: 'Item R' },
];

function MiniCard({ item }: { item: MatchingListItem }) {
    return (
        <View style={styles.miniCard}>
            <Text style={styles.miniKey}>{item.key}</Text>
            <LatexText
                content={item.text}
                color={COLORS.onSurface}
                fontSize={12}
                fontFamily={TYPOGRAPHY.fontFamily.medium}
            />
        </View>
    );
}

/** Match List-I to List-II with mapping-code options. */
export const MatchingLists: React.FC<SharedQuestionProps> = (props) => {
    const shell = shellFromShared(props);
    const lists = props.question.presentationHints?.matchingLists;
    const listI = lists?.listI?.length ? lists.listI : DEFAULT_LIST_I;
    const listII = lists?.listII?.length ? lists.listII : DEFAULT_LIST_II;
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            <View style={styles.matrix}>
                <View style={styles.column}>
                    <Text style={styles.columnLabel}>List-I</Text>
                    {listI.map((item) => (
                        <MiniCard key={item.key} item={item} />
                    ))}
                </View>
                <View style={styles.column}>
                    <Text style={styles.columnLabel}>List-II</Text>
                    {listII.map((item) => (
                        <MiniCard key={item.key} item={item} />
                    ))}
                </View>
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
    matrix: {
        flexDirection: 'row',
        gap: SPACING[2],
        backgroundColor: COLORS.surfaceContainerLow,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING[3],
    },
    column: {
        flex: 1,
        gap: SPACING[2],
    },
    columnLabel: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.onSurfaceVariant,
        marginBottom: SPACING[1],
    },
    miniCard: {
        backgroundColor: COLORS.surfaceContainerLowest,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.outlineVariant,
        padding: SPACING[2],
        gap: 4,
    },
    miniKey: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
    },
    miniText: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: 12,
        color: COLORS.onSurface,
    },
});

export default MatchingLists;
