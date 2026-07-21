import * as React from 'react';

/** Pill toggle switch; primary track when on. */
export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export function Switch(props: SwitchProps): React.JSX.Element;
