import React from 'react';

/**
 * Kelola Checkbox — square check, primary fill when checked.
 */
export function Checkbox({ label, checked, defaultChecked, onChange, disabled = false, id, style = {} }) {
  const inputId = id || `kelola-cb-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label htmlFor={inputId} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, ...style,
    }}>
      <span style={{ position: 'relative', display: 'inline-flex', width: 18, height: 18 }}>
        <input
          id={inputId} type="checkbox" checked={checked} defaultChecked={defaultChecked}
          onChange={onChange} disabled={disabled}
          style={{ position: 'absolute', opacity: 0, width: 18, height: 18, margin: 0, cursor: 'inherit' }}
        />
        <Box checked={checked ?? defaultChecked} />
      </span>
      {label && <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-body)' }}>{label}</span>}
    </label>
  );
}

function Box({ checked }) {
  return (
    <span style={{
      width: 18, height: 18, borderRadius: 'var(--radius-sm)',
      border: `1.5px solid ${checked ? 'var(--primary-5)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--primary-5)' : 'var(--neutral-0)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all var(--duration-base) var(--ease-standard)', boxSizing: 'border-box',
    }}>
      {checked && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
