import React, { useState } from "react";
import styled from "styled-components";
import { colors, spacing } from "../../styles/theme";

interface CollapsibleContentProps {
  title: string;
  content: string;
  isOpen?: boolean;
}

const CollapsibleContainer = styled.div`
  margin-top: ${spacing.md};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  overflow: hidden;
  background: white;
`;

const CollapsibleHeader = styled.button`
  width: 100%;
  padding: ${spacing.md};
  background: rgba(185, 19, 23, 0.05);
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(185, 19, 23, 0.1);
  }
`;

const Title = styled.h3`
  margin: 0;
  color: ${colors.primary};
  font-size: 16px;
  font-weight: 600;
`;

const Icon = styled.div<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    color: ${colors.primary};
  }
`;

const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const ContentText = styled.div`
  padding: ${spacing.md};
  color: #6f767e;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const CollapsibleContentComponent: React.FC<CollapsibleContentProps> = ({
  title,
  content,
  isOpen: initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <CollapsibleContainer>
      <CollapsibleHeader onClick={toggleOpen}>
        <Title>{title}</Title>
        <Icon isOpen={isOpen}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
            />
          </svg>
        </Icon>
      </CollapsibleHeader>
      <CollapsibleContent isOpen={isOpen}>
        <ContentText>{content}</ContentText>
      </CollapsibleContent>
    </CollapsibleContainer>
  );
};

export default CollapsibleContentComponent;
