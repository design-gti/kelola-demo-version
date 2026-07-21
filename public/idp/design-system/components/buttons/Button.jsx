import React from 'react';

/**
 * Kelola Button — pill-shaped, Avenir 14/700 label.
 * Mirrors the product's Mantine Button (radius "xl", className "font-title").
 */
export function Button({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  uppercase = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { height: 30, padding: '0 16px', font: 13 },
    md: { height: 38, padding: '0 22px', font: 14 },
    lg: { height: 46, padding: '0 30px', font: 15 },
  };
  const s = sizes[size] || sizes.md;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: s.font,
    lineHeight: 1,
    letterSpacing: uppercase ? '0.04em' : 0,
    textTransform: uppercase ? 'uppercase' : 'none',
    borderRadius: 'var(--radius-pill)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)',
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...style,
  };

  const c = color; // primary | secondary | error | success | warning
  const solid = `var(--${c}-5)`;
  const solidHover = `var(--${c}-6)`;
  const soft = `var(--${c}-1)`;
  const deep = `var(--${c}-6)`;

  const variants = {
    filled: { background: solid, color: '#fff', '--hover-bg': solidHover },
    light: { background: soft, color: deep, '--hover-bg': `var(--${c}-2)` },
    outline: { background: 'transparent', color: solid, borderColor: 'currentColor', '--hover-bg': soft },
    subtle: { background: 'transparent', color: solid, '--hover-bg': soft },
  };
  const v = variants[variant] || variants.filled;

  const onEnter = (e) => { if (!disabled && !loading) e.currentTarget.style.background = e.currentTarget.style.getPropertyValue('--hover-bg'); };
  const onLeave = (e) => { e.currentTarget.style.background = v.background; };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ ...base, ...v }}
      {...rest}
    >
      {loading && <Spinner />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 14, height: 14, borderRadius: '50%',
        border: '2px solid currentColor', borderTopColor: 'transparent',
        display: 'inline-block', animation: 'kelola-spin 0.7s linear infinite',
      }}
    />
  );
}

// keyframes injected once
if (typeof document !== 'undefined' && !document.getElementById('kelola-btn-kf')) {
  const st = document.createElement('style');
  st.id = 'kelola-btn-kf';
  st.textContent = '@keyframes kelola-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(st);
}
