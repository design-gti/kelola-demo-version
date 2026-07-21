import * as React from 'react';

/**
 * Compact status pill — Open Sans 10/700. Set `notch` for the BETA-tag corner,
 * `gradient` for the brand-gradient fill.
 * @startingPoint section="Feedback" subtitle="Status badges, tags & BETA pills" viewport="700x180"
 */
export interface BadgeProps {
  children?: React.ReactNode;
  /** @default "light" */
  variant?: 'filled' | 'light' | 'outline';
  /** @default "primary" */
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  /** Signature 8/0/8/0 asymmetric corners. @default false */
  notch?: boolean;
  /** Brand blue gradient fill (overrides variant/color). @default false */
  gradient?: boolean;
  /** Leading status dot. @default false */
  leftDot?: boolean;
  style?: React.CSSProperties;
}
export function Badge(props: BadgeProps): React.JSX.Element;
