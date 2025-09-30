import React, { memo } from "react";
import { FormattedText } from "../ui/FormattedText";
import { Message } from "../../types";

interface ChatMessageProps {
  message: Message;
}

const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ChatMessage = memo<ChatMessageProps>(({ message }) => {
  const isOwn = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: !isOwn ? "flex-start" : "flex-end",
        alignItems: "center",
        width: "100%",
        minHeight: 0,
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          margin: "8px",
          textAlign: isOwn ? "end" : "start",
          padding: "8px 16px",
          color: "rgb(39, 39, 39)",
          backgroundColor: "transparent",
          borderRadius: "16px 16px 0px",
          border: "1px solid rgb(39, 39, 39)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            color: "inherit",
            fontFamily: "Nunito Sans, sans-serif",
          }}
        >
          <FormattedText text={message.content} />
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#999",
            marginTop: "4px",
            textAlign: isOwn ? "right" : "left",
          }}
        >
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
