import * as React from 'react';

/** Square checkbox with a primary fill when checked. */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export function Checkbox(props: CheckboxProps): React.JSX.Element;
