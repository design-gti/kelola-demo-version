import React from 'react';

/**
 * Kelola Badge — compact status pill. Open Sans 10/700 label.
 * `notch` renders the signature 8/0/8/0 asymmetric corner (used for BETA tags).
 */
export function Badge({
  children,
  variant = 'light',
  color = 'primary',
  notch = false,
  gradient = false,
  leftDot = false,
  style = {},
}) {
  const c = color;
  const variants = {
    filled: { background: `var(--${c}-5)`, color: '#fff' },
    light: { background: `var(--${c}-1)`, color: `var(--${c}-6)` },
    outline: { background: 'transparent', color: `var(--${c}-6)`, border: `1px solid var(--${c}-3)` },
  };
  const v = gradient ? { background: 'var(--gradient-primary)', color: '#fff' } : (variants[variant] || variants.light);

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 20, padding: '0 9px',
      fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, lineHeight: 1,
      letterSpacing: '.02em', whiteSpace: 'nowrap',
      borderRadius: notch ? 'var(--radius-notch)' : 'var(--radius-pill)',
      ...v, ...style,
    }}>
      {leftDot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}
