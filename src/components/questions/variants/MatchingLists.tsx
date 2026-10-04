import React from 'react';
import { Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../../constants';
import { useColors, useThemedStyles, type ColorPalette } from '../../../theme';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionStack } from '../OptionStack';
import { StemText } from '../StemText';
import { LatexText } from '../LatexText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps, MatchingListItem } from '../types';

function createStyles(colors: ColorPalette) {
    return {
        matrix: {
            flexDirection: 'row' as const,
            gap: SPACING[2],
            backgroundColor: colors.surfaceContainerLow,
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
            fontWeight: '700' as const,
            color: colors.onSurfaceVariant,
            marginBottom: SPACING[1],
        },
        miniCard: {
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: BORDER_RADIUS.lg,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            padding: SPACING[2],
            gap: 4,
        },
        miniKey: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: 12,
            fontWeight: '700' as const,
            color: colors.primary,
        },
    };
}

function MiniCard({ item }: { item: MatchingListItem }) {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    return (
        <View style={styles.miniCard}>
            <Text style={styles.miniKey}>{item.key}</Text>
            <LatexText
                content={item.text}
                color={colors.onSurface}
                fontSize={13}
                fontFamily={TYPOGRAPHY.fontFamily.medium}
                lineHeight={18}
            />
        </View>
    );
}

/** List-I / List-II when both lists exist, then mapping-code options. */
export const MatchingLists: React.FC<SharedQuestionProps> = (props) => {
    const styles = useThemedStyles(createStyles);
    const shell = shellFromShared(props);
    const lists = props.question.presentationHints?.matchingLists;
    const listI = lists?.listI ?? [];
    const listII = lists?.listII ?? [];
    const showMatrix = listI.length > 0 && listII.length > 0;
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    return (
        <QuestionCardShell {...shell} stem={<StemText>{props.question.question_text || ''}</StemText>}>
            {showMatrix ? (
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
            ) : null}
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

export default MatchingLists;
