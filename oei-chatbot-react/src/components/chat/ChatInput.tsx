import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className="meme-input"
      style={{
        width: "100%",
        height: "74px",
        padding: "14px 48px",
        border: "2px solid rgba(39, 39, 39, 0.35)",
        background: "rgba(255, 255, 255, 0.35)",
        borderRadius: "14px",
        color: "rgba(255, 255, 255, 0.9)",
        borderColor: "transparent",
        fontSize: "16px",
        fontFamily: "inherit",
      }}
    />
  );
};

export default ChatInput;
