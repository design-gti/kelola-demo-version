import * as React from 'react';

/** Icon-only button for toolbars, close affordances, and table row actions. */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** @default "subtle" */
  variant?: 'filled' | 'light' | 'subtle';
  /** @default "primary" */
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** @default "pill" */
  radius?: 'pill' | 'md' | 'sm';
  disabled?: boolean;
  'aria-label'?: string;
}

export function IconButton(props: IconButtonProps): React.JSX.Element;
