import React from 'react';

/**
 * Kelola IconButton — square/circular icon-only action.
 * Use for toolbar actions, close buttons, table row actions.
 */
export function IconButton({
  children,
  variant = 'subtle',
  color = 'primary',
  size = 'md',
  radius = 'pill',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  style = {},
  ...rest
}) {
  const sizes = { sm: 28, md: 34, lg: 42 };
  const dim = sizes[size] || sizes.md;
  const c = color;
  const solid = `var(--${c}-5)`;
  const soft = `var(--${c}-1)`;

  const variants = {
    filled: { background: solid, color: '#fff', '--hover-bg': `var(--${c}-6)` },
    light: { background: soft, color: `var(--${c}-6)`, '--hover-bg': `var(--${c}-2)` },
    subtle: { background: 'transparent', color: solid, '--hover-bg': soft },
  };
  const v = variants[variant] || variants.subtle;
  const radii = { pill: 'var(--radius-pill)', md: 'var(--radius-md)', sm: 'var(--radius-sm)' };

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = e.currentTarget.style.getPropertyValue('--hover-bg'); }}
      onMouseLeave={(e) => { e.currentTarget.style.background = v.background; }}
      style={{
        width: dim, height: dim,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: radii[radius] || radii.pill,
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color var(--duration-base) var(--ease-standard)',
        ...v, ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
