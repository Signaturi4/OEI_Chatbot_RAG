import { useState, useCallback, useRef } from "react";
import { ChatMessage } from "../types";
import { apiService } from "../services/api";

interface UseChatReturn {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  retryLastMessage: () => Promise<void>;
}

export const useChat = (): UseChatReturn => {
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialize with welcome message from Austrian Institute AI
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content:
        "Greetings! I'm Austrian Institute AI - I will inform you about our courses. Just ask me a question and I will help you.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastMessageRef = useRef<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      // Store the message for potential retry
      lastMessageRef.current = content.trim();

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.sendMessage(content.trim(), messages);

        if (response.success && response.data) {
          const assistantMessage: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: response.data.message,
            timestamp: new Date(),
            courses: response.data.courses,
            ai_content: response.data.ai_content,
          };

          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error(response.error || "Failed to get response from AI");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);

        // Add error message to chat
        const errorChatMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorChatMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (input.trim() && !isLoading) {
        await sendMessage(input.trim());
        setInput("");
      }
    },
    [input, isLoading, sendMessage]
  );

  const retryLastMessage = useCallback(async () => {
    if (lastMessageRef.current && !isLoading) {
      // Remove the last assistant message (error message)
      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) =>
            msg.role !== "assistant" || msg.id !== prev[prev.length - 1]?.id
        );
        return filtered;
      });

      await sendMessage(lastMessageRef.current);
    }
  }, [sendMessage, isLoading]);

  return {
    messages,
    input,
    isLoading,
    error,
    handleSubmit,
    handleInputChange,
    retryLastMessage,
  };
};
