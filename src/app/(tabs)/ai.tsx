// AI Tutor Screen — Stitch-aligned chat interface with Cadet Vijay mascot.
// Per Stitch: sticky header with mascot + name, quick topic chips,
// chat bubbles (user=primary, AI=surface-container), sticky input bar.
import { useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";
import { layout, useColors, useThemedStyles, type ColorPalette } from "../../theme";

// Mock AI responses
const AI_RESPONSES = [
    "Great question! Let me explain this concept step by step. First, let's break down the key points...",
    "I notice you're working hard! Here's a helpful tip for this topic: remember to focus on the core concepts first.",
    "You're making excellent progress! This topic is important for the AISSEE. Let me help you master it.",
    "I see you're building a strong foundation! Keep practicing, and you'll ace this section in no time.",
];

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const QUICK_TOPICS: { label: string; icon: "calculate" | "language" | "psychology" | "public" }[] = [
    { label: "Math Tips", icon: "calculate" },
    { label: "English Grammar", icon: "language" },
    { label: "Logic Puzzles", icon: "psychology" },
    { label: "GK Facts", icon: "public" },
];

function createStyles(colors: ColorPalette) {
    return {
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[3],
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.outlineVariant,
            gap: SPACING[3],
        },
        headerText: {
            flex: 1,
        },
        headerName: {
            fontFamily: TYPOGRAPHY.fontFamily.bold,
            fontSize: TYPOGRAPHY.fontSize.lg,
            color: colors.onSurface,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
        },
        headerStatus: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 4,
            marginTop: 2,
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.success,
        },
        headerStatusText: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: colors.success,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
        },
        chipsContainer: {
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[3],
            gap: SPACING[2],
            flexDirection: "row" as const,
        },
        chip: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            backgroundColor: colors.surfaceContainerHigh,
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[2],
            borderRadius: BORDER_RADIUS.full,
            gap: 4,
        },
        chipPressed: {
            backgroundColor: colors.surfaceVariant,
        },
        chipText: {
            fontFamily: TYPOGRAPHY.fontFamily.medium,
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: colors.primary,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
        },
        chatContent: {
            padding: SPACING[4],
            paddingBottom: SPACING[6],
        },
        messageRow: {
            flexDirection: "row" as const,
            alignItems: "flex-end" as const,
            marginBottom: SPACING[4],
        },
        messageRowUser: {
            justifyContent: "flex-end" as const,
        },
        bubble: {
            maxWidth: "75%" as const,
            padding: SPACING[4],
            borderRadius: BORDER_RADIUS.xl,
        },
        bubbleAI: {
            backgroundColor: colors.surfaceContainerHigh,
            borderBottomLeftRadius: 4,
            marginLeft: SPACING[2],
        },
        bubbleUser: {
            backgroundColor: colors.primary,
            borderBottomRightRadius: 4,
            marginRight: SPACING[2],
        },
        bubbleText: {
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurface,
            lineHeight: 24,
        },
        bubbleTextUser: {
            color: colors.onPrimary,
        },
        userAvatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.primaryContainer,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
        typingIndicator: {
            flexDirection: "row" as const,
            gap: 4,
            paddingVertical: 4,
        },
        typingDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.onSurfaceVariant,
        },
        inputBar: {
            flexDirection: "row" as const,
            alignItems: "flex-end" as const,
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[3],
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            gap: SPACING[2],
        },
        textInput: {
            flex: 1,
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: BORDER_RADIUS.xl,
            paddingHorizontal: SPACING[4],
            paddingVertical: SPACING[3],
            fontFamily: TYPOGRAPHY.fontFamily.regular,
            fontSize: TYPOGRAPHY.fontSize.base,
            color: colors.onSurface,
            maxHeight: 120,
        },
        sendBtn: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.surfaceContainerHigh,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
        sendBtnActive: {
            backgroundColor: colors.primary,
        },
    };
}

export default function AIScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const styles = useThemedStyles(createStyles);
    const colors = useColors();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi there! I'm Cadet Vijay, your AI study buddy. I can help you understand tricky concepts, explain topics in different ways, and quiz you before the exam. What would you like to learn today?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const canSend = inputText.trim().length > 0;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={layout.fill}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
            >
                <View style={styles.header}>
                    <MascotDisplay expression="encouraging" size={44} />
                    <View style={styles.headerText}>
                        <Text style={styles.headerName}>Cadet Vijay</Text>
                        <View style={styles.headerStatus}>
                            <View style={styles.statusDot} />
                            <Text style={styles.headerStatusText}>AI Study Buddy</Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsContainer}
                >
                    {QUICK_TOPICS.map((topic) => (
                        <Pressable
                            key={topic.label}
                            onPress={() => setInputText(`Explain ${topic.label}`)}
                            style={({ pressed }) => [
                                styles.chip,
                                pressed ? styles.chipPressed : null,
                            ]}
                        >
                            <MaterialIcon name={topic.icon} size={16} color={colors.primary} />
                            <Text style={styles.chipText}>{topic.label}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <ScrollView
                    ref={scrollViewRef}
                    style={layout.fill}
                    contentContainerStyle={styles.chatContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageRow,
                                message.isUser ? styles.messageRowUser : null,
                            ]}
                        >
                            {!message.isUser && (
                                <MascotDisplay expression="thinking" size={36} />
                            )}

                            <View
                                style={[
                                    styles.bubble,
                                    message.isUser ? styles.bubbleUser : styles.bubbleAI,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bubbleText,
                                        message.isUser ? styles.bubbleTextUser : null,
                                    ]}
                                >
                                    {message.text}
                                </Text>
                            </View>

                            {message.isUser && (
                                <View style={styles.userAvatar}>
                                    <MaterialIcon name="person" size={18} color={colors.onPrimary} filled />
                                </View>
                            )}
                        </View>
                    ))}

                    {isTyping && (
                        <View style={styles.messageRow}>
                            <MascotDisplay expression="thinking" size={36} />
                            <View style={[styles.bubble, styles.bubbleAI]}>
                                <View style={styles.typingIndicator}>
                                    {[0, 1, 2].map((i) => (
                                        <View key={i} style={styles.typingDot} />
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputBar}>
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Ask Cadet Vijay anything..."
                        placeholderTextColor={colors.onSurfaceVariant}
                        multiline
                        maxLength={500}
                        style={styles.textInput}
                    />
                    <Pressable
                        onPress={handleSend}
                        disabled={!canSend}
                        style={({ pressed }) => [
                            styles.sendBtn,
                            canSend ? styles.sendBtnActive : null,
                            pressed ? layout.pressed : null,
                        ]}
                    >
                        <MaterialIcon
                            name="send"
                            size={22}
                            color={canSend ? colors.onPrimary : colors.onSurfaceVariant}
                        />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
