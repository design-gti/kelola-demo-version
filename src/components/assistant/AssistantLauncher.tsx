"use client";
import { ActionIcon, Indicator } from "@mantine/core";
import { IconMessageChatbot, IconX } from "@tabler/icons-react";

export default function AssistantLauncher({
  open,
  onClick,
  badgeCount = 0,
}: {
  open: boolean;
  onClick: () => void;
  badgeCount?: number;
}) {
  const button = (
    <ActionIcon
      onClick={onClick}
      radius="xl"
      size={52}
      aria-label={open ? "Tutup asisten Kelola" : "Buka asisten Kelola"}
      style={{
        background: "#016699",
        boxShadow: "2px 4px 10px rgba(0,0,0,0.18)",
      }}
    >
      {open ? <IconX size={24} color="#fff" /> : <IconMessageChatbot size={24} color="#fff" />}
    </ActionIcon>
  );

  const showBadge = !open && badgeCount > 0;

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60 }}>
      {showBadge ? (
        <Indicator color="red" size={16} label={badgeCount > 9 ? "9+" : badgeCount} offset={6} withBorder>
          {button}
        </Indicator>
      ) : (
        button
      )}
    </div>
  );
}
