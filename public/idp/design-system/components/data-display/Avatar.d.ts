import * as React from 'react';

/** Circular avatar with a thin ring; initials fallback on a tinted background. */
export interface AvatarProps {
  src?: string;
  name?: string;
  /** Diameter in px. @default 40 */
  size?: number;
  /** Initials/background ramp. @default "primary" */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** @default true */
  ring?: boolean;
  style?: React.CSSProperties;
}
export function Avatar(props: AvatarProps): React.JSX.Element;
