import * as React from 'react';

/**
 * Sidebar navigation item with the signature carved-notch active state.
 * Place inside a <Sidebar> (or any brand-gradient container).
 * @startingPoint section="Navigation" subtitle="Gradient sidebar with carved-notch active nav" viewport="700x420"
 */
export interface NavItemProps {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  onClick?: () => void;
  /** Canvas color the notch carves toward. @default var(--background) */
  canvas?: string;
}
export function NavItem(props: NavItemProps): React.JSX.Element;

/** Brand-gradient sidebar rail with a white logo strip. */
export interface SidebarProps {
  children?: React.ReactNode;
  logo?: React.ReactNode;
  /** @default 264 */
  width?: number;
  style?: React.CSSProperties;
}
export function Sidebar(props: SidebarProps): React.JSX.Element;
