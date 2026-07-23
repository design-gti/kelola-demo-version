import { MouseEvent, ReactNode } from "react";
import { Button } from "@mantine/core";

interface TextButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  fontSize?: number;
}

export default function TextButton({ children, onClick, fontSize = 11 }: TextButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="subtle"
      color="primary"
      size="compact-xs"
      radius="xl"
      styles={{
        label: { fontSize, fontFamily: "'Open Sans', sans-serif" },
      }}
    >
      {children}
    </Button>
  );
}
