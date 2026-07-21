import * as React from 'react';

/**
 * White content card with the signature soft Kelola shadow and 8px radius.
 * @startingPoint section="Layout" subtitle="Card surface with header, body & footer" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  /** Inner padding in px. @default 16 */
  padding?: number;
  withBorder?: boolean;
  /** Apply the card-action gradient wash on hover. @default false */
  hoverable?: boolean;
}
export function Card(props: CardProps): React.JSX.Element;
