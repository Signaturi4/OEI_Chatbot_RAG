import React from "react";

interface QuickStartExamplesProps {
  onExampleClick: (text: string) => void;
}

const QuickStartExamples: React.FC<QuickStartExamplesProps> = ({
  onExampleClick,
}) => {
  // OEI course examples
  const examples = ["Krakow - Online B1 Course","brno - Offline A1 Course", "In which cities are you located?", "What is the best course for me?"];

  const getStyle = (text: string) => {
    switch (text) {
      case "Online Courses":
        return {
          backgroundColor: "#B91317",
        };
      default:
        return {
          backgroundColor: "#B91317", // OEI primary color
        };
    }
  };

  const handleClick = (text: string) => {
    onExampleClick(text);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: 0,
        marginBottom: "8px",
      }}
    >
      {examples.map((text) => (
        <button
          key={text}
          onClick={() => handleClick(text)}
          style={{
            fontFamily: "SF UI Display, sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: 1.2,
            color: "#ffffff",
            padding: "6px 10px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            textAlign: "center",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
            ...getStyle(text),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.opacity = "1";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {text}
        </button>
      ))}
    </div>
  );
};

export default QuickStartExamples;
