import * as React from 'react';

/** Tinted alert panel with a leading icon and left accent bar. */
export interface AlertProps {
  /** @default "info" */
  type?: 'info' | 'error' | 'success' | 'warning';
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export function Alert(props: AlertProps): React.JSX.Element;
