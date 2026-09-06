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
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

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

export default function AIScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
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

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
            >
                {/* Stitch-style sticky header */}
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

                {/* Quick topic chips — Stitch: surface-container chips */}
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
                                pressed && styles.chipPressed,
                            ]}
                        >
                            <MaterialIcon name={topic.icon} size={16} color={COLORS.primary} />
                            <Text style={styles.chipText}>{topic.label}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Chat messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1 }}
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
                                message.isUser && styles.messageRowUser,
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
                                        message.isUser && styles.bubbleTextUser,
                                    ]}
                                >
                                    {message.text}
                                </Text>
                            </View>

                            {message.isUser && (
                                <View style={styles.userAvatar}>
                                    <MaterialIcon name="person" size={18} color={COLORS.onPrimary} filled />
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <View style={[styles.messageRow, styles.messageRowAI]}>
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

                {/* Stitch-style sticky input bar */}
                <View style={styles.inputBar}>
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Ask Cadet Vijay anything..."
                        placeholderTextColor={COLORS.onSurfaceVariant}
                        multiline
                        maxLength={500}
                        style={styles.textInput}
                    />
                    <Pressable
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                        style={({ pressed }) => [
                            styles.sendBtn,
                            inputText.trim() && styles.sendBtnActive,
                            pressed && styles.sendBtnPressed,
                        ]}
                    >
                        <MaterialIcon
                            name="send"
                            size={22}
                            color={inputText.trim() ? COLORS.onPrimary : COLORS.onSurfaceVariant}
                        />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outlineVariant,
        gap: SPACING[3],
    },
    headerText: {
        flex: 1,
    },
    headerName: {
        fontFamily: TYPOGRAPHY.fontFamily.bold,
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.onSurface,
        fontWeight: "700",
    },
    headerStatus: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
    },
    headerStatusText: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.success,
        fontWeight: "500",
    },
    chipsContainer: {
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
        gap: SPACING[2],
        flexDirection: "row",
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surfaceContainerHigh,
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[2],
        borderRadius: BORDER_RADIUS.full,
        gap: 4,
    },
    chipPressed: {
        backgroundColor: COLORS.surfaceVariant,
    },
    chipText: {
        fontFamily: TYPOGRAPHY.fontFamily.medium,
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.primary,
        fontWeight: "600",
    },
    chatContent: {
        padding: SPACING[4],
        paddingBottom: SPACING[6],
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: SPACING[4],
    },
    messageRowUser: {
        justifyContent: "flex-end",
    },
    messageRowAI: {
        justifyContent: "flex-start",
    },
    bubble: {
        maxWidth: "75%",
        padding: SPACING[4],
        borderRadius: BORDER_RADIUS.xl,
    },
    bubbleAI: {
        backgroundColor: COLORS.surfaceContainerHigh,
        borderBottomLeftRadius: 4,
        marginLeft: SPACING[2],
    },
    bubbleUser: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
        marginRight: SPACING[2],
    },
    bubbleText: {
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurface,
        lineHeight: 24,
    },
    bubbleTextUser: {
        color: COLORS.onPrimary,
    },
    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primaryContainer,
        alignItems: "center",
        justifyContent: "center",
    },
    typingIndicator: {
        flexDirection: "row",
        gap: 4,
        paddingVertical: 4,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.onSurfaceVariant,
    },
    inputBar: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
        gap: SPACING[2],
    },
    textInput: {
        flex: 1,
        backgroundColor: COLORS.surfaceContainerHigh,
        borderRadius: BORDER_RADIUS.xl,
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
        fontFamily: TYPOGRAPHY.fontFamily.regular,
        fontSize: TYPOGRAPHY.fontSize.base,
        color: COLORS.onSurface,
        maxHeight: 120,
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surfaceContainerHigh,
        alignItems: "center",
        justifyContent: "center",
    },
    sendBtnActive: {
        backgroundColor: COLORS.primary,
    },
    sendBtnPressed: {
        opacity: 0.8,
    },
});
