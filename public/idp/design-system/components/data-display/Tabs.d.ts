import * as React from 'react';

export type TabItem = string | { value: string; label: React.ReactNode; icon?: React.ReactNode; count?: number };

/** Underline tabs (Home dashboard Company/Individual). Active tab turns primary. */
export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export function Tabs(props: TabsProps): React.JSX.Element;
