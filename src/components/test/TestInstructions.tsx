// TestInstructions — pre-test instructions display
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../ui/Button';
import { MascotDisplay } from '../shared/MascotDisplay';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, EXAM_STRUCTURE } from '../../constants';

interface Section {
    name: string;
    questions: number;
    marks: number;
}

interface TestInstructionsProps {
    title: string;
    durationMinutes: number;
    totalQuestions: number;
    totalMarks: number;
    sections?: Section[];
    negativeMarking?: boolean;
    onStart: () => void;
    onCancel?: () => void;
    loading?: boolean;
}

export const TestInstructions: React.FC<TestInstructionsProps> = ({
    title,
    durationMinutes,
    totalQuestions,
    totalMarks,
    sections,
    negativeMarking = false,
    onStart,
    onCancel,
    loading = false,
}) => {
    const instructions = [
        `The test contains ${totalQuestions} questions worth ${totalMarks} marks.`,
        `Total time allowed is ${durationMinutes} minutes.`,
        negativeMarking
            ? 'There is negative marking. Incorrect answers will deduct marks.'
            : 'No negative marking — there is no penalty for wrong answers.',
        'You can navigate between questions using Previous/Next buttons.',
        'Use the question palette to jump to any question directly.',
        'You can mark questions for review and return to them later.',
        'Submit the test before time expires or when you are done.',
        'Once submitted, answers cannot be changed.',
    ];

    return (
        <ScrollView contentContainerStyle={{ padding: SPACING[5] }} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: SPACING[5] }}>
                <MascotDisplay expression="studying" size={80} />
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.fontSize['2xl'],
                        fontWeight: '800',
                        color: COLORS.textPrimary,
                        textAlign: 'center',
                        marginTop: SPACING[3],
                    }}
                >
                    {title}
                </Text>
                <Text style={{ fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' }}>
                    Read the instructions carefully before starting
                </Text>
            </View>

            {/* Test summary */}
            <View
                style={{
                    flexDirection: 'row',
                    gap: SPACING[3],
                    marginBottom: SPACING[5],
                }}
            >
                {[
                    { label: 'Questions', value: totalQuestions.toString(), icon: '❓' },
                    { label: 'Marks', value: totalMarks.toString(), icon: '📊' },
                    { label: 'Duration', value: `${durationMinutes}m`, icon: '⏱️' },
                ].map((item) => (
                    <View
                        key={item.label}
                        style={{
                            flex: 1,
                            backgroundColor: COLORS.primaryFixed,
                            borderRadius: BORDER_RADIUS.xl,
                            padding: SPACING[3],
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.lg, fontWeight: '800', color: COLORS.primary, marginTop: 4 }}>
                            {item.value}
                        </Text>
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary }}>
                            {item.label}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Section breakdown */}
            {sections && sections.length > 0 && (
                <View
                    style={{
                        backgroundColor: COLORS.cardBackground,
                        borderRadius: BORDER_RADIUS.xl,
                        padding: SPACING[4],
                        marginBottom: SPACING[4],
                        borderWidth: 1,
                        borderColor: COLORS.cardBorder,
                    }}
                >
                    <Text style={{ fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING[3] }}>
                        📋 Section Breakdown
                    </Text>
                    {sections.map((section, idx) => (
                        <View
                            key={section.name}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: SPACING[2],
                                borderBottomWidth: idx < sections.length - 1 ? 1 : 0,
                                borderBottomColor: COLORS.cardBorder,
                            }}
                        >
                            <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textPrimary, fontWeight: '500' }}>
                                {section.name}
                            </Text>
                            <View style={{ flexDirection: 'row', gap: SPACING[4] }}>
                                <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>
                                    {section.questions} Q
                                </Text>
                                <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary }}>
                                    {section.marks} M
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* General instructions */}
            <View
                style={{
                    backgroundColor: COLORS.backgroundSecondary,
                    borderRadius: BORDER_RADIUS.xl,
                    padding: SPACING[4],
                    marginBottom: SPACING[5],
                }}
            >
                <Text style={{ fontSize: TYPOGRAPHY.fontSize.base, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING[3] }}>
                    📌 Instructions
                </Text>
                {instructions.map((instruction, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', gap: SPACING[2], marginBottom: SPACING[2] }}>
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, lineHeight: 20 }}>
                            {idx + 1}.
                        </Text>
                        <Text style={{ fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, flex: 1, lineHeight: 20 }}>
                            {instruction}
                        </Text>
                    </View>
                ))}
            </View>

            {/* CTA Buttons */}
            <Button
                title={loading ? 'Loading...' : '🚀 Start Test'}
                onPress={onStart}
                loading={loading}
                fullWidth
                size="lg"
                style={{ marginBottom: SPACING[3] }}
            />
            {onCancel && (
                <Button
                    title="← Go Back"
                    variant="secondary"
                    onPress={onCancel}
                    fullWidth
                    size="lg"
                />
            )}
        </ScrollView>
    );
};

export default TestInstructions;
