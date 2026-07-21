import React, { useState } from 'react';

/**
 * Kelola TextInput — label (Avenir 12/700) over a bordered field.
 * Value text is Open Sans 12/400 on white. Supports left/right sections,
 * password reveal, error + description.
 */
export function TextInput({
  label,
  description,
  error,
  required = false,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  disabled = false,
  leftSection = null,
  rightSection = null,
  passwordToggle = false,
  id,
  style = {},
  ...rest
}) {
  const [reveal, setReveal] = useState(false);
  const inputId = id || `kelola-in-${Math.random().toString(36).slice(2, 8)}`;
  const isPassword = type === 'password' || passwordToggle;
  const effType = isPassword ? (reveal ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700,
          lineHeight: '16.39px', color: 'var(--text-body)', display: 'flex', gap: 3,
        }}>
          {label}{required && <span style={{ color: 'var(--error-5)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftSection && (
          <span style={{ position: 'absolute', left: 12, color: 'var(--text-faint)', display: 'flex', pointerEvents: 'none' }}>{leftSection}</span>
        )}
        <input
          id={inputId}
          type={effType}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: '100%', boxSizing: 'border-box',
            height: 38, padding: '0 12px',
            paddingLeft: leftSection ? 36 : 12,
            paddingRight: (rightSection || isPassword) ? 36 : 12,
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 400,
            color: 'var(--text-strong)',
            background: disabled ? 'var(--neutral-1)' : 'var(--neutral-0)',
            border: `1px solid ${error ? 'var(--error-5)' : 'var(--border-input)'}`,
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            transition: 'border-color var(--duration-base), box-shadow var(--duration-base)',
          }}
          onFocus={(e) => { if (!error) { e.target.style.borderColor = 'var(--primary-5)'; e.target.style.boxShadow = 'var(--shadow-focus)'; } }}
          onBlur={(e) => { e.target.style.borderColor = error ? 'var(--error-5)' : 'var(--border-input)'; e.target.style.boxShadow = 'none'; }}
          {...rest}
        />
        {isPassword && (
          <button type="button" onClick={() => setReveal(r => !r)} aria-label="toggle password"
            style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
            <i className={reveal ? 'ti ti-eye-off' : 'ti ti-eye'} />
          </button>
        )}
        {!isPassword && rightSection && (
          <span style={{ position: 'absolute', right: 12, color: 'var(--text-faint)', display: 'flex' }}>{rightSection}</span>
        )}
      </div>
      {error
        ? <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--error-5)' }}>{error}</span>
        : description && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>{description}</span>}
    </div>
  );
}
