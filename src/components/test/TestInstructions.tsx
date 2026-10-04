// TestInstructions — pre-test instructions display
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useThemedStyles, type ColorPalette } from '../../theme';
import { Button } from '../ui/Button';
import { MascotDisplay } from '../shared/MascotDisplay';

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

function createStyles(colors: ColorPalette) {
    return {
        scroll: { padding: SPACING[5] },
        header: {
            alignItems: 'center' as const,
            marginBottom: SPACING[5],
        },
        title: {
            fontSize: TYPOGRAPHY.fontSize['2xl'],
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            color: colors.textPrimary,
            textAlign: 'center' as const,
            marginTop: SPACING[3],
        },
        subtitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
            marginTop: 4,
            textAlign: 'center' as const,
        },
        summaryRow: {
            gap: SPACING[3],
            marginBottom: SPACING[5],
        },
        summaryCard: {
            flex: 1,
            backgroundColor: colors.primaryFixed,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[3],
            alignItems: 'center' as const,
        },
        summaryIcon: { fontSize: 20 },
        summaryValue: {
            fontSize: TYPOGRAPHY.fontSize.lg,
            fontWeight: TYPOGRAPHY.fontWeight.extrabold,
            fontFamily: TYPOGRAPHY.fontFamily.extrabold,
            color: colors.primary,
            marginTop: 4,
        },
        summaryLabel: {
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
        },
        sectionCard: {
            backgroundColor: colors.cardBackground,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[4],
            marginBottom: SPACING[4],
            borderWidth: 1,
            borderColor: colors.cardBorder,
        },
        sectionTitle: {
            fontSize: TYPOGRAPHY.fontSize.base,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            color: colors.textPrimary,
            marginBottom: SPACING[3],
        },
        sectionRow: {
            paddingVertical: SPACING[2],
        },
        sectionDivider: {
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
        },
        sectionName: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.textPrimary,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontFamily: TYPOGRAPHY.fontFamily.medium,
        },
        sectionMeta: {
            gap: SPACING[4],
        },
        sectionMetaText: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
        },
        instructionsCard: {
            backgroundColor: colors.backgroundSecondary,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING[4],
            marginBottom: SPACING[5],
        },
        instructionRow: {
            gap: SPACING[2],
            marginBottom: SPACING[2],
        },
        instructionIndex: {
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
            lineHeight: 20,
        },
        instructionText: {
            flex: 1,
            fontSize: TYPOGRAPHY.fontSize.sm,
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            color: colors.textSecondary,
            lineHeight: 20,
        },
        startButton: {
            marginBottom: SPACING[3],
        },
    };
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
    const styles = useThemedStyles(createStyles);
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
    const summary = [
        { label: 'Questions', value: totalQuestions.toString(), icon: '❓' },
        { label: 'Marks', value: totalMarks.toString(), icon: '📊' },
        { label: 'Duration', value: `${durationMinutes}m`, icon: '⏱️' },
    ];

    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <MascotDisplay expression="studying" size={80} />
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Read the instructions carefully before starting</Text>
            </View>

            <View style={[layout.row, styles.summaryRow]}>
                {summary.map((item) => (
                    <View key={item.label} style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>{item.icon}</Text>
                        <Text style={styles.summaryValue}>{item.value}</Text>
                        <Text style={styles.summaryLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>

            {sections && sections.length > 0 ? (
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>📋 Section Breakdown</Text>
                    {sections.map((section, idx) => (
                        <View
                            key={section.name}
                            style={[
                                layout.rowBetween,
                                styles.sectionRow,
                                idx < sections.length - 1 ? styles.sectionDivider : null,
                            ]}
                        >
                            <Text style={styles.sectionName}>{section.name}</Text>
                            <View style={[layout.row, styles.sectionMeta]}>
                                <Text style={styles.sectionMetaText}>{section.questions} Q</Text>
                                <Text style={styles.sectionMetaText}>{section.marks} M</Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : null}

            <View style={styles.instructionsCard}>
                <Text style={styles.sectionTitle}>📌 Instructions</Text>
                {instructions.map((instruction, idx) => (
                    <View key={idx} style={[layout.row, styles.instructionRow]}>
                        <Text style={styles.instructionIndex}>{idx + 1}.</Text>
                        <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                ))}
            </View>

            <Button
                title={loading ? 'Loading...' : '🚀 Start Test'}
                onPress={onStart}
                loading={loading}
                fullWidth
                size="lg"
                style={styles.startButton}
            />
            {onCancel ? (
                <Button
                    title="← Go Back"
                    variant="secondary"
                    onPress={onCancel}
                    fullWidth
                    size="lg"
                />
            ) : null}
        </ScrollView>
    );
};

export default TestInstructions;
