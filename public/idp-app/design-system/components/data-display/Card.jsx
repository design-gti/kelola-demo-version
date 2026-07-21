import React from 'react';

/**
 * Kelola Card — white surface, 8px radius, the signature soft shadow.
 * Optional header (title + action) and footer.
 */
export function Card({
  children, title, subtitle, action, footer,
  padding = 16, withBorder = false, hoverable = false,
  style = {}, ...rest
}) {
  return (
    <div
      onMouseEnter={hoverable ? (e) => { e.currentTarget.style.background = 'var(--gradient-card-action)'; } : undefined}
      onMouseLeave={hoverable ? (e) => { e.currentTarget.style.background = 'var(--surface-card)'; } : undefined}
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        border: withBorder ? '1px solid var(--border)' : 'none',
        overflow: 'hidden',
        transition: 'background var(--duration-base) var(--ease-standard)',
        cursor: hoverable ? 'pointer' : 'default',
        ...style,
      }}
      {...rest}
    >
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: `${padding}px ${padding}px ${subtitle ? 4 : 0}px` }}>
          <div>
            {title && <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 16, color: 'var(--text-strong)', lineHeight: 1.3 }}>{title}</div>}
            {subtitle && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
      {footer && (
        <div style={{ padding: `0 ${padding}px ${padding}px`, borderTop: '1px solid var(--neutral-2)', paddingTop: 12, marginTop: 4 }}>{footer}</div>
      )}
    </div>
  );
}
