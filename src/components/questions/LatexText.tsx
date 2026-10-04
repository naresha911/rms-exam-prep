import React from 'react';
import { Text, View, StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { MathView } from 'expo-mathjax';
import { containsLatex, parseLatexSegments, type LatexSegment } from '../../utils/latex';

interface LatexTextProps {
    content?: string | null;
    color: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: TextStyle['fontWeight'];
    lineHeight?: number;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    align?: 'left' | 'center';
}

type InlineRun = { kind: 'inline'; segments: LatexSegment[] };
type DisplayRun = { kind: 'display'; value: string };

function groupSegments(segments: LatexSegment[]): Array<InlineRun | DisplayRun> {
    const blocks: Array<InlineRun | DisplayRun> = [];
    let inline: LatexSegment[] = [];

    const flush = () => {
        if (!inline.length) return;
        blocks.push({ kind: 'inline', segments: inline });
        inline = [];
    };

    for (const segment of segments) {
        if (segment.type === 'math' && segment.display) {
            flush();
            blocks.push({ kind: 'display', value: segment.value });
        } else {
            inline.push(segment);
        }
    }
    flush();
    return blocks;
}

/** Renders mixed prose and TeX. Inline math stays on the text line; display math is its own block. */
export const LatexText: React.FC<LatexTextProps> = ({
    content,
    color,
    fontSize = 16,
    fontFamily,
    fontWeight,
    lineHeight,
    style,
    containerStyle,
    align = 'left',
}) => {
    const text = content ?? '';
    const textStyle: TextStyle = {
        color,
        fontSize,
        fontFamily,
        fontWeight,
        lineHeight: lineHeight ?? Math.round(fontSize * 1.4),
        textAlign: align,
    };

    if (!text) return null;

    if (!containsLatex(text)) {
        return <Text style={[textStyle, style]}>{text}</Text>;
    }

    const blocks = groupSegments(parseLatexSegments(text));
    const alignStyle = align === 'center' ? styles.alignCenter : styles.alignLeft;

    return (
        <View style={[styles.stack, alignStyle, containerStyle]}>
            {blocks.map((block, index) => {
                if (block.kind === 'display') {
                    return (
                        <View key={index} style={styles.displayMath}>
                            <MathView tex={block.value} display color={color} fontSize={fontSize + 2} />
                        </View>
                    );
                }

                return (
                    <View key={index} style={styles.inlineRow}>
                        {block.segments.map((segment, segmentIndex) => {
                            if (segment.type === 'text') {
                                if (!segment.value) return null;
                                return (
                                    <Text key={segmentIndex} style={[textStyle, styles.inlineText, style]}>
                                        {segment.value}
                                    </Text>
                                );
                            }
                            return (
                                <View key={segmentIndex} style={styles.inlineMath}>
                                    <MathView
                                        tex={segment.value}
                                        display={false}
                                        color={color}
                                        fontSize={fontSize}
                                    />
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    stack: {
        width: '100%',
        gap: 4,
    },
    alignLeft: {
        alignItems: 'flex-start',
    },
    alignCenter: {
        alignItems: 'center',
    },
    inlineRow: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    inlineText: {
        flexShrink: 1,
    },
    inlineMath: {
        marginHorizontal: 2,
        justifyContent: 'center',
    },
    displayMath: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 8,
    },
});

export default LatexText;
