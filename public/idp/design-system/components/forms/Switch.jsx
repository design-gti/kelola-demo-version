import React from 'react';

/**
 * Kelola Switch — pill toggle, primary track when on.
 */
export function Switch({ label, checked, defaultChecked, onChange, disabled = false, id, style = {} }) {
  const inputId = id || `kelola-sw-${Math.random().toString(36).slice(2, 8)}`;
  const on = checked ?? defaultChecked;
  return (
    <label htmlFor={inputId} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, ...style,
    }}>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <input id={inputId} type="checkbox" checked={checked} defaultChecked={defaultChecked}
          onChange={onChange} disabled={disabled}
          style={{ position: 'absolute', opacity: 0, width: 38, height: 22, margin: 0, cursor: 'inherit' }} />
        <span style={{
          width: 38, height: 22, borderRadius: 'var(--radius-pill)',
          background: on ? 'var(--primary-5)' : 'var(--neutral-4)',
          transition: 'background var(--duration-base) var(--ease-standard)',
          display: 'inline-flex', alignItems: 'center', padding: 2, boxSizing: 'border-box',
        }}>
          <span style={{
            width: 18, height: 18, borderRadius: '50%', background: '#fff',
            transform: on ? 'translateX(16px)' : 'translateX(0)',
            transition: 'transform var(--duration-base) var(--ease-standard)',
            boxShadow: '0 1px 3px rgba(0,0,0,.2)',
          }} />
        </span>
      </span>
      {label && <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-body)' }}>{label}</span>}
    </label>
  );
}
