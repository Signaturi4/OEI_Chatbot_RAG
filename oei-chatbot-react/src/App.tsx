import "./App.css";
import React from "react";
import LiveChat from "./components/chat/LiveChat";
import { useChat } from "./hooks/useChat";

function App() {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    retryLastMessage,
  } = useChat();

  return (
    <LiveChat
      chatLoading={false}
      meta={null}
      isLoading={isLoading}
      input={input}
      messages={messages}
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      onStop={retryLastMessage}
      onTranscription={undefined}
      onSearch={async () => []}
      onSearchRecipe={async () => []}
      showRecipePanel={false}
      serviceId="oei"
    />
  );
}

export default App;
