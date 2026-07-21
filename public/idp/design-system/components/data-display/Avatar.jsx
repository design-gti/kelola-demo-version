import React from 'react';

/**
 * Kelola Avatar — circular, white-padded with a thin ring (the product's
 * "border-avatar"). Falls back to initials on a tinted background.
 */
export function Avatar({ src, name = '', size = 40, color = 'primary', ring = true, style = {} }) {
  const initials = name
    .split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: src ? 'var(--neutral-0)' : `var(--${color}-1)`,
      border: ring ? '2px solid var(--neutral-3)' : 'none',
      boxSizing: 'border-box', overflow: 'hidden', flexShrink: 0, ...style,
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        : <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: size * 0.38, color: `var(--${color}-6)` }}>{initials || '?'}</span>}
    </span>
  );
}
