import { MouseEvent, ReactNode } from "react";

interface TextButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  fontSize?: number;
}

export default function TextButton({ children, onClick, fontSize = 11 }: TextButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize,
        color: "#016699",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Open Sans', sans-serif",
        padding: 0,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}
