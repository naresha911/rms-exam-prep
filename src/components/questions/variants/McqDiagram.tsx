import React from 'react';
import { Image, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../../constants';
import { useThemedStyles, type ColorPalette } from '../../../theme';
import { QuestionCardShell } from '../QuestionCardShell';
import { OptionStack } from '../OptionStack';
import { StemText } from '../StemText';
import { shellFromShared } from '../shellHelpers';
import type { SharedQuestionProps } from '../types';

function createStyles(colors: ColorPalette) {
    return {
        well: {
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[3],
            alignItems: 'center' as const,
            gap: SPACING[2],
        },
        plate: {
            width: '100%' as const,
            minHeight: 180,
            borderRadius: BORDER_RADIUS.lg,
            backgroundColor: colors.figurePlate,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            padding: SPACING[2],
        },
        diagram: {
            width: '100%' as const,
            height: 180,
        },
        caption: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: 12,
            color: colors.onSurfaceVariant,
        },
    };
}

/** Shared diagram on a light plate, then full-width answer rows. */
export const McqDiagram: React.FC<SharedQuestionProps> = (props) => {
    const styles = useThemedStyles(createStyles);
    const shell = shellFromShared(props);
    const path = props.question.diagram_path;
    const browseRevealed =
        props.mode === 'browse' &&
        (props.solveStatus === 'correct' || props.solveStatus === 'incorrect');

    return (
        <QuestionCardShell
            {...shell}
            stem={<StemText>{props.question.question_text || ''}</StemText>}
            context={
                <View style={styles.well}>
                    <View style={styles.plate}>
                        {path ? (
                            <Image source={{ uri: path }} style={styles.diagram} resizeMode="contain" />
                        ) : (
                            <Text style={styles.caption}>Diagram unavailable</Text>
                        )}
                    </View>
                    <Text style={styles.caption}>Figure</Text>
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

export default McqDiagram;
