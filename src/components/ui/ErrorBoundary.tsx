// ErrorBoundary — catches React render errors and shows a friendly fallback
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onReset?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <Text style={styles.emoji}>😕</Text>
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.message}>
                        {__DEV__
                            ? this.state.error?.message ?? 'An unexpected error occurred'
                            : 'An unexpected error occurred. Please try again.'}
                    </Text>
                    <Pressable
                        onPress={this.handleReset}
                        style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
                    >
                        <Text style={styles.buttonText}>Try Again</Text>
                    </Pressable>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING[6],
        backgroundColor: COLORS.background,
    },
    emoji: {
        fontSize: 64,
        marginBottom: SPACING[4],
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING[2],
        textAlign: 'center',
    },
    message: {
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: SPACING[6],
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING[6],
        paddingVertical: SPACING[3],
        borderRadius: BORDER_RADIUS.full,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: TYPOGRAPHY.fontSize.base,
    },
});

export default ErrorBoundary;
