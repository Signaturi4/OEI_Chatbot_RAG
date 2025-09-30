import React from "react";

interface ArrowIconProps {
  direction: "left" | "right";
  className?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ direction, className = "" }) => {
  const transform = direction === "left" ? "rotate(-90deg)" : "rotate(90deg)";

  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width="24"
      height="24"
      className={className}
      style={{ transform }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
      />
    </svg>
  );
};

export default ArrowIcon;
