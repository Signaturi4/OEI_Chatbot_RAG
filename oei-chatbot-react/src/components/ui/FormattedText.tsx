import React, { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";

interface FormattedTextProps {
  text: string;
  fontSize?: number;
}

// Auto-link URLs in text
const autoLinkUrls = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    // Create clean, minimalist display text for the link
    let displayText = url;

    // Handle different URL patterns with simple, clean text
    if (url.includes("servuswebshop.oesterreichinstitut.com")) {
      if (url.includes("/courses/")) {
        displayText = "German courses";
      } else if (url.includes("/checkout/")) {
        displayText = "book your course";
      } else {
        displayText = "OEI Course Portal";
      }
    } else if (url.includes("oesterreichinstitut.com")) {
      if (url.includes("/german-courses/learn-german/")) {
        displayText = "German courses";
      } else if (url.includes("/german-courses/")) {
        displayText = "German courses";
      } else {
        displayText = "OEI Website";
      }
    } else {
      // For other URLs, show just the domain
      try {
        const urlObj = new URL(url);
        displayText = urlObj.hostname;
      } catch {
        displayText = url;
      }
    }

    return `[${displayText}](${url})`;
  });
};

export const FormattedText = memo<FormattedTextProps>(
  ({ text, fontSize = 16 }) => {
    const processedText = useMemo(() => {
      if (!text) return "";

      // Auto-link URLs
      const linkedText = autoLinkUrls(text);

      // Convert bullet points with URLs to markdown links
      const bulletLinkRegex = /^-\s+([^\n:]+?):\s+(https?:\/\/\S+)$/gm;
      const markdownText = linkedText.replace(
        bulletLinkRegex,
        (match, title, url) => {
          // Create clean, simple link text based on URL patterns
          let linkText = title.trim();

          if (url.includes("servuswebshop.oesterreichinstitut.com")) {
            if (url.includes("/courses/")) {
              linkText = "German courses";
            } else if (url.includes("/checkout/")) {
              linkText = "book your course";
            } else {
              linkText = "OEI Course Portal";
            }
          } else if (url.includes("oesterreichinstitut.com")) {
            if (url.includes("/german-courses/learn-german/")) {
              linkText = "German courses";
            } else if (url.includes("/german-courses/")) {
              linkText = "German courses";
            } else {
              linkText = "OEI Website";
            }
          }

          return `- [${linkText}](${url})`;
        }
      );

      return markdownText;
    }, [text]);

    if (!text) {
      return null;
    }

    return (
      <div
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.6,
          color: "inherit",
          fontFamily: "Nunito Sans, sans-serif",
        }}
      >
        <ReactMarkdown
          components={{
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--red)",
                  textDecoration: "underline",
                  fontWeight: "inherit",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--primary-light-color, #d41b1f)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--red)";
                }}
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {processedText}
        </ReactMarkdown>
      </div>
    );
  }
);

FormattedText.displayName = "FormattedText";

export default FormattedText;
