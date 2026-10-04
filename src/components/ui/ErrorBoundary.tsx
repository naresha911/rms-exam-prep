import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import { layout, useThemedStyles, type ColorPalette } from '../../theme';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onReset?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            padding: SPACING[6],
            backgroundColor: colors.background,
        },
        emoji: {
            fontSize: 64,
            marginBottom: SPACING[4],
        },
        title: {
            fontSize: TYPOGRAPHY.fontSize.xl,
            fontWeight: '700' as const,
            color: colors.textPrimary,
            marginBottom: SPACING[2],
            textAlign: 'center' as const,
        },
        message: {
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.textSecondary,
            textAlign: 'center' as const,
            lineHeight: 24,
            marginBottom: SPACING[6],
        },
        button: {
            backgroundColor: colors.primary,
            paddingHorizontal: SPACING[6],
            paddingVertical: SPACING[3],
            borderRadius: BORDER_RADIUS.full,
        },
        buttonText: {
            color: colors.onPrimary,
            fontWeight: '700' as const,
            fontSize: TYPOGRAPHY.fontSize.base,
        },
    };
}

function ErrorFallback({
    message,
    onReset,
}: {
    message: string;
    onReset: () => void;
}) {
    const styles = useThemedStyles(createStyles);
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>😕</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>{message}</Text>
            <Pressable
                onPress={onReset}
                style={({ pressed }) => [styles.button, pressed ? layout.pressed : null]}
            >
                <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
        </View>
    );
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
            if (this.props.fallback) return this.props.fallback;
            const message = __DEV__
                ? this.state.error?.message ?? 'An unexpected error occurred'
                : 'An unexpected error occurred. Please try again.';
            return <ErrorFallback message={message} onReset={this.handleReset} />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
