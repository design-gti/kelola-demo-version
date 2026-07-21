import * as React from 'react';

export type SelectOption = string | { value: string; label: string };

/** Dropdown select with a soft-shadowed menu; selected row highlights primary-1. */
export interface SelectProps {
  label?: React.ReactNode;
  placeholder?: string;
  data: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}
export function Select(props: SelectProps): React.JSX.Element;
