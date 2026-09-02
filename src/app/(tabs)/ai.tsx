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
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MascotDisplay } from "../../components/shared/MascotDisplay";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants";

// Mock AI responses for demo
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

        // Simulate AI response
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

    const quickTopics = [
        { icon: "📐", label: "Math Tips" },
        { icon: "📖", label: "English Grammar" },
        { icon: "🧠", label: "Logic Puzzles" },
        { icon: "🌍", label: "GK Facts" },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: SPACING[5],
                        paddingVertical: SPACING[4],
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.cardBorder,
                    }}
                >
                    <MascotDisplay expression="encouraging" size={50} showBackground />
                    <View style={{ marginLeft: SPACING[3] }}>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.lg,
                                fontWeight: "700",
                                color: COLORS.textPrimary,
                            }}
                        >
                            Cadet Vijay
                        </Text>
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.fontSize.sm,
                                color: COLORS.success,
                            }}
                        >
                            AI Study Buddy
                        </Text>
                    </View>
                </View>

                {/* Quick Topics */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: SPACING[5],
                        paddingVertical: SPACING[3],
                        gap: SPACING[2],
                    }}
                >
                    {quickTopics.map((topic, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setInputText(`Explain ${topic.label}`)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: COLORS.surfaceContainer,
                                paddingHorizontal: SPACING[4],
                                paddingVertical: SPACING[2],
                                borderRadius: BORDER_RADIUS.full,
                                gap: SPACING[1],
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>{topic.icon}</Text>
                            <Text
                                style={{
                                    fontSize: TYPOGRAPHY.fontSize.sm,
                                    fontWeight: "600",
                                    color: COLORS.textPrimary,
                                }}
                            >
                                {topic.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Chat Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: SPACING[5] }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                {
                                    flexDirection: "row",
                                    marginBottom: SPACING[4],
                                    alignItems: "flex-start",
                                },
                                message.isUser && {
                                    justifyContent: "flex-end",
                                },
                            ]}
                        >
                            {!message.isUser && (
                                <MascotDisplay
                                    expression={message.text.includes("?") ? "thinking" : "happy"}
                                    size={36}
                                    showBackground
                                />
                            )}
                            <View
                                style={[
                                    {
                                        maxWidth: "75%",
                                        padding: SPACING[4],
                                        borderRadius: BORDER_RADIUS.xl,
                                        marginLeft: SPACING[2],
                                    },
                                    message.isUser
                                        ? {
                                            backgroundColor: COLORS.primary,
                                            borderBottomRightRadius: 4,
                                        }
                                        : {
                                            backgroundColor: COLORS.surfaceContainer,
                                            borderBottomLeftRadius: 4,
                                        },
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            fontSize: TYPOGRAPHY.fontSize.base,
                                            lineHeight: 22,
                                        },
                                        message.isUser
                                            ? { color: COLORS.onPrimary }
                                            : { color: COLORS.textPrimary },
                                    ]}
                                >
                                    {message.text}
                                </Text>
                            </View>
                            {message.isUser && (
                                <View
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: COLORS.primaryLight,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginLeft: SPACING[2],
                                    }}
                                >
                                    <Text style={{ fontSize: 14 }}>👤</Text>
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: SPACING[4],
                            }}
                        >
                            <MascotDisplay expression="thinking" size={36} showBackground />
                            <View
                                style={{
                                    backgroundColor: COLORS.surfaceContainer,
                                    padding: SPACING[4],
                                    borderRadius: BORDER_RADIUS.xl,
                                    marginLeft: SPACING[2],
                                }}
                            >
                                <View style={{ flexDirection: "row", gap: 4 }}>
                                    {[0, 1, 2].map((i) => (
                                        <View
                                            key={i}
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: COLORS.textTertiary,
                                            }}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Input Area */}
                <View
                    style={{
                        padding: SPACING[4],
                        borderTopWidth: 1,
                        borderTopColor: COLORS.cardBorder,
                        backgroundColor: COLORS.background,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-end",
                            gap: SPACING[2],
                        }}
                    >
                        <TextInput
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Ask me anything about AISSEE..."
                            placeholderTextColor={COLORS.textTertiary}
                            multiline
                            maxLength={500}
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.surfaceContainer,
                                borderRadius: BORDER_RADIUS.xl,
                                paddingHorizontal: SPACING[4],
                                paddingVertical: SPACING[3],
                                fontSize: TYPOGRAPHY.fontSize.base,
                                color: COLORS.textPrimary,
                                maxHeight: 120,
                            }}
                        />
                        <Pressable
                            onPress={handleSend}
                            disabled={!inputText.trim()}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: inputText.trim()
                                    ? COLORS.primary
                                    : COLORS.surfaceContainer,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ fontSize: 20 }}>➤</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
