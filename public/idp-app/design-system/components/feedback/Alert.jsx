import React from 'react';

/**
 * Kelola Alert (AlertBox) — soft tinted panel with a leading icon and a
 * left accent. Types map to the semantic colors.
 */
export function Alert({ type = 'info', title, children, icon, onClose, style = {} }) {
  const map = {
    info: { c: 'primary', i: 'ti-info-circle' },
    error: { c: 'error', i: 'ti-alert-circle' },
    success: { c: 'success', i: 'ti-circle-check' },
    warning: { c: 'warning', i: 'ti-alert-triangle' },
  };
  const m = map[type] || map.info;
  return (
    <div role="alert" style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 14px',
      background: `var(--${m.c}-0)`,
      borderRadius: 'var(--radius-md)',
      borderLeft: `3px solid var(--${m.c}-5)`,
      ...style,
    }}>
      <span style={{ color: `var(--${m.c}-5)`, display: 'flex', fontSize: 18, marginTop: 1 }}>
        {icon || <i className={`ti ${m.i}`} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 13, color: `var(--${m.c}-7)`, marginBottom: children ? 2 : 0 }}>{title}</div>}
        {children && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.45, color: 'var(--text-body)' }}>{children}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 2 }}>
          <i className="ti ti-x" />
        </button>
      )}
    </div>
  );
}
