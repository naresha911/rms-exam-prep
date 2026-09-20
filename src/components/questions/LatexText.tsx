import React from 'react';
import { View, Text, StyleSheet, type TextStyle, type StyleProp, type ViewStyle } from 'react-native';
import { MathView } from 'expo-mathjax';
import { containsLatex, parseLatexSegments } from '../../utils/latex';

interface LatexTextProps {
    content?: string | null;
    color: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: TextStyle['fontWeight'];
    lineHeight?: number;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}

/** Renders mixed prose + TeX ($...$, $$...$$, \\(...\\), \\ce{...}). */
export const LatexText: React.FC<LatexTextProps> = ({
    content,
    color,
    fontSize = 15,
    fontFamily,
    fontWeight,
    lineHeight,
    style,
    containerStyle,
}) => {
    const text = content ?? '';
    const textStyle: TextStyle = {
        color,
        fontSize,
        fontFamily,
        fontWeight,
        lineHeight: lineHeight ?? Math.round(fontSize * 1.35),
    };

    if (!text) {
        return null;
    }

    if (!containsLatex(text)) {
        return <Text style={[textStyle, style]}>{text}</Text>;
    }

    const segments = parseLatexSegments(text);

    return (
        <View style={[styles.wrap, containerStyle]}>
            {segments.map((segment, index) => {
                if (segment.type === 'text') {
                    if (!segment.value) return null;
                    return (
                        <Text key={index} style={[textStyle, style]}>
                            {segment.value}
                        </Text>
                    );
                }

                return (
                    <View
                        key={index}
                        style={segment.display ? styles.displayMath : styles.inlineMath}
                    >
                        <MathView
                            tex={segment.value}
                            display={segment.display}
                            color={color}
                            fontSize={segment.display ? fontSize + 2 : fontSize}
                        />
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    inlineMath: {
        marginHorizontal: 2,
        maxWidth: '100%',
    },
    displayMath: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 8,
    },
});

export default LatexText;
