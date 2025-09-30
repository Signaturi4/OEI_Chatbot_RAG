import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { colors, spacing } from "../../styles/theme";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg} ${spacing.md};
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: ${colors.textLight};
  font-weight: 500;
  margin-bottom: ${spacing.sm};
`;

const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${colors.primary};
  animation: ${fadeIn} 0.6s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  animation-direction: alternate;
`;

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  message = "",
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingContainer>
      {message && (
        <LoadingText>
          {message}
          {dots}
        </LoadingText>
      )}
      <DotsContainer>
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </DotsContainer>
    </LoadingContainer>
  );
};

export default LoadingAnimation;
