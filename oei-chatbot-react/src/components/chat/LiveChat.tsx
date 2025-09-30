import { memo, useEffect, useMemo, useRef } from "react";
import type { ReactNode, UIEvent, ChangeEvent, FormEvent } from "react";
import React from "react";
import { Message, ChatMessage as ChatMessageType } from "../../types";
import { FormattedText } from "../ui/FormattedText";
import CourseCarousel from "../course/CourseCarousel";
import LoadingAnimation from "../ui/LoadingAnimation";
import ArrowSmallUpIcon from "../../assets/icons/ArrowSmallUp";
import ArrowPathIcon from "../../assets/icons/ArrowPath";
import QuickStartExamples from "./QuickStartExamples";

const MAX_WIDTH = 600;
const SCROLL_PADDING = 12;

export default function LiveChat({
  chatLoading,
  meta,
  isLoading,
  messages,
  onInputChange,
  onSubmit,
  input,
  onStop,
  onTranscription,
  onSearch,
  onSearchRecipe,
  showRecipePanel = false,
  serviceId,
}: {
  chatLoading?: boolean;
  meta?: ReactNode;
  isLoading: boolean;
  input: string;
  messages?: Message[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTranscription?: (transcription: string) => void;
  onSearch: (query: string, options: { serviceId: string }) => Promise<any[]>;
  onSearchRecipe: (
    query: string,
    options: { serviceId: string }
  ) => Promise<any[]>;
  download?: boolean;
  onStop?: () => void;
  showRecipePanel?: boolean;
  serviceId: string;
}) {
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoading) {
      onSubmit(event);
    }
  };

  const onStopInn = () => {
    if (isLoading) {
      onStop?.();
    }
  };

  const handleExampleClick = (text: string) => {
    const fakeEvent = {
      target: { value: text },
      currentTarget: { value: text },
    } as ChangeEvent<HTMLInputElement>;
    onInputChange(fakeEvent);
  };

  const scrollPosition = useRef<HTMLSpanElement | null>(null);
  const scroll = useRef({ top: 0, auto: true });
  const listRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Always scroll to bottom when a new message is added
    scroll.current.auto = true;
    if (scrollPosition?.current) {
      scrollPosition.current.scrollIntoView({
        behavior: "smooth" as ScrollBehavior,
      });
    }
  }, [messages]);

  // Specifically scroll when loading state changes (AI response)
  useEffect(() => {
    if (!isLoading && messages && messages.length > 0) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        if (scrollPosition?.current) {
          scrollPosition.current.scrollIntoView({
            behavior: "smooth" as ScrollBehavior,
          });
        }
      }, 100);
    }
  }, [isLoading, messages]); // Added messages to dependency array

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const offset = SCROLL_PADDING * 2;
    const currentTop = e.currentTarget.scrollTop;
    const { scrollHeight, clientHeight } = e.currentTarget;

    // Check if user is near the bottom (within offset)
    const isNearBottom =
      Math.round(currentTop + offset) >= scrollHeight - clientHeight;

    scroll.current = {
      top: currentTop,
      auto: isNearBottom,
    };
  };

  return (
    <>
      {/* Main container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        className={`cart oei`}
      >
        {!chatLoading ? (
          <>
            {/* Scrollable Content Area */}
            <div
              ref={listRef}
              onScroll={handleScroll}
              style={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                paddingBottom: "148px",
              }}
            >
              {/* Inner container for centering content */}
              <div
                style={{
                  maxWidth: MAX_WIDTH,
                  margin: "0 auto",
                  padding: `0 ${SCROLL_PADDING}px`,
                }}
              >
                {/* Chat Messages */}
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
                  onScrollToBottom={() => {
                    if (scrollPosition?.current) {
                      scrollPosition.current.scrollIntoView({
                        behavior: "smooth" as ScrollBehavior,
                      });
                    }
                  }}
                />

                {meta}

                {/* Scroll anchor */}
                <span ref={scrollPosition}></span>
              </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Quick Start Examples */}
              <QuickStartExamples onExampleClick={handleExampleClick} />

              {/* Form */}
              <form
                onSubmit={submitHandler}
                style={{ width: "100%", maxWidth: MAX_WIDTH, margin: 0 }}
              >
                <div style={{ display: "flex", gap: "5rem" }}>
                  <div className="meme-input__wrapper">
                    <div className="meme-input__recorder">
                      {/* Audio recorder placeholder */}
                    </div>
                    <input
                      type="text"
                      className="meme-input"
                      value={input}
                      onChange={onInputChange}
                      placeholder="Type here"
                      style={{
                        width: "100%",
                        height: "74px",
                        padding: "14px 48px",
                        border: "2px solid rgba(39, 39, 39, 0.35)",
                        background: "rgba(255, 255, 255, 0.35)",
                        borderRadius: "14px",
                        color: "rgba(39, 39, 39, 0.9)",
                        borderColor: "transparent",
                        fontSize: "16px",
                        fontFamily: "inherit",
                      }}
                    />
                    <button
                      type="submit"
                      className="neo-icon"
                      onClick={onStopInn}
                      style={{
                        position: "absolute",
                        right: "3px",
                        top: "50%",
                        transform: "translate(0, -50%)",
                        cursor: "pointer",
                        color: "#B91317",
                        background: "none",
                        border: "none",
                        padding: "0.2em",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "2rem",
                        transition: "all 0.5s ease",
                      }}
                    >
                      {isLoading ? (
                        <ArrowPathIcon rotation />
                      ) : (
                        <ArrowSmallUpIcon />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

const ChatMessages = memo(
  ({
    messages,
    isLoading,
    onScrollToBottom,
  }: {
    messages?: ChatMessageType[];
    isLoading: boolean;
    onScrollToBottom: () => void;
  }) => {
    return (
      <>
        {messages?.map((message, index) => (
          <div key={message.id || `${message.role}-${index}`}>
            <ChatMessage
              text={message.content}
              isOwn={message.role === "user"}
            />
            {/* Render carousel outside message for assistant messages */}
            {message.role === "assistant" &&
              message.courses &&
              message.courses.length > 0 && (
                <CourseCarousel
                  courses={message.courses}
                  onScrollToBottom={onScrollToBottom}
                />
              )}
          </div>
        ))}
        {/* Show loading animation when loading */}
        {isLoading && (
          <div style={{ width: "100%", maxWidth: MAX_WIDTH, margin: "0 auto" }}>
            <LoadingAnimation />
          </div>
        )}
      </>
    );
  }
);

const ChatMessage = memo(
  ({ text, isOwn }: { text: string; isOwn: boolean }) => {
    const lines = useMemo(() => <FormattedText text={text} />, [text]);

    if (!text) {
      return null;
    }

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
          {lines}
        </div>
      </div>
    );
  }
);
