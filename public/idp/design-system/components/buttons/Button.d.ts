import * as React from 'react';

/**
 * Pill-shaped primary action button. Avenir 14/700 label, soft hover-darken.
 * @startingPoint section="Buttons" subtitle="Pill button — filled / light / outline / subtle" viewport="700x200"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Visual style. @default "filled" */
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  /** Semantic color ramp. @default "primary" */
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Uppercase + letter-spacing (used for the login CTA). @default false */
  uppercase?: boolean;
}

export function Button(props: ButtonProps): React.JSX.Element;
