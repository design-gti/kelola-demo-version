"use client";
import { ActionIcon, Indicator, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";

export default function TopHeading() {
  return (
    <div className="h-[54px] bg-[#f8f9fa] flex items-center justify-between w-full">
      <Text fw={700} size="sm" c="#58595b" style={{ fontFamily: "'Open Sans', sans-serif" }}>
        Home
      </Text>
      <Indicator color="red" size={8} offset={4} withBorder>
        <ActionIcon variant="subtle" color="gray" radius="xl" aria-label="Notifikasi">
          <IconBell size={20} color="#58595b" stroke={1.8} />
        </ActionIcon>
      </Indicator>
    </div>
  );
}
