import styled, { createGlobalStyle } from "styled-components";

// OEI Brand Colors
export const colors = {
  primary: "#B91317", // OEI Red
  secondary: "#4A4A4A", // Dark Gray
  muted: "#6F767E", // Muted Gray
  background: "#FFFFFF", // White
  border: "#EEEEEE", // Light Gray Border
  text: "#4A4A4A", // Dark Gray Text
  textLight: "#6F767E", // Light Gray Text
  success: "#26834E", // Green for success states
  error: "#DC3545", // Red for errors
  warning: "#FFC107", // Yellow for warnings
};

// Typography
export const typography = {
  fontFamily:
    '"SF UI Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Spacing
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
};

// Border Radius
export const borderRadius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  full: "50%",
};

// Shadows
export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
};

// Global Styles
export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${typography.fontFamily};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.normal};
    line-height: ${typography.lineHeight.normal};
    color: ${colors.text};
    background-color: ${colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${typography.fontWeight.semibold};
    line-height: ${typography.lineHeight.tight};
    margin-bottom: ${spacing.md};
  }

  h1 {
    font-size: ${typography.fontSize["3xl"]};
  }

  h2 {
    font-size: ${typography.fontSize["2xl"]};
  }

  h3 {
    font-size: ${typography.fontSize.xl};
  }

  h4 {
    font-size: ${typography.fontSize.lg};
  }

  p {
    margin-bottom: ${spacing.md};
    line-height: ${typography.lineHeight.relaxed};
  }

  a {
    color: ${colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${colors.secondary};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  input, textarea {
    font-family: inherit;
    outline: none;
    border: none;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.border};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.muted};
    border-radius: ${borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.secondary};
  }
`;

// Container
export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 ${spacing.md};
`;

// Card Component Base
export const CardBase = styled.div`
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  margin: ${spacing.sm} 0;
  box-shadow: ${shadows.sm};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${shadows.md};
  }
`;

// Button Base
export const ButtonBase = styled.button<{
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.sm};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.base};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  ${(props) =>
    props.variant === "primary"
      ? `
    background-color: ${colors.primary};
    color: ${colors.background};
    border: 1px solid ${colors.primary};

    &:hover {
      background-color: ${colors.secondary};
      border-color: ${colors.secondary};
    }

    &:active {
      transform: translateY(1px);
    }
  `
      : `
    background-color: transparent;
    color: ${colors.primary};
    border: 1px solid ${colors.primary};

    &:hover {
      background-color: ${colors.primary};
      color: ${colors.background};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Input Base
export const InputBase = styled.input`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSize.base};
  background-color: ${colors.background};
  color: ${colors.text};
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(185, 19, 23, 0.1);
  }

  &::placeholder {
    color: ${colors.muted};
  }
`;

// Text Utilities
export const TextMuted = styled.span`
  color: ${colors.muted};
`;

export const TextPrimary = styled.span`
  color: ${colors.primary};
`;

export const TextSecondary = styled.span`
  color: ${colors.secondary};
`;
